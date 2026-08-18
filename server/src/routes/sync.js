import { Router } from 'express';
import { replaceItems } from '../db.js';

export const syncRouter = Router();

syncRouter.post('/api/sync', async (req, res) => {
  const { items } = req.body ?? {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "'items' deve essere un array" });
  }

  try {
    await replaceItems(items);
    res.json({ ok: true, count: items.length });
  } catch (e) {
    console.error('Errore sincronizzazione item:', e);
    res.status(500).json({ error: 'Errore sincronizzazione item' });
  }
});
