/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import {
  isNotificationSupported,
  canNotify,
  getNotificationPermission,
  requestNotificationPermission,
  showBrowserNotification,
  getServiceWorkerRegistration,
  unregisterSW,
} from './browser.js';

import { showToast, getToasts, clearToasts } from './toast.js';
import {
  setupAutoNotifications,
  cancelAllScheduledNotifications,
  cancelItemNotification,
  flushExpiredNotifications,
  checkAndNotifyNow,
  formatItemNotification,
} from './integration.js';

// Esporta tutto per l'uso nei componenti
export {
  // Browser notifications
  isNotificationSupported,
  canNotify,
  getNotificationPermission,
  requestNotificationPermission,
  showBrowserNotification,
  getServiceWorkerRegistration,
  unregisterSW,
  // Scheduler
  setupAutoNotifications,
  cancelAllScheduledNotifications as cancelAllNotifications,
  cancelItemNotification,
  flushExpiredNotifications,
  checkAndNotifyNow,
  // Toast notifications
  showToast,
  getToasts,
  clearToasts,
};

/**
 * Funzione unificata per mostrare notifica per un item
 * @param {AgendaItem} item - Item agenda
 * @returns {Promise<boolean>} True se mostrata come notifica di sistema
 */
export function notifyForItem(item) {
  const { title, body } = formatItemNotification(item);
  return showBrowserNotification(title, {
    body,
    tag: `item_${item.id}`,
    data: { itemId: item.id, url: '/' },
  });
}
