/**
 * Side Navigation Bar per Desktop
 * Secondo Google Stitch Cognitive Protocol - Desktop Layout
 * Visibile solo su schermi >= lg (1024px)
 */

import { NavLink } from 'react-router-dom';

/**
 * SideNavBar - Navigazione laterale per desktop
 * @returns {JSX.Element} Sidebar con menu verticale
 */
export default function SideNavBar() {
  return (
    <nav className="hidden lg:flex h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-xl px-md z-50">
      {/* Logo e titolo */}
      <div className="mb-xl px-sm">
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Agenda Intelligente
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Precision Scheduling
        </p>
      </div>

      {/* Menu principale */}
      <div className="flex-1 space-y-sm">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Dashboard"
        >
          <span className="material-symbols-outlined text-xl" data-icon="dashboard">
            dashboard
          </span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </NavLink>

        {/* Agenda */}
        <NavLink
          to="/agenda"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Agenda"
        >
          <span className="material-symbols-outlined text-xl fill" data-icon="calendar_today">
            calendar_today
          </span>
          <span className="font-body-md text-body-md">Agenda</span>
        </NavLink>

        {/* Tasks */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Tasks"
        >
          <span className="material-symbols-outlined text-xl" data-icon="add_task">
            add_task
          </span>
          <span className="font-body-md text-body-md">Tasks</span>
        </NavLink>

        {/* Filters */}
        <NavLink
          to="/filters"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Filters"
        >
          <span className="material-symbols-outlined text-xl" data-icon="filter_list">
            filter_list
          </span>
          <span className="font-body-md text-body-md">Filters</span>
        </NavLink>

        {/* Alerts */}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Alerts"
        >
          <span className="material-symbols-outlined text-xl" data-icon="notifications">
            notifications
          </span>
          <span className="font-body-md text-body-md">Alerts</span>
        </NavLink>
      </div>

      {/* Settings in basso */}
      <div className="mt-auto px-sm pt-xl">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `no-underline flex items-center gap-md px-lg py-md rounded-lg scale-98 transition-transform duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
            }`
          }
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-xl" data-icon="settings">
            settings
          </span>
          <span className="font-body-md text-body-md">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
