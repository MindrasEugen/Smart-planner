/**
 * Accesso al DB: Postgres di Supabase, tramite connessione diretta (non
 * PostgREST/anon key: qui il server usa la connection string con password,
 * quindi bypassa le Row Level Security policy per design, coerente con un
 * backend fidato che parla direttamente al proprio DB).
 */

import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  // Il pooler "transaction mode" di Supabase (porta 6543) non supporta i
  // prepared statement: va disattivato esplicitamente, altrimenti ogni query fallisce
  prepare: false,
});

/**
 * Crea le tabelle se non esistono. Va chiamata una volta all'avvio.
 * @returns {Promise<void>}
 */
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      endpoint TEXT PRIMARY KEY,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      vibrate BOOLEAN NOT NULL DEFAULT true,
      silent BOOLEAN NOT NULL DEFAULT false,
      created_at BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      due_time TEXT NOT NULL,
      status TEXT NOT NULL,
      notification_settings TEXT NOT NULL,
      updated_at TEXT
    )
  `;
  // Dedupe: un'occorrenza (item, orario calcolato) va inviata una volta sola,
  // anche se due tick si sovrappongono o il DB mirror non e' ancora cambiato
  await sql`
    CREATE TABLE IF NOT EXISTS sent_notifications (
      item_id TEXT NOT NULL,
      next_time BIGINT NOT NULL,
      sent_at BIGINT NOT NULL,
      PRIMARY KEY (item_id, next_time)
    )
  `;
}

/**
 * Upsert di una subscription push
 * @param {{endpoint: string, keys: {p256dh: string, auth: string}}} subscription
 * @param {{vibrate?: boolean, silent?: boolean}} prefs
 * @returns {Promise<void>}
 */
export async function upsertSubscription(subscription, prefs = {}) {
  await sql`
    INSERT INTO subscriptions (endpoint, p256dh, auth, vibrate, silent, created_at)
    VALUES (${subscription.endpoint}, ${subscription.keys.p256dh}, ${subscription.keys.auth},
            ${Boolean(prefs.vibrate)}, ${Boolean(prefs.silent)}, ${Date.now()})
    ON CONFLICT (endpoint) DO UPDATE SET
      p256dh = excluded.p256dh,
      auth = excluded.auth,
      vibrate = excluded.vibrate,
      silent = excluded.silent
  `;
}

/**
 * Rimuove una subscription per endpoint
 * @param {string} endpoint
 * @returns {Promise<void>}
 */
export async function deleteSubscription(endpoint) {
  await sql`DELETE FROM subscriptions WHERE endpoint = ${endpoint}`;
}

/**
 * @returns {Promise<Array<{endpoint: string, keys: {p256dh: string, auth: string}, vibrate: boolean, silent: boolean}>>}
 */
export async function getAllSubscriptions() {
  const rows = await sql`SELECT * FROM subscriptions`;
  return rows.map((row) => ({
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
    vibrate: row.vibrate,
    silent: row.silent,
  }));
}

/**
 * Sostituisce per intero il mirror degli item (stessa filosofia di
 * `rescheduleAll` lato client: cancella tutto e riscrive tutto)
 * @param {Array<Object>} items
 * @returns {Promise<void>}
 */
export async function replaceItems(items) {
  await sql.begin(async (tx) => {
    await tx`DELETE FROM items`;
    for (const item of items) {
      await tx`
        INSERT INTO items (id, title, due_date, due_time, status, notification_settings, updated_at)
        VALUES (${item.id}, ${item.title}, ${item.dueDate}, ${item.dueTime}, ${item.status},
                ${JSON.stringify(item.notificationSettings ?? {})}, ${item.updatedAt ?? null})
      `;
    }
  });
}

/**
 * @returns {Promise<Array<Object>>} Item nel formato atteso da scheduler.js
 */
export async function getAllItems() {
  const rows = await sql`SELECT * FROM items`;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    dueTime: row.due_time,
    status: row.status,
    notificationSettings: JSON.parse(row.notification_settings),
  }));
}

/**
 * @param {string} itemId
 * @param {number} nextTime - Timestamp (ms) restituito da calculateNextNotificationTime
 * @returns {Promise<boolean>} True se questa occorrenza e' gia' stata inviata
 */
export async function wasNotified(itemId, nextTime) {
  const rows = await sql`
    SELECT 1 FROM sent_notifications WHERE item_id = ${itemId} AND next_time = ${nextTime}
  `;
  return rows.length > 0;
}

/**
 * Registra un'occorrenza come gia' inviata, e ripulisce le voci piu' vecchie
 * di questo stesso item (non servono piu' una volta passata l'occorrenza successiva)
 * @param {string} itemId
 * @param {number} nextTime
 * @returns {Promise<void>}
 */
export async function markNotified(itemId, nextTime) {
  await sql`
    INSERT INTO sent_notifications (item_id, next_time, sent_at)
    VALUES (${itemId}, ${nextTime}, ${Date.now()})
    ON CONFLICT (item_id, next_time) DO NOTHING
  `;
  await sql`DELETE FROM sent_notifications WHERE item_id = ${itemId} AND next_time < ${nextTime}`;
}
