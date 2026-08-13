/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useNavigate } from 'react-router-dom';
import { getTimeStatus } from '../../../logic/time/status.js';
import { formatTime } from '../../../logic/time/timezone.js';

// Icone Material Symbols per tipo
const typeIcons = {
  TASK: 'task_alt',
  BIRTHDAY: 'cake',
};

/**
 * Mappatura stato a colori
 */
const getStatusConfig = (item) => {
  const timeStatus = getTimeStatus(item);
  
  if (item.status === 'COMPLETED') {
    return { bg: 'bg-secondary/10', text: 'text-on-surface-variant' };
  }
  
  if (timeStatus === 'OVERDUE') {
    return { bg: 'bg-danger/10', text: 'text-danger' };
  }
  
  if (timeStatus === 'IMMINENT' || timeStatus === 'DUE') {
    return { bg: 'bg-warning/10', text: 'text-warning' };
  }
  
  // Colore basato su importanza
  if (item.importance === 'HIGH') {
    return { bg: 'bg-danger/10', text: 'text-danger' };
  }
  
  if (item.importance === 'MEDIUM') {
    return { bg: 'bg-warning/10', text: 'text-warning' };
  }
  
  return { bg: 'bg-success/10', text: 'text-success' };
};

/**
 * @typedef {Object} AgendaItemCompactProps
 * @property {AgendaItem} item - Item da visualizzare
 */

export default function AgendaItemCompact({ item }) {
  const navigate = useNavigate();
  const timeStatus = getTimeStatus(item);
  const colors = getStatusConfig(item);
  const typeIcon = typeIcons[item.type] || 'event';
  const formattedTime = formatTime(item.dueTime);

  const handleClick = () => navigate(`/edit/${item.id}`);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 p-3 rounded-xl border-0 bg-transparent hover:bg-surface-container-high cursor-pointer text-start transition-colors active:scale-95"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${item.title} - ${item.dueDate.toLocaleDateString('it-IT')} alle ${formattedTime} - Importanza: ${item.importance}`}
    >
      <span className={`material-symbols-outlined text-[24px] ${colors.text} me-3`}>
        {typeIcon}
      </span>
      <div className="flex-grow min-w-0">
        <p className={`mb-1 font-body-lg text-body-lg font-medium truncate ${colors.text}`}>
          {item.title}
        </p>
        <p className="mb-0 font-body-md text-body-md text-on-surface-variant">
          {item.dueDate.toLocaleDateString('it-IT')} alle {formattedTime}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full font-label-sm ${colors.bg} ${colors.text}`}>
          {item.importance}
        </span>
        {timeStatus === 'OVERDUE' && (
          <span className="px-2 py-1 rounded-full bg-danger text-on-error font-label-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>Scaduto</span>
          </span>
        )}
        {timeStatus === 'IMMINENT' && (
          <span className="px-2 py-1 rounded-full bg-warning text-on-surface font-label-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span>Imminente</span>
          </span>
        )}
      </div>
    </button>
  );
}
