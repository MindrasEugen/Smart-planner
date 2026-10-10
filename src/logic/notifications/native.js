/**
 * Notifiche dell'app nativa Android tramite @capacitor/local-notifications.
 *
 * A differenza del web (un timeout/Service Worker che ripianifica dopo ogni
 * notifica), qui le notifiche scattano ad app chiusa: tutte le ripetizioni
 * vanno quindi pianificate in anticipo, entro un orizzonte limitato. Ogni
 * apertura dell'app (e ogni modifica degli item) ripianifica da zero ed
 * estende l'orizzonte.
 *
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { calculateUpcomingNotificationTimes } from './scheduler.js';
import { addHistoryEntry } from './db.js';
import { getVibrationEnabled, getSilentNotifications } from '../preferences.js';

// Orizzonte di pianificazione: oltre, ci pensa la prossima apertura dell'app
const HORIZON_DAYS = 14;
// Tetti sugli allarmi: Android (Samsung in particolare) rifiuta oltre ~500
// allarmi per app. Il tetto per item evita che un solo promemoria "ogni
// minuto dopo la scadenza" consumi tutto il budget degli altri.
const MAX_PER_ITEM = 60;
const MAX_TOTAL = 400;

// Ultima pianificazione, per registrare nello storico (pagina Avvisi) le
// notifiche scattate mentre l'app era chiusa: nessun evento JS le osserva.
const LAST_SCHEDULE_KEY = 'agenda_native_last_schedule';

// I canali Android sono immutabili dopo la creazione: uno per combinazione
// di preferenze, scelto a ogni pianificazione.
const CHANNELS = {
  default: {
    id: 'promemoria',
    name: 'Promemoria',
    description: 'Avvisi delle scadenze',
    importance: 4,
    vibration: true,
  },
  noVibration: {
    id: 'promemoria-senza-vibrazione',
    name: 'Promemoria senza vibrazione',
    description: 'Avvisi delle scadenze, senza vibrazione',
    importance: 4,
    vibration: false,
  },
  silent: {
    id: 'promemoria-silenziosi',
    name: 'Promemoria silenziosi',
    description: 'Avvisi delle scadenze, senza suono ne\' vibrazione',
    importance: 2,
    vibration: false,
  },
};

let channelsReady = null;

/**
 * Crea i canali di notifica (idempotente, una volta per avvio)
 * @returns {Promise<void>}
 */
function ensureChannels() {
  if (!channelsReady) {
    channelsReady = Promise.all(
      Object.values(CHANNELS).map((channel) => LocalNotifications.createChannel(channel))
    ).catch((e) => {
      channelsReady = null;
      throw e;
    });
  }
  return channelsReady;
}

/**
 * @returns {string} ID del canale coerente con le preferenze attuali
 */
function pickChannelId() {
  if (getSilentNotifications()) return CHANNELS.silent.id;
  return getVibrationEnabled() ? CHANNELS.default.id : CHANNELS.noVibration.id;
}

/**
 * Stato del permesso notifiche, nello stesso formato della Notification API web
 * @returns {Promise<'granted' | 'denied' | 'default'>}
 */
export async function getNativeNotificationPermission() {
  const { display } = await LocalNotifications.checkPermissions();
  if (display === 'granted' || display === 'denied') return display;
  return 'default';
}

/**
 * Chiede il permesso notifiche (Android 13+; prima e' concesso di default)
 * @returns {Promise<'granted' | 'denied' | 'default'>}
 */
export async function requestNativeNotificationPermission() {
  await LocalNotifications.requestPermissions();
  return getNativeNotificationPermission();
}

/**
 * Permesso "Sveglie e promemoria" (allarmi esatti, Android 12+). Senza, le
 * notifiche possono arrivare con qualche minuto di ritardo.
 * @returns {Promise<boolean>} True se gli allarmi esatti sono consentiti
 */
