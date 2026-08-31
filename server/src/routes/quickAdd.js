import { Router } from 'express';
import { isAiConfigured, extractTaskFromText } from '../ai.js';
import { getQuickAddUsageToday, incrementQuickAddUsage } from '../db.js';

export const quickAddRouter = Router();

const MAX_TEXT_LENGTH = 500;
const DAILY_LIMIT = Number(process.env.QUICK_ADD_DAILY_LIMIT ?? 5);

/**
 * Data e ora correnti nel fuso Europe/Rome, calcolate da un solo Date per
 * evitare disallineamenti tra i due valori. Servono entrambe nel prompt: senza
 * l'ora, espressioni relative all'istante attuale ("tra 10 minuti", "adesso")
 * sono impossibili da risolvere per il modello, che non ha altro modo di
 * sapere che ore sono ora (era la causa dell'orario sempre sbagliato su
 * queste richieste).
 * @returns {{ date: string, time: string }} Data YYYY-MM-DD e ora HH:mm
 */
function nowInRome() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
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

    const { date: todayISO, time: nowTime } = nowInRome();
    const { dateSpecified, timeSpecified, ...draft } = await extractTaskFromText(
      text.trim(),
      todayISO,
      nowTime
    );
    const newTotal = await incrementQuickAddUsage(deviceId);

    res.json({
      ok: true,
      draft,
      readyToAutoSave: dateSpecified && timeSpecified,
      remaining: Math.max(0, DAILY_LIMIT - newTotal),
    });
  } catch (e) {
    console.error('Errore quick add AI:', e.message);
    res.status(502).json({ error: "Errore nell'elaborazione AI, riprova" });
  }
});
