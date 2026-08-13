/**
 * Top App Bar secondo Google Stitch Cognitive Protocol
 * Mobile only (< lg), fixed top, branding e navigazione
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileSideNav from './MobileSideNav';

export default function TopAppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isCalendarActive = pathname === '/' || pathname.startsWith('/agenda');

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <>
      <header className="lg:hidden bg-surface-container-lowest dark:bg-surface-dim w-full fixed top-0 z-50 border-b border-outline-variant h-16">
        {/* px-5 py-2: dimensioni dei pulsanti fissate esplicitamente
            (w-11 h-11 / w-10 h-10) invece di derivarle da padding + icona.
            Il font Material Symbols arriva da un <link> esterno non
            racchiuso in un @layer Tailwind, quindi la sua regola
            `.material-symbols-outlined { font-size: 24px; line-height: 1 }`
            batte sempre le utility `text-lg` (stesso bug di cascata dei
            layer già visto altrove nel progetto) — l'icona finisce sempre
            a 24px reali indipendentemente dalla classe di dimensione
            applicata, quindi calcolare l'altezza dal padding non è
            affidabile. Con dimensioni fisse la riga resta entro h-16 (64px)
            a prescindere da come il font renderizza l'icona al suo interno. */}
        <div className="flex justify-between items-center px-5 py-2">
          <button
            onClick={handleMenuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-sidenav"
            aria-label="Apri menu principale"
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors active:scale-95 touch-target"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-on-surface text-lg">
              menu
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-variant dark:bg-surface-container-highest border border-outline-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant dark:text-on-surface text-lg">
                person
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim m-0">
              Oggi
            </h1>
          </div>

          <Link
            to="/agenda"
            className={`no-underline w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
              isCalendarActive
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest'
            }`}
            aria-label="Vai al calendario"
            aria-current={isCalendarActive ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </Link>
        </div>
      </header>

      <MobileSideNav isOpen={isMenuOpen} onClose={handleMenuClose} />
    </>
  );
}
