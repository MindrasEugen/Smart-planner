/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../types/status.js').Status} Status
 * @typedef {import('../../types/status.js').Importance} Importance
 * @typedef {import('../../types/status.js').ItemType} ItemType
 * @typedef {import('../../types/status.js').TimeStatus} TimeStatus
 */

import { getTimeStatus } from '../time/status.js';
import { parseDateTime, isSameDay } from '../time/timezone.js';

/**
 * Criteri di filtro
 * @typedef {Object} FilterCriteria
 * @property {ItemType} [type] - Tipo di elemento
 * @property {Status} [status] - Stato
 * @property {Importance} [importance] - Importanza
 * @property {Date} [date] - Data specifica
 * @property {'TODAY' | 'TOMORROW' | 'NEXT_WEEK' | 'OVERDUE'} [dateFilter] - Filtro per range di date
 * @property {boolean} [upcomingOnly] - Solo imminenti
 * @property {boolean} [overdueOnly] - Solo scaduti
 */

/**
 * Criteri di ordinamento
 * @typedef {Object} SortCriteria
 * @property {'dueDate' | 'importance' | 'status' | 'creationDate'} field - Campo di ordinamento
 * @property {boolean} ascending - Ordine crescente
 */

/**
 * Filtro per tipo
 * @param {AgendaItem[]} items - Array di item
 * @param {ItemType} [type] - Tipo
 * @returns {AgendaItem[]} Item filtrati
 */
export function filterByType(items, type) {
  if (!type) return [...items];
  return items.filter(item => item.type === type);
}

/**
 * Filtro per stato
 * @param {AgendaItem[]} items - Array di item
 * @param {Status} [status] - Stato
 * @returns {AgendaItem[]} Item filtrati
 */
export function filterByStatus(items, status) {
  if (!status) return [...items];
  return items.filter(item => item.status === status);
}

/**
 * Filtro per importanza
 * @param {AgendaItem[]} items - Array di item
 * @param {Importance} [importance] - Importanza
 * @returns {AgendaItem[]} Item filtrati
 */
export function filterByImportance(items, importance) {
  if (!importance) return [...items];
  return items.filter(item => item.importance === importance);
}

/**
 * Filtro per data (giorno specifico)
 * @param {AgendaItem[]} items - Array di item
 * @param {Date} [date] - Data
 * @returns {AgendaItem[]} Item filtrati
 */
export function filterByDate(items, date) {
  if (!date) return [...items];
  return items.filter(item => {
    const itemDate = new Date(item.dueDate);
    return (
      itemDate.getFullYear() === date.getFullYear() &&
      itemDate.getMonth() === date.getMonth() &&
      itemDate.getDate() === date.getDate()
    );
  });
}

/**
 * Filtro per item imminenti
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Item imminenti
 */
export function filterUpcoming(items) {
  return items.filter(item => {
    const timeStatus = getTimeStatus(item);
    return timeStatus === 'IMMINENT' || timeStatus === 'DUE';
  });
}

/**
 * Filtro per item scaduti
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Item scaduti
 */
export function filterOverdue(items) {
  return items.filter(item => getTimeStatus(item) === 'OVERDUE');
}

/**
 * Filtro per item con scadenza oggi
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Item con scadenza oggi
 */
export function filterByToday(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return items.filter(item => {
    const itemDate = new Date(item.dueDate);
    return isSameDay(itemDate, today);
  });
}

/**
 * Filtro per item con scadenza domani
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Item con scadenza domani
 */
export function filterByTomorrow(items) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return items.filter(item => {
    const itemDate = new Date(item.dueDate);
    return isSameDay(itemDate, tomorrow);
  });
}

/**
 * Filtro per item con scadenza nella prossima settimana (esclusi oggi/domani)
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Item nella prossima settimana
 */
export function filterByNextWeek(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  return items.filter(item => {
    const itemDate = new Date(item.dueDate);
    return itemDate >= today && itemDate <= nextWeek && !isSameDay(itemDate, today);
  });
}

