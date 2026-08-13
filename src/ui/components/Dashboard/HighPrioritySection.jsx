/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import StatsCard from './StatsCard.jsx';

/**
 * @typedef {Object} HighPrioritySectionProps
 * @property {AgendaItem[]} items - Item ad alta priorità
 */

export default function HighPrioritySection({ items }) {
  return (
    <StatsCard
      title="Alta Priorità"
      items={items}
      maxItems={5}
      viewAllUrl="/agenda"
    />
  );
}
