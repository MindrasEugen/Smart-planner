/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import StatsCard from './StatsCard.jsx';

/**
 * @typedef {Object} OverdueSectionProps
 * @property {AgendaItem[]} items - Item scaduti
 */

export default function OverdueSection({ items }) {
  return (
    <StatsCard
      title="Task Scaduti"
      items={items}
      maxItems={5}
      viewAllUrl="/agenda"
    />
  );
}
