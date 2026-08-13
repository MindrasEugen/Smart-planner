/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { parseDateTime, getCurrentDateInTZ } from '../time/timezone.js';

// Intervallo minimo tra due notifiche: un valore 0/NaN produrrebbe orari
// non validi e quindi una raffica di notifiche
const MIN_REPEAT_MINUTES = 1;

/**
 * Normalizza le impostazioni di notifica di un item
 * @param {AgendaItem} item - Item agenda
 * @returns {{ startBefore: number, repeatEvery: number, notifyAfterDeadline: boolean }} Impostazioni valide
 */
function getSafeNotificationSettings(item) {
  const settings = item.notificationSettings ?? {};
  const startBefore = Number(settings.startBefore);
  const repeatEvery = Number(settings.repeatEvery);

  return {
    startBefore: Number.isFinite(startBefore) && startBefore > 0 ? startBefore : 0,
    repeatEvery:
      Number.isFinite(repeatEvery) && repeatEvery >= MIN_REPEAT_MINUTES
        ? repeatEvery
        : MIN_REPEAT_MINUTES,
    notifyAfterDeadline: Boolean(settings.notifyAfterDeadline),
  };
}

/**
 * Calcola il prossimo orario in cui notificare per un item.
 * L'orario restituito e' sempre strettamente nel futuro: se non lo fosse,
 * il chiamante ripianificherebbe all'infinito notificando in continuazione.
 * @param {AgendaItem} item - Item agenda
 * @returns {Date | null} Prossimo orario notifica o null
 */
export function calculateNextNotificationTime(item) {
  // Non notificare per item completati
  if (item.status === 'COMPLETED') {
    return null;
  }

  const { startBefore, repeatEvery, notifyAfterDeadline } = getSafeNotificationSettings(item);
  const now = getCurrentDateInTZ();
  const dueDateTime = parseDateTime(item.dueDate, item.dueTime);

  if (Number.isNaN(dueDateTime.getTime())) {
    return null;
  }

  // Se scadenza e' passata
  if (now >= dueDateTime) {
    // Se non si vuole notificare dopo la scadenza, fermarsi
    if (!notifyAfterDeadline) {
      return null;
    }

    // Prossimo multiplo di repeatEvery successivo a ora.
    // floor(...) + 1 e non ceil(...): con uno scarto multiplo esatto
    // dell'intervallo, ceil restituirebbe l'istante corrente.
    const diffMinutes = Math.floor((now.getTime() - dueDateTime.getTime()) / 60000);
    const nextMinutes = (Math.floor(diffMinutes / repeatEvery) + 1) * repeatEvery;
    return new Date(dueDateTime.getTime() + nextMinutes * 60000);
  }

  // Scadenza futura: calcola quando iniziare a notificare
  const startTime = new Date(dueDateTime.getTime() - startBefore * 60000);

  // Se non e' ancora ora di iniziare
  if (now < startTime) {
    return startTime;
  }

  // E' ora di iniziare o siamo in mezzo al periodo di notifica
  const elapsedMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);

  // Numero di notifiche gia' inviate
  const notificationsSent = Math.floor(elapsedMinutes / repeatEvery);

  // Prossima notifica
  const nextNotificationMinutes = (notificationsSent + 1) * repeatEvery;
  const nextTime = new Date(startTime.getTime() + nextNotificationMinutes * 60000);

  // Se nextTime e' dopo la scadenza, verifica se vogliamo notificare dopo
  if (nextTime > dueDateTime && !notifyAfterDeadline) {
    return null;
  }

  return nextTime;
}

/**
 * Verifica se e' il momento di notificare ora
 * @param {AgendaItem} item - Item agenda
 * @returns {boolean} True se e' il momento
 */
export function shouldNotifyNow(item) {
  const nextTime = calculateNextNotificationTime(item);
  if (!nextTime) {
    return false;
  }

  const now = getCurrentDateInTZ();
  const diffMs = nextTime.getTime() - now.getTime();

  // Considera "ora" se la differenza e' <= 1 minuto
  return diffMs <= 60000 && diffMs >= 0;
}

/**
 * Restituisce tutti gli item che richiedono notifica, con orario esatto
 * @param {AgendaItem[]} items - Array di item
 * @returns {Array<{ item: AgendaItem, time: Date }>} Array di notifiche pianificate
 */
export function getAllScheduledNotifications(items) {
  const scheduled = [];

  for (const item of items) {
    const nextTime = calculateNextNotificationTime(item);
    if (nextTime) {
      scheduled.push({ item, time: nextTime });
    }
  }

  // Ordina per orario di notifica
  return scheduled.sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Restituisce gli item che necessitano notifica IMMEDIATA
 * @param {AgendaItem[]} items - Array di item
 * @returns {AgendaItem[]} Array di item da notificare
 */
export function getItemsToNotifyNow(items) {
  return items.filter(item => shouldNotifyNow(item));
}
