/**
 * @typedef {import('../../types/status.js').TimeStatus} TimeStatus
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { parseDateTime, getCurrentDateInTZ } from './timezone.js';

const IMMINENT_THRESHOLD_MINUTES = 1440; // 24 ore
const DUE_MARGIN_MINUTES = 1; // 1 minuto

/**
 * Calcola lo stato temporale di un item
 * @param {AgendaItem} item - Item agenda
 * @returns {TimeStatus} Stato temporale
 */
export function getTimeStatus(item) {
  const now = getCurrentDateInTZ();
  const dueDateTime = parseDateTime(item.dueDate, item.dueTime);
  const diffMs = dueDateTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMs < 0) {
    return 'OVERDUE';
  }

  if (Math.abs(diffMinutes) <= DUE_MARGIN_MINUTES) {
    return 'DUE';
  }

  if (diffMinutes <= IMMINENT_THRESHOLD_MINUTES) {
    return 'IMMINENT';
  }

  return 'FAR';
}

export { IMMINENT_THRESHOLD_MINUTES, DUE_MARGIN_MINUTES };
