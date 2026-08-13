/**
 * @typedef {import('./useToast.js').UseToastResult} UseToastResult
 */

import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';
import { subscribeToToasts } from '../../../logic/notifications/toast.js';
import { useToast } from './useToast.js';
import Toast from './Toast.jsx';

const ToastContext = createContext(null);

/**
 * @typedef {Object} ToastProviderProps
 * @property {React.ReactNode} children - Componenti figli
 */

export function ToastProvider({ children }) {
  const toast = useToast();
  const toastContainerRef = useRef(null);

  const contextValue = useMemo(() => toast, [toast]);

  // Riceve i toast emessi dal layer logic (notifiche senza permesso, errori)
  const { addToast } = toast;
  useEffect(() => {
    return subscribeToToasts(({ message, type }) => {
      addToast(message, type);
    });
  }, [addToast]);

  // Focus automatico sul primo toast quando viene aggiunto
  useEffect(() => {
    if (toast.messages.length > 0 && toastContainerRef.current) {
      const firstToast = toastContainerRef.current.querySelector('[role="alert"]');
      if (firstToast) {
        firstToast.focus();
      }
    }
  }, [toast.messages.length]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div 
        ref={toastContainerRef}
        className="fixed bottom-0 right-0 p-3"
        style={{ zIndex: 1050 }}
        role="region"
        aria-live="polite"
        aria-label="Notifiche"
      >
        <div className="flex flex-col gap-2" style={{ minWidth: '280px', maxWidth: '400px' }}>
          {toast.messages.map(message => (
            <Toast
              key={message.id}
              message={message}
              onRemove={toast.removeToast}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
