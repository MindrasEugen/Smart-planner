/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { agendaStore } from '../store/index.js';
import { showBrowserNotification, getServiceWorkerRegistration } from './browser.js';
import { calculateNextNotificationTime, getItemsToNotifyNow } from './scheduler.js';
import {
  saveScheduledNotification,
  removeScheduledNotificationById,
  removeScheduledNotificationsByItemId,
  clearAllScheduledNotifications as clearAllScheduledNotificationsFromDB,
  getExpiredNotifications,
  createNotificationId,
} from './db.js';
import { syncItemsToServer } from './sync.js';
import { getPushEnabled } from '../preferences.js';

// Timeout in-page attivi, per item (fallback mentre l'app e' aperta)
const scheduledNotifications = new Map();

// Attesa prima di riprovare quando l'orario calcolato e' gia' passato
const RETRY_DELAY_MS = 60000;

/**
 * Invia un messaggio al Service Worker, se attivo
 * @param {Object} message - Messaggio da inviare
 * @returns {Promise<void>}
 */
async function postToServiceWorker(message) {
  const registration = await getServiceWorkerRegistration();
  if (registration?.active) {
    registration.active.postMessage(message);
  }
}

/**
 * Costruisce titolo e corpo della notifica per un item
 * @param {AgendaItem} item - Item agenda
 * @returns {{ title: string, body: string }} Testi della notifica
 */
export function formatItemNotification(item) {
  const dueDate = item.dueDate instanceof Date ? item.dueDate : new Date(item.dueDate);
  return {
    title: `[${item.importance}] ${item.title}`,
    body: `Scadenza: ${dueDate.toLocaleDateString()} alle ${item.dueTime}`,
  };
}

/**
 * Cancella il timeout in-page di un item
 * @param {string} id - ID dell'item
 */
function clearItemTimeout(id) {
  const timeout = scheduledNotifications.get(id);
  if (timeout) {
    clearTimeout(timeout);
    scheduledNotifications.delete(id);
  }
}

/**
 * Pianifica la prossima notifica per un item, sostituendo quella esistente
 * @param {AgendaItem} item - Item agenda
 * @returns {Promise<void>}
 */
async function scheduleItemNotification(item) {
  // La cancellazione va attesa: altrimenti la pulizia async di IndexedDB
  // rimuove il record appena salvato dalla pianificazione successiva.
  await cancelItemNotification(item.id);
  await scheduleItemNotificationFresh(item);
}

/**
 * Pianifica la notifica di un item assumendo che non ne esistano altre.
 * Da usare solo dopo una cancellazione: salta la pulizia per item e
 * quindi una transazione IndexedDB per elemento.
 * @param {AgendaItem} item - Item agenda
 * @returns {Promise<void>}
 */
async function scheduleItemNotificationFresh(item) {
  // Non pianificare per item completati
  if (item.status === 'COMPLETED') {
    return;
  }

  // Calcola il prossimo orario di notifica
  const nextTime = calculateNextNotificationTime(item);
  if (!nextTime) {
    return;
  }

  const { title, body } = formatItemNotification(item);
  const delay = nextTime.getTime() - Date.now();

  // Se l'orario e' gia' passato, notifica subito e riprova piu' tardi.
  // Non si ricorre immediatamente: con un orologio sfasato la ricorsione
  // diventerebbe infinita, con una notifica per iterazione.
  if (delay <= 0) {
    await showNotificationForItem(item);
    scheduledNotifications.set(
      item.id,
      setTimeout(() => {
        scheduleItemNotification(item).catch((e) =>
          console.error('Errore ripianificazione notifica:', e)
        );
      }, RETRY_DELAY_MS)
    );
    return;
  }

  // Salva in IndexedDB: e' cio' che permette al Service Worker di notificare
  // anche quando la pagina non e' aperta
  const notificationId = createNotificationId(item.id, nextTime.getTime());
  try {
    await saveScheduledNotification({
      id: notificationId,
      itemId: item.id,
      title,
      body,
      scheduledTime: nextTime.getTime(),
      data: { itemId: item.id, url: '/' },
      createdAt: Date.now(),
    });
    await postToServiceWorker({ type: 'INIT_SYNC' });
  } catch (e) {
    console.error('Errore salvataggio notifica in IndexedDB:', e);
  }

  // Fallback in-page mentre l'app e' aperta
  const timeout = setTimeout(() => {
    showNotificationForItem(item)
      .then(() => scheduleItemNotification(item))
      .catch((e) => console.error('Errore notifica pianificata:', e));
  }, delay);

  scheduledNotifications.set(item.id, timeout);
}

/**
 * Mostra la notifica per un item
 * @param {AgendaItem} item - Item agenda
 * @returns {Promise<void>}
 */
async function showNotificationForItem(item) {
  const { title, body } = formatItemNotification(item);
  // showBrowserNotification ricade automaticamente sul toast se manca il permesso
  await showBrowserNotification(title, {
    body,
    tag: `item_${item.id}`,
    data: { itemId: item.id, url: '/' },
  });
}

/**
 * Cancella le notifiche pianificate di un item
 * @param {string} id - ID dell'item
 * @returns {Promise<void>}
 */
