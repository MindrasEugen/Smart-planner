/**
 * Agenda Page secondo Google Stitch Cognitive Protocol
 * Layout responsive: Mobile e Desktop
 */

import { FadeIn } from '../components/Animations';
import AgendaView from '../components/AgendaView/AgendaView.jsx';

export default function AgendaPage() {
  return (
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-0 h-full lg:flex lg:flex-col">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <FadeIn>
          <AgendaView />
        </FadeIn>
      </div>
      
      {/* Desktop layout */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>
          <AgendaView />
        </FadeIn>
      </div>
    </div>
  );
}
