/**
 * @typedef {import('../../../logic/hooks.js').UseAgendaResult} UseAgendaResult
 */

import { useState } from 'react';
import { useAgenda } from '../../../logic/hooks.js';
import FilterBar from '../Filters/FilterBar.jsx';
import AgendaHeader from './AgendaHeader.jsx';
import ViewToggle from './ViewToggle.jsx';
import DailyView from './DailyView.jsx';
import WeeklyView from './WeeklyView.jsx';
import UpcomingList from './UpcomingList.jsx';

/** @typedef {'daily' | 'weekly' | 'upcoming'} ViewType */

export default function AgendaView() {
  const { filteredItems } = useAgenda();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('daily');

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="py-3">
      <AgendaHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onToday={handleToday}
      />

      <ViewToggle
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <FilterBar />

      {currentView === 'daily' && (
        <DailyView items={filteredItems} date={currentDate} />
      )}
      {currentView === 'weekly' && (
        <WeeklyView items={filteredItems} date={currentDate} />
      )}
      {currentView === 'upcoming' && (
        <UpcomingList items={filteredItems} />
      )}
    </div>
  );
}
