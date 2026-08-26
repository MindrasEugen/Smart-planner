/**
 * Settings Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 */

import { useCallback, useEffect, useState } from 'react';
import { FadeIn } from '../components/Animations';
import FeedbackForm from '../components/Feedback/FeedbackForm.jsx';
import { useInstallPrompt } from '../components/InstallBanner/useInstallPrompt.js';
import Avatar from '../components/Avatar/Avatar.jsx';
import AvatarPicker from '../components/Avatar/AvatarPicker.jsx';
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../../logic/notifications/browser.js';
import { showToast } from '../../logic/notifications/toast.js';
import {
  getTheme,
  setTheme,
  getVibrationEnabled,
  setVibrationEnabled,
  getSilentNotifications,
  setSilentNotifications,
  setPushEnabled,
  getPushSubscribed,
  getAvatar,
  setAvatar,
} from '../../logic/preferences.js';
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  getExistingPushSubscription,
} from '../../logic/notifications/push.js';
import {
  isSyncConfigured,
  syncSubscriptionToServer,
  deleteSubscriptionFromServer,
} from '../../logic/notifications/sync.js';

const THEME_OPTIONS = [
  { value: 'light', label: 'Chiaro', icon: 'light_mode' },
  { value: 'dark', label: 'Scuro', icon: 'dark_mode' },
  { value: 'system', label: 'Sistema', icon: 'contrast' },
];

const CHECKBOX_CLASS =
  'w-5 h-5 rounded border border-outline text-primary focus:ring-2 focus:ring-primary/20';

/** Safari iOS espone `navigator.standalone`; nessun altro browser lo definisce. */
const isIOS = typeof navigator !== 'undefined' && navigator.standalone !== undefined;

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
 * Sezione per scegliere l'avatar del profilo: sostituisce il placeholder
 * generico ("person" grigio) mostrato in TopAppBar/DesktopTopAppBar.
 * Salvato in localStorage (nessun account/login nel progetto, vedi
 * PLAN.md — ROAD-07): stesso meccanismo di tema/vibrazione sopra.
 * @returns {JSX.Element} Sezione impostazioni avatar
 */
function ProfileSettings() {
  const [avatarId, setAvatarId] = useState(() => getAvatar());
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelect = useCallback((id) => {
    setAvatar(id);
    setAvatarId(id);
    setPickerOpen(false);
  }, []);

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Immagine profilo</h2>
      <p className="text-sm text-on-surface-variant mt-2">
        Scegli un avatar per il tuo profilo, al posto dell&apos;icona generica.
      </p>

      <div className="flex items-center gap-4 mt-4">
        <Avatar size="lg" />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="px-4 py-2 bg-primary hover:brightness-90 rounded-xl text-on-primary text-sm font-medium transition-colors active:scale-95"
          aria-label="Cambia avatar"
        >
          Cambia avatar
        </button>
      </div>

      <AvatarPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentAvatarId={avatarId}
        onSelect={handleSelect}
      />
    </section>
  );
}

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
          className="mt-4 px-4 py-2 bg-primary hover:brightness-90 rounded-xl text-on-primary text-sm font-medium transition-colors active:scale-95"
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
 * Sezione per attivare le notifiche push (VAPID), consegnate dal backend.
 * A differenza di NotificationSettings sopra (permesso browser, richieste
 * solo mentre l'app e' aperta), queste arrivano anche ad app completamente
 * chiusa e telefono bloccato: e' il canale che risolve BUG-01.
 * Nascosta del tutto se il build non ha un backend configurato
 * (VITE_SYNC_API_URL/VITE_SYNC_SECRET) o se il browser non supporta la Push API.
 * @returns {JSX.Element | null} Sezione notifiche push, o null se non disponibile
 */
