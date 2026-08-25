import { useState } from 'react';
import FormField from '../Forms/FormField.jsx';
import { showToast } from '../../../logic/notifications/toast.js';

/** Repo GitHub del progetto: destinazione delle issue precompilate */
const GITHUB_REPO = 'MindrasEugen/Smart-planner';

/**
 * Categorie di feedback: ciascuna precompila titolo ed etichetta della issue GitHub.
 * @type {Array<{ value: string, label: string, githubLabel: string, titlePrefix: string }>}
 */
const FEEDBACK_CATEGORIES = [
  { value: 'bug', label: 'Bug', githubLabel: 'bug', titlePrefix: '[Bug] ' },
  {
    value: 'idea',
    label: 'Idea / richiesta funzione',
    githubLabel: 'enhancement',
    titlePrefix: '[Idea] ',
  },
  {
    value: 'tech',
    label: 'Feedback tecnico',
    githubLabel: 'feedback tecnico',
    titlePrefix: '[Feedback tecnico] ',
  },
];

const categoryOptions = [
  { value: '', label: 'Seleziona una categoria...' },
  ...FEEDBACK_CATEGORIES.map(({ value, label }) => ({ value, label })),
];

/**
 * Form di feedback categorizzato: nessun backend, l'invio apre in una nuova tab
 * la creazione di una issue GitHub precompilata (titolo/corpo/etichetta) in base alla categoria.
 * @returns {JSX.Element} Sezione feedback
 */
export default function FeedbackForm() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // `required` sui campi blocca già il submit nativo se vuoti: qui arriva solo dati validi.
  const handleSubmit = (event) => {
    event.preventDefault();

    const selected = FEEDBACK_CATEGORIES.find((c) => c.value === category);
    const params = new URLSearchParams({
      title: selected.titlePrefix,
      body: description.trim(),
      labels: selected.githubLabel,
    });

    window.open(`https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`, '_blank', 'noopener,noreferrer');
    showToast('Issue GitHub aperta in una nuova scheda: completa l’invio da lì', 'success');
    setDescription('');
    setCategory('');
  };

  return (
    <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mt-6">
      <h2 className="text-xl font-semibold text-on-surface">Feedback</h2>
      <p className="text-sm text-on-surface-variant mt-2">
        Segnala un bug o proponi un&apos;idea. L&apos;invio apre una issue precompilata sulla
        nostra pagina GitHub: serve un account GitHub per completarla.
      </p>

      <form onSubmit={handleSubmit} className="mt-4" aria-label="Modulo di feedback">
        <FormField
          label="Categoria"
          type="select"
          name="feedbackCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          required
        />
        <FormField
          label="Descrizione"
          type="textarea"
          name="feedbackDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrivi il problema o l'idea..."
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:brightness-90 rounded-xl text-on-primary text-sm font-medium transition-colors active:scale-95"
          aria-label="Invia feedback su GitHub"
        >
          Invia su GitHub
        </button>
      </form>
    </section>
  );
}
