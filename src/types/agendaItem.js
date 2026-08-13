/**
 * @typedef {import('./status.js').Importance} Importance
 * @typedef {import('./status.js').Status} Status
 * @typedef {import('./status.js').ItemType} ItemType
 * @typedef {import('./notifications.js').NotificationSettings} NotificationSettings
 */

/**
 * Struttura base comune a Task e Birthday
 * @typedef {Object} AgendaItemBase
 * @property {string} id - Identificatore univoco
 * @property {string} title - Titolo dell'elemento
 * @property {string} [description] - Descrizione opzionale
 * @property {Date} dueDate - Data di scadenza
 * @property {string} dueTime - Ora di scadenza (formato HH:mm)
 * @property {Importance} importance - Livello di importanza
 * @property {Status} status - Stato dell'elemento
 * @property {NotificationSettings} notificationSettings - Impostazioni notifiche
 * @property {Date} createdAt - Data creazione
 * @property {Date} updatedAt - Data ultimo aggiornamento
 */

/**
 * Task: attivita' generica
 * @typedef {Object} Task
 * @property {'TASK'} type - Tipo elemento
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Date} dueDate
 * @property {string} dueTime
 * @property {Importance} importance
 * @property {Status} status
 * @property {NotificationSettings} notificationSettings
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Birthday: compleanno con campo specifico personName
 * @typedef {Object} Birthday
 * @property {'BIRTHDAY'} type - Tipo elemento
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Date} dueDate
 * @property {string} dueTime
 * @property {Importance} importance
 * @property {Status} status
 * @property {NotificationSettings} notificationSettings
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {string} personName - Nome della persona
 */

/**
 * Tipo unione per tutti gli elementi agenda
 * @typedef {Task | Birthday} AgendaItem
 */

export {};
