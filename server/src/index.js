import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import webpush from 'web-push';
import { initDB } from './db.js';
import { requireSyncSecret } from './auth.js';
import { subscribeRouter } from './routes/subscribe.js';
import { syncRouter } from './routes/sync.js';
import { tickRouter } from './routes/tick.js';

// Vedi PLAN.md/BUG-01: parseDateTime() in src/logic/time/timezone.js usa
// Date.setHours(), che dipende dal fuso orario LOCALE del processo. Sui
// container Render il default e' UTC: senza TZ fissato ogni orario di
// notifica calcolato qui sarebbe sbagliato di qualche ora, senza errori
// visibili. Controllo esplicito prima di avviare qualunque cosa.
const EXPECTED_TZ = 'Europe/Rome';
const actualTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (actualTZ !== EXPECTED_TZ) {
  console.error(
    `Fuso orario del processo (${actualTZ}) diverso da quello atteso (${EXPECTED_TZ}). ` +
      `Imposta la variabile d'ambiente TZ=${EXPECTED_TZ} prima di avviare il server: ` +
      'senza questo, ogni orario di notifica calcolato sara\' sbagliato.'
  );
  process.exit(1);
}

for (const key of ['SYNC_SECRET', 'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT', 'DATABASE_URL']) {
  if (!process.env[key]) {
    console.error(`Variabile d'ambiente mancante: ${key} (vedi server/.env.example)`);
    process.exit(1);
  }
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

await initDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173').split(','),
  })
);

// Root: risposta semplice per l'health check di Render (default su "/")
app.get('/', (req, res) => res.status(200).send('ok'));

app.use(requireSyncSecret, subscribeRouter);
app.use(requireSyncSecret, syncRouter);
app.use(requireSyncSecret, tickRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Push server in ascolto sulla porta ${port} (TZ=${actualTZ})`));
