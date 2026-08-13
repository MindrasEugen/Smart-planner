/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useMemo } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import AgendaItemCard from '../AgendaItem/AgendaItemCard.jsx';
import { parseDateTime } from '../../../logic/time/timezone.js';

/**
 * @typedef {Object} WeeklyViewProps
 * @property {AgendaItem[]} items - Array di item
 * @property {Date} date - Data corrente
 */

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

// Ordinamento data → priorità (tie-break su importanza a parità di orario)
const importanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function WeeklyView({ items, date }) {
  // Memoizza la data di oggi per evitare ricreazione ad ogni render
  const today = useMemo(() => new Date(), []);

  // Inizio settimana (lunedi)
  const weekStart = useMemo(() => startOfWeek(date, { weekStartsOn: 1 }), [date]);
  
  // Crea array di 7 giorni
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Filtra e raggruppa item per giorno
  const itemsByDay = useMemo(() => {
    return days.map((day) => {
      return items.filter((item) => {
        const itemDate = new Date(item.dueDate);
        return (
          itemDate.getFullYear() === day.getFullYear() &&
          itemDate.getMonth() === day.getMonth() &&
          itemDate.getDate() === day.getDate()
        );
      });
    });
  }, [days, items]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-md">
      {days.map((day, index) => {
        const dayItems = itemsByDay[index];
        const isToday = 
          day.getDate() === today.getDate() &&
          day.getMonth() === today.getMonth() &&
          day.getFullYear() === today.getFullYear();

        return (
          <div
            key={day.toISOString()}
            className={`flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg h-full ${isToday ? 'border-2 border-primary bg-primary/10' : ''}`}
          >
            <div className="p-md border-b border-outline-variant">
              <h3 className={`font-body-lg text-on-surface mb-0 ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                {DAYS[index]} {format(day, 'd')}
              </h3>
            </div>
            
            <div className="p-md flex-grow">
              {dayItems.length === 0 ? (
                <p className="font-body-md text-on-surface-variant text-center mb-0">Nessun elemento</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {dayItems
                    .sort((a, b) => {
                      const aTime = parseDateTime(a.dueDate, a.dueTime);
                      const bTime = parseDateTime(b.dueDate, b.dueTime);
                      const timeDiff = aTime.getTime() - bTime.getTime();
                      return timeDiff !== 0 ? timeDiff : (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
                    })
                    .slice(0, 5) // Max 5 item per giorno
                    .map((item) => (
                      <AgendaItemCard key={item.id} item={item} variant="compact" />
                    ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
