import React from 'react';

/**
 * @typedef {Object} EmptyStateProps
 * @property {string} message
 * @property {string} [description]
 * @property {React.ReactNode} [icon]
 * @property {React.ReactNode} [action]
 * @property {string} [className='']
 */

export default function EmptyState({
  message,
  description,
  icon = <span className="material-symbols-outlined text-[40px] text-outline-variant" role="img" aria-hidden="true">event_busy</span>,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-xl px-md text-center ${className}`}>
      <div className="mb-lg text-outline-variant">
        {icon}
      </div>
      <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">{message}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg" style={{ maxWidth: '500px' }}>{description}</p>
      )}
      {action && (
        <div className="flex gap-sm">
          {action}
        </div>
      )}
    </div>
  );
}
