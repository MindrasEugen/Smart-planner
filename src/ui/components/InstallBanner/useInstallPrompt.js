import { useState, useEffect, useCallback } from 'react';

const DISMISSED_KEY = 'agenda_install_banner_dismissed';

/**
 * Verifica se l'app e' gia' in esecuzione come PWA installata
 * @returns {boolean} True se in modalita' standalone (installata)
 */
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Hook per gestire il prompt di installazione PWA (evento `beforeinstallprompt`).
 * L'evento va intercettato e salvato: il browser non lo ripropone su richiesta,
 * va invocato esplicitamente tramite `prompt()` sull'evento originale.
 * @returns {{ canInstall: boolean, promptInstall: () => Promise<void>, dismiss: () => void }}
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === 'true'
  );

  useEffect(() => {
    if (isStandalone()) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  }, []);

  return {
    canInstall: Boolean(deferredPrompt) && !dismissed,
    promptInstall,
    dismiss,
  };
}
