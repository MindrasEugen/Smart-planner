import React from 'react';

/**
 * @typedef {Object} LoadingSpinnerProps
 * @property {'sm' | 'md' | 'lg' | 'xl'} [size='md']
 * @property {string} [className='']
 * @property {string} [label='Caricamento...']
 */

// Spinner custom basato su design system Stitch
export default function LoadingSpinner({
  size = 'md',
  className = '',
  label = 'Caricamento...',
}) {
  const spinnerSizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const spinnerSize = spinnerSizeClasses[size] || spinnerSizeClasses.md;

  return (
    <div className="flex items-center justify-center gap-md" role="status" aria-label={label}>
      <div
        className={`animate-spin rounded-full border border-primary border-t-primary-fixed ${spinnerSize} ${className}`}
        role="status"
        aria-hidden="true"
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
