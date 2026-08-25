import { useEffect, useRef, useCallback } from 'react';
import { AVATAR_OPTIONS } from './avatarOptions.js';

/**
 * Popup di scelta avatar: griglia di icone selezionabili. Stesso pattern di
 * ConfirmDialog (backdrop + pannello con bordo, Escape per chiudere, focus
 * trap) per coerenza con l'unico altro modale dell'app.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string | null} props.currentAvatarId
 * @param {(avatarId: string) => void} props.onSelect
 * @returns {JSX.Element | null}
 */
export default function AvatarPicker({ isOpen, onClose, currentAvatarId, onSelect }) {
  const panelRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll('button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.addEventListener('keydown', handleKeyDown);
    const first = panelRef.current?.querySelector('button');
    if (first) first.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1055] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-lg w-full"
        style={{ maxWidth: '360px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-picker-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="avatar-picker-title" className="font-body-lg text-body-lg text-on-surface font-semibold">
            Scegli un avatar
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant dark:hover:bg-surface-container-highest transition-colors"
            aria-label="Chiudi"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">close</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {AVATAR_OPTIONS.map((option) => {
            const isSelected = option.id === currentAvatarId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`w-16 h-16 rounded-full ${option.bg} flex items-center justify-center mx-auto transition-transform active:scale-95 ${
                  isSelected ? 'ring-2 ring-offset-2 ring-primary ring-offset-surface-container-lowest' : ''
                }`}
                aria-label={`Avatar ${option.icon}${isSelected ? ' (selezionato)' : ''}`}
                aria-pressed={isSelected}
              >
                <span className={`material-symbols-outlined ${option.text} text-2xl`}>{option.icon}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
