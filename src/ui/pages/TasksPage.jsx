/**
 * Tasks Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 * Vista dedicata ai soli Task (Agenda mostra Task + Compleanni insieme)
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAgenda } from '../../logic/hooks.js';
import { applySort } from '../../logic/items/filters.js';
import { sortOptions, parseSortValue, formatSortValue } from '../components/Filters/useFilters.js';
import SortDropdown from '../components/Filters/SortDropdown.jsx';
import AgendaItemCard from '../components/AgendaItem/AgendaItemCard.jsx';
import { FadeIn } from '../components/Animations';

export default function TasksPage() {
  const { tasks } = useAgenda();
  const [sort, setSort] = useState({ field: 'dueDate', ascending: true });

  const sortedTasks = useMemo(() => applySort(tasks, sort), [tasks, sort]);
  const pendingCount = useMemo(
    () => tasks.filter((task) => task.status === 'PENDING').length,
    [tasks]
  );

  const handleSortChange = (value) => setSort(parseSortValue(value));

  const content = (
    <>
      <div className="flex items-start justify-between gap-md flex-wrap mb-lg">
        <div>
          <h1 className="font-headline-md lg:font-headline-lg text-on-surface">Tasks</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            {tasks.length === 0
              ? 'Nessun task creato'
              : `${pendingCount} in sospeso su ${tasks.length} totali`}
          </p>
        </div>
        <Link
          to="/create/task"
          className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-sm active:scale-95 transition-all no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nuovo Task
        </Link>
      </div>

      {tasks.length > 0 && (
        <div className="w-full sm:w-64 mb-lg">
          <SortDropdown
            options={sortOptions}
            value={formatSortValue(sort)}
            onChange={handleSortChange}
          />
        </div>
      )}

      {sortedTasks.length === 0 ? (
        <div className="text-center py-xl">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            task_alt
          </span>
          <p className="font-body-md text-on-surface-variant mt-2">
            Nessun task da mostrare. Creane uno per iniziare.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3" role="list" aria-label="Elenco task">
          {sortedTasks.map((task) => (
            <AgendaItemCard key={task.id} item={task} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-xl h-full lg:flex lg:flex-col">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <FadeIn>{content}</FadeIn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>{content}</FadeIn>
      </div>
    </div>
  );
}
