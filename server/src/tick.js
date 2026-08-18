/**
 * Controllo periodico (chiamato da /api/tick, invocato dal Render Cron Job):
 * per ogni item mirrorato, calcola se e' il momento di notificare e, se si',
 * invia una Web Push a tutte le subscription registrate.
 *
 * Riusa `calculateNextNotificationTime` da src/logic/notifications/scheduler.js
 * (stesso file del client, nessuna duplicazione della logica di ricorrenza:
 * quel modulo non ha dipendenze DOM, vedi scheduler.test.js).
 */

import webpush from 'web-push';
import { calculateNextNotificationTime } from '../../src/logic/notifications/scheduler.js';
import { getAllItems, getAllSubscriptions, wasNotified, markNotified, deleteSubscription } from './db.js';

// Deve coprire almeno l'intervallo del Cron Job (default 5 minuti): una
// finestra piu' stretta della frequenza del tick farebbe perdere occorrenze
// tra un tick e l'altro. shouldNotifyNow del client usa 1 minuto perche' li'
// il tick e' un setTimeout preciso, non un poll ogni N minuti.
const TICK_WINDOW_MS = Number(process.env.TICK_WINDOW_MINUTES ?? 5) * 60 * 1000;

/**
 * Calcola se un item e' dovuto ora, con una finestra invece del minuto fisso
 * di shouldNotifyNow (pensato per un tick client al secondo, non per un poll).
 * @param {Object} item - Item nel formato restituito da getAllItems
 * @returns {Date | null} Orario dell'occorrenza dovuta, o null
 */
export function isDueWithinWindow(item, windowMs = TICK_WINDOW_MS) {
  const nextTime = calculateNextNotificationTime(item);
  if (!nextTime) return null;
  const diffMs = nextTime.getTime() - Date.now();
  return diffMs <= windowMs && diffMs >= -windowMs ? nextTime : null;
}

/**
 * Stesso formato testi del client (formatItemNotification in integration.js),
 * ridotto ai soli campi che il backend riceve via /api/sync (niente importance:
 * non fa parte del payload sincronizzato)
 * @param {Object} item
 * @returns {{title: string, body: string}}
 */
function formatItemNotification(item) {
  const dueDateTime = new Date(`${item.dueDate.slice(0, 10)}T00:00:00`);
  return {
    title: item.title,
    body: `Scadenza: ${dueDateTime.toLocaleDateString('it-IT')} alle ${item.dueTime}`,
  };
}

/**
 * Esegue un tick completo: controlla tutti gli item, invia le push dovute.
 * @returns {Promise<{ sent: number }>} Numero di invii effettuati (per subscription)
 */
export async function runTick() {
  const [items, subscriptions] = await Promise.all([getAllItems(), getAllSubscriptions()]);

  let sent = 0;

  for (const item of items) {
    const nextTime = isDueWithinWindow(item);
    if (!nextTime) continue;

    const occurrenceKey = nextTime.getTime();
    if (await wasNotified(item.id, occurrenceKey)) continue;

    const { title, body } = formatItemNotification(item);

    for (const subscription of subscriptions) {
      const payload = JSON.stringify({
        title,
        body,
        tag: `item_${item.id}`,
        data: { itemId: item.id, url: '/' },
        vibrate: subscription.vibrate,
        silent: subscription.silent,
      });

      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: subscription.keys },
          payload
        );
        sent++;
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          // Endpoint scaduto/disiscritto lato browser: segnale standard Web Push
          await deleteSubscription(subscription.endpoint);
        } else {
          console.error('Errore invio push:', e.statusCode, e.body ?? e.message);
        }
      }
    }

    await markNotified(item.id, occurrenceKey);
  }

  return { sent };
}
