/**
 * Bottom Navigation Bar secondo Google Stitch Cognitive Protocol
 * Glassmorphism effect, fixed bottom, mobile only
 */

import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/agenda', icon: 'event_note', label: 'Agenda' },
  { to: '/alerts', icon: 'notifications', label: 'Alerts' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden bg-surface dark:bg-surface-dim fixed bottom-0 w-full z-50 border-t border-outline-variant h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center w-full px-4 h-full">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `no-underline flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-colors active:scale-95 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-dim/50'
              }`
            }
            aria-label={label}
          >
            <span className="material-symbols-outlined text-xl mb-1">{icon}</span>
            <span className="font-label-sm text-label-sm">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
