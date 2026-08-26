/**
 * Priority List - Lista alta priorità secondo Google Stitch
 * Lista verticale con border colorati
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgendaStore } from '../../../logic/store/index.js';
import { useAgenda } from '../../../logic/hooks.js';
import { getTimeStatus } from '../../../logic/time/status.js';
import { formatTime } from '../../../logic/time/timezone.js';
import AgendaItemActions from '../AgendaItem/AgendaItemActions.jsx';

/**
 * Singola riga: componente a sé per poter usare useState (pannello azioni)
 * per ogni item, cosa non possibile dentro una .map() nel componente padre.
 * @param {Object} props
 * @param {Object} props.item - Item da mostrare
 */
function PriorityItem({ item }) {
  const [showActions, setShowActions] = useState(false);
  const toggleComplete = useAgendaStore((state) => state.toggleComplete);
  const isCompleted = item.status === 'COMPLETED';

  // Colore strip in base all'importanza
  let stripColor = 'bg-primary';
  if (item.importance === 'HIGH') stripColor = 'bg-secondary-container';
  if (item.importance === 'MEDIUM') stripColor = 'bg-surface-tint';
  if (item.importance === 'LOW') stripColor = 'bg-tertiary-container';

  // Formatta data
  const formattedDate = new Date(item.dueDate).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit'
  });
  const formattedTime = formatTime(item.dueTime);

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant transition-transform duration-200 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="p-md flex items-center gap-md">
        {/* Strip colorato */}
        <div className={`w-1 h-10 rounded-full shrink-0 ${stripColor}`} />

        {/* Checkbox: interattiva, stesso pattern di AgendaItemCard */}
        <div
          role="checkbox"
          aria-checked={isCompleted}
          tabIndex={0}
          onClick={() => toggleComplete(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleComplete(item.id);
            }
          }}
          className="w-6 h-6 rounded border border-outline-variant flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-surface-variant active:bg-surface-container-high transition-colors"
        >
          {isCompleted && (
            <span className="material-symbols-outlined text-primary text-[16px]">check</span>
          )}
        </div>

        {/* Contenuto */}
        <div className="flex-grow min-w-0">
          <h4 className={`font-body-lg text-body-lg font-medium ${
            isCompleted ? 'text-outline line-through' : 'text-on-surface'
          }`}>
            {item.title}
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Entro {formattedDate} alle {formattedTime}
          </p>
        </div>

        {/* Apre/chiude il pannello azioni sotto la riga: stesso pattern di
            AgendaItemCard, gia' verificato su touch (BUG-04) */}
        <button
          type="button"
          onClick={() => setShowActions((prev) => !prev)}
          aria-expanded={showActions}
          aria-label="Altre azioni"
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:bg-surface-variant active:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">more_vert</span>
        </button>
      </div>

      {showActions && (
        <div className="px-md pb-md flex justify-end border-t border-outline-variant pt-2">
          <AgendaItemActions item={item} onAction={() => setShowActions(false)} />
        </div>
      )}
    </div>
  );
}

/**
 * Lista elementi per fascia di priorità
 * @param {Object} props
 * @param {Array} props.items - Array di item della fascia di priorità
 * @param {string} [props.title] - Titolo della sezione
 * @param {'HIGH' | 'MEDIUM' | 'LOW'} [props.importance] - Fascia di priorità: se presente,
 *   il titolo diventa cliccabile e porta in Agenda filtrata su questa importanza
 * @returns {JSX.Element} Sezione con lista priorità
 */
export default function PriorityList({ items, title = 'Alta Priorità', importance }) {
  const navigate = useNavigate();
  const { setFilterCriteria } = useAgenda();

  if (items.length === 0) return null;

  const goToFilteredAgenda = () => {
    setFilterCriteria({ importance });
    navigate('/agenda');
  };

  return (
    <section className="animate-fade-in-delay-2">
      <h2 className="mb-md">
        {importance ? (
          <button
            type="button"
            onClick={goToFilteredAgenda}
            className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider hover:text-on-surface transition-colors flex items-center gap-1"
            aria-label={`Vai in Agenda filtrata su ${title}`}
          >
            {title}
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        ) : (
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            {title}
          </span>
        )}
      </h2>
      <div className="space-y-sm">
        {items.map((item) => (
          <PriorityItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
