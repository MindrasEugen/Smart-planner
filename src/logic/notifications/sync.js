/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

/**
 * Sincronizzazione col backend Web Push: manda al server la subscription
 * del browser e una copia minima degli item, cosi' puo' calcolare lui
 * quando inviare una notifica anche ad app chiusa (vedi server/).
 */

import { getVibrationEnabled, getSilentNotifications } from '../preferences.js';

const API_URL = import.meta.env.VITE_SYNC_API_URL;
const SYNC_SECRET = import.meta.env.VITE_SYNC_SECRET;

// Tempo di attesa dopo l'ultima modifica prima di inviare la sincronizzazione:
// evita una richiesta di rete per ogni singola battitura/modifica ravvicinata
const SYNC_DEBOUNCE_MS = 2000;

let syncTimeout = null;

/**
 * @returns {boolean} True se il backend di sincronizzazione e' configurato in questo build
 */
export function isSyncConfigured() {
  return Boolean(API_URL && SYNC_SECRET);
}

/**
 * Esegue una fetch autenticata verso il backend
 * @param {string} path - Percorso relativo (es. '/api/sync')
 * @param {Object} options - Opzioni fetch
 * @returns {Promise<Response>} Risposta fetch
 */
function authedFetch(path, options) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SYNC_SECRET}`,
      ...options?.headers,
    },
  });
}

/**
 * Riduce un item al sottoinsieme di campi rilevanti per il calcolo delle notifiche
 * @param {AgendaItem} item - Item agenda
 * @returns {Object} Item ridotto
 */
function toSyncPayload(item) {
  return {
    id: item.id,
    title: item.title,
    dueDate: item.dueDate instanceof Date ? item.dueDate.toISOString() : item.dueDate,
    dueTime: item.dueTime,
    status: item.status,
    notificationSettings: item.notificationSettings,
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
  };
}

/**
 * Invia al backend l'elenco completo degli item (sostituzione totale lato server,
 * stessa filosofia di `rescheduleAll`: cancella tutto e ripianifica tutto).
 * Debounced: chiamate ravvicinate si accorpano in una sola richiesta.
 * @param {AgendaItem[]} items - Array di item
 * @returns {void}
 */
export function syncItemsToServer(items) {
  if (!isSyncConfigured()) return;

  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    authedFetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify({ items: items.map(toSyncPayload) }),
    }).catch((e) => console.error('Errore sincronizzazione item col backend push:', e));
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Registra (upsert) la subscription push presso il backend
 * @param {PushSubscription} subscription - Subscription del browser
 * @returns {Promise<void>}
 */
export async function syncSubscriptionToServer(subscription) {
  if (!isSyncConfigured()) return;

  await authedFetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      prefs: {
        vibrate: getVibrationEnabled(),
        silent: getSilentNotifications(),
      },
    }),
  });
}

/**
 * Rimuove una subscription push dal backend
 * @param {string} endpoint - Endpoint della subscription da rimuovere
 * @returns {Promise<void>}
 */
export async function deleteSubscriptionFromServer(endpoint) {
  if (!isSyncConfigured()) return;

  await authedFetch('/api/subscribe', {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
  });
}
