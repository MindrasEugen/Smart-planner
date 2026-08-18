/**
 * Preferenze utente persistite in localStorage (coerente con l'architettura
 * local-first del progetto, nessun database).
 * @typedef {'light' | 'dark' | 'system'} Theme
 */

const THEME_KEY = 'agenda_theme';
const VIBRATION_KEY = 'agenda_vibration_enabled';
const SILENT_KEY = 'agenda_notifications_silent';
const PUSH_ENABLED_KEY = 'agenda_push_enabled';
const PUSH_SUBSCRIBED_KEY = 'agenda_push_subscribed';

/**
 * Legge il tema salvato
 * @returns {Theme} Tema corrente, 'system' se non impostato
 */
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

/**
 * @returns {boolean} True se il sistema operativo preferisce il tema scuro
 */
function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Applica il tema al DOM: `.dark` su `<html>` abilita `@custom-variant dark`
 * in `global.css`. Va chiamata sia all'avvio sia a ogni cambio.
 * @param {Theme} [theme] - Tema da applicare, default quello salvato
 */
export function applyTheme(theme = getTheme()) {
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', isDark);
}

/**
 * Salva e applica il tema scelto
 * @param {Theme} theme - Nuovo tema
 */
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

let systemThemeWatcherAttached = false;

/**
 * Riapplica il tema quando cambia la preferenza di sistema, ma solo se
 * l'utente ha scelto 'system' (altrimenti la scelta esplicita non deve
 * essere sovrascritta). Idempotente: chiamabile più volte senza duplicare
 * il listener.
 */
export function watchSystemTheme() {
  if (systemThemeWatcherAttached) return;
  systemThemeWatcherAttached = true;
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme('system');
  });
}

/**
 * @returns {boolean} True se la vibrazione per le notifiche è abilitata (default: sì)
 */
export function getVibrationEnabled() {
  return localStorage.getItem(VIBRATION_KEY) !== 'false';
}

/**
 * @param {boolean} enabled - Nuovo valore
 */
export function setVibrationEnabled(enabled) {
  localStorage.setItem(VIBRATION_KEY, String(enabled));
}

/**
 * @returns {boolean} True se le notifiche devono essere silenziose (default: no)
 */
export function getSilentNotifications() {
  return localStorage.getItem(SILENT_KEY) === 'true';
}

/**
 * @param {boolean} silent - Nuovo valore
 */
export function setSilentNotifications(silent) {
  localStorage.setItem(SILENT_KEY, String(silent));
}

/**
 * @returns {boolean} True se l'utente ha scelto di attivare le notifiche push (default: no)
 */
export function getPushEnabled() {
  return localStorage.getItem(PUSH_ENABLED_KEY) === 'true';
}

/**
 * @param {boolean} enabled - Nuovo valore
 */
export function setPushEnabled(enabled) {
  localStorage.setItem(PUSH_ENABLED_KEY, String(enabled));
}

/**
 * @returns {boolean} True se esiste gia' una subscription push attiva su questo device
 */
export function getPushSubscribed() {
  return localStorage.getItem(PUSH_SUBSCRIBED_KEY) === 'true';
}

/**
 * @param {boolean} subscribed - Nuovo valore
 */
export function setPushSubscribed(subscribed) {
  localStorage.setItem(PUSH_SUBSCRIBED_KEY, String(subscribed));
}