/**
 * Ordinamento per data di scadenza
 * @param {AgendaItem[]} items - Array di item
 * @param {boolean} [ascending=true] - Ordine crescente
 * @returns {AgendaItem[]} Item ordinati
 */
export function sortByDueDate(items, ascending = true) {
  return [...items].sort((a, b) => {
    const aDate = parseDateTime(a.dueDate, a.dueTime);
    const bDate = parseDateTime(b.dueDate, b.dueTime);
    return ascending ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
  });
}

/**
 * Ordinamento per importanza (HIGH > MEDIUM > LOW)
 * @param {AgendaItem[]} items - Array di item
 * @param {boolean} [ascending=true] - Ordine crescente
 * @returns {AgendaItem[]} Item ordinati
 */
export function sortByImportance(items, ascending = true) {
  const importanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  return [...items].sort((a, b) => {
    const aVal = importanceOrder[a.importance];
    const bVal = importanceOrder[b.importance];
    return ascending ? bVal - aVal : aVal - bVal;
  });
}

/**
 * Ordinamento per stato (PENDING > COMPLETED)
 * @param {AgendaItem[]} items - Array di item
 * @param {boolean} [ascending=true] - Ordine crescente
 * @returns {AgendaItem[]} Item ordinati
 */
export function sortByStatus(items, ascending = true) {
  const statusOrder = { PENDING: 2, COMPLETED: 1 };
  return [...items].sort((a, b) => {
    const aVal = statusOrder[a.status];
    const bVal = statusOrder[b.status];
    return ascending ? bVal - aVal : aVal - bVal;
  });
}

/**
 * Ordinamento per data di creazione
 * @param {AgendaItem[]} items - Array di item
 * @param {boolean} [ascending=true] - Ordine crescente
 * @returns {AgendaItem[]} Item ordinati
 */
export function sortByCreationDate(items, ascending = true) {
  return [...items].sort((a, b) => {
    return ascending
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/**
 * Applica tutti i filtri
 * @param {AgendaItem[]} items - Array di item
 * @param {FilterCriteria} filters - Criteri di filtro
 * @returns {AgendaItem[]} Item filtrati
 */
export function applyFilters(items, filters) {
  let result = [...items];

  if (filters.type) {
    result = filterByType(result, filters.type);
  }

  if (filters.status) {
    result = filterByStatus(result, filters.status);
  }

  if (filters.importance) {
    result = filterByImportance(result, filters.importance);
  }

  if (filters.date) {
    result = filterByDate(result, filters.date);
  }

  if (filters.dateFilter) {
    switch (filters.dateFilter) {
      case 'TODAY':
        result = filterByToday(result);
        break;
      case 'TOMORROW':
        result = filterByTomorrow(result);
        break;
      case 'NEXT_WEEK':
        result = filterByNextWeek(result);
        break;
      case 'OVERDUE':
        result = filterOverdue(result);
        break;
    }
  }

  if (filters.upcomingOnly) {
    result = filterUpcoming(result);
  }

  if (filters.overdueOnly) {
    result = filterOverdue(result);
  }

  return result;
}

/**
 * Applica ordinamento
 * @param {AgendaItem[]} items - Array di item
 * @param {SortCriteria} sort - Criteri di ordinamento
 * @returns {AgendaItem[]} Item ordinati
 */
export function applySort(items, sort) {
  switch (sort.field) {
    case 'dueDate':
      return sortByDueDate(items, sort.ascending);
    case 'importance':
      return sortByImportance(items, sort.ascending);
    case 'status':
      return sortByStatus(items, sort.ascending);
    case 'creationDate':
      return sortByCreationDate(items, sort.ascending);
    default:
      return [...items];
  }
}

/**
 * Applica filtri + ordinamento
 * @param {AgendaItem[]} items - Array di item
 * @param {FilterCriteria} filters - Criteri di filtro
 * @param {SortCriteria} sort - Criteri di ordinamento
 * @returns {AgendaItem[]} Item filtrati e ordinati
 */
export function applyFiltersAndSort(items, filters, sort) {
  return applySort(applyFilters(items, filters), sort);
}
