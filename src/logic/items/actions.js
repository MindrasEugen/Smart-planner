/**
 * @typedef {import('../../types/agendaItem.js').Task} Task
 * @typedef {import('../../types/agendaItem.js').Birthday} Birthday
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../types/status.js').Importance} Importance
 * @typedef {import('../../types/notifications.js').NotificationSettings} NotificationSettings
 */

import { v4 as uuidv4 } from 'uuid';
import { agendaStore } from '../store/index.js';
import { cancelItemNotification } from '../notifications/integration.js';

// NotificationSettings di default per Task
/** @type {NotificationSettings} */
export const DEFAULT_TASK_NOTIFICATIONS = {
  startBefore: 120,     // 2 ore prima
  repeatEvery: 30,     // ogni 30 minuti
  stopOnComplete: true,
  notifyAfterDeadline: false,
};

// NotificationSettings di default per Birthday
/** @type {NotificationSettings} */
export const DEFAULT_BIRTHDAY_NOTIFICATIONS = {
  startBefore: 1440,    // 24 ore prima
  repeatEvery: 60,     // ogni 1 ora
  stopOnComplete: true,
  notifyAfterDeadline: false,
};

/**
 * Crea un nuovo Task
 * @param {Object} data - Dati del task
 * @param {string} data.title - Titolo
 * @param {string} [data.description] - Descrizione
 * @param {Date} data.dueDate - Data scadenza
 * @param {string} data.dueTime - Ora scadenza (HH:mm)
 * @param {Importance} [data.importance] - Importanza
 * @param {Object} [data.notificationSettings] - Impostazioni notifiche
 * @param {number} [data.notificationSettings.startBefore]
 * @param {number} [data.notificationSettings.repeatEvery]
 * @param {boolean} [data.notificationSettings.stopOnComplete]
 * @param {boolean} [data.notificationSettings.notifyAfterDeadline]
 * @returns {Task} Task creato
 */
export function createTask(data) {
  const now = new Date();
  return {
    id: uuidv4(),
    type: 'TASK',
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    dueTime: data.dueTime,
    importance: data.importance ?? 'MEDIUM',
    status: 'PENDING',
    notificationSettings: {
      ...DEFAULT_TASK_NOTIFICATIONS,
      ...data.notificationSettings,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Crea un nuovo Birthday
 * @param {Object} data - Dati del compleanno
 * @param {string} data.personName - Nome persona
 * @param {string} [data.title] - Titolo
 * @param {string} [data.description] - Descrizione
 * @param {Date} data.dueDate - Data
 * @param {string} [data.dueTime] - Ora (HH:mm)
 * @param {Importance} [data.importance] - Importanza
 * @param {Object} [data.notificationSettings] - Impostazioni notifiche
 * @param {number} [data.notificationSettings.startBefore]
 * @param {number} [data.notificationSettings.repeatEvery]
 * @param {boolean} [data.notificationSettings.stopOnComplete]
 * @param {boolean} [data.notificationSettings.notifyAfterDeadline]
 * @returns {Birthday} Birthday creato
 */
export function createBirthday(data) {
  const now = new Date();
  return {
    id: uuidv4(),
    type: 'BIRTHDAY',
    personName: data.personName,
    title: data.title ?? `Compleanno di ${data.personName}`,
    description: data.description,
    dueDate: data.dueDate,
    dueTime: data.dueTime ?? '00:00',
    importance: data.importance ?? 'HIGH',
    status: 'PENDING',
    notificationSettings: {
      ...DEFAULT_BIRTHDAY_NOTIFICATIONS,
      ...data.notificationSettings,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Aggiunge un item allo store
 * @param {AgendaItem} item - Item da aggiungere
 */
export function addItem(item) {
  const store = agendaStore.getState();
  store.addItem(item);
}

/**
 * Aggiorna un item nello store
 * Aggiorna automaticamente updatedAt
 * Cancella notifiche se status diventa COMPLETED
 * @param {string} id - ID dell'item
 * @param {Object} updates - Aggiornamenti parziali
 * @param {string} [updates.id]
 * @param {string} [updates.title]
 * @param {string} [updates.description]
 * @param {Date} [updates.dueDate]
 * @param {string} [updates.dueTime]
 * @param {import('../../types/status.js').Importance} [updates.importance]
 * @param {import('../../types/status.js').Status} [updates.status]
 * @param {import('../../types/notifications.js').NotificationSettings} [updates.notificationSettings]
 * @param {Date} [updates.createdAt]
 * @param {Date} [updates.updatedAt]
 * @returns {AgendaItem | null} Item aggiornato o null
 */
export function updateItem(id, updates) {
  const store = agendaStore.getState();
  const currentItem = store.items.find(item => item.id === id);

  if (!currentItem) {
    return null;
  }

  // Se lo status diventa COMPLETED, cancella tutte le notifiche per l'item
  if (updates.status === 'COMPLETED' && currentItem.status !== 'COMPLETED') {
    cancelItemNotification(id);
  }

  // Aggiorna updatedAt automaticamente
  const itemWithUpdatedAt = {
    ...updates,
    updatedAt: new Date(),
  };

  store.updateItem(id, itemWithUpdatedAt);

  // Ritorna l'item aggiornato
  return store.items.find(item => item.id === id) ?? null;
}

/**
 * Elimina un item dallo store
 * Cancella tutte le notifiche per l'item
 * @param {string} id - ID dell'item
 * @returns {boolean} True se eliminato, false se non trovato
 */
export function deleteItem(id) {
  const store = agendaStore.getState();
  const exists = store.items.some(item => item.id === id);

  if (exists) {
    cancelItemNotification(id);
    store.deleteItem(id);
  }

  return exists;
}

/**
 * Toggle stato di completamento
 * @param {string} id - ID dell'item
 * @returns {AgendaItem | null} Item aggiornato o null
 */
export function toggleComplete(id) {
  const store = agendaStore.getState();
  const item = store.items.find(item => item.id === id);

  if (!item) {
    return null;
  }

  store.toggleComplete(id);
  return store.items.find(item => item.id === id) ?? null;
}

/**
 * Reimposta tutto lo store
 */
export function resetStore() {
  const store = agendaStore.getState();
  store.resetStore();
}
