/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import StatsCard from './StatsCard.jsx';

/**
 * @typedef {Object} UpcomingSectionProps
 * @property {AgendaItem[]} items - Item imminenti
 */

export default function UpcomingSection({ items }) {
  return (
    <StatsCard
      title="Scadenze Imminenti"
      items={items}
      maxItems={5}
      viewAllUrl="/agenda"
    />
  );
}
