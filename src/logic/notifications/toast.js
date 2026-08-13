// Canale toast tra il layer logic (senza React) e il ToastProvider React.
//
// Il layer logic emette qui; ToastProvider si sottoscrive e rende i messaggi.
// Senza questo ponte le chiamate a showToast() finivano in un array che
// nessun componente leggeva (il fallback delle notifiche era invisibile).

/**
 * @typedef {'info' | 'warning' | 'error' | 'success'} ToastType
 */

/**
 * @typedef {Object} ToastMessage
 * @property {string} id - Identificatore univoco
 * @property {string} message - Messaggio
 * @property {ToastType} type - Tipo di toast
 */

/** @type {Set<Function>} */
const listeners = new Set();

// Toast emessi prima che un listener fosse pronto (es. all'avvio dell'app)
let pending = [];
let toastId = 0;

/**
 * Mostra un toast
 * @param {string} message - Messaggio da mostrare
 * @param {ToastType} [type='info'] - Tipo di toast
 */
export function showToast(message, type = 'info') {
  /** @type {ToastMessage} */
  const toast = { id: `toast_${toastId++}`, message, type };

  if (listeners.size === 0) {
    pending.push(toast);
    return;
  }

  listeners.forEach((listener) => listener(toast));
}

/**
 * Sottoscrive un listener ai toast emessi dal layer logic.
 * Alla sottoscrizione riceve subito i toast accumulati in precedenza.
 * @param {(toast: ToastMessage) => void} listener - Callback per ogni toast
 * @returns {Function} Funzione di annullamento della sottoscrizione
 */
export function subscribeToToasts(listener) {
  listeners.add(listener);

  if (pending.length > 0) {
    const buffered = pending;
    pending = [];
    buffered.forEach((toast) => listener(toast));
  }

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Ottieni i toast non ancora consegnati a un listener
 * @returns {ToastMessage[]} Array di toast in attesa
 */
export function getToasts() {
  return [...pending];
}

/**
 * Svuota i toast in attesa
 */
export function clearToasts() {
  pending = [];
}
