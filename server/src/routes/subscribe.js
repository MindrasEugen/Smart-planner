import { Router } from 'express';
import { upsertSubscription, deleteSubscription } from '../db.js';

export const subscribeRouter = Router();

subscribeRouter.post('/api/subscribe', async (req, res) => {
  const { subscription, prefs } = req.body ?? {};
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: 'Subscription non valida' });
  }

  try {
    await upsertSubscription(subscription, prefs ?? {});
    res.json({ ok: true });
  } catch (e) {
    console.error('Errore salvataggio subscription:', e);
    res.status(500).json({ error: 'Errore salvataggio subscription' });
  }
});

subscribeRouter.delete('/api/subscribe', async (req, res) => {
  const { endpoint } = req.body ?? {};
  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint mancante' });
  }

  try {
    await deleteSubscription(endpoint);
    res.json({ ok: true });
  } catch (e) {
    console.error('Errore eliminazione subscription:', e);
    res.status(500).json({ error: 'Errore eliminazione subscription' });
  }
});
