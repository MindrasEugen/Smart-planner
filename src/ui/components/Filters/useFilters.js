/**
 * @typedef {import('../../../logic/items/filters.js').FilterCriteria} FilterCriteria
 * @typedef {import('../../../logic/items/filters.js').SortCriteria} SortCriteria
 * @typedef {import('../../../types/status.js').ItemType} ItemType
 * @typedef {import('../../../types/status.js').Status} Status
 * @typedef {import('../../../types/status.js').Importance} Importance
 */

import { useMemo, useCallback } from 'react';
import { useAgenda } from '../../../logic/hooks.js';

/**
 * @typedef {Object} FilterOption
 * @property {string} value - Valore del filtro
 * @property {string} label - Etichetta da mostrare
 */

export const typeOptions = [
  { value: '', label: 'Tutti' },
  { value: 'TASK', label: 'Task' },
  { value: 'BIRTHDAY', label: 'Compleanni' },
];

export const statusOptions = [
  { value: '', label: 'Tutti' },
  { value: 'PENDING', label: 'In sospeso' },
  { value: 'COMPLETED', label: 'Completati' },
  { value: 'OVERDUE', label: 'Scaduti' },
];

export const importanceOptions = [
  { value: '', label: 'Tutti' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Bassa' },
];

export const dateOptions = [
  { value: '', label: 'Tutti' },
  { value: 'TODAY', label: 'Oggi' },
  { value: 'TOMORROW', label: 'Domani' },
  { value: 'NEXT_WEEK', label: 'Prossima settimana' },
  { value: 'OVERDUE', label: 'Scaduti' },
];

export const sortOptions = [
  { value: 'dueDate_asc', label: 'Scadenza (più vicina)' },
  { value: 'dueDate_desc', label: 'Scadenza (più lontana)' },
  { value: 'importance_desc', label: 'Importanza (alta)' },
  { value: 'status_asc', label: 'Stato' },
];

/**
 * Parsa un valore di ordinamento in SortCriteria
 * @param {string} value - Valore da parsare (es: "dueDate_asc")
 * @returns {SortCriteria} Criteri di ordinamento
 */
export function parseSortValue(value) {
  const [field, order] = value.split('_');
  return {
    field: field,
    ascending: order === 'asc',
  };
}

/**
 * Formatta SortCriteria in stringa
 * @param {SortCriteria} sort - Criteri di ordinamento
 * @returns {string} Stringa formattata (es: "dueDate_asc")
 */
export function formatSortValue(sort) {
  return `${sort.field}_${sort.ascending ? 'asc' : 'desc'}`;
}

/**
 * Hook per gestire filtri e ordinamento
 * @returns {Object} Funzioni e opzioni per i filtri
 */
export function useFilters() {
  const {
    filterCriteria,
    sortCriteria,
    setFilterCriteria,
    setSortCriteria,
  } = useAgenda();

  const activeFilters = useMemo(() => {
    const filters = [];

    if (filterCriteria.type) {
      const opt = typeOptions.find(o => o.value === filterCriteria.type);
      filters.push({ key: 'type', label: 'Tipo', value: opt?.label || filterCriteria.type });
    }
    if (filterCriteria.overdueOnly) {
      filters.push({ key: 'status', label: 'Stato', value: 'Scaduti' });
    } else if (filterCriteria.status) {
      const opt = statusOptions.find(o => o.value === filterCriteria.status);
      filters.push({ key: 'status', label: 'Stato', value: opt?.label || filterCriteria.status });
    }
    if (filterCriteria.importance) {
      const opt = importanceOptions.find(o => o.value === filterCriteria.importance);
      filters.push({ key: 'importance', label: 'Importanza', value: opt?.label || filterCriteria.importance });
    }
    if (filterCriteria.dateFilter) {
      const opt = dateOptions.find(o => o.value === filterCriteria.dateFilter);
      filters.push({ key: 'dateFilter', label: 'Data', value: opt?.label || filterCriteria.dateFilter });
    }

    return filters;
  }, [filterCriteria]);

  const clearAllFilters = useCallback(() => {
    setFilterCriteria({});
  }, [setFilterCriteria]);

  const clearFilter = useCallback((key) => {
    const newCriteria = { ...filterCriteria };
    delete newCriteria[key];
    // 'status' copre anche 'Scaduti', rappresentato internamente da overdueOnly
    if (key === 'status') delete newCriteria.overdueOnly;
    setFilterCriteria(newCriteria);
  }, [filterCriteria, setFilterCriteria]);

  const setTypeFilter = useCallback((value) => {
    setFilterCriteria({ ...filterCriteria, type: value || undefined });
  }, [filterCriteria, setFilterCriteria]);

  // "Scaduti" non è un valore reale di item.status (solo PENDING/COMPLETED
  // esistono nel modello dati): è un concetto temporale calcolato, quindi va
  // rappresentato con overdueOnly (già gestito da applyFilters) invece che
  // finire dentro filterByStatus, dove non corrisponderebbe a nessun item.
  const setStatusFilter = useCallback((value) => {
    if (value === 'OVERDUE') {
      setFilterCriteria({ ...filterCriteria, status: undefined, overdueOnly: true });
    } else {
      setFilterCriteria({ ...filterCriteria, status: value || undefined, overdueOnly: undefined });
    }
  }, [filterCriteria, setFilterCriteria]);

  const setImportanceFilter = useCallback((value) => {
    setFilterCriteria({ ...filterCriteria, importance: value || undefined });
  }, [filterCriteria, setFilterCriteria]);

  const setDateFilter = useCallback((value) => {
    setFilterCriteria({ ...filterCriteria, dateFilter: value || undefined });
  }, [filterCriteria, setFilterCriteria]);

  const setSort = useCallback((value) => {
    setSortCriteria(parseSortValue(value));
  }, [setSortCriteria]);

  // Valore da passare al FilterDropdown "Stato": riflette anche overdueOnly,
  // che non vive dentro filterCriteria.status
  const statusFilterValue = filterCriteria.overdueOnly ? 'OVERDUE' : (filterCriteria.status || '');

  return {
    filterCriteria,
    sortCriteria,
    activeFilters,
    statusFilterValue,
    clearAllFilters,
    clearFilter,
    setTypeFilter,
    setStatusFilter,
    setImportanceFilter,
    setDateFilter,
    setSort,
    typeOptions,
    statusOptions,
    importanceOptions,
    dateOptions,
    sortOptions,
  };
}
