/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import StatsCard from './StatsCard.jsx';

/**
 * @typedef {Object} CompletedSectionProps
 * @property {AgendaItem[]} items - Item completati
 */

export default function CompletedSection({ items }) {
  return (
    <StatsCard
      title="Task Completati"
      items={items}
      maxItems={5}
    />
  );
}
