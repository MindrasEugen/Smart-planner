/**
 * Calendar Widget per Desktop Dashboard
 * Secondo Google Stitch Cognitive Protocol
 */

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

// Helper per formattare date in italiano usando Intl
const formatIt = (date, options) => {
  return new Intl.DateTimeFormat('it-IT', options).format(date);
};

/**
 * CalendarWidget - Widget calendario per desktop
 * @typedef {Object} CalendarWidgetProps
 * @property {Date} [selectedDate] - Data selezionata (controllata dal parent)
 * @property {Function} [onDateSelect] - Callback per selezione data
 * @returns {JSX.Element} Widget calendario mensile
 */
export default function CalendarWidget({ selectedDate: externalSelectedDate, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Usa la data esterna se fornita, altrimenti usa currentDate
  const selectedDate = externalSelectedDate || currentDate;
  
  // Sincronizza currentDate se selectedDate esterna cambia
  useEffect(() => {
    if (externalSelectedDate && !isSameMonth(externalSelectedDate, currentDate)) {
      setCurrentDate(externalSelectedDate);
    }
  }, [externalSelectedDate, currentDate]);

  // Genera giorni del mese
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start, end });

  // Nomi giorni della settimana (abbreviazioni univoche)
  const weekDays = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-lg">
      {/* Intestazione calendario */}
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-body-md text-body-md font-semibold">
          {formatIt(currentDate, { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            aria-label="Mese precedente"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={nextMonth}
            className="text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            aria-label="Mese successivo"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Giorni della settimana */}
      <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm text-on-surface-variant mb-2">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Giorni del mese */}
      <div className="grid grid-cols-7 gap-1 text-center font-body-md text-body-md">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDay = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              className={`relative py-1 rounded cursor-pointer transition-colors ${
                !isCurrentMonth
                  ? 'text-outline-variant hover:bg-surface-container-high'
                  : 'hover:bg-surface-container-high'
              } ${
                isTodayDay
                  ? 'border-2 border-primary bg-primary/10 text-primary font-bold'
                  : ''
              } ${
                isSelected && !isTodayDay
                  ? 'bg-primary-container text-on-primary-container font-medium'
                  : ''
              }`}
              onClick={() => {
                setCurrentDate(day);
                onDateSelect?.(day);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCurrentDate(day);
                  onDateSelect?.(day);
                }
              }}
              role="gridcell"
              tabIndex={0}
              aria-label={formatIt(day, { day: '2-digit', month: 'long', year: 'numeric' })}
              aria-selected={isSelected}
            >
              {format(day, 'd')}
              {isTodayDay && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-on-primary rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
