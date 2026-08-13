/**
 * Gestione timezone e date
 */

/**
 * Restituisce la timezone dell'utente
 * @returns {string} Timezone (es: "Europe/Rome")
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Restituisce la data/ora corrente nel timezone dell'utente
 * @returns {Date} Data/ora corrente
 */
export function getCurrentDateInTZ() {
  return new Date();
}

/**
 * Parsa data e ora in un oggetto Date
 * @param {Date} dueDate - Data
 * @param {string} dueTime - Ora (formato HH:mm)
 * @returns {Date} Data/ora combinate
 */
export function parseDateTime(dueDate, dueTime) {
  const [hours, minutes] = dueTime.split(':');
  const date = new Date(dueDate);
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
}

/**
 * Verifica se due date sono lo stesso giorno
 * @param {Date} date1 - Prima data
 * @param {Date} date2 - Seconda data
 * @returns {boolean} True se stesso giorno
 */
export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Calcola il tempo rimanente fino a una data target
 * @param {Date} targetDate - Data target
 * @returns {Object} Oggetto con days, hours, minutes
 */
export function getTimeUntil(targetDate) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  return { days, hours, minutes };
}

/**
 * Formatta un'orario in formato HH:mm
 * @param {string} time - Ora (formato HH:mm)
 * @returns {string} Ora formattata
 */
export function formatTime(time) {
  // Se l'ora è "00:00" o vuota, mostra "Tutto il giorno"
  if (!time || time === '00:00') {
    return 'Tutto il giorno';
  }
  
  // Estrai ore e minuti
  const [hours, minutes] = time.split(':');
  
  // Formatta in HH:mm
  return `${hours}:${minutes}`;
}
