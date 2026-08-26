/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../types/agendaItem.js').Task} Task
 * @typedef {import('../../types/agendaItem.js').Birthday} Birthday
 * @typedef {import('../../types/status.js').Status} Status
 * @typedef {import('../../types/status.js').Importance} Importance
 * @typedef {import('../../types/status.js').ItemType} ItemType
 * @typedef {import('../../types/status.js').TimeStatus} TimeStatus
 */

import { agendaStore } from '../store/index.js';
import { getTimeStatus } from '../time/status.js';
import { parseDateTime } from '../time/timezone.js';
import { calculateNextNotificationTime } from '../notifications/scheduler.js';

/**
 * Ottieni tutti gli item dallo store
 * @returns {AgendaItem[]} Array di tutti gli item
 */
export function getItems() {
  return agendaStore.getState().items;
}

/**
 * Ottieni item per tipo
 * @param {ItemType} [type] - Tipo di elemento (TASK o BIRTHDAY)
 * @returns {AgendaItem[]} Array di item filtrati per tipo
 */
export function getItemsByType(type) {
  const items = getItems();
  if (!type) return items;
  return items.filter(item => item.type === type);
}

/**
 * Ottieni item per stato
 * @param {Status} [status] - Stato dell'elemento
 * @returns {AgendaItem[]} Array di item filtrati per stato
 */
export function getItemsByStatus(status) {
  const items = getItems();
  if (!status) return items;
  return items.filter(item => item.status === status);
}

/**
 * Ottieni item per importanza
 * @param {Importance} [importance] - Livello di importanza
 * @returns {AgendaItem[]} Array di item filtrati per importanza
 */
export function getItemsByImportance(importance) {
  const items = getItems();
  if (!importance) return items;
  return items.filter(item => item.importance === importance);
}

/**
 * Ottieni solo Task
 * @returns {Task[]} Array di task
 */
export function getTasks() {
  return getItemsByType('TASK');
}

/**
 * Ottieni solo Birthday
 * @returns {Birthday[]} Array di compleanni
 */
export function getBirthdays() {
  return getItemsByType('BIRTHDAY');
}

/**
 * Compleanno da mostrare in Dashboard, se ce n'e' uno: solo nella finestra
 * tra la prima notifica (scadenza meno "Inizia notifiche") e la fine della
 * giornata del compleanno stesso — non per tutto l'anno. Se più compleanni
 * rientrano nella finestra (raro), viene scelto il più vicino.
 * @returns {Birthday | null} Compleanno da mostrare, o null se nessuno e' nella finestra
 */
export function getUpcomingBirthdayForDashboard() {
  const now = new Date();

  const visible = getBirthdays().filter((birthday) => {
    const dueDateTime = combineDateTime(birthday);
    const startBefore = birthday.notificationSettings?.startBefore ?? 0;
    const windowStart = new Date(dueDateTime.getTime() - startBefore * 60000);
    const endOfDay = new Date(birthday.dueDate);
    endOfDay.setHours(23, 59, 59, 999);
    return now >= windowStart && now <= endOfDay;
  });

  visible.sort((a, b) => combineDateTime(a).getTime() - combineDateTime(b).getTime());
  return visible[0] ?? null;
}

/**
 * Ottieni item con alta priorita'
 * @returns {AgendaItem[]} Array di item ad alta priorita
 */
export function getHighPriorityItems() {
  return getItemsByImportance('HIGH');
}

/**
 * Ottieni item a media priorita'
 * @returns {AgendaItem[]} Array di item a media priorita
 */
export function getMediumPriorityItems() {
  return getItemsByImportance('MEDIUM');
}

/**
 * Ottieni item a bassa priorita'
 * @returns {AgendaItem[]} Array di item a bassa priorita
 */
export function getLowPriorityItems() {
  return getItemsByImportance('LOW');
}

/**
 * Helper per combinare dueDate e dueTime in un Date
 * @param {AgendaItem} item - Item agenda
 * @returns {Date} Data e ora combinate
 */
function combineDateTime(item) {
  return parseDateTime(item.dueDate, item.dueTime);
}

/**
 * True se l'item e' completato e la giornata della sua scadenza e' gia'
 * passata. Usato per nascondere i task completati dalla Dashboard "a fine
 * giornata": in Agenda/storico restano sempre visibili, questo filtro non
 * cancella nulla, si applica solo alle liste mostrate in Dashboard.
 * @param {AgendaItem} item - Item agenda
 * @returns {boolean} True se va nascosto dalla Dashboard
 */
export function isStaleCompleted(item) {
  if (item.status !== 'COMPLETED') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(item.dueDate);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

/**
 * Ottieni item imminenti o in scadenza
 * @returns {AgendaItem[]} Array di item imminenti/in scadenza ordinati
 */
export function getUpcomingItems() {
  const items = getItems();
  return items
    .filter(item => {
      const timeStatus = getTimeStatus(item);
      return timeStatus === 'IMMINENT' || timeStatus === 'DUE';
    })
    .sort((a, b) => combineDateTime(a).getTime() - combineDateTime(b).getTime());
}

/**
 * Ottieni item scaduti
 * @returns {AgendaItem[]} Array di item scaduti ordinati
 */
export function getOverdueItems() {
  const items = getItems();
  return items
    .filter(item => getTimeStatus(item) === 'OVERDUE')
    .sort((a, b) => combineDateTime(a).getTime() - combineDateTime(b).getTime());
}

/**
 * Ottieni TimeStatus per un item
 * @param {string} id - ID dell'item
 * @returns {TimeStatus | null} Stato temporale o null
 */
export function getItemTimeStatus(id) {
  const item = getItems().find(item => item.id === id);
  if (!item) return null;
  return getTimeStatus(item);
}

/**
 * Ottieni prossima notifica per un item
 * @param {string} id - ID dell'item
 * @returns {Date | null} Data prossima notifica o null
 */
export function getNextNotificationTime(id) {
  const item = getItems().find(item => item.id === id);
  if (!item) return null;
  return calculateNextNotificationTime(item);
}
