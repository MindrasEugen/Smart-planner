/**
 * @typedef {Object} FilterChipProps
 * @property {string} label - Etichetta del filtro
 * @property {string} value - Valore del filtro
 * @property {Function} onRemove - Callback per rimuovere
 * @property {string} [className] - Classe CSS aggiuntiva
 */

import React, { memo, useMemo } from 'react';

export default memo(function FilterChip({ label, value, onRemove, className = '' }) {
  // Memoizza il valore visualizzato per evitare re-calcoli inutili
  const displayValue = useMemo(() => {
    if (value.length > 20) return `${value.slice(0, 15)}...`;
    return value;
  }, [value]);

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-label-sm ${className} active:scale-95 transition-transform`}
    >
      <span className="truncate" style={{ maxWidth: '120px' }}>
        {label}: {displayValue}
      </span>
      <button
        onClick={onRemove}
        className="p-0 m-0 text-primary hover:bg-primary/20 rounded-full transition-colors"
        aria-label={`Rimuovi filtro ${label}`}
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
});
