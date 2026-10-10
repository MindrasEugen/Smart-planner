/**
 * Piattaforma di esecuzione: web (browser/PWA) o app nativa Capacitor.
 * Nell'app nativa la WebView non ha Notification API ne' Web Push: le
 * notifiche passano da @capacitor/local-notifications (vedi
 * logic/notifications/native.js) e Service Worker/installazione PWA vanno spenti.
 */

import { Capacitor } from '@capacitor/core';

/** True se l'app gira dentro il guscio nativo Capacitor (Android) */
export const isNativeApp = Capacitor.isNativePlatform();
