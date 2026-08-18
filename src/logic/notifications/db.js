/**
 * Database IndexedDB per notifiche pianificate
 * Usato per persistenza notifiche quando l'app e' chiusa
 */

const DB_NAME = 'agenda-notifications';
const STORE_NAME = 'scheduled';
const HISTORY_STORE_NAME = 'history';
const DB_VERSION = 2;

// Limite di voci nello storico: repeatEvery puo' arrivare a 1 minuto, quindi
// senza un tetto la tabella crescerebbe senza controllo su un uso prolungato
const MAX_HISTORY_ENTRIES = 200;

/**
 * @typedef {Object} ScheduledNotification
 * @property {string} id
 * @property {string} itemId
 * @property {string} title
 * @property {string} body
 * @property {number} scheduledTime
 * @property {Object} data
 * @property {number} createdAt
 */

/**
 * @typedef {Object} NotificationHistoryEntry
 * @property {string} id
 * @property {string} [itemId]
 * @property {string} title
 * @property {string} body
 * @property {number} shownAt
 */

/**
 * Apri database IndexedDB
 * @returns {Promise<IDBDatabase>} Database aperto
 */
export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(HISTORY_STORE_NAME)) {
        db.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Salva una notifica pianificata in IndexedDB
 * @param {ScheduledNotification} notification - Notifica da salvare
 * @returns {Promise<void>}
 */
export async function saveScheduledNotification(notification) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).put(notification);
  });
}

/**
 * Rimuovi una notifica pianificata per ID
 * @param {string} id - ID della notifica
 * @returns {Promise<void>}
 */
export async function removeScheduledNotificationById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).delete(id);
  });
}

/**
 * Rimuovi tutte le notifiche pianificate di un item
 * @param {string} itemId - ID dell'item agenda
 * @returns {Promise<string[]>} ID delle notifiche rimosse
 */
export async function removeScheduledNotificationsByItemId(itemId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const removed = [];

    const request = store.getAll();
    request.onsuccess = () => {
      for (const notification of request.result) {
        if (notification.itemId === itemId) {
          store.delete(notification.id);
          removed.push(notification.id);
        }
      }
    };

    tx.oncomplete = () => resolve(removed);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Ottieni tutte le notifiche scadute (scheduledTime <= ora)
 * @returns {Promise<ScheduledNotification[]>} Array di notifiche scadute
 */
export async function getExpiredNotifications() {
  const db = await openDB();
  const now = Date.now();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.filter(n => n.scheduledTime <= now));
    request.onerror = () => reject(request.error);
  });
}

/**
 * Cancella tutte le notifiche pianificate
 * @returns {Promise<void>}
 */
export async function clearAllScheduledNotifications() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE_NAME).clear();
  });
}

/**
 * Crea ID univoco per una notifica
 * @param {string} itemId - ID dell'item
 * @param {number} scheduledTime - Timestamp pianificato
 * @returns {string} ID della notifica
 */
export function createNotificationId(itemId, scheduledTime) {
  return `notif_${itemId}_${scheduledTime}`;
}

/**
 * Registra nello storico una notifica mostrata all'utente.
 * Chiamata indipendentemente dal canale con cui e' stata mostrata
 * (Service Worker, Notification diretta o toast di fallback).
 * @param {NotificationHistoryEntry} entry - Voce di storico
 * @returns {Promise<void>}
 */
export async function addHistoryEntry(entry) {
  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(HISTORY_STORE_NAME).put(entry);
  });
  await trimHistory(db);
}

/**
 * Elimina le voci di storico piu' vecchie oltre il limite consentito
 * @param {IDBDatabase} db - Database gia' aperto
 * @returns {Promise<void>}
 */
async function trimHistory(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    const store = tx.objectStore(HISTORY_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const entries = request.result.sort((a, b) => b.shownAt - a.shownAt);
      for (const entry of entries.slice(MAX_HISTORY_ENTRIES)) {
        store.delete(entry.id);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Ottieni lo storico delle notifiche mostrate, piu' recenti prima
 * @returns {Promise<NotificationHistoryEntry[]>} Voci di storico
 */
export async function getHistory() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE_NAME, 'readonly');
    const request = tx.objectStore(HISTORY_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.shownAt - a.shownAt));
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina una singola voce dallo storico
 * @param {string} id - ID della voce di storico
 * @returns {Promise<void>}
 */
export async function removeHistoryEntry(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(HISTORY_STORE_NAME).delete(id);
  });
}

/**
 * Svuota lo storico delle notifiche
 * @returns {Promise<void>}
 */
export async function clearHistory() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(HISTORY_STORE_NAME).clear();
  });
}
