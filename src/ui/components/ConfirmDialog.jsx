import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @typedef {Object} ConfirmDialogProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {() => void} onConfirm
 * @property {string} title
 * @property {string} message
 * @property {string} [confirmText='Conferma']
 * @property {string} [cancelText='Annulla']
 * @property {'danger' | 'warning' | 'info'} [variant='danger']
 */

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'danger',
}) {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // isClosing va riportato a false dopo il fade-out: altrimenti la guardia
    // di rendering (`!isOpen && !isClosing`) non torna mai true, il dialog
    // resta montato invisibile (opacity-0) ma con pointer-events attivi su
    // `fixed inset-0` — un overlay a schermo intero che blocca ogni click
    // sul resto dell'app finché la pagina non viene ricaricata.
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onConfirm();
      onClose();
    }, 200);
  }, [onConfirm, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    
    if (isOpen) {
      setIsClosing(false);
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      // Focus sul primo elemento focusabile all'apertura
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  // Mappatura varianti a colori e icone
  const getVariantConfig = () => {
    const map = {
      danger: {
        icon: 'error',
        iconColor: 'text-danger',
        bgColor: 'bg-error-container/10',
        borderColor: 'border-danger',
        confirmBtnColor: 'bg-danger text-on-error'
      },
      warning: {
        icon: 'warning',
        iconColor: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning',
        confirmBtnColor: 'bg-warning text-on-surface'
      },
      info: {
        icon: 'info',
        iconColor: 'text-info',
        bgColor: 'bg-info/10',
        borderColor: 'border-info',
        confirmBtnColor: 'bg-info text-on-info'
      }
    };
    return map[variant] || map.danger;
  };

  const { icon, iconColor, bgColor, borderColor, confirmBtnColor } = getVariantConfig();

  return (
    // Il click sul backdrop per chiudere è un pattern standard dei dialog
    // modali; l'equivalente da tastiera è già gestito da Escape
    // (document-level, sopra) e i controlli davvero interattivi sono i
    // pulsanti dentro il dialog, già raggiungibili da tastiera — il backdrop
    // stesso non deve entrare nel tab order.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[1055] ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-surface-container-lowest rounded-xl p-4 m-3 shadow-lg ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ maxWidth: '500px' }}
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        aria-modal="true"
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 rounded-full p-2 border ${borderColor} ${bgColor}`}>
            <span className={`material-symbols-outlined text-[24px] ${iconColor}`}>
              {icon}
            </span>
          </div>
          <div>
            <h3 id="dialog-title" className="font-body-lg text-body-lg text-on-surface font-semibold mb-2">
              {title}
            </h3>
            <p id="dialog-message" className="font-body-md text-body-md text-on-surface-variant">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant active:scale-95"
            aria-label="Annulla azione"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 ${confirmBtnColor} rounded-xl transition-colors font-label-sm active:scale-95`}
            aria-label={`Conferma ${title.toLowerCase()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
