/**
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../items/filters.js').FilterCriteria} FilterCriteria
 * @typedef {import('../items/filters.js').SortCriteria} SortCriteria
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { loadFromStorage } from './persistence.js';

/**
 * Criteri di ordinamento predefiniti
 * @type {SortCriteria}
 */
const DEFAULT_SORT_CRITERIA = { field: 'dueDate', ascending: true };

/**
 * Interfaccia dello store Zustand
 * @typedef {Object} AgendaStore
 * @property {AgendaItem[]} items - Array di elementi agenda
 * @property {FilterCriteria} filterCriteria - Criteri di filtro attivi
 * @property {SortCriteria} sortCriteria - Criteri di ordinamento attivi
 * @property {'daily' | 'weekly' | 'upcoming'} viewMode - Vista attiva in Agenda
 * @property {Function} addItem - Aggiunge un elemento
 * @property {Function} updateItem - Aggiorna un elemento
 * @property {Function} deleteItem - Elimina un elemento
 * @property {Function} toggleComplete - Toggle stato completamento
 * @property {Function} setFilterCriteria - Imposta i criteri di filtro
 * @property {Function} setSortCriteria - Imposta i criteri di ordinamento
 * @property {Function} resetStore - Reimposta lo store
 */

// Store con subscribeWithSelector: necessario per subscribe(selector, listener),
// usato da integration.js (notifiche) e persistence.js per reagire ai soli items.
export const agendaStore = create(subscribeWithSelector((set, get) => ({
  // Carica dati iniziali da localStorage
  items: loadFromStorage()?.items ?? [],

  // Filtri e ordinamento: stato reattivo, non variabili di modulo
  filterCriteria: {},
  sortCriteria: DEFAULT_SORT_CRITERIA,
  // Vista Agenda: nello store (non locale al componente) cosi' la Dashboard
  // puo' impostarla prima di navigare (es. click su una categoria priorita'
  // porta dritto sulla vista "Prossime", invece di ripartire sempre da
  // "Giornaliera" indipendentemente da dove si arriva)
  viewMode: 'daily',

    /**
     * Aggiunge un elemento all'agenda
     * @param {AgendaItem} item - Elemento da aggiungere
     */
    addItem: (item) => {
      set((state) => ({
        items: [...state.items, item],
      }));
    },

    /**
     * Aggiorna un elemento dell'agenda
     * @param {string} id - ID dell'elemento
     * @param {Object} updates - Aggiornamenti parziali
     * @param {string} [updates.id]
     * @param {string} [updates.title]
     * @param {string} [updates.description]
     * @param {Date} [updates.dueDate]
     * @param {string} [updates.dueTime]
     * @param {import('../../types/status.js').Importance} [updates.importance]
     * @param {import('../../types/status.js').Status} [updates.status]
     * @param {import('../../types/notifications.js').NotificationSettings} [updates.notificationSettings]
     * @param {Date} [updates.createdAt]
     * @param {Date} [updates.updatedAt]
     */
    updateItem: (id, updates) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
        ),
      }));
    },

    /**
     * Elimina un elemento dall'agenda
     * @param {string} id - ID dell'elemento
     */
    deleteItem: (id) => {
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    },

    /**
     * Toggle stato di completamento
     * @param {string} id - ID dell'elemento
     */
    toggleComplete: (id) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: item.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
                updatedAt: new Date(),
              }
            : item
        ),
      }));
    },

    /**
     * Imposta i criteri di filtro
     * @param {FilterCriteria} criteria - Criteri di filtro
     */
    setFilterCriteria: (criteria) => {
      set({ filterCriteria: criteria ?? {} });
    },

    /**
     * Imposta i criteri di ordinamento
     * @param {SortCriteria} criteria - Criteri di ordinamento
     */
    setSortCriteria: (criteria) => {
      set({ sortCriteria: criteria ?? DEFAULT_SORT_CRITERIA });
    },

    /**
     * Imposta la vista attiva in Agenda
     * @param {'daily' | 'weekly' | 'upcoming'} mode - Vista da attivare
     */
    setViewMode: (mode) => {
      set({ viewMode: mode ?? 'daily' });
    },

    /**
     * Reimposta lo store
     */
    resetStore: () => {
      set({
        items: [],
        filterCriteria: {},
        sortCriteria: DEFAULT_SORT_CRITERIA,
        viewMode: 'daily',
      });
    },
  }))
);

// Hook React per uso nei componenti
export const useAgendaStore = agendaStore;
