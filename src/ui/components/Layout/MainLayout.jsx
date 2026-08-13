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
    <div className="h-screen bg-surface-container-lowest flex overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Salta al contenuto principale
      </a>

      {/* SideNavBar - solo desktop (lg e sopra) */}
      <SideNavBar />

      {/* TopAppBar - solo mobile, sticky top-0 full width */}
      <TopAppBar />

      {/* Container principale per desktop - flex-1 ml-64 */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen relative">
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
          className="flex-1 pt-16 lg:pt-0 lg:mt-16 pb-48 lg:pb-0 overflow-y-auto lg:overflow-visible"
        >
          <div className="h-full min-h-full">
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
