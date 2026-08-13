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
      {/* overflow-x-auto: le 3 etichette italiane non vanno a capo (parole
          singole) — senza scroll orizzontale la riga eccede il viewport su
          schermi stretti e il bordo destro viene tagliato silenziosamente
          dall'overflow-hidden del layout root */}
      <div className="flex gap-sm overflow-x-auto">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onViewChange(option.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-label-sm transition-colors active:scale-95 shrink-0 ${
              currentView === option.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant border border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
