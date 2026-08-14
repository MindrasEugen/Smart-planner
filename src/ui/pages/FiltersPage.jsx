/**
 * Filters Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 * Scorciatoie di filtro: un clic applica il filtro globale (lo stesso usato
 * da FilterBar in Agenda) e porta direttamente alla vista filtrata.
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../../logic/hooks.js';
import { applyFilters } from '../../logic/items/filters.js';
import { FadeIn } from '../components/Animations';

const PRESETS = [
  { key: 'overdue', label: 'Scaduti', icon: 'warning', criteria: { dateFilter: 'OVERDUE' }, colorClass: 'text-error' },
  { key: 'today', label: 'Oggi', icon: 'today', criteria: { dateFilter: 'TODAY' }, colorClass: 'text-warning' },
  { key: 'tomorrow', label: 'Domani', icon: 'event', criteria: { dateFilter: 'TOMORROW' }, colorClass: 'text-primary' },
  { key: 'nextWeek', label: 'Prossima settimana', icon: 'date_range', criteria: { dateFilter: 'NEXT_WEEK' }, colorClass: 'text-primary' },
  { key: 'highPriority', label: 'Alta priorità', icon: 'priority_high', criteria: { importance: 'HIGH' }, colorClass: 'text-error' },
  { key: 'pending', label: 'In sospeso', icon: 'pending', criteria: { status: 'PENDING' }, colorClass: 'text-warning' },
  { key: 'completed', label: 'Completati', icon: 'check_circle', criteria: { status: 'COMPLETED' }, colorClass: 'text-success' },
];

export default function FiltersPage() {
  const { items, setFilterCriteria } = useAgenda();
  const navigate = useNavigate();

  const counts = useMemo(() => {
    const map = {};
    for (const preset of PRESETS) {
      map[preset.key] = applyFilters(items, preset.criteria).length;
    }
    return map;
  }, [items]);

  const applyPreset = (criteria) => {
    setFilterCriteria(criteria);
    navigate('/agenda');
  };

  const content = (
    <>
      <h1 className="font-headline-md lg:font-headline-lg text-on-surface">Filtri</h1>
      <p className="font-body-md text-on-surface-variant mt-1 mb-lg">
        Scorciatoie rapide: applica un filtro e vai direttamente in Agenda. Per filtri più
        specifici (Tipo, combinazioni multiple) usa la barra filtri dentro Agenda.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md" role="list">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => applyPreset(preset.criteria)}
            className="flex items-center gap-3 p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container-low active:scale-95 transition-all text-start"
            aria-label={`Filtra: ${preset.label}, ${counts[preset.key]} elementi`}
          >
            <span className={`material-symbols-outlined text-[24px] ${preset.colorClass}`}>
              {preset.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-body-lg text-on-surface font-medium truncate">{preset.label}</p>
              <p className="font-body-md text-on-surface-variant">
                {counts[preset.key]} element{counts[preset.key] === 1 ? 'o' : 'i'}
              </p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">
              chevron_right
            </span>
          </button>
        ))}
      </div>
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
