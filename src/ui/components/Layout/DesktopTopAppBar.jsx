/**
 * Top App Bar per Desktop
 * Secondo Google Stitch Cognitive Protocol - Desktop Layout
 * Visibile solo su schermi >= lg (1024px)
 */

import { useLocation, Link } from 'react-router-dom';

/**
 * DesktopTopAppBar - Top bar per desktop (solo parte destra)
 * @returns {JSX.Element} Top bar con ricerca e azioni
 */
export default function DesktopTopAppBar() {
  const location = useLocation();
  const isAlertsActive = location.pathname === '/alerts';
  const isSettingsActive = location.pathname === '/settings';

  // Mappa route a titolo
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/agenda') return 'Agenda';
    if (path === '/alerts') return 'Alerts';
    if (path === '/settings') return 'Settings';
    if (path === '/tasks') return 'Tasks';
    if (path === '/filters') return 'Filters';
    if (path.startsWith('/create/')) return 'Nuovo';
    if (path.startsWith('/edit/')) return 'Modifica';
    return 'Agenda Intelligente';
  };
  
  return (
    <header className="hidden lg:flex fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center h-16 px-xl border-b border-outline-variant">
      {/* Brand + Titolo pagina */}
      <div className="flex items-baseline gap-md">
        <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Agenda
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          {getPageTitle()}
        </span>
      </div>

      {/* Azioni a destra */}
      <div className="flex items-center gap-lg">
        {/* Search */}
        <div className="relative hidden xl:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            className="bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
            placeholder="Cerca..."
            aria-label="Cerca"
          />
        </div>

        {/* Notifiche */}
        <Link
          to="/alerts"
          className={`no-underline transition-colors scale-98 active:opacity-80 ${
            isAlertsActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="Notifiche"
          aria-current={isAlertsActive ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-xl" data-icon="notifications">
            notifications
          </span>
        </Link>

        {/* Profilo */}
        <Link
          to="/settings"
          className={`no-underline transition-colors scale-98 active:opacity-80 ${
            isSettingsActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="Account"
          aria-current={isSettingsActive ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-xl" data-icon="account_circle">
            account_circle
          </span>
        </Link>
      </div>
    </header>
  );
}
