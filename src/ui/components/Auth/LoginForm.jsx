import React, { useState, useCallback } from 'react';
import FormField from '../Forms/FormField.jsx';

/**
 * @typedef {Object} LoginFormProps
 * @property {Function} onSubmit - Callback chiamata con { email, password } quando validazione passa
 * @property {boolean} [submitting] - Se true, disabilita il bottone e mostra "Accesso in corso..."
 * @property {string | null} [serverError] - Messaggio di errore da server
 */

/**
 * Componente form di login presentational (dumb).
 * Riceve tutto via props, nessun collegamento a Supabase o auth logic.
 * Validazione client-side: email obbligatoria con @ e . dopo @, password minimo 6 caratteri.
 * @param {LoginFormProps} props
 * @returns {JSX.Element}
 */
export default function LoginForm({ onSubmit, submitting = false, serverError = null }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  /**
   * Validazione email semplice: deve contenere @ e un . dopo la @
   * @param {string} email
   * @returns {boolean}
   */
  const isValidEmail = (email) => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return false;
    const afterAt = email.substring(atIndex + 1);
    return afterAt.includes('.');
  };

  /**
   * Valida il form prima di sottomettere
   * @returns {boolean} true se valido, false altrimenti
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password obbligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimo 6 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) return;

      onSubmit({
        email: formData.email.trim(),
        password: formData.password,
      });
    },
    [formData, validate, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-md mb-lg">
      <h2 className="font-headline-md text-on-surface mb-lg">Accedi</h2>

      <div className="flex flex-col gap-md">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="nome@esempio.com"
          required
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Minimo 6 caratteri"
          required
        />

        {serverError && (
          <p className="font-body-md text-body-md text-danger bg-danger/10 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 bg-primary hover:brightness-90 disabled:opacity-60 rounded-xl text-on-primary font-label-sm transition-colors active:scale-95"
          aria-label="Accedi al tuo account"
        >
          {submitting ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </div>
    </form>
  );
}
