/**
 * Quick Stats - Stats narrative secondo Google Stitch Cognitive Protocol
 * Mostra: Task completati oggi, In sospeso con CTA
 */

import { Link } from 'react-router-dom';
import { useAgenda } from '../../../logic/hooks.js';

/**
 * Chip stato rapido per Dashboard con messaggi narrativi
 * @returns {JSX.Element} Sezione con chip stato e CTA
 */
export default function QuickStats() {
  const { items } = useAgenda();

  // Calcola conteggi
  const completedToday = items.filter(item =>
    item.status === 'COMPLETED' &&
    new Date(item.completedAt || item.dueDate).toDateString() === new Date().toDateString()
  ).length;
  const pendingCount = items.filter(item => item.status === 'PENDING').length;

  return (
    // In colonne strette (sidebar desktop, lg:col-span-3) le chip a pillola
    // orizzontali pensate per il mobile andrebbero in overlap col testo che
    // va a capo: da lg diventano card impilate verticalmente.
    <section className="flex flex-wrap gap-sm lg:flex-col lg:flex-nowrap lg:gap-md mb-xl animate-fade-in">
      {/* Task completati oggi - Messaggio narrante */}
      <div className="bg-tertiary-container/10 border border-tertiary-container/20 rounded-full lg:rounded-xl px-4 py-2 lg:p-lg flex items-center lg:flex-col lg:items-start gap-2">
        <span className="material-symbols-outlined text-tertiary-container text-lg">check_circle</span>
        <span className="font-headline-md text-headline-md text-tertiary-container">
          {completedToday > 0
            ? `Hai completato ${completedToday} task oggi`
            : 'Nessun task completato oggi'}
        </span>
      </div>

      {/* In sospeso - Messaggio narrante + CTA */}
      <div className="bg-surface-container-highest border border-outline-variant rounded-full lg:rounded-xl px-4 py-2 lg:p-lg flex items-center lg:flex-col lg:items-start gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-lg">pending</span>
        <span className="font-headline-md text-headline-md text-on-surface-variant">
          {pendingCount > 0
            ? `${pendingCount} task in sospeso`
            : 'Nessun task in sospeso'}
        </span>
        <Link
          to="/create/task"
          className="no-underline ml-2 lg:ml-0 lg:mt-sm bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm hover:brightness-90 transition-colors"
        >
          + Nuovo Task
        </Link>
      </div>
    </section>
  );
}
