/**
 * @typedef {import('../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../types/agendaItem.js').Task} Task
 * @typedef {import('../types/agendaItem.js').Birthday} Birthday
 * @typedef {import('../types/status.js').TimeStatus} TimeStatus
 */

import { useCallback, useMemo } from 'react';
import { useAgendaStore } from './store/index.js';
import {
  createTask,
  createBirthday,
  addItem,
  updateItem,
  deleteItem,
  toggleComplete,
} from './items/actions.js';
import {
  getItems,
  getTasks,
  getBirthdays,
  getUpcomingItems,
  getOverdueItems,
  getHighPriorityItems,
  getMediumPriorityItems,
  getLowPriorityItems,
  getItemTimeStatus,
  getNextNotificationTime,
} from './items/selectors.js';
import {
  applyFilters,
  applySort,
  applyFiltersAndSort,
} from './items/filters.js';
import { getTimeStatus } from './time/status.js';

/**
 * Hook principale per la gestione dell'agenda
 * @returns {Object} Oggetto con dati, filtri e funzioni CRUD
 */
export function useAgenda() {
  // Ottieni lo store Zustand
  const items = useAgendaStore((state) => state.items);

  // Filtri e ordinamento vivono nello store: cambiarli provoca un re-render
  const filterCriteria = useAgendaStore((state) => state.filterCriteria);
  const sortCriteria = useAgendaStore((state) => state.sortCriteria);
  const setFilterCriteria = useAgendaStore((state) => state.setFilterCriteria);
  const setSortCriteria = useAgendaStore((state) => state.setSortCriteria);

  // Dati derivati (usando useMemo per ottimizzare)
  const tasks = useMemo(() => getTasks(items), [items]);
  const birthdays = useMemo(() => getBirthdays(items), [items]);
  const upcomingItems = useMemo(() => getUpcomingItems(items), [items]);
  const overdueItems = useMemo(() => getOverdueItems(items), [items]);
  const highPriorityItems = useMemo(() => getHighPriorityItems(items), [items]);
  const mediumPriorityItems = useMemo(() => getMediumPriorityItems(items), [items]);
  const lowPriorityItems = useMemo(() => getLowPriorityItems(items), [items]);

  // Item filtrati e ordinati
  const filteredItems = useMemo(() => {
    return applyFiltersAndSort(items, filterCriteria, sortCriteria);
  }, [items, filterCriteria, sortCriteria]);

  // Funzioni CRUD (usando useCallback per memorizzare i riferimenti)
  const addTask = useCallback((data) => {
    const task = createTask(data);
    addItem(task);
    return task;
  }, []);

  const addBirthday = useCallback((data) => {
    const birthday = createBirthday(data);
    addItem(birthday);
  }, []);

  const updateItemCallback = useCallback((id, updates) => {
    updateItem(id, updates);
  }, []);

  const deleteItemCallback = useCallback((id) => {
    deleteItem(id);
  }, []);

  const toggleCompleteCallback = useCallback((id) => {
    toggleComplete(id);
  }, []);

  // Funzioni utility
  const getTimeStatusCallback = useCallback((id) => {
    return getItemTimeStatus(id);
  }, [items]);

  const getNextNotificationCallback = useCallback((id) => {
    return getNextNotificationTime(id);
  }, [items]);

  return {
    // Dati grezzi
    items,

    // Dati derivati
    tasks,
    birthdays,
    upcomingItems,
    overdueItems,
    highPriorityItems,
    mediumPriorityItems,
    lowPriorityItems,

    // Filtri e ordinamento
    filterCriteria,
    sortCriteria,
    filteredItems,

    // Funzioni di aggiornamento
    setFilterCriteria,
    setSortCriteria,

    // Funzioni CRUD
    addTask,
    addBirthday,
    updateItem: updateItemCallback,
    deleteItem: deleteItemCallback,
    toggleComplete: toggleCompleteCallback,

    // Funzioni utility
    getTimeStatus: getTimeStatusCallback,
    getNextNotification: getNextNotificationCallback,
  };
}
