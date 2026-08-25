/**
 * @typedef {Object} Location
 * @property {string} pathname - Percorso URL
 * @property {string} [search] - Stringa query
 * @property {string} [hash] - Hash URL
 * @property {Object} [state] - Stato di navigazione
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} AgendaHeaderProps
 * @property {Date} currentDate - Data corrente
 * @property {Function} onDateChange - Callback per cambiare data
 * @property {Function} onToday - Callback per andare a oggi
 */

export default function AgendaHeader({
  currentDate,
  onDateChange,
  onToday,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Header principale con data e navigazione.
          lg: come il resto del layout (MainLayout/TopAppBar/BottomNav usano
          tutti lg), non md: altrimenti tra 768 e 1023px questo header passa
          alla riga singola desktop mentre il resto della pagina è ancora in
          modalità mobile. */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-lg gap-md">
        {/* w-full lg:w-auto: senza una larghezza esplicita su mobile, il
            genitore items-start (necessario per non stirare i due gruppi in
            altezza) lascia questo blocco largo quanto il suo contenuto —
            flex-wrap non ha nulla su cui avvolgersi e la riga (data lunga +
            2 pulsanti) eccede il viewport invece di andare a capo.
            justify-center: centra il gruppo (data + Oggi + Scegli data)
            nella riga a piena larghezza invece di lasciarlo allineato a
            sinistra. */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-md w-full lg:w-auto">
          <h1 className="font-headline-md text-on-surface mb-0 text-center">
            {formatDate(currentDate)}
          </h1>
          <button
            onClick={onToday}
            className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant"
            title="Vai a oggi"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            Oggi
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant"
              aria-label="Scegli data"
              title="Scegli data"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              Scegli data
            </button>
            {showDatePicker && (
              <div className="absolute top-full mt-1 z-50">
                <input
                  type="date"
                  value={currentDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    onDateChange(date);
                    setShowDatePicker(false);
                  }}
                  className="px-2 py-1 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Sotto lg: frecce giorno prec./succ. su una riga, "Nuovo Elemento"
            sulla riga sotto (a larghezza piena) — da lg in su restano
            affiancati su un'unica riga, c'è spazio a sufficienza. */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-sm">
          <div className="flex items-center justify-center gap-sm">
            <button
              onClick={() => onDateChange(new Date(currentDate.getTime() - 86400000))}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-high hover:bg-surface-variant border border-outline-variant transition-colors"
              title="Giorno precedente"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_left</span>
            </button>
            <button
              onClick={() => onDateChange(new Date(currentDate.getTime() + 86400000))}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-high hover:bg-surface-variant border border-outline-variant transition-colors"
              title="Giorno successivo"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
            </button>
          </div>
          <Link
            to="/create/task"
            className="no-underline flex items-center justify-center lg:justify-start gap-1 px-4 py-1.5 bg-primary hover:brightness-90 rounded-xl text-on-primary font-label-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nuovo Elemento
          </Link>
        </div>
      </div>
    </>
  );
}
