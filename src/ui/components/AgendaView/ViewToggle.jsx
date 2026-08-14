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
          orizzontale). L'icona è nascosta sotto sm: (~640px) per lasciare
          più spazio al testo: su un telefono stretto (~412px) le 3
          etichette italiane con icona troncavano comunque con ellissi
          ("Giornali...", "Settima...") pur restando dentro lo schermo —
          verificato su emulatore Android reale il 2026-08-14. `truncate`
          resta come ultima rete di sicurezza sui viewport ancora più
          stretti.
          `hidden sm:inline` va sul wrapper, MAI direttamente sullo <span
          className="material-symbols-outlined">: quel foglio di stile
          (caricato via <link>, fuori da ogni @layer Tailwind) impone
          `display: inline-block` con priorità più alta di qualunque
          utility Tailwind `@layer`-based — `hidden` non riesce a
          sovrascriverlo sull'icona stessa (stesso bug di cascata già
          risolto altrove nel progetto, qui riscoperto sull'icona invece
          che su colori/margini). */}
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
            <span className="hidden sm:inline-flex shrink-0">
              <span className="material-symbols-outlined text-[16px]">{option.icon}</span>
            </span>
            <span className="truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
