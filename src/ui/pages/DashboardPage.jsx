/**
 * @typedef {import('../../logic/hooks.js').UseAgendaResult} UseAgendaResult
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgenda } from '../../logic/hooks.js';
import QuickStats from '../components/Dashboard/QuickStats.jsx';
import UpcomingCards from '../components/Dashboard/UpcomingCards.jsx';
import PriorityList from '../components/Dashboard/PriorityList.jsx';
import GlassmorphismCard from '../components/Dashboard/GlassmorphismCard.jsx';
import CalendarWidget from '../components/Dashboard/CalendarWidget.jsx';
import AgendaItemCard from '../components/AgendaItem/AgendaItemCard.jsx';
import FadeIn from '../components/Animations/FadeIn.jsx';

export default function DashboardPage() {
  const { 
    items, 
    upcomingItems, 
    overdueItems, 
    highPriorityItems, 
    birthdays 
  } = useAgenda();
  
  // Stato per il giorno selezionato nel calendario
  const [selectedDate, setSelectedDate] = useState(null);

  const completedItems = items.filter(i => i.status === 'COMPLETED');
  const nextBirthday = birthdays.length > 0 ? birthdays[0] : null;
  
  // Task per il giorno selezionato
  const selectedDateItems = selectedDate 
    ? items.filter(item => {
        const itemDate = new Date(item.dueDate);
        return (
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate()
        );
      })
    : [];
  
  // Formatta la data selezionata per il display
  const formattedSelectedDate = selectedDate 
    ? selectedDate.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    // lg:pt-xl (non lg:pt-0): a differenza di Dashboard, tutte le altre pagine
    // hanno un <h1> il cui margin-bottom crea uno stacco visivo dal
    // DesktopTopAppBar; Dashboard non ha un <h1> desktop, quindi senza
    // padding proprio le card iniziano incollate al bordo della top bar.
    <div className="px-margin-mobile lg:px-xl pt-6 lg:pt-xl pb-8 lg:pb-0 h-full lg:flex lg:flex-col">
      {/* Mobile: layout a colonna singola */}
      <FadeIn>
        <div className="lg:hidden space-y-xl">
          <QuickStats />
          <UpcomingCards items={[...upcomingItems, ...overdueItems].slice(0, 2)} />
          <PriorityList items={highPriorityItems} />
          {nextBirthday && <GlassmorphismCard birthday={nextBirthday} />}
        </div>
      </FadeIn>

      {/* Desktop: layout a 3 colonne */}
      <FadeIn>
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
          <div className="lg:grid lg:grid-cols-12 gap-lg h-full max-w-7xl mx-auto w-full">
            {/* Colonna sinistra: Stats */}
            <div className="lg:col-span-3 flex flex-col gap-xl">
              <QuickStats />
            </div>
            
            {/* Colonna centrale: Calendario (FULCRO VISIVO) + PriorityList */}
            <div className="lg:col-span-6 flex flex-col gap-xl">
              {/* Calendario in evidenza */}
              <div className="bg-surface border border-outline-variant rounded-xl p-lg">
                <CalendarWidget 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate}
                />
              </div>
              
              {/* PriorityList */}
              <PriorityList items={highPriorityItems} />
              
              {/* Task del giorno selezionato */}
              {selectedDate && (
                <FadeIn>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
                    <div className="flex justify-between items-center mb-md">
                      <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        Task per {formattedSelectedDate}
                      </h3>
                      <Link 
                        to="/create/task" 
                        state={{ suggestedDate: selectedDate.toISOString() }}
                        className="no-underline bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm hover:bg-primary-container transition-colors"
                      >
                        + Aggiungi
                      </Link>
                    </div>
                    {selectedDateItems.length > 0 ? (
                      <div className="space-y-sm">
                        {selectedDateItems.map(item => (
                          <AgendaItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant text-center py-lg">
                        Nessun task per questo giorno
                      </p>
                    )}
                  </div>
                </FadeIn>
              )}
            </div>
            
            {/* Colonna destra: Upcoming */}
            <div className="lg:col-span-3 flex flex-col gap-xl">
              <UpcomingCards items={[...upcomingItems, ...overdueItems].slice(0, 2)} />
              {nextBirthday && <GlassmorphismCard birthday={nextBirthday} />}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
