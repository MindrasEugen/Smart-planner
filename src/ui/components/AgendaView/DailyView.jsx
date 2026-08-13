/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useMemo } from 'react';
import AgendaItemCard from '../AgendaItem/AgendaItemCard.jsx';
import { parseDateTime } from '../../../logic/time/timezone.js';

/**
 * @typedef {Object} DailyViewProps
 * @property {AgendaItem[]} items - Array di item
 * @property {Date} date - Data da visualizzare
 */

// Ordinamento data → priorità (tie-break su importanza a parità di orario)
const importanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

// Nomi delle sezioni in italiano
const sectionLabels = {
  overdue: 'Scaduti',
  imminent: 'Imminenti',
  due: 'In Scadenza',
  others: 'Altri',
  completed: 'Completati'
};

// Icone Material Symbols per le sezioni
const sectionIcons = {
  overdue: 'warning',
  imminent: 'schedule',
  due: 'clock',
  others: 'event',
  completed: 'check_circle'
};

export default function DailyView({ items, date }) {
  // Memoizza il filtraggio degli item per la data specifica
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemDate = new Date(item.dueDate);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });
  }, [items, date]);

  // Memoizza l'ordinamento degli item filtrati
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aTime = parseDateTime(a.dueDate, a.dueTime);
      const bTime = parseDateTime(b.dueDate, b.dueTime);
      const timeDiff = aTime.getTime() - bTime.getTime();
      return timeDiff !== 0 ? timeDiff : (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
    });
  }, [filteredItems]);

  // Memoizza la categorizzazione degli item
  const { overdue, imminent, due, others, completed } = useMemo(() => {
    const now = new Date();
    return sortedItems.reduce(
      (acc, item) => {
        const dueDateTime = parseDateTime(item.dueDate, item.dueTime);

        if (dueDateTime < now && item.status !== 'COMPLETED') {
          acc.overdue.push(item);
        } else if (dueDateTime.getTime() - now.getTime() <= 86400000) {
          acc.imminent.push(item);
        } else if (dueDateTime.getTime() - now.getTime() <= 3600000) {
          acc.due.push(item);
        } else if (item.status === 'COMPLETED') {
          acc.completed.push(item);
        } else {
          acc.others.push(item);
        }
        return acc;
      },
      { overdue: [], imminent: [], due: [], others: [], completed: [] }
    );
  }, [sortedItems]);

  // Verifica se la data visualizzata è oggi
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }, [date]);

  // Formatta la data in italiano (memoizzato)
  const formattedDate = useMemo(() => {
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [date]);

  if (filteredItems.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center">
        <span className="material-symbols-outlined text-[48px] text-outline-variant">event_busy</span>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 mb-0">Nessun elemento per questo giorno</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Intestazione con data */}
      <h2 className={`font-headline-md text-headline-md mb-sm ${isToday ? 'text-primary font-bold' : 'text-on-surface'}`}>
        {formattedDate}
      </h2>
      
      {overdue.length > 0 && (
        <section className="flex flex-col gap-gutter">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] me-1">{sectionIcons.overdue}</span>
            {sectionLabels.overdue}
          </h3>
          <div className="flex flex-col gap-3">
            {overdue.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
      {imminent.length > 0 && (
        <section className="flex flex-col gap-gutter">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] me-1">{sectionIcons.imminent}</span>
            {sectionLabels.imminent}
          </h3>
          <div className="flex flex-col gap-3">
            {imminent.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
      {due.length > 0 && (
        <section className="flex flex-col gap-gutter">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] me-1">{sectionIcons.due}</span>
            {sectionLabels.due}
          </h3>
          <div className="flex flex-col gap-3">
            {due.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
      {others.length > 0 && (
        <section className="flex flex-col gap-gutter">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] me-1">{sectionIcons.others}</span>
            {sectionLabels.others}
          </h3>
          <div className="flex flex-col gap-3">
            {others.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section className="flex flex-col gap-gutter">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] me-1">{sectionIcons.completed}</span>
            {sectionLabels.completed}
          </h3>
          <div className="flex flex-col gap-3">
            {completed.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
