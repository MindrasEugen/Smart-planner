/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../../types/agendaItem.js').Birthday} Birthday
 */

import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import { useAgendaStore } from '../../../logic/store/index.js';
import AgendaItemActions from './AgendaItemActions.jsx';
import { getTimeStatus } from '../../../logic/time/status.js';
import { formatTime } from '../../../logic/time/timezone.js';

/**
 * @typedef {Object} AgendaItemCardProps
 * @property {AgendaItem} item - Item da visualizzare
 */

// Colore strip di scadenza (4px, equivalente a un border-l-4): Scaduto=error, Imminente=warning
const getStripColor = (item) => {
  const timeStatus = getTimeStatus(item);

  if (timeStatus === 'OVERDUE') {
    return 'bg-error';
  }

  if (timeStatus === 'IMMINENT' || timeStatus === 'DUE') {
    return 'bg-warning';
  }

  return 'bg-transparent';
};

// Mappatura badge stato: colori semantici error/warning/success
const getStatusBadge = (item) => {
  const timeStatus = getTimeStatus(item);

  if (item.status === 'COMPLETED') {
    return {
      className: 'text-success',
      icon: 'check_circle',
      label: 'Completato'
    };
  }

  if (timeStatus === 'OVERDUE') {
    return {
      className: 'text-error',
      icon: 'warning',
      label: 'Scaduto'
    };
  }

  if (timeStatus === 'IMMINENT') {
    return {
      className: 'text-warning',
      icon: 'schedule',
      label: 'Imminente'
    };
  }

  if (timeStatus === 'DUE') {
    return {
      className: 'text-warning',
      icon: 'schedule',
      label: 'In scadenza'
    };
  }

  return null;
};

// Mappatura badge importanza: Alta=error, Media=warning, Bassa=success
const getImportanceBadge = (importance) => {
  const map = {
    HIGH: { className: 'bg-error/10 text-error', label: 'Alta' },
    MEDIUM: { className: 'bg-warning/10 text-warning', label: 'Media' },
    LOW: { className: 'bg-success/10 text-success', label: 'Bassa' }
  };
  return map[importance] || null;
};

// Icone per tipo
const getTypeIcon = (type) => {
  const map = {
    TASK: 'task_alt',
    BIRTHDAY: 'cake'
  };
  return map[type] || 'event';
};

// Etichette tipo
const getTypeLabel = (type) => {
  const map = {
    TASK: 'Task',
    BIRTHDAY: 'Compleanno'
  };
  return map[type] || 'Evento';
};

export default React.memo(function AgendaItemCard({ item }) {
  const [showActions, setShowActions] = useState(false);
  const toggleComplete = useAgendaStore((state) => state.toggleComplete);
  
  // Memoizza valori derivati da item per evitare re-calcoli inutili
  const timeStatus = useMemo(() => getTimeStatus(item), [item]);
  const stripColor = useMemo(() => getStripColor(item), [item]);
  const statusBadge = useMemo(() => getStatusBadge(item), [item]);
  const importanceBadge = useMemo(() => getImportanceBadge(item.importance), [item.importance]);
  const typeIcon = useMemo(() => getTypeIcon(item.type), [item.type]);
  const typeLabel = useMemo(() => getTypeLabel(item.type), [item.type]);
  const isCompleted = useMemo(() => item.status === 'COMPLETED', [item.status]);
  
  const handleToggleComplete = useCallback(() => {
    toggleComplete(item.id);
  }, [item.id, toggleComplete]);
  
  // Formatta l'ora
  const displayTime = useMemo(() => formatTime(item.dueTime), [item.dueTime]);
  
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-lg relative overflow-hidden p-md flex gap-md items-center ${isCompleted ? 'opacity-60' : ''} hover:bg-surface-container-low active:bg-surface-container-high transition-colors cursor-pointer`}
      role="article"
      aria-label={item.type === 'BIRTHDAY' && item.personName ? `${item.title} di ${item.personName}` : item.title}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Strip colorato verticale a sinistra */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripColor}`} />
      
      {/* Ora */}
      <div className="flex flex-col items-end shrink-0 w-16">
        <span className={`font-label-caps text-label-caps ${isCompleted ? 'text-outline line-through' : 'text-on-surface'}`}>
          {displayTime}
        </span>
      </div>
      
      {/* Contenuto principale */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-body-lg text-body-lg ${isCompleted ? 'text-outline line-through' : 'text-on-surface'} truncate font-medium`}>
            {item.title}
          </span>
          {statusBadge && (
            <span className={`material-symbols-outlined text-[14px] ${statusBadge.className}`}>
              {statusBadge.icon}
            </span>
          )}
          {item.type === 'BIRTHDAY' && item.personName && (
            <span className="font-body-md text-body-md text-on-surface-variant">
              {item.personName}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-body-md">
          <span className="material-symbols-outlined text-[16px]">{typeIcon}</span>
          <span>{typeLabel}</span>
          {importanceBadge && (
            <>
              <span className="mx-1">·</span>
              <span className={`px-2 py-0.5 rounded ${importanceBadge.className}`}>
                {importanceBadge.label}
              </span>
            </>
          )}
        </div>
        
        {item.description && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 truncate">{item.description}</p>
        )}
      </div>
      
      {/* Checkbox accessibile */}
      <div
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex={0}
        onClick={handleToggleComplete}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleComplete();
          }
        }}
        className="w-6 h-6 rounded-sm border border-outline flex items-center justify-center shrink-0 cursor-pointer hover:bg-surface-variant active:bg-surface-container-high transition-colors"
      >
        {isCompleted ? (
          <span className="material-symbols-outlined text-primary text-[16px]">check</span>
        ) : (
          <span className="material-symbols-outlined text-[16px] opacity-0">check_box_outline_blank</span>
        )}
      </div>
      
      {/* Azioni hover */}
      {showActions && (
        <div className="ml-md">
          <AgendaItemActions item={item} onAction={() => setShowActions(false)} />
        </div>
      )}
    </div>
  );
});
