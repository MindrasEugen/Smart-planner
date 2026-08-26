/**
 * Avviso informativo: spiega perché i task completati spariscono dalla
 * Dashboard a fine giornata (vedi hooks.js/isStaleCompleted), cosi' non
 * sembra un bug. Compare a ogni apertura dell'app, sparisce da solo dopo
 * 30 secondi (o subito, se l'utente lo chiude a mano).
 */

import { useEffect, useState } from 'react';

const AUTO_DISMISS_MS = 30000;
const FADE_OUT_MS = 500;

export default function AutoCleanupNotice() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), AUTO_DISMISS_MS);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (!fading) return undefined;
    const removeTimer = setTimeout(() => setVisible(false), FADE_OUT_MS);
    return () => clearTimeout(removeTimer);
  }, [fading]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={`bg-primary/5 border border-primary/20 rounded-xl p-md flex items-start gap-3 ${
        fading ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
      <p className="text-sm text-on-surface-variant flex-grow">
        I task completati vengono rimossi automaticamente dalla Dashboard a fine giornata. Restano
        sempre disponibili in Agenda.
      </p>
      <button
        type="button"
        onClick={() => setFading(true)}
        aria-label="Chiudi avviso"
        className="shrink-0 p-1 rounded-full hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
      </button>
    </div>
  );
}
