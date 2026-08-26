/**
 * QuickAddInput: componente per estrarre dati da testo libero via AI
 * Integra il componente nel flusso di creazione task su CreatePage.jsx
 */

import { useState } from 'react';
import { isQuickAddConfigured, requestQuickAdd } from '../../../logic/ai/quickAdd.js';

/**
 * @typedef {Object} QuickAddInputProps
 * @property {Function} onDraftReady - Callback chiamata con l'oggetto draft quando estrazione ha successo
 */

/**
 * Componente per generare draft di task da testo libero tramite AI
 * @param {QuickAddInputProps} props
 * @returns {JSX.Element | null}
 */
export default function QuickAddInput({ onDraftReady }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(null);

  if (!isQuickAddConfigured()) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    const result = await requestQuickAdd(text.trim());

    if (result.remaining !== null) {
      setRemaining(result.remaining);
    }

    if (result.draft) {
      onDraftReady(result.draft);
      setText('');
    } else if (result.error) {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-md mb-lg">
      <h3 className="font-headline-md text-on-surface mb-md">Quick add con AI</h3>

      <div className="flex flex-col gap-md">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Es. Riunione con Marco venerdì alle 15, importante"
          disabled={submitting}
          className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container-lowest font-body-md text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-60"
          rows={4}
        />

        {error && (
          <p className="font-body-md text-body-md text-danger bg-danger/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {remaining !== null && !error && (
          <p className="text-xs text-on-surface-variant">
            {remaining} quick add rimaste oggi
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-4 py-2 bg-primary hover:brightness-90 disabled:opacity-60 rounded-xl text-on-primary font-label-sm transition-colors active:scale-95"
          aria-label="Genera con AI"
        >
          {submitting ? 'Generazione...' : 'Genera con AI'}
        </button>
      </div>
    </form>
  );
}
