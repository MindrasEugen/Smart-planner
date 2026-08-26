import { Router } from 'express';
import { isAiConfigured, extractTaskFromText } from '../ai.js';
import { getQuickAddUsageToday, incrementQuickAddUsage } from '../db.js';

export const quickAddRouter = Router();

const MAX_TEXT_LENGTH = 500;
const DAILY_LIMIT = Number(process.env.QUICK_ADD_DAILY_LIMIT ?? 5);

/**
 * Data odierna nel fuso Europe/Rome (stesso criterio di db.js/todayInRome,
 * serve qui solo per passarla nel prompt).
 * @returns {string} Data in formato YYYY-MM-DD
 */
function todayInRome() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' });
}

quickAddRouter.post('/api/quick-add', async (req, res) => {
  const { deviceId, text } = req.body ?? {};

  if (typeof deviceId !== 'string' || !deviceId.trim()) {
    return res.status(400).json({ error: 'deviceId mancante' });
  }
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text mancante' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Testo troppo lungo (max ${MAX_TEXT_LENGTH} caratteri)` });
  }

  if (!isAiConfigured()) {
    return res.status(500).json({ error: 'AI non configurata sul server' });
  }

  try {
    const usedToday = await getQuickAddUsageToday(deviceId);
    if (usedToday >= DAILY_LIMIT) {
      return res.status(429).json({
        error: `Limite giornaliero di quick add raggiunto (${DAILY_LIMIT}/giorno). Riprova domani.`,
        remaining: 0,
      });
    }

    const draft = await extractTaskFromText(text.trim(), todayInRome());
    const newTotal = await incrementQuickAddUsage(deviceId);

    res.json({ ok: true, draft, remaining: Math.max(0, DAILY_LIMIT - newTotal) });
  } catch (e) {
    console.error('Errore quick add AI:', e.message);
    res.status(502).json({ error: "Errore nell'elaborazione AI, riprova" });
  }
});
