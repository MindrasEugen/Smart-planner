/**
 * Alerts Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 * Cronologia delle notifiche mostrate (qualunque canale: Service Worker,
 * Notification diretta o toast di fallback) — vedi logic/notifications/db.js
 */

import { useCallback, useEffect, useState } from 'react';
import { getHistory, clearHistory } from '../../logic/notifications/db.js';
import { FadeIn } from '../components/Animations';

function formatShownAt(timestamp) {
  return new Date(timestamp).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AlertsPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(() => {
    setLoading(true);
    getHistory()
      .then((entries) => setHistory(entries))
      .catch((e) => console.error('Errore caricamento storico notifiche:', e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
  };

  const content = (
    <>
      <div className="flex items-start justify-between gap-md flex-wrap mb-lg">
        <div>
          <h1 className="font-headline-md lg:font-headline-lg text-on-surface">Alerts</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Cronologia delle notifiche mostrate
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadHistory}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant active:scale-95"
            aria-label="Aggiorna cronologia"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Aggiorna
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-error/10 hover:text-error rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant active:scale-95"
              aria-label="Cancella cronologia"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Cancella
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="font-body-md text-on-surface-variant">Caricamento...</p>
      ) : history.length === 0 ? (
        <div className="text-center py-xl">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
            notifications_none
          </span>
          <p className="font-body-md text-on-surface-variant mt-2">
            Nessuna notifica mostrata finora
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Cronologia notifiche">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-body-lg text-on-surface font-medium truncate">
                  {entry.title}
                </span>
                <span className="font-label-sm text-on-surface-variant shrink-0">
                  {formatShownAt(entry.shownAt)}
                </span>
              </div>
              {entry.body && (
                <p className="font-body-md text-on-surface-variant mt-1">{entry.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-xl h-full lg:flex lg:flex-col">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <FadeIn>{content}</FadeIn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>{content}</FadeIn>
      </div>
    </div>
  );
}
