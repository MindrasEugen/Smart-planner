/**
 * @typedef {Object} FormFieldProps
 * @property {string} label - Etichetta del campo
 * @property {string} type - Tipo di input (text, textarea, select, date, time, number, email, password)
 * @property {string | number} value - Valore del campo
 * @property {Function} onChange - Callback al cambio
 * @property {string} [error] - Messaggio di errore
 * @property {string} name - Nome del campo
 * @property {string} [placeholder] - Placeholder
 * @property {boolean} [required] - Campo obbligatorio
 * @property {Array<{value: string, label: string}>} [options] - Opzioni per select
 * @property {string} [className] - Classe CSS per il container
 * @property {string} [inputClassName] - Classe CSS per l'input
 */

import React from 'react';

export default function FormField({
  label,
  type,
  value,
  onChange,
  error,
  name,
  placeholder,
  required = false,
  options,
  className = '',
  inputClassName = '',
}) {
  const renderInput = () => {
    const baseInputClasses = `w-full px-3 py-2 border border-outline rounded-lg bg-surface-container-lowest font-body-md text-on-surface placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${error ? 'border-danger' : ''} ${inputClassName}`;
    
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseInputClasses}
            required={required}
            rows={4}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={!!error}
          />
        );
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClasses}
            required={required}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={!!error}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseInputClasses}
            required={required}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={!!error}
          />
        );
    }
  };

  return (
    <div className={`mb-md ${className}`}>
      <label htmlFor={name} className="block font-body-md text-on-surface mb-1">
        {label}
        {required && <span className="text-danger" style={{ marginLeft: '4px' }}>*</span>}
      </label>
      {renderInput()}
      {error && <p id={`${name}-error`} className="font-body-md text-body-md text-danger mt-1">{error}</p>}
    </div>
  );
}
