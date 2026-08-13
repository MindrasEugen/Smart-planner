/**
 * Restituisce la timezone dell'utente
 * @returns {string} Timezone (es: "Europe/Rome")
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Converte una data in UTC
 * @param {Date} date - Data da convertire
 * @returns {Date} Data in UTC
 */
export function toUTC(date) {
  return new Date(date.toISOString());
}

/**
 * Converte una data UTC in locale
 * @param {Date} date - Data UTC
 * @returns {Date} Data locale
 */
export function fromUTC(date) {
  return new Date(date);
}
