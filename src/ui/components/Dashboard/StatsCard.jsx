/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { Link } from 'react-router-dom';
import AgendaItemCompact from '../../AgendaItem/AgendaItemCompact.jsx';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - Titolo della card
 * @property {AgendaItem[]} items - Array di item da mostrare
 * @property {number} [maxItems=5] - Numero massimo di item da mostrare
 * @property {string} [viewAllUrl] - URL per "Vedi tutti"
 */

export default function StatsCard({ 
  title, 
  items, 
  maxItems = 5, 
  viewAllUrl 
}) {
  const displayItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col h-full">
      <div className="flex justify-between items-center p-md border-b border-outline-variant">
        <h2 className="font-headline-md text-on-surface mb-0">{title}</h2>
        {hasMore && viewAllUrl && (
          <Link
            to={viewAllUrl}
            className="no-underline font-label-sm text-primary hover:opacity-70 transition-opacity"
          >
            Vedi tutti
          </Link>
        )}
      </div>
      
      <div className="p-md flex-grow">
        {displayItems.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant text-center py-lg mb-0">Nessun elemento</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {displayItems.map((item) => (
              <AgendaItemCompact key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


