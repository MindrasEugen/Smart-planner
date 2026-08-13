/**
 * @typedef {Object} FilterDropdownProps
 * @property {string} label - Etichetta del dropdown
 * @property {Array<{value: string, label: string}>} options - Opzioni del dropdown
 * @property {string} value - Valore selezionato
 * @property {Function} onChange - Callback al cambio
 * @property {string} [className] - Classe CSS aggiuntiva
 */

import React, { useState, useRef, useEffect } from 'react';

export default function FilterDropdown({ label, options, value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chiusura da tastiera: Escape (con qualunque elemento del dropdown a
  // fuoco) e spostamento del focus fuori dal componente (altrimenti il
  // pannello resta aperto e sovrapposto anche dopo aver tabulato altrove —
  // il solo listener "mousedown" sopra non copre la navigazione da tastiera).
  // Ascoltatori nativi sul nodo, non prop JSX, per non attivare
  // jsx-a11y/no-noninteractive-element-interactions su un <div> che non è
  // mai esso stesso un target di focus.
  useEffect(() => {
    const node = dropdownRef.current;
    if (!node || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleFocusOut = (e) => {
      if (!node.contains(e.relatedTarget)) {
        setIsOpen(false);
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    node.addEventListener('focusout', handleFocusOut);
    return () => {
      node.removeEventListener('keydown', handleKeyDown);
      node.removeEventListener('focusout', handleFocusOut);
    };
  }, [isOpen]);

  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  const dropdownId = `filter-dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
        {label}
      </span>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="w-full flex items-center justify-between gap-1 px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface text-start"
        type="button"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-label={`Seleziona ${label}`}
      >
        <span>{selectedLabel}</span>
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
          {isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
        </span>
      </button>

      {isOpen && (
        <div id={dropdownId} className="absolute top-full mt-1 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden" style={{ zIndex: 1000 }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-start font-body-md text-on-surface hover:bg-surface-variant transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
