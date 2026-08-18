/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { showToast } from './toast.js';
import { addHistoryEntry } from './db.js';
import { getVibrationEnabled, getSilentNotifications } from '../preferences.js';

// Pattern vibrazione standard per una notifica (ms: vibra, pausa, vibra)
const VIBRATION_PATTERN = [200, 100, 200];

// Icona di default per le notifiche di sistema
const DEFAULT_NOTIFICATION_ICON = '/icons/icon-192x192.png';

// Attesa massima per il Service Worker: navigator.serviceWorker.ready non
// risolve MAI se nessun SW e' registrato, quindi non va atteso senza limite
const SW_READY_TIMEOUT_MS = 3000;

/**
 * Verifica se il browser supporta le notifiche
 * @returns {boolean} True se l'API Notification esiste
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Restituisce lo stato del permesso notifiche
 * @returns {NotificationPermission | 'unsupported'} Stato del permesso
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Verifica se possiamo effettivamente mostrare una notifica di sistema.
 * Supporto dell'API da solo non basta: serve il permesso concesso.
 * @returns {boolean} True se il permesso e' 'granted'
 */
export function canNotify() {
  return isNotificationSupported() && Notification.permission === 'granted';
}

/**
 * Richiesta permessi per le notifiche
 * @returns {Promise<NotificationPermission>} Stato del permesso dopo la richiesta
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    showToast('Notifiche non supportate in questo browser', 'error');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Errore nella richiesta permessi:', e);
    return 'denied';
  }
}

/**
 * Mostra una notifica di sistema.
 * Usa il Service Worker quando disponibile: `new Notification()` lancia
 * TypeError su Chrome Android e non sopravvive alla chiusura della pagina.
 * @param {string} title - Titolo della notifica
 * @param {{ body?: string, icon?: string, tag?: string, data?: Object }} [options] - Opzioni
 * @returns {Promise<boolean>} True se la notifica di sistema e' stata mostrata
 */
export async function showBrowserNotification(title, options) {
  // Storico: registrato indipendentemente dal canale (SW, Notification o
  // toast di fallback) e senza attendere l'esito, per non ritardare la notifica
  addHistoryEntry({
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    itemId: options?.data?.itemId,
    title,
    body: options?.body ?? '',
    shownAt: Date.now(),
  }).catch((e) => console.error('Errore salvataggio storico notifica:', e));

  if (!canNotify()) {
    showToast(options?.body ? `${title} - ${options.body}` : title, 'info');
    return false;
  }

  const notificationOptions = {
    body: options?.body,
    icon: options?.icon ?? DEFAULT_NOTIFICATION_ICON,
    tag: options?.tag,
    data: options?.data,
    // Rispettato solo dai browser mobile con supporto Vibration API sulle
    // notifiche di sistema (non è `navigator.vibrate()`, inutilizzabile da
    // un contesto Service Worker)
    vibrate: getVibrationEnabled() ? VIBRATION_PATTERN : undefined,
    silent: getSilentNotifications(),
  };

  // Percorso preferito: Service Worker (il click e' gestito da 'notificationclick')
  const registration = await getServiceWorkerRegistration();
  if (registration) {
    try {
      await registration.showNotification(title, notificationOptions);
      return true;
    } catch (e) {
      console.error('Errore notifica via Service Worker:', e);
    }
  }

  // Fallback: notifica legata alla pagina
  try {
    const notification = new Notification(title, notificationOptions);
    notification.onclick = () => {
      window.focus();
      if (options?.data?.url) {
        window.location.href = options.data.url;
      }
    };
    return true;
  } catch (e) {
    console.error('Errore nella creazione notifica:', e);
    showToast(title, 'info');
    return false;
  }
}

/**
 * Restituisce la registrazione del Service Worker.
 * La registrazione e' effettuata una sola volta da vite-plugin-pwa
 * (virtual:pwa-register in main.jsx): qui la si attende soltanto.
 * @returns {Promise<ServiceWorkerRegistration | null>} Registrazione o null
 */
export async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve(null), SW_READY_TIMEOUT_MS)
    );
    return await Promise.race([navigator.serviceWorker.ready, timeout]);
  } catch (e) {
    console.error('Service Worker non disponibile:', e);
    return null;
  }
}

/**
 * @deprecated La registrazione avviene tramite vite-plugin-pwa in main.jsx.
 * Mantenuta per compatibilita': attende la registrazione esistente.
 * @returns {Promise<ServiceWorkerRegistration | null>} Registrazione o null
 */
export async function registerSW() {
  return getServiceWorkerRegistration();
}

/**
 * Deregistra il Service Worker
 * @returns {Promise<void>}
 */
export async function unregisterSW() {
  const registration = await getServiceWorkerRegistration();
  if (registration) {
    await registration.unregister();
  }
}

/**
 * Verifica se il Service Worker e' attivo
 * @returns {Promise<boolean>} True se c'e' un SW controllante
 */
export async function isSWReady() {
  return Boolean(await getServiceWorkerRegistration());
}
