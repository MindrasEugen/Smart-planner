import { Router } from 'express';
import { runTick } from '../tick.js';

export const tickRouter = Router();

tickRouter.get('/api/tick', async (req, res) => {
  try {
    const result = await runTick();
    res.json({ ok: true, ...result });
  } catch (e) {
    console.error('Errore durante il tick:', e);
    res.status(500).json({ error: 'Errore durante il tick' });
  }
});