function PushNotificationsSettings() {
  const [permission, setPermission] = useState(() => getNotificationPermission());
  const [subscribed, setSubscribedState] = useState(() => getPushSubscribed());
  const [loading, setLoading] = useState(false);

  const handleEnable = useCallback(async () => {
    setLoading(true);
    try {
      let currentPermission = permission;
      if (currentPermission !== 'granted') {
        const result = await requestNotificationPermission();
        currentPermission = result;
        setPermission(result);
        if (result !== 'granted') {
          showToast('Serve il permesso notifiche per attivare i promemoria push', 'error');
          return;
        }
      }
      const subscription = await subscribeToPush();
      await syncSubscriptionToServer(subscription);
      setPushEnabled(true);
      setSubscribedState(true);
      showToast('Notifiche push attivate', 'success');
    } catch (e) {
      console.error('Errore attivazione notifiche push:', e);
      showToast("Errore nell'attivazione delle notifiche push", 'error');
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const handleDisable = useCallback(async () => {
    setLoading(true);
    try {
      const subscription = await getExistingPushSubscription();
      await unsubscribeFromPush();
      if (subscription) {
        await deleteSubscriptionFromServer(subscription.endpoint);
      }
      setPushEnabled(false);
      setSubscribedState(false);
      showToast('Notifiche push disattivate', 'info');
    } catch (e) {
      console.error('Errore disattivazione notifiche push:', e);
      showToast('Errore nella disattivazione delle notifiche push', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isSyncConfigured() || !isPushSupported()) return null;

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">
        Notifiche push (anche ad app chiusa)
      </h2>
      <p className="text-sm text-on-surface-variant mt-2">
        A differenza delle notifiche normali, queste arrivano anche col telefono
        bloccato o l&apos;app completamente chiusa.
      </p>

      <p className="text-sm bg-warning/10 text-warning rounded-lg px-3 py-2 mt-3 flex items-start gap-2">
        <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
        <span>
          Su alcuni telefoni Android, se il risparmio energetico limita l&apos;app in
          background, le notifiche possono arrivare in ritardo o non arrivare affatto.
          Se non le ricevi a schermo spento, controlla le impostazioni batteria del
          telefono (di solito Impostazioni → App → Chrome, o il nome di questa app se
          installata → Batteria) e imposta &quot;Nessuna restrizione&quot;.
        </span>
      </p>

      <button
        type="button"
        onClick={subscribed ? handleDisable : handleEnable}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-colors active:scale-95 disabled:opacity-60 ${
          subscribed
            ? 'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-variant'
            : 'bg-primary hover:brightness-90 text-on-primary'
        }`}
        aria-label={subscribed ? 'Disattiva le notifiche push' : 'Attiva le notifiche push'}
      >
        {subscribed ? 'Disattiva' : 'Attiva notifiche push'}
      </button>
    </section>
  );
}

/**
 * Sezione preferenze utente: tema, vibrazione e notifiche silenziose.
 * Persistite in localStorage, coerente con l'architettura local-first del progetto.
 * @returns {JSX.Element} Sezione preferenze
 */
function PreferencesSettings() {
  const [theme, setThemeState] = useState(() => getTheme());
  const [vibrationEnabled, setVibrationEnabledState] = useState(() => getVibrationEnabled());
  const [silent, setSilentState] = useState(() => getSilentNotifications());

  const handleThemeChange = useCallback((value) => {
    setTheme(value);
    setThemeState(value);
  }, []);

  const handleVibrationChange = useCallback((e) => {
    const enabled = e.target.checked;
    setVibrationEnabled(enabled);
    setVibrationEnabledState(enabled);
    // Anteprima immediata, solo se il dispositivo la supporta davvero
    if (enabled && 'vibrate' in navigator) navigator.vibrate(100);
  }, []);

  const handleSilentChange = useCallback((e) => {
    const value = e.target.checked;
    setSilentNotifications(value);
    setSilentState(value);
  }, []);

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Preferenze</h2>

      <div className="mt-4">
        <span className="block text-sm text-on-surface-variant mb-2">Tema</span>
        <div className="flex gap-2">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleThemeChange(opt.value)}
              aria-pressed={theme === opt.value}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-sm transition-colors active:scale-95 ${
                theme === opt.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant border border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer mt-6">
        <input
          type="checkbox"
          className={CHECKBOX_CLASS}
          checked={vibrationEnabled}
          onChange={handleVibrationChange}
        />
        <span className="text-sm text-on-surface">
          Vibrazione per le notifiche
          <span className="block text-xs text-on-surface-variant">
            Solo su mobile, se supportata dal browser
          </span>
        </span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer mt-4">
        <input
          type="checkbox"
          className={CHECKBOX_CLASS}
          checked={silent}
          onChange={handleSilentChange}
        />
        <span className="text-sm text-on-surface">
          Notifiche silenziose
          <span className="block text-xs text-on-surface-variant">
            Disattiva il suono di sistema delle notifiche
          </span>
        </span>
      </label>
    </section>
  );
}

/**
 * Sezione per installare l'app come PWA, sempre raggiungibile da qui
 * anche se l'utente ha già chiuso l'InstallBanner in precedenza.
 * @returns {JSX.Element | null} Sezione installazione, o null se già installata
 */
function InstallSettings() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  if (isInstalled) return null;

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Installa l&apos;app</h2>

      {isInstallable ? (
        <>
          <p className="text-sm text-on-surface-variant mt-2">
            Installa Agenda Intelligente per un accesso rapido e notifiche più
            affidabili.
          </p>
          <button
            type="button"
            onClick={promptInstall}
            className="mt-4 px-4 py-2 bg-primary hover:brightness-90 rounded-xl text-on-primary text-sm font-medium transition-colors active:scale-95"
            aria-label="Installa l'app"
          >
            Installa
          </button>
        </>
      ) : (
        <p className="text-sm text-on-surface-variant mt-2">
          {isIOS
            ? 'Su Safari: tocca l\'icona di condivisione, poi "Aggiungi a Home". Le notifiche sono affidabili solo dopo l\'installazione.'
            : 'Il tuo browser non offre l\'installazione automatica: cerca "Aggiungi a schermata Home" o "Installa app" nel menu del browser.'}
        </p>
      )}
    </section>
  );
}

/**
 * Novità recenti mostrate nella sezione "Novità". Voce più recente in cima.
 * Aggiungere/rimuovere una voce qui aggiorna la sezione: nessun JSX da toccare altrove.
 * @type {Array<{ titolo: string, descrizione: string, data: string }>}
 */
const RECENT_UPDATES = [
  {
    titolo: 'Quick Add con AI',
    descrizione:
      "Scrivi una frase libera e l'AI crea il task per te. Se specifichi data e ora, viene salvato subito (con un tasto Annulla se ti sei sbagliato); altrimenti puoi rivederlo prima di salvare.",
    data: '27 Ago 2026',
  },
  {
    titolo: 'Dashboard più utile',
    descrizione:
      'Le categorie in Dashboard (Alta/Media/Bassa priorità, Scadenze imminenti) sono ora cliccabili e ti portano dritto in Agenda con il filtro giusto già impostato.',
    data: '27 Ago 2026',
  },
  {
    titolo: 'Corretti alcuni problemi su mobile',
    descrizione:
      'La barra di navigazione in basso ora resta sempre visibile, anche mentre crei un nuovo task. La lista "Scadenze Imminenti" è più leggibile su schermi piccoli.',
    data: '27 Ago 2026',
  },
];

/**
 * Sezione statica con le ultime novità del progetto.
 * Contenuto pilotato da {@link RECENT_UPDATES}.
 * @returns {JSX.Element} Sezione "Novità"
 */
function RecentUpdatesSettings() {
  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Novità</h2>
      <p className="text-sm text-on-surface-variant mt-2">
        Le ultime cose aggiunte o corrette nell&apos;app.
      </p>

      <ul className="mt-4 space-y-4">
        {RECENT_UPDATES.map((update) => (
          <li key={update.titolo}>
            <div className="flex items-center flex-wrap gap-2">
              <p className="text-sm font-medium text-on-surface">{update.titolo}</p>
              <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">
                {update.data}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">{update.descrizione}</p>
          </li>
        ))}
      </ul>
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
    titolo: 'Profili utente personali',
    descrizione:
      'Registrazione, login e sincronizzazione dei tuoi dati su più dispositivi. In arrivo per fine settembre.',
    stato: 'In arrivo',
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
 * Contenuto pilotato da {@link UPCOMING_FEATURES}.
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
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-0 h-full lg:flex lg:flex-col">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <FadeIn>
          <h1 className="font-headline-md text-on-surface">Impostazioni</h1>
          <ProfileSettings />
          <NotificationSettings />
          <PushNotificationsSettings />
          <PreferencesSettings />
          <InstallSettings />
          <FeedbackForm />
          <RecentUpdatesSettings />
          <ComingSoonSettings />
        </FadeIn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>
          <h1 className="font-headline-lg text-on-surface mb-xl">Impostazioni</h1>
          <ProfileSettings />
          <NotificationSettings />
          <PushNotificationsSettings />
          <PreferencesSettings />
          <InstallSettings />
          <FeedbackForm />
          <RecentUpdatesSettings />
          <ComingSoonSettings />
        </FadeIn>
      </div>
    </div>
  );
}
