import React from 'react';
import FormField from './FormField.jsx';
import { useTaskForm, timeUnitOptions } from './useTaskForm.js';

/**
 * @typedef {import('./useTaskForm.js').UseTaskFormProps} UseTaskFormProps
 */

const importanceOptions = [
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Bassa' },
];

export default function TaskForm({ item, mode }) {
  const {
    formData,
    errors,
    handleChange,
    handleNumberChange,
    handleSubmit,
    handleCancel,
  } = useTaskForm({ item, mode });

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl p-md mb-lg">
      <h2 className="font-headline-md text-on-surface mb-lg">
        {mode === 'edit' ? 'Modifica Task' : 'Crea Nuovo Task'}
      </h2>

      <div className="flex flex-col gap-md">
        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-grow">
            <FormField
              label="Titolo"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Es. Completare progetto"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-grow">
            <FormField
              label="Descrizione"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Descrizione dettagliata del task (opzionale)"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-grow md:flex-grow-0 md:w-1/2">
            <FormField
              label="Data Scadenza"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              required
            />
          </div>
          <div className="flex-grow md:flex-grow-0 md:w-1/2">
            <FormField
              label="Ora Scadenza"
              type="time"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              error={errors.dueTime}
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-grow md:flex-grow-0 md:w-1/2">
            <FormField
              label="Importanza"
              type="select"
              name="importance"
              value={formData.importance}
              onChange={handleChange}
              options={importanceOptions}
            />
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border border-outline text-primary focus:ring-2 focus:ring-primary/20"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={formData.notificationsEnabled}
              onChange={handleChange}
            />
            <span className="font-body-md text-on-surface">Attiva Notifiche</span>
          </label>
        </div>

        {formData.notificationsEnabled && (
          <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md mt-1">
            <h3 className="font-headline-md text-on-surface mb-md">Impostazioni Notifiche</h3>

            <div className="flex flex-col md:flex-row gap-md">
              <div className="flex-grow md:w-1/4">
                <FormField
                  label="Inizia notifiche"
                  type="number"
                  name="startBeforeValue"
                  value={formData.startBeforeValue}
                  onChange={(e) => handleNumberChange('startBeforeValue', Number(e.target.value))}
                  className="mb-0"
                />
              </div>
              <div className="flex-grow md:w-1/4">
                <FormField
                  label="&nbsp;"
                  type="select"
                  name="startBeforeUnit"
                  value={formData.startBeforeUnit}
                  onChange={handleChange}
                  options={timeUnitOptions}
                  className="mb-0"
                />
              </div>
              <div className="flex-grow md:w-1/4">
                <FormField
                  label="Ripeti ogni"
                  type="number"
                  name="repeatEveryValue"
                  value={formData.repeatEveryValue}
                  onChange={(e) => handleNumberChange('repeatEveryValue', Number(e.target.value))}
                  className="mb-0"
                />
              </div>
              <div className="flex-grow md:w-1/4">
                <FormField
                  label="&nbsp;"
                  type="select"
                  name="repeatEveryUnit"
                  value={formData.repeatEveryUnit}
                  onChange={handleChange}
                  options={timeUnitOptions}
                  className="mb-0"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-md mt-1">
              <div className="flex-grow">
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border border-outline text-primary focus:ring-2 focus:ring-primary/20"
                    id="notifyAfterDeadline"
                    name="notifyAfterDeadline"
                    checked={formData.notifyAfterDeadline}
                    onChange={handleChange}
                  />
                  <span className="font-body-md text-on-surface">Notifica dopo scadenza</span>
                </label>
              </div>
              <div className="flex-grow">
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border border-outline text-primary focus:ring-2 focus:ring-primary/20"
                    id="stopOnComplete"
                    name="stopOnComplete"
                    checked={formData.stopOnComplete}
                    onChange={handleChange}
                  />
                  <span className="font-body-md text-on-surface">Fermati a completamento</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant mt-1">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant rounded-xl border border-outline-variant transition-colors font-label-sm text-on-surface-variant active:scale-95"
            aria-label="Annulla modifiche"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-container rounded-xl text-on-primary font-label-sm transition-colors active:scale-95"
            aria-label="Salva task"
          >
            Salva
          </button>
        </div>
      </div>
    </form>
  );
}
