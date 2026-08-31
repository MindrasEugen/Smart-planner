/**
 * Estrazione AI per la Quick Add: dato un testo libero, chiede a Gemini di
 * restituire i campi di un Task (titolo/descrizione/data/ora/importanza) in
 * un JSON tipizzato via responseSchema, cosi' non serve fare parsing fragile
 * di testo libero in risposta.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    description: { type: 'STRING' },
    dueDate: { type: 'STRING', description: 'Data nel formato YYYY-MM-DD' },
    dueTime: { type: 'STRING', description: 'Ora nel formato HH:mm (24 ore)' },
    importance: { type: 'STRING', enum: ['LOW', 'MEDIUM', 'HIGH'] },
    dateSpecified: {
      type: 'BOOLEAN',
      description:
        'True solo se il testo conteneva un riferimento esplicito alla data (anche vago/relativo, es. "domani", "venerdì"). False se dueDate è stata dedotta/inventata perché il testo non diceva nulla in merito.',
    },
    timeSpecified: {
      type: 'BOOLEAN',
      description:
        'True solo se il testo conteneva un riferimento esplicito all\'orario (anche vago, es. "nel pomeriggio", "verso sera"). False se dueTime è stata dedotta/inventata perché il testo non diceva nulla in merito.',
    },
  },
  required: ['title', 'dueDate', 'dueTime', 'importance', 'dateSpecified', 'timeSpecified'],
};

const DUE_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DUE_TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * @returns {boolean} True se GEMINI_API_KEY e' configurata su questo server
 */
export function isAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * @param {string} text - Testo libero scritto dall'utente
 * @param {string} todayISO - Data odierna (YYYY-MM-DD, fuso Europe/Rome)
 * @param {string} nowTime - Ora corrente (HH:mm, fuso Europe/Rome)
 * @returns {string} Prompt completo per Gemini
 */
function buildPrompt(text, todayISO, nowTime) {
  return `Oggi è ${todayISO} e sono le ${nowTime} (fuso orario Europe/Rome).
Estrai da questa frase libera scritta da un utente i dettagli di un task da aggiungere alla sua agenda personale:

"${text}"

Regole:
- Se manca un'informazione, deducila in modo ragionevole: nessun orario indicato → "09:00"; nessuna data indicata → oggi (${todayISO}); nessuna importanza indicata → "MEDIUM".
- Espressioni relative come "domani", "dopodomani", "lunedì prossimo" vanno risolte rispetto alla data di oggi indicata sopra, non rispetto a nessun'altra data.
- Espressioni relative all'istante presente ("tra 10 minuti", "tra un'ora", "adesso", "tra mezz'ora") vanno risolte sommando l'intervallo all'ora corrente indicata sopra (${nowTime}), non a "09:00" o a un altro orario di default. Se la somma supera la mezzanotte, usa il resto sull'orario e passa a dueDate il giorno successivo a quello odierno.
- Il titolo deve essere breve e chiaro (max 60 caratteri). La descrizione può restare una stringa vuota se il testo non aggiunge dettagli utili oltre al titolo.
- dateSpecified e timeSpecified vanno valutati con attenzione: sono true SOLO se il testo conteneva davvero un riferimento, anche vago o parziale ("venerdì", "nel pomeriggio", "tra un'ora"). Se hai dovuto inventare dueDate/dueTime perché il testo non ne parlava affatto, il rispettivo flag va false.
- Rispondi solo con i campi richiesti, nessun testo aggiuntivo.`;
}

/**
 * @param {Object} draft - Oggetto restituito da Gemini
 * @returns {boolean} True se ha la forma attesa
 */
function isValidDraft(draft) {
  return (
    draft &&
    typeof draft.title === 'string' &&
    draft.title.trim().length > 0 &&
    typeof draft.description === 'string' &&
    DUE_DATE_RE.test(draft.dueDate) &&
    DUE_TIME_RE.test(draft.dueTime) &&
    ['LOW', 'MEDIUM', 'HIGH'].includes(draft.importance) &&
    typeof draft.dateSpecified === 'boolean' &&
    typeof draft.timeSpecified === 'boolean'
  );
}

/**
 * Chiede a Gemini di estrarre i campi di un Task da un testo libero.
 * @param {string} text - Testo libero (già validato/troncato dal chiamante)
 * @param {string} todayISO - Data odierna (YYYY-MM-DD, fuso Europe/Rome)
 * @param {string} nowTime - Ora corrente (HH:mm, fuso Europe/Rome)
 * @returns {Promise<{title: string, description: string, dueDate: string, dueTime: string, importance: 'LOW'|'MEDIUM'|'HIGH', dateSpecified: boolean, timeSpecified: boolean}>}
 * @throws {Error} Se la chiave non è configurata, la chiamata fallisce, o la risposta non ha la forma attesa
 */
export async function extractTaskFromText(text, todayISO, nowTime) {
  if (!isAiConfigured()) {
    throw new Error('GEMINI_API_KEY non configurata sul server');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(text, todayISO, nowTime) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Gemini ha risposto ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = await response.json();
  const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Risposta Gemini senza contenuto utilizzabile');
  }

  let draft;
  try {
    draft = JSON.parse(rawText);
  } catch {
    throw new Error('Risposta Gemini non è JSON valido');
  }

  if (!isValidDraft(draft)) {
    throw new Error('Risposta Gemini con campi mancanti o nel formato sbagliato');
  }

  return {
    title: draft.title.trim().slice(0, 60),
    description: draft.description.trim(),
    dueDate: draft.dueDate,
    dueTime: draft.dueTime,
    importance: draft.importance,
    dateSpecified: draft.dateSpecified,
    timeSpecified: draft.timeSpecified,
  };
}
