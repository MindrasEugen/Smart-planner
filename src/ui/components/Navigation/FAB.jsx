/**
 * Floating Action Button secondo Google Stitch Cognitive Protocol
 * 56x56px, circular, shadow, fixed bottom-right
 */

import { Link } from 'react-router-dom';

/**
 * Floating Action Button
 * @returns {JSX.Element} Pulsante galleggiante per aggiungere
 */
export default function FAB() {
  return (
    <Link 
      to="/create/task" 
      className="no-underline fixed bottom-20 right-margin-mobile lg:bottom-lg lg:right-lg w-[56px] h-[56px] bg-primary text-on-primary rounded-full shadow-fab flex items-center justify-center z-fab hover:brightness-90 active:scale-95 transition-all group"
      aria-label="Aggiungi nuovo task"
      title="Nuovo Task"
    >
      <span className="material-symbols-outlined text-2xl">add</span>
    </Link>
  );
}
