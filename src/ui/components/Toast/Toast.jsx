/**
 * @typedef {import('./useToast.js').ToastMessage} ToastMessage
 * @typedef {import('./useToast.js').ToastType} ToastType
 */

import React, { useEffect, useCallback } from 'react';

/**
 * @typedef {Object} ToastProps
 * @property {ToastMessage} message - Messaggio toast
 * @property {Function} onRemove - Callback per rimuovere il toast
 */

/**
 * @typedef {Object} ToastStyle
 * @property {string} bg - Classi CSS background
 * @property {string} icon - Nome icona Material Symbols
 * @property {string} text - Classe CSS testo
 *
 * @typedef {Object} ToastColors
 * @property {ToastStyle} info
 * @property {ToastStyle} success
 * @property {ToastStyle} warning
 * @property {ToastStyle} error
 */
/** @type {ToastColors} */
const toastColors = {
  info: {
    bg: 'bg-primary/10 border-l-4 border-primary/20',
    icon: 'info',
    text: 'text-primary',
  },
  success: {
    bg: 'bg-success/10 border-l-4 border-success/20',
    icon: 'check_circle',
    text: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10 border-l-4 border-warning/20',
    icon: 'warning',
    text: 'text-warning',
  },
  error: {
    bg: 'bg-danger/10 border-l-4 border-danger/20',
    icon: 'error',
    text: 'text-danger',
  },
};

export default function Toast({ message, onRemove }) {
  const colors = toastColors[message.type];

  const handleRemove = useCallback(() => {
    onRemove(message.id);
  }, [message.id, onRemove]);

  const handleAction = useCallback(() => {
    message.action?.onClick();
    onRemove(message.id);
  }, [message.action, message.id, onRemove]);

  useEffect(() => {
    if (message.duration && message.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(message.id);
      }, message.duration);
      return () => clearTimeout(timer);
    }
  }, [message.id, message.duration, onRemove]);

  return (
    <div
      className={`rounded-xl p-3 mb-2 shadow-sm ${colors.bg}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined text-[20px] ${colors.text}`}>{colors.icon}</span>
        <p className={`mb-0 font-body-md text-body-md font-medium ${colors.text}`}>{message.message}</p>
        {message.action && (
          <button
            onClick={handleAction}
            className={`shrink-0 font-label-sm text-label-sm font-medium underline hover:no-underline ${colors.text}`}
          >
            {message.action.label}
          </button>
        )}
        <button
          onClick={handleRemove}
          className="ml-auto p-1 hover:bg-surface-container-high rounded-full transition-colors active:scale-95"
          aria-label="Chiudi notifica"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
        </button>
      </div>
    </div>
  );
}
