/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 */

/**
 * @typedef {Object} ToastMessage
 * @property {string} id - Identificatore univoco
 * @property {ToastType} type - Tipo di toast
 * @property {string} message - Messaggio
 * @property {number} [duration] - Durata in ms (default: 5000)
 */

/**
 * @typedef {Object} UseToastResult
 * @property {ToastMessage[]} messages - Array di messaggi toast
 * @property {Function} addToast - Aggiunge un toast
 * @property {Function} removeToast - Rimuove un toast per ID
 * @property {Function} clearToasts - Rimuove tutti i toast
 */

import { useCallback, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook per gestire i toast notifications
 * @returns {UseToastResult} Oggetto con funzioni per gestire toast
 */
export function useToast() {
  const [messages, setMessages] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = uuidv4();
    setMessages(prev => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addToast,
    removeToast,
    clearToasts,
  };
}
