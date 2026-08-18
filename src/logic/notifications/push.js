/**
 * Web Push (VAPID): sottoscrizione del browser al canale push del backend.
 * A differenza delle notifiche locali (browser.js), queste sopravvivono
 * alla chiusura dell'app: e' il backend a inviarle all'orario giusto.
 */

import { getServiceWorkerRegistration } from './browser.js';
import { setPushSubscribed } from '../preferences.js';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * @returns {boolean} True se il browser supporta Push API + Service Worker
 */
export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    Boolean(VAPID_PUBLIC_KEY)
  );
}

/**
 * Converte la chiave pubblica VAPID (base64url) nel formato Uint8Array
 * richiesto da `PushManager.subscribe({ applicationServerKey })`.
 * @param {string} base64String - Chiave pubblica VAPID
 * @returns {Uint8Array} Chiave convertita
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Restituisce la subscription push esistente per questo browser, se presente
 * @returns {Promise<PushSubscription | null>} Subscription o null
 */
export async function getExistingPushSubscription() {
  if (!isPushSupported()) return null;
  const registration = await getServiceWorkerRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

/**
 * Sottoscrive il browser al canale push (richiede permesso notifiche gia' concesso).
 * @returns {Promise<PushSubscription>} Subscription creata
 */
export async function subscribeToPush() {
  if (!isPushSupported()) {
    throw new Error('Push non supportato in questo browser');
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    throw new Error('Service Worker non disponibile');
  }

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  setPushSubscribed(true);
  return subscription;
}

/**
 * Annulla la subscription push locale (non avvisa il backend: e' compito
 * del chiamante rimuoverla anche lato server prima o dopo questa chiamata)
 * @returns {Promise<void>}
 */
export async function unsubscribeFromPush() {
  const subscription = await getExistingPushSubscription();
  if (subscription) {
    await subscription.unsubscribe();
  }
  setPushSubscribed(false);
}
