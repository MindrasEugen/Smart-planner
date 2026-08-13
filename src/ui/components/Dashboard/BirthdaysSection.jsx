/**
 * @typedef {import('../../../types/agendaItem.js').Birthday} Birthday
 */

import StatsCard from './StatsCard.jsx';

/**
 * @typedef {Object} BirthdaysSectionProps
 * @property {Birthday[]} birthdays - Array di compleanni
 */

export default function BirthdaysSection({ birthdays }) {
  return (
    <StatsCard
      title="Prossimi Compleanni"
      items={birthdays}
      maxItems={5}
      viewAllUrl="/agenda"
    />
  );
}
