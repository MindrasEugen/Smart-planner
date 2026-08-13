/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import AgendaItemCard from './AgendaItemCard.jsx';
import AgendaItemCompact from './AgendaItemCompact.jsx';

/** @typedef {'card' | 'compact'} Variant */

/**
 * @typedef {Object} AgendaItemProps
 * @property {AgendaItem} item - Item da visualizzare
 * @property {Variant} [variant='card'] - Variante di visualizzazione
 */

export default function AgendaItem({ item, variant = 'card' }) {
  if (variant === 'compact') {
    return <AgendaItemCompact item={item} />;
  }
  return <AgendaItemCard item={item} />;
}
