/** @typedef {'daily' | 'weekly' | 'upcoming'} ViewType */

/**
 * @typedef {Object} ViewToggleProps
 * @property {ViewType} currentView - Vista corrente
 * @property {Function} onViewChange - Callback per cambiare vista
 */

const viewOptions = [
  { id: 'daily', label: 'Giornaliera', icon: 'calendar_view_day' },
  { id: 'weekly', label: 'Settimanale', icon: 'calendar_view_week' },
  { id: 'upcoming', label: 'Prossime', icon: 'upcoming' },
];

export default function ViewToggle({ currentView, onViewChange }) {
  return (
    <div className="bg-surface-container-low rounded-xl p-1 mb-lg">
      {/* Ogni pulsante è flex-1: si restringe per condividere lo spazio
          disponibile invece di eccedere il contenitore (mai scroll
          orizzontale). L'etichetta ha `truncate` come rete di sicurezza
          sui viewport più stretti, così al limite si accorcia con ellissi
          invece di spingere il bordo destro fuori dal layout. */}
      <div className="flex gap-sm">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onViewChange(option.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg font-label-sm transition-colors active:scale-95 ${
              currentView === option.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant border border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] shrink-0">{option.icon}</span>
            <span className="truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
