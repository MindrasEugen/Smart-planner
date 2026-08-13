/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import StatsCard from './StatsCard.jsx';
import UpcomingSection from './UpcomingSection.jsx';
import OverdueSection from './OverdueSection.jsx';
import HighPrioritySection from './HighPrioritySection.jsx';
import BirthdaysSection from './BirthdaysSection.jsx';
import CompletedSection from './CompletedSection.jsx';

/**
 * Dashboard principale
 * @param {Object} props - Props del componente
 * @param {AgendaItem[]} props.upcomingItems - Item imminenti
 * @param {AgendaItem[]} props.overdueItems - Item scaduti
 * @param {AgendaItem[]} props.highPriorityItems - Item ad alta priorità
 * @param {AgendaItem[]} props.birthdays - Compleanni
 * @param {AgendaItem[]} props.completedItems - Item completati
 */
export default function Dashboard({ 
  upcomingItems, 
  overdueItems, 
  highPriorityItems, 
  birthdays,
  completedItems 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
      <UpcomingSection items={upcomingItems} />
      <OverdueSection items={overdueItems} />
      <HighPrioritySection items={highPriorityItems} />
      <BirthdaysSection birthdays={birthdays} />
      <CompletedSection items={completedItems} />
    </div>
  );
}
