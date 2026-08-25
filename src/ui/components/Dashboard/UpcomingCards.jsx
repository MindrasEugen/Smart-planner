/**
 * Upcoming Cards - Card scadenze imminenti con horizontal scroll
 * Secondo Google Stitch design
 */

import { useState } from 'react';
import { getTimeStatus } from '../../../logic/time/status.js';
import { formatTime } from '../../../logic/time/timezone.js';
import AgendaItemActions from '../AgendaItem/AgendaItemActions.jsx';

// Mappatura stato temporale a badge
const getStatusInfo = (timeStatus) => {
  const map = {
    OVERDUE: {
      badgeBg: 'bg-error/10',
      badgeText: 'text-error',
      badgeTextColor: 'Scaduto',
      badgeIcon: 'warning',
      stripColor: 'bg-error'
    },
    IMMINENT: {
      badgeBg: 'bg-secondary-container/10',
      badgeText: 'text-secondary-container',
      badgeTextColor: 'Imminente',
      badgeIcon: 'schedule',
      stripColor: 'bg-secondary-container'
    },
    DUE: {
      badgeBg: 'bg-secondary-container/10',
      badgeText: 'text-secondary-container',
      badgeTextColor: 'In scadenza',
      badgeIcon: 'schedule',
      stripColor: 'bg-secondary-container'
    },
    FAR: {
      badgeBg: 'bg-primary/10',
      badgeText: 'text-primary',
      badgeTextColor: 'Prossimo',
      badgeIcon: 'calendar_today',
      stripColor: 'bg-primary'
    }
  };
  return map[timeStatus] || map.FAR;
};

/**
 * Singola card: componente a sé per poter usare useState (pannello azioni)
 * per ogni item, cosa non possibile dentro una .map() nel componente padre.
 * @param {Object} props
 * @param {Object} props.item - Item da mostrare
 */
function UpcomingCard({ item }) {
  const [showActions, setShowActions] = useState(false);
  const timeStatus = getTimeStatus(item);
  const { badgeBg, badgeText, badgeTextColor, badgeIcon, stripColor } = getStatusInfo(timeStatus);
  const formattedTime = formatTime(item.dueTime);

  return (
    <div className="snap-start min-w-[280px] lg:min-w-0 lg:w-full bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden flex-shrink-0 transition-transform duration-200">
      {/* Strip colorato a sinistra */}
      <div className={`absolute top-0 left-0 w-1 h-full ${stripColor}`} />

      <div className="flex justify-between items-start mb-lg">
        {/* Badge stato */}
        <div className={`${badgeBg} ${badgeText} px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1`}>
          <span className={`material-symbols-outlined text-[14px]`}>{badgeIcon}</span>
          <span>{badgeTextColor}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Ora */}
          <span className="font-body-md text-body-md text-on-surface-variant">
            {formattedTime}
          </span>
          {/* Apre/chiude il pannello azioni sotto la card: stesso pattern di
              AgendaItemCard, gia' verificato su touch (BUG-04) */}
          <button
            type="button"
            onClick={() => setShowActions((prev) => !prev)}
            aria-expanded={showActions}
            aria-label="Altre azioni"
            className="w-8 h-8 -mr-2 rounded-full flex items-center justify-center shrink-0 hover:bg-surface-variant active:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">more_vert</span>
          </button>
        </div>
      </div>

      <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
        {item.title}
      </h3>

      {item.description && (
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{item.description}</span>
        </p>
      )}

      {showActions && (
        <div className="mt-md pt-2 flex justify-end border-t border-outline-variant">
          <AgendaItemActions item={item} onAction={() => setShowActions(false)} />
        </div>
      )}
    </div>
  );
}

/**
 * Card orizzontali per scadenze imminenti
 * @param {Object} props
 * @param {Array} props.items - Array di item da mostrare
 * @returns {JSX.Element} Sezione con card orizzontali
 */
export default function UpcomingCards({ items }) {
  if (items.length === 0) return null;

  return (
    <section className="animate-fade-in-delay-1">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
        Scadenze Imminenti
      </h2>
      {/* Carosello orizzontale con snap solo sotto lg: (mobile/tablet) —
          la colonna destra desktop è ~280-320px, troppo stretta anche per
          una singola card da 280px: da lg: in su diventa una lista verticale
          a larghezza piena, senza overflow-x. */}
      <div className="flex overflow-x-auto pb-4 -mx-margin-mobile px-margin-mobile gap-gutter snap-x lg:flex-col lg:overflow-x-visible lg:snap-none lg:mx-0 lg:px-0 lg:pb-0 lg:gap-sm">
        {items.map((item) => (
          <UpcomingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
