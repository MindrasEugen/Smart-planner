/**
 * Mobile Side Navigation - Menu hamburger per schermi <640px
 * Secondo Google Stitch Cognitive Protocol
 */

import { useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/agenda', icon: 'calendar_today', label: 'Agenda' },
  { to: '/tasks', icon: 'add_task', label: 'Tasks' },
  { to: '/filters', icon: 'filter_list', label: 'Filters' },
  { to: '/alerts', icon: 'notifications', label: 'Alerts' },
];

const bottomNavItems = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

/**
 * MobileSideNav - Menu laterale per mobile
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Stato di apertura del menu
 * @param {Function} props.onClose - Callback per chiudere il menu
 * @returns {JSX.Element} Menu laterale per mobile
 */
export default function MobileSideNav({ isOpen, onClose }) {
  const navId = 'mobile-sidenav';
  const menuRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && menuRef.current) {
      const focusable = menuRef.current.querySelectorAll('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const first = menuRef.current.querySelector('a[href]');
      if (first) first.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Chiudi menu"
      />
      <div
        id={navId}
        ref={menuRef}
        className="fixed left-0 top-0 h-full w-64 bg-surface dark:bg-surface-dim z-50 shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0"
        aria-label="Menu principale"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="flex flex-col h-full py-xl px-md">
          <div className="mb-xl px-sm">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Agenda Intelligente
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
              Precision Scheduling
            </p>
          </div>
          <div className="flex-1 space-y-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `no-underline flex items-center gap-md px-lg py-md rounded-lg font-bold scale-98 transition-transform duration-200 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest transition-colors'
                  }`
                }
                aria-label={item.label}
                onClick={onClose}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="mt-auto px-sm pt-xl">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest transition-colors'
                  }`
                }
                aria-label={item.label}
                onClick={onClose}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
