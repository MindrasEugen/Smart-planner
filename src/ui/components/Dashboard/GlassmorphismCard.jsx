/**
 * Glassmorphism Card - Card con effetto vetro per compleanni
 * Secondo Google Stitch Cognitive Protocol
 */

/**
 * Card glassmorphism per prossimo compleanno
 * @param {Object} props
 * @param {Object} props.birthday - Oggetto compleanno
 * @returns {JSX.Element} Card con effetto glassmorphism
 */
export default function GlassmorphismCard({ birthday }) {
  // Formatta data
  const formattedDate = new Date(birthday.dueDate).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });

  return (
    <section className="animate-fade-in-delay-3">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">
        Prossimi Eventi
      </h2>
      <div 
        className="bg-primary-container/5 backdrop-blur-sm rounded-xl border border-primary-container/10 p-lg relative overflow-hidden flex items-center justify-between hover-scale"
        style={{ minHeight: '100px' }}
      >
        {/* Icona cake decorativa */}
        <div className="absolute -right-4 -top-4 opacity-10">
          <span 
            className="material-symbols-outlined"
            style={{ fontSize: '100px' }}
          >
            cake
          </span>
        </div>
        
        <div className="z-1">
          <p className="font-label-sm text-label-sm text-primary-container mb-1">
            {formattedDate}
          </p>
          <h4 className="font-headline-md text-headline-md text-on-surface">
            Compleanno di {birthday.personName}
          </h4>
          {birthday.description && (
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {birthday.description}
            </p>
          )}
        </div>
        
        {/* Freccia */}
        <button 
          className="bg-surface-container-lowest p-2 rounded-full border border-outline-variant shadow-sm active:scale-95 transition-transform z-10"
          aria-label="Vedi dettagli"
        >
          <span className="material-symbols-outlined text-primary-container text-[20px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}
