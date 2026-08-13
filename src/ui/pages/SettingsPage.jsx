/**
 * Settings Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 */

import { useCallback, useEffect, useState } from 'react';
import { FadeIn } from '../components/Animations';
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../../logic/notifications/browser.js';
import { showToast } from '../../logic/notifications/toast.js';

/**
 * Etichette leggibili per lo stato del permesso notifiche
 * @type {Record<string, { label: string, className: string }>}
 */
const PERMISSION_LABELS = {
  granted: { label: 'Attive', className: 'text-success' },
  denied: { label: 'Bloccate dal browser', className: 'text-error' },
  default: { label: 'Non ancora autorizzate', className: 'text-on-surface-variant' },
  unsupported: { label: 'Non supportate su questo browser', className: 'text-error' },
};

/**
 * Sezione per abilitare le notifiche di sistema.
 * Senza il permesso concesso l'app ricade sui toast, quindi i promemoria
 * non compaiono quando l'app non e' in primo piano.
 * @returns {JSX.Element} Sezione impostazioni notifiche
 */
function NotificationSettings() {
  const [permission, setPermission] = useState(() => getNotificationPermission());

  // Il permesso puo' cambiare dalle impostazioni del browser
  useEffect(() => {
    const onVisibilityChange = () => setPermission(getNotificationPermission());
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const handleRequest = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(getNotificationPermission());

    if (result === 'granted') {
      showToast('Notifiche attivate', 'success');
    } else if (result === 'denied') {
      showToast('Notifiche bloccate: autorizzale dalle impostazioni del browser', 'error');
    }
  }, []);

  const status = PERMISSION_LABELS[permission] ?? PERMISSION_LABELS.default;
  const canRequest = permission === 'default';

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Notifiche</h2>
      <p className="text-sm text-on-surface-variant mt-2">
        Stato: <span className={status.className}>{status.label}</span>
      </p>
      <p className="text-sm text-on-surface-variant mt-2">
        Senza autorizzazione i promemoria compaiono solo come messaggi
        nell&apos;app, mentre e&apos; aperta.
      </p>

      {canRequest && (
        <button
          type="button"
          onClick={handleRequest}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary-container rounded-xl text-on-primary text-sm font-medium transition-colors active:scale-95"
          aria-label="Abilita le notifiche di sistema"
        >
          Abilita notifiche
        </button>
      )}

      {permission === 'denied' && (
        <p className="text-sm text-on-surface-variant mt-4">
          Il browser ha bloccato le notifiche per questo sito: riattivale
          dall&apos;icona del lucchetto nella barra degli indirizzi.
        </p>
      )}
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-0 h-full">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <FadeIn>
          <h1 className="font-headline-md text-on-surface">Impostazioni</h1>
          <NotificationSettings />
        </FadeIn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>
          <h1 className="font-headline-lg text-on-surface mb-xl">Impostazioni</h1>
          <NotificationSettings />
        </FadeIn>
      </div>
    </div>
  );
}
