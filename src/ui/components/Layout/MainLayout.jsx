/**
 * @typedef {import('react').ReactNode} ReactNode
 */

import { Outlet, useLocation } from 'react-router-dom';
import TopAppBar from './TopAppBar.jsx';
import BottomNav from './BottomNav.jsx';
import FAB from '../Navigation/FAB.jsx';
import SideNavBar from './SideNavBar.jsx';
import DesktopTopAppBar from './DesktopTopAppBar.jsx';
import InstallBanner from '../InstallBanner/InstallBanner.jsx';

/**
 * Layout principale secondo Google Stitch Cognitive Protocol
 * Responsive: Mobile (< lg) e Desktop (>= lg) usando CSS media queries
 * @param {Object} props - Props del componente
 * @param {ReactNode} [props.children] - Componenti figli
 * @returns {JSX.Element} Layout responsive con navigation mobile/desktop
 */
export default function MainLayout({ children }) {
  const location = useLocation();
  
  // Nascondi BottomNav e FAB nelle pagine di creazione/modifica
  const hideNav = location.pathname.startsWith('/create/') || 
                  location.pathname.startsWith('/edit/');

  return (
    // h-dvh (dynamic viewport height) invece di h-screen (100vh): sui browser
    // mobili reali 100vh e' l'altezza col chrome del browser (barra indirizzi)
    // completamente nascosto, quasi mai quella davvero visibile — la shell si
    // dimensiona più alta del viewport reale, tagliando il fondo (BottomNav)
    // fuori dall'area visibile finché l'utente non scrolla il browser stesso.
    <div className="h-dvh bg-surface-container-lowest flex overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Salta al contenuto principale
      </a>

      {/* SideNavBar - solo desktop (lg e sopra) */}
      <SideNavBar />

      {/* TopAppBar - solo mobile, sticky top-0 full width */}
      <TopAppBar />

      {/* Container principale per desktop - flex-1 ml-64.
          min-w-0: senza, è un flex item (figlio della shell radice sopra,
          anch'essa flex) con min-width:auto di default — se il contenuto
          di una pagina ha una larghezza minima naturale maggiore del
          viewport (qui: Agenda con AgendaHeader + ViewToggle + FilterBar,
          misurato 439px di richiesta minima contro 412px di viewport
          reale su Pixel 6), il wrapper rifiuta di restringersi sotto
          quella soglia e l'intero albero eredita quella larghezza,
          tagliata silenziosamente da overflow-hidden sulla shell radice
          invece di andare a capo o restringersi — stesso pattern già
          corretto oggi in ViewToggle/AgendaHeader, ma qui alla radice
          dell'intero layout. Trovato via emulatore Android reale +
          CDP il 2026-08-14, segnalato dall'utente ("il lato destro non è
          centrato, viene tagliato"). */}
      <div className="flex-1 min-w-0 lg:ml-64 flex flex-col h-dvh relative">
        {/* DesktopTopAppBar - solo desktop, fixed top-right */}
        <DesktopTopAppBar />

        {/* Main Content Area.
            pb-48 (192px) su mobile: il FAB (bottom-20 + 56px alto) arriva
            fino a 136px dal fondo, la BottomNav aggiunge il proprio
            safe-area-inset-bottom oltre ai suoi 64px — senza margine
            sufficiente l'ultimo contenuto di ogni pagina scrollabile resta
            permanentemente coperto anche scrollando fino in fondo. */}
        <main
          id="main-content"
          className="flex-1 lg:min-h-0 pt-16 lg:pt-0 lg:mt-16 pb-48 lg:pb-0 overflow-y-auto lg:overflow-visible"
        >
          {/* min-h-full sotto lg, lg:h-full da lg in su — due bisogni
              opposti per lo stesso div:
              - Su mobile serve che CRESCA oltre il viewport quando il
                contenuto è più alto: con h-full fisso (height:100%,
                comportamento precedente) il contenuto in eccesso trabocca
                solo visivamente (overflow:visible, nessun contenitore
                interno scrolla) senza spostare il flusso — pb-48 su
                <main> veniva quindi calcolato rispetto all'altezza di
                LAYOUT di questo div (mai più alta del viewport), non
                rispetto a dove il contenuto finiva davvero. Risultato:
                l'ultimo testo di ogni pagina lunga restava a ~25px dal
                fondo invece dei 192px attesi, coperto da BottomNav/FAB —
                confermato via CDP + emulatore Android reale il
                2026-08-14, non riproducibile con gli strumenti di
                automazione desktop. min-h-full (min-height:100%) risolve
                questo: pagine corte restano comunque alte quanto il
                viewport, pagine lunghe crescono oltre e trascinano pb-48
                con sé nel punto giusto.
              - Su desktop invece serve un'altezza VINCOLATA (di nuovo
                h-full, qui come lg:h-full): DS-07 (stesso giorno) dipende
                da questa catena h-full/min-h-0 per dare al contenitore
                scrollabile di ogni pagina (lg:overflow-y-auto) un'altezza
                reale — con solo min-h-full su desktop il div cresce con
                il contenuto invece di restare vincolato, e lo scroll
                interno smette di funzionare (stesso bug che DS-07 aveva
                corretto altrove). */}
          <div className="min-h-full lg:h-full">
            {children || <Outlet />}
          </div>
        </main>

        {/* FAB - posizione diversa per mobile/desktop */}
        {!hideNav && <FAB />}
      </div>

      {/* Banner "Installa App" - solo mobile, sopra la Bottom Navigation */}
      {!hideNav && <InstallBanner />}

      {/* Bottom Navigation - solo mobile, fixed bottom */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
