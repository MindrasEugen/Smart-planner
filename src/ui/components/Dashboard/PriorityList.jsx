/**
 * Priority List - Lista alta priorità secondo Google Stitch
 * Lista verticale con border colorati
 */

import { getTimeStatus } from '../../../logic/time/status.js';
import { formatTime } from '../../../logic/time/timezone.js';

/**
 * Lista elementi ad alta priorità
 * @param {Object} props
 * @param {Array} props.items - Array di item ad alta priorità
 * @returns {JSX.Element} Sezione con lista priorità
 */
export default function PriorityList({ items }) {
  if (items.length === 0) return null;

  return (
    <section className="animate-fade-in-delay-2">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
        Alta Priorità
      </h2>
      <div className="space-y-sm">
        {items.map((item) => {
          const timeStatus = getTimeStatus(item);
          const isCompleted = item.status === 'COMPLETED';
          
          // Colore strip in base all'importanza
          let stripColor = 'bg-primary';
          if (item.importance === 'HIGH') stripColor = 'bg-secondary-container';
          if (item.importance === 'MEDIUM') stripColor = 'bg-surface-tint';
          if (item.importance === 'LOW') stripColor = 'bg-tertiary-container';

          // Formatta data
          const formattedDate = new Date(item.dueDate).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit'
          });
          const formattedTime = formatTime(item.dueTime);

          return (
            <div 
              key={item.id}
              className={`bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex items-center gap-md active:scale-95 transition-transform duration-200 hover-lift ${
                isCompleted ? 'opacity-60' : ''
              }`}
            >
              {/* Strip colorato */}
              <div className={`w-1 h-10 rounded-full ${stripColor}`} />
              
              {/* Checkbox */}
              <div className="w-6 h-6 rounded border border-outline-variant flex-shrink-0 flex items-center justify-center">
                {isCompleted && (
                  <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                )}
              </div>
              
              {/* Contenuto */}
              <div className="flex-grow">
                <h4 className={`font-body-lg text-body-lg font-medium ${
                  isCompleted ? 'text-outline line-through' : 'text-on-surface'
                }`}>
                  {item.title}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Entro {formattedDate} alle {formattedTime}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
