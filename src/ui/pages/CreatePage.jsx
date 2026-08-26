/**
 * @typedef {import('../../logic/hooks.js').UseAgendaResult} UseAgendaResult
 * @typedef {import('../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgenda } from '../../logic/hooks.js';
import { useToastContext } from '../components/Toast/index.js';
import { FadeIn } from '../components/Animations';
import TaskForm from '../components/Forms/TaskForm.jsx';
import QuickAddInput from '../components/Forms/QuickAddInput.jsx';
import BirthdayForm from '../components/Forms/BirthdayForm.jsx';

/**
 * @typedef {Object} CreatePageProps
 * @property {'task' | 'birthday' | 'edit'} mode - Modalità pagina
 */

export default function CreatePage({ mode }) {
  const [aiDraft, setAiDraft] = useState(null);
  const [draftKey, setDraftKey] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const { items, addTask, deleteItem } = useAgenda();

  const item = id ? items.find((i) => i.id === id) : null;
  const formMode = mode === 'edit' ? 'edit' : 'create';

  const handleAutoSave = (draft) => {
    const task = addTask({
      title: draft.title,
      description: draft.description || undefined,
      dueDate: new Date(draft.dueDate),
      dueTime: draft.dueTime,
      importance: draft.importance,
    });
    addToast(`Task creato: "${task.title}"`, 'success', 8000, {
      label: 'Annulla',
      onClick: () => deleteItem(task.id),
    });
    navigate('/');
  };

  let content;
  if (mode === 'birthday' || (mode === 'edit' && item?.type === 'BIRTHDAY')) {
    content = <BirthdayForm item={item || null} mode={formMode} />;
  } else if (mode === 'task' || (mode === 'edit' && item?.type === 'TASK')) {
    if (mode === 'task' && formMode === 'create') {
      content = (
        <>
          <QuickAddInput
            onDraftReady={(draft) => { setAiDraft(draft); setDraftKey((k) => k + 1); }}
            onAutoSave={handleAutoSave}
          />
          <TaskForm item={item || null} mode={formMode} initialData={aiDraft} key={draftKey} />
        </>
      );
    } else {
      content = <TaskForm item={item || null} mode={formMode} />;
    }
  } else {
    content = (
      <h1 className="font-headline-md text-on-surface">
        {mode === 'edit' ? 'Modifica' : 'Crea ' + (mode === 'task' ? 'Task' : 'Compleanno')}
      </h1>
    );
  }

  return (
    // Come le altre pagine: il contenitore desktop usa lg:flex-1 + lg:overflow-y-auto
    // per scrollare un form più alto del viewport (main ha lg:overflow-visible,
    // nessun antenato scrolla altrimenti) — ma lg:flex-1 non ha alcun effetto
    // senza un genitore flex: per questo la root qui sotto ha anche lg:flex
    // lg:flex-col (bug reale trovato in produzione il 2026-08-14, vedi DS-07).
    // NB: niente max-w-3xl qui — in questo progetto `--spacing-3xl: 64px` è
    // un token di spaziatura custom, e max-w-3xl lo risolve come max-width
    // (64px!) invece dei classici 48rem, comprimendo il form a un filo
    // invisibile. Stesso identico contenitore di tutte le altre pagine.
    <div className="px-margin-mobile lg:px-xl py-lg lg:py-xl h-full lg:flex lg:flex-col">
      <div className="lg:hidden">
        <FadeIn>{content}</FadeIn>
      </div>
      <div className="hidden lg:block lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar">
        <FadeIn>{content}</FadeIn>
      </div>
    </div>
  );
}
