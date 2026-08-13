/**
 * @typedef {import('../../logic/hooks.js').UseAgendaResult} UseAgendaResult
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useParams } from 'react-router-dom';
import { useAgenda } from '../../logic/hooks.js';
import { FadeIn } from '../components/Animations';
import TaskForm from '../components/Forms/TaskForm.jsx';
import BirthdayForm from '../components/Forms/BirthdayForm.jsx';

/**
 * @typedef {Object} CreatePageProps
 * @property {'task' | 'birthday' | 'edit'} mode - Modalità pagina
 */

export default function CreatePage({ mode }) {
  const { id } = useParams();
  const { items } = useAgenda();

  const item = id ? items.find((i) => i.id === id) : null;
  const formMode = mode === 'edit' ? 'edit' : 'create';

  let content;
  if (mode === 'birthday' || (mode === 'edit' && item?.type === 'BIRTHDAY')) {
    content = <BirthdayForm item={item || null} mode={formMode} />;
  } else if (mode === 'task' || (mode === 'edit' && item?.type === 'TASK')) {
    content = <TaskForm item={item || null} mode={formMode} />;
  } else {
    content = (
      <h1 className="font-headline-md text-on-surface">
        {mode === 'edit' ? 'Modifica' : 'Crea ' + (mode === 'task' ? 'Task' : 'Compleanno')}
      </h1>
    );
  }

  return (
    // Come le altre pagine: senza il contenitore lg:overflow-y-auto un form
    // più alto del viewport resta bloccato (main ha lg:overflow-visible,
    // nessun antenato scrolla) e i campi/pulsanti oltre il fondo sono
    // irraggiungibili su desktop.
    // NB: niente max-w-3xl qui — in questo progetto `--spacing-3xl: 64px` è
    // un token di spaziatura custom, e max-w-3xl lo risolve come max-width
    // (64px!) invece dei classici 48rem, comprimendo il form a un filo
    // invisibile. Stesso identico contenitore di tutte le altre pagine.
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-xl h-full">
      <div className="lg:hidden">
        <FadeIn>{content}</FadeIn>
      </div>
      <div className="hidden lg:block lg:flex-1 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>{content}</FadeIn>
      </div>
    </div>
  );
}
