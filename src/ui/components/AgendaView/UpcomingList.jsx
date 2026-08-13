/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useMemo } from 'react';
import AgendaItemCard from '../AgendaItem/AgendaItemCard.jsx';
import { parseDateTime, getCurrentDateInTZ } from '../../../logic/time/timezone.js';

/**
 * @typedef {Object} UpcomingListProps
 * @property {AgendaItem[]} items - Array di item
 */

// Ordinamento data → priorità (tie-break su importanza a parità di orario)
const importanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function UpcomingList({ items }) {
  // Filtra item futuri
  const now = getCurrentDateInTZ();
  const upcomingItems = useMemo(() => {
    return items
      .filter((item) => {
        const dueDateTime = parseDateTime(item.dueDate, item.dueTime);
        return dueDateTime >= now;
      })
      .sort((a, b) => {
        const aTime = parseDateTime(a.dueDate, a.dueTime);
        const bTime = parseDateTime(b.dueDate, b.dueTime);
        const timeDiff = aTime.getTime() - bTime.getTime();
        return timeDiff !== 0 ? timeDiff : (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
      });
  }, [items]);

  // Raggruppa per data
  const itemsByDate = useMemo(() => {
    const grouped = {};
    upcomingItems.forEach((item) => {
      const dateKey = new Date(item.dueDate).toLocaleDateString('it-IT');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    return grouped;
  }, [upcomingItems]);

  if (upcomingItems.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg text-center p-lg">
        <p className="font-body-md text-on-surface-variant mb-0">Nessun elemento futuro</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      {Object.entries(itemsByDate).map(([date, dayItems]) => (
        <section key={date}>
          <h3 className="font-headline-md text-on-surface mb-md border-b border-outline-variant pb-sm">{date}</h3>
          <div className="flex flex-col gap-3">
            {dayItems.map((item) => (
              <AgendaItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
