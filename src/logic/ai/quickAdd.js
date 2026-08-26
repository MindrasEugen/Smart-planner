/**
 * Quick Add AI: estrae titolo/descrizione/data/ora/importanza da testo libero
 * via endpoint backend POST /api/quick-add, usando lo stesso backend del sync.
 */

import { getDeviceId } from './deviceId.js';

const API_URL = import.meta.env.VITE_SYNC_API_URL;
const SYNC_SECRET = import.meta.env.VITE_SYNC_SECRET;

/**
 * @returns {boolean} True se il quick add AI è configurato in questo build
 */
export function isQuickAddConfigured() {
  return Boolean(API_URL && SYNC_SECRET);
}

/**
 * Esegue una fetch autenticata verso il backend
 * @param {string} path - Percorso relativo (es. '/api/quick-add')
 * @param {Object} options - Opzioni fetch
 * @returns {Promise<Response>} Risposta fetch
 */
function authedFetch(path, options) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SYNC_SECRET}`,
      ...options?.headers,
    },
  });
}

/**
 * Chiama l'endpoint backend per estrarre dati strutturati da testo libero
 * @param {string} text - Testo libero (max 500 caratteri)
 * @returns {Promise<Object>} Oggetto con forma:
 *   - successo: { draft: { title, description, dueDate, dueTime, importance }, readyToAutoSave: boolean, error: null, remaining: number }
 *   - errore: { draft: null, readyToAutoSave: false, error: '<messaggio leggibile>', remaining: number|null }
 *   - non configurato: { draft: null, readyToAutoSave: false, error: 'Quick add AI non configurata', remaining: null }
 */
export async function requestQuickAdd(text) {
  if (!isQuickAddConfigured()) {
    return {
      draft: null,
      readyToAutoSave: false,
      error: 'Quick add AI non configurata',
      remaining: null,
    };
  }

  try {
    const response = await authedFetch('/api/quick-add', {
      method: 'POST',
      body: JSON.stringify({
        deviceId: getDeviceId(),
        text,
      }),
    });

    const json = await response.json();

    if (response.ok) {
      return {
        draft: json.draft || null,
        readyToAutoSave: Boolean(json.readyToAutoSave),
        error: null,
        remaining: json.remaining ?? null,
      };
    }

    // Errore HTTP (4xx/5xx)
    return {
      draft: null,
      readyToAutoSave: false,
      error: json.error || 'Errore sconosciuto dal server',
      remaining: json.remaining ?? null,
    };
  } catch (err) {
    // Errore di rete vero
    return {
      draft: null,
      readyToAutoSave: false,
      error: `Errore di rete: ${err.message}`,
      remaining: null,
    };
  }
}