export async function hasExactAlarmPermission() {
  const { exact_alarm: state } = await LocalNotifications.checkExactNotificationSetting();
  return state === 'granted';
}

/**
 * Apre la schermata di sistema per consentire gli allarmi esatti
 * @returns {Promise<boolean>} True se consentiti al ritorno
 */
export async function openExactAlarmSettings() {
  const { exact_alarm: state } = await LocalNotifications.changeExactNotificationSetting();
  return state === 'granted';
}

/**
 * Registra nello storico le notifiche della pianificazione precedente il cui
 * orario e' ormai passato (quindi gia' mostrate dal sistema)
 * @returns {Promise<void>}
 */
async function recordFiredNotifications() {
  let previous = [];
  try {
    previous = JSON.parse(localStorage.getItem(LAST_SCHEDULE_KEY) || '[]');
  } catch {
    previous = [];
  }

  // Senza permesso il sistema non le ha mostrate: niente storico
  if ((await getNativeNotificationPermission()) !== 'granted') return;

  const now = Date.now();
  for (const entry of previous) {
    if (entry.at > now) continue;
    await addHistoryEntry({
      // ID stabile per (item, orario): una registrazione ripetuta sovrascrive
      id: `hist_${entry.itemId}_${entry.at}`,
      itemId: entry.itemId,
      title: entry.title,
      body: entry.body,
      shownAt: entry.at,
    }).catch((e) => console.error('Errore salvataggio storico notifica:', e));
  }
}

/**
 * Cancella tutte le notifiche native ancora in attesa
 * @returns {Promise<void>}
 */
export async function cancelAllNativeNotifications() {
  const { notifications } = await LocalNotifications.getPending();
  if (notifications.length > 0) {
    await LocalNotifications.cancel({
      notifications: notifications.map(({ id }) => ({ id })),
    });
  }
}

/**
 * Ripianifica da zero le notifiche native di tutti gli item
 * @param {AgendaItem[]} items - Item agenda
 * @param {(item: AgendaItem) => { title: string, body: string }} format - Testi della notifica
 * @returns {Promise<void>}
 */
export async function rescheduleNativeNotifications(items, format) {
  await ensureChannels();
  await recordFiredNotifications();
  await cancelAllNativeNotifications();

  const now = new Date();
  const until = new Date(now.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000);

  const planned = [];
  for (const item of items) {
    const times = calculateUpcomingNotificationTimes(item, { limit: MAX_PER_ITEM, until, now });
    if (times.length === 0) continue;
    const { title, body } = format(item);
    for (const time of times) {
      planned.push({ itemId: item.id, title, body, at: time.getTime() });
    }
  }

  // Oltre il tetto si tengono le piu' vicine: le altre arriveranno con la
  // ripianificazione alla prossima apertura dell'app
  planned.sort((a, b) => a.at - b.at);
  const selected = planned.slice(0, MAX_TOTAL).map((entry, index) => ({ ...entry, id: index + 1 }));

  // Senza permesso "Sveglie e promemoria" si pianifica inesatto: con
  // isExactNotification (default true) il plugin aprirebbe le impostazioni
  // di sistema a ogni ripianificazione
  const exact = await hasExactAlarmPermission();
  const channelId = pickChannelId();

  if (selected.length > 0) {
    await LocalNotifications.schedule({
      notifications: selected.map((entry) => ({
        id: entry.id,
        title: entry.title,
        body: entry.body,
        channelId,
        smallIcon: 'ic_stat_notify',
        iconColor: '#002045',
        group: `item_${entry.itemId}`,
        extra: { itemId: entry.itemId },
        schedule: { at: new Date(entry.at), allowWhileIdle: true },
        isExactNotification: exact,
      })),
    });
  }

  try {
    localStorage.setItem(LAST_SCHEDULE_KEY, JSON.stringify(selected));
  } catch (e) {
    console.error('Errore salvataggio pianificazione notifiche:', e);
  }
}