export async function cancelItemNotification(id) {
  clearItemTimeout(id);

  try {
    const removedIds = await removeScheduledNotificationsByItemId(id);
    for (const notificationId of removedIds) {
      await postToServiceWorker({ type: 'CANCEL_NOTIFICATION', id: notificationId });
    }
  } catch (e) {
    console.error('Errore cancellazione notifica da IndexedDB:', e);
  }
}

/**
 * Cancella tutte le notifiche pianificate
 * @returns {Promise<void>}
 */
export async function cancelAllScheduledNotifications() {
  scheduledNotifications.forEach((timeout) => clearTimeout(timeout));
  scheduledNotifications.clear();

  try {
    await clearAllScheduledNotificationsFromDB();
  } catch (e) {
    console.error('Errore pulizia IndexedDB:', e);
  }
}

// Coda di serializzazione: due ripianificazioni sovrapposte si
// cancellerebbero a vicenda (la pulizia della seconda rimuove i record
// che la prima sta ancora scrivendo)
let rescheduleChain = Promise.resolve();

/**
 * Accoda una ripianificazione completa, senza sovrapposizioni
 * @param {AgendaItem[]} items - Array di item
 * @returns {Promise<void>}
 */
function queueReschedule(items) {
  rescheduleChain = rescheduleChain
    .then(() => rescheduleAll(items))
    .catch((e) => console.error('Errore ripianificazione notifiche:', e));
  return rescheduleChain;
}

/**
 * Ripianifica da zero le notifiche di tutti gli item
 * @param {AgendaItem[]} items - Array di item
 * @returns {Promise<void>}
 */
async function rescheduleAll(items) {
  // La pulizia va attesa: se partisse in parallelo alla pianificazione,
  // cancellerebbe le notifiche appena create
  await cancelAllScheduledNotifications();

  // IndexedDB e' gia' vuoto: si usa la variante senza cancellazione per item
  for (const item of items) {
    await scheduleItemNotificationFresh(item);
  }
}

/**
 * Mostra e consuma le notifiche scadute rimaste in IndexedDB.
 * Serve quando il Service Worker non e' stato risvegliato dal sistema:
 * alla riapertura dell'app le scadenze passate vengono comunque segnalate.
 * @returns {Promise<void>}
 */
export async function flushExpiredNotifications() {
  try {
    const expired = await getExpiredNotifications();
    for (const notification of expired) {
      await showBrowserNotification(notification.title, {
        body: notification.body,
        tag: notification.id,
        data: notification.data,
      });
      await removeScheduledNotificationById(notification.id);
    }
  } catch (e) {
    console.error('Errore recupero notifiche scadute:', e);
  }
}

/**
 * Sincronizza gli item col backend push, solo se l'utente ha attivato le
 * notifiche push (altrimenti syncItemsToServer e' comunque un no-op se il
 * backend non e' configurato in questo build, vedi isSyncConfigured)
 * @param {AgendaItem[]} items - Array di item
 */
function syncToServerIfPushEnabled(items) {
  if (getPushEnabled()) {
    syncItemsToServer(items);
  }
}

/**
 * Monitora lo store e pianifica le notifiche automaticamente
 * @returns {Function} Funzione di cleanup
 */
export function startNotificationMonitor() {
  // subscribe(selector, listener) richiede il middleware subscribeWithSelector,
  // applicato in logic/store/index.js
  const unsubscribe = agendaStore.subscribe(
    (state) => state.items,
    (items) => queueReschedule(items)
  );

  // Sincronizza col backend push a ogni modifica degli item (debounced in sync.js):
  // e' cio' che permette al server di sapere cosa notificare anche ad app chiusa
  const unsubscribePushSync = agendaStore.subscribe(
    (state) => state.items,
    (items) => syncToServerIfPushEnabled(items)
  );

  // Recupera le scadenze passate, poi pianifica gli item esistenti
  flushExpiredNotifications()
    .then(() => {
      const items = agendaStore.getState().items;
      queueReschedule(items);
      // Corregge eventuali disallineamenti col backend dopo un periodo offline
      syncToServerIfPushEnabled(items);
    })
    .catch((e) => console.error('Errore inizializzazione notifiche:', e));

  return () => {
    unsubscribe();
    unsubscribePushSync();
    cancelAllScheduledNotifications().catch((e) =>
      console.error('Errore cleanup notifiche:', e)
    );
  };
}

/**
 * Inizializza il monitoraggio automatico delle notifiche
 * @returns {Function} Funzione di cleanup
 */
export function setupAutoNotifications() {
  try {
    // Il Service Worker e' registrato da vite-plugin-pwa in main.jsx
    return startNotificationMonitor();
  } catch (e) {
    console.error('Errore inizializzazione notifiche:', e);
    return () => {};
  }
}

/**
 * Mostra immediatamente le notifiche degli item che le richiedono ora
 * @param {AgendaItem[]} items - Array di item
 * @returns {Promise<void>}
 */
export async function checkAndNotifyNow(items) {
  for (const item of getItemsToNotifyNow(items)) {
    await showNotificationForItem(item);
  }
}
