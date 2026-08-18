/**
 * @typedef {import('./useFilters.js').FilterOption} FilterOption
 */

import React from 'react';
import FilterDropdown from './FilterDropdown.jsx';
import SortDropdown from './SortDropdown.jsx';
import FilterChip from './FilterChip.jsx';
import { useFilters, formatSortValue } from './useFilters.js';

export default function FilterBar() {
  const {
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
  } = useFilters();

  const currentSortValue = formatSortValue(sortCriteria);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md mb-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-md items-end">
        <div>
          <FilterDropdown
            label="Tipo"
            options={typeOptions}
            value={filterCriteria.type || ''}
            onChange={setTypeFilter}
          />
        </div>

        <div>
          <FilterDropdown
            label="Stato"
            options={statusOptions}
            value={statusFilterValue}
            onChange={setStatusFilter}
          />
        </div>

        <div>
          <FilterDropdown
            label="Importanza"
            options={importanceOptions}
            value={filterCriteria.importance || ''}
            onChange={setImportanceFilter}
          />
        </div>

        <div>
          <FilterDropdown
            label="Data"
            options={dateOptions}
            value={filterCriteria.dateFilter || ''}
            onChange={setDateFilter}
          />
        </div>

        <div>
          <SortDropdown
            options={sortOptions}
            value={currentSortValue}
            onChange={setSort}
          />
        </div>

        <div>
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant active:scale-95"
            aria-label="Reimposta tutti i filtri"
          >
            <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
            Reimposta
          </button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-md">
          <div className="flex flex-wrap gap-sm">
            {activeFilters.map((filter) => (
              <FilterChip
                key={filter.key}
                label={filter.label}
                value={filter.value}
                onRemove={() => clearFilter(filter.key)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
