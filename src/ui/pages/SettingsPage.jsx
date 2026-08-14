/**
 * Settings Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 */

import { useCallback, useEffect, useState } from 'react';
import { FadeIn } from '../components/Animations';
import FeedbackForm from '../components/Feedback/FeedbackForm.jsx';
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

/**
 * Funzionalità in arrivo mostrate nella sezione "Prossimamente".
 * Aggiungere/rimuovere una voce qui aggiorna la sezione: nessun JSX da toccare altrove.
 * @type {Array<{ titolo: string, descrizione: string, stato: string }>}
 */
const UPCOMING_FEATURES = [
  {
    titolo: 'Quick add intelligente',
    descrizione:
      "Crea un task scrivendo una frase libera: l'AI pre-compila titolo, data, ora e importanza.",
    stato: 'In valutazione',
  },
  {
    titolo: 'Feedback dall’app',
    descrizione: "Segnala un bug o proponi un'idea direttamente da qui, senza uscire dall'app.",
    stato: 'In arrivo',
  },
  {
    titolo: 'Annunci discreti',
    descrizione:
      "Spazi pubblicitari limitati, pensati per sostenere lo sviluppo senza appesantire l'esperienza.",
    stato: 'In valutazione',
  },
  {
    titolo: 'Profili utente personali',
    descrizione: 'Sincronizzazione dei tuoi dati su più dispositivi.',
    stato: 'In valutazione',
  },
];

/**
 * Stile del badge per ciascuno stato: nuovi valori di `stato` ricadono sul default.
 * @type {Record<string, string>}
 */
const UPCOMING_STATO_STYLES = {
  'In arrivo': 'bg-primary/10 text-primary',
  'In valutazione': 'bg-surface-container-highest text-on-surface-variant',
};

/**
 * Sezione statica che informa sulle prossime evoluzioni del progetto.
 * Contenuto pilotato da {@link UPCOMING_FEATURES}: nessuna data precisa, linguaggio volutamente vago.
 * @returns {JSX.Element} Sezione "Prossimamente"
 */
function ComingSoonSettings() {
  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Prossimamente</h2>
      <p className="text-sm text-on-surface-variant mt-2">
        Alcune idee su cui stiamo lavorando. Tempi e dettagli possono cambiare.
      </p>

      <ul className="mt-4 space-y-4">
        {UPCOMING_FEATURES.map((feature) => (
          <li key={feature.titolo}>
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-sm font-medium text-on-surface">{feature.titolo}</p>
              <span
                className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm ${
                  UPCOMING_STATO_STYLES[feature.stato] ?? UPCOMING_STATO_STYLES['In valutazione']
                }`}
              >
                {feature.stato}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">{feature.descrizione}</p>
          </li>
        ))}
      </ul>
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
          <FeedbackForm />
          <ComingSoonSettings />
        </FadeIn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>
          <h1 className="font-headline-lg text-on-surface mb-xl">Impostazioni</h1>
          <NotificationSettings />
          <FeedbackForm />
          <ComingSoonSettings />
        </FadeIn>
      </div>
    </div>
  );
}
