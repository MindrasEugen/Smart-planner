/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

const STORAGE_KEY = 'agenda_intelligente_v1';

/**
 * Serializza un array di AgendaItem per localStorage
 * @param {AgendaItem[]} items - Array di elementi agenda
 * @returns {string} Stringa JSON serializzata
 */
function serializeItems(items) {
  return JSON.stringify(items.map(item => ({
    ...item,
    dueDate: item.dueDate.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  })));
}

/**
 * Deserializza gli item da localStorage
 * @param {string} serialized - Stringa JSON serializzata
 * @returns {AgendaItem[]} Array di elementi agenda
 */
function deserializeItems(serialized) {
  const parsed = JSON.parse(serialized);
  return parsed.map(item => ({
    ...item,
    dueDate: new Date(item.dueDate),
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

/**
 * Salva lo stato in localStorage
 * @param {{ items: AgendaItem[] }} state - Stato da salvare
 */
export function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeItems(state.items));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Carica lo stato da localStorage
 * @returns {{ items: AgendaItem[] } | null} Stato caricato o null
 */
export function loadFromStorage() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      return { items: deserializeItems(serialized) };
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

/**
 * Configura la persistenza automatica per lo store
 * Sottoscrive solo `items`: i cambi di filtro/ordinamento non sono persistiti
 * e non devono provocare scritture su localStorage.
 * @param {Object} store - Lo store Zustand (richiede il middleware subscribeWithSelector)
 * @returns {Function} Funzione di cleanup
 */
export function setupStorePersistence(store) {
  const unsubscribe = store.subscribe(
    (state) => state.items,
    (items) => {
      saveToStorage({ items });
    }
  );
  return unsubscribe;
}
