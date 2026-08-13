import { useInstallPrompt } from './useInstallPrompt.js';

/**
 * Banner "Installa App", mobile only. Visibile solo quando il browser
 * ha effettivamente offerto l'evento `beforeinstallprompt` (Chrome/Edge
 * Android — Safari iOS non lo supporta) e l'utente non l'ha gia' chiuso.
 * @returns {JSX.Element | null} Banner installazione o null
 */
export default function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      // mr-24 (96px) riserva lo spazio del FAB (56px + 20px di margine, z-fab: 1000):
      // senza questo margine il pulsante di chiusura finisce sotto il FAB e diventa cliccabile
      className="lg:hidden fixed bottom-16 inset-x-0 z-40 ml-3 mr-24 mb-2 rounded-xl bg-primary-container text-on-primary-container shadow-lg p-3 flex items-center gap-3"
      style={{ marginBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      role="complementary"
      aria-label="Installa l'app"
    >
      <span className="material-symbols-outlined text-[24px]">install_mobile</span>
      <p className="flex-1 mb-0 font-body-md text-body-md font-medium">
        Installa Agenda Intelligente per un accesso rapido e notifiche affidabili
      </p>
      <button
        onClick={promptInstall}
        className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm active:scale-95 shrink-0"
      >
        Installa
      </button>
      <button
        onClick={dismiss}
        className="p-1 hover:bg-primary/10 rounded-full active:scale-95 shrink-0"
        aria-label="Chiudi banner installazione"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
