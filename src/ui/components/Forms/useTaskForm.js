/**
 * @typedef {import('../../../types/status.js').Importance} Importance
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../../types/agendaItem.js').Task} Task
 * @typedef {import('../../../types/notifications.js').NotificationSettings} NotificationSettings
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../../../logic/hooks.js';
import { DEFAULT_TASK_NOTIFICATIONS } from '../../../logic/items/actions.js';

/**
 * @typedef {Object} TaskFormData
 * @property {string} title - Titolo
 * @property {string} description - Descrizione
 * @property {string} dueDate - Data scadenza (YYYY-MM-DD)
 * @property {string} dueTime - Ora scadenza (HH:mm)
 * @property {Importance} importance - Livello importanza
 * @property {boolean} notificationsEnabled - Notifiche attivate
 * @property {number} startBeforeValue - Valore inizio notifiche
 * @property {'minutes' | 'hours' | 'days'} startBeforeUnit - Unità di misura inizio
 * @property {number} repeatEveryValue - Valore ripetizione
 * @property {'minutes' | 'hours' | 'days'} repeatEveryUnit - Unità di misura ripetizione
 * @property {boolean} notifyAfterDeadline - Notifica dopo scadenza
 * @property {boolean} stopOnComplete - Ferma a completamento
 */

/**
 * @typedef {Object} UseTaskFormProps
 * @property {AgendaItem | null} [item] - Item esistente (per edit)
 * @property {'create' | 'edit'} mode - Modalità (creazione o modifica)
 */

const importanceOptions = [
  { value: 'LOW', label: 'Bassa' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
];

export const timeUnitOptions = [
  { value: 'minutes', label: 'minuti' },
  { value: 'hours', label: 'ore' },
  { value: 'days', label: 'giorni' },
];

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

/**
 * Converte un numero di minuti nel valore/unità più leggibile per il form
 * (solo se la conversione è esatta, altrimenti resta in minuti).
 * @param {number} totalMinutes - Minuti totali
 * @returns {{ value: number, unit: 'minutes' | 'hours' | 'days' }} Valore e unità
 */
function minutesToFormUnit(totalMinutes) {
  if (totalMinutes >= MINUTES_PER_DAY && totalMinutes % MINUTES_PER_DAY === 0) {
    return { value: totalMinutes / MINUTES_PER_DAY, unit: 'days' };
  }
  if (totalMinutes >= MINUTES_PER_HOUR && totalMinutes % MINUTES_PER_HOUR === 0) {
    return { value: totalMinutes / MINUTES_PER_HOUR, unit: 'hours' };
  }
  return { value: totalMinutes, unit: 'minutes' };
}

/**
 * Hook per gestire il form dei Task
 * @param {UseTaskFormProps} props - Props del hook
 * @returns {Object} Dati e funzioni del form
 */
export function useTaskForm({ item, mode }) {
  const navigate = useNavigate();
  const { addTask, updateItem } = useAgenda();

  const [formData, setFormData] = useState(() => {
    if (mode === 'edit' && item && item.type === 'TASK') {
      const dueDate = item.dueDate instanceof Date ? item.dueDate.toISOString().split('T')[0] : '';
      const { notificationSettings } = item;
      const startBefore = minutesToFormUnit(notificationSettings.startBefore);
      const repeatEvery = minutesToFormUnit(notificationSettings.repeatEvery);
      return {
        title: item.title,
        description: item.description || '',
        dueDate,
        dueTime: item.dueTime,
        importance: item.importance,
        notificationsEnabled: true,
        startBeforeValue: startBefore.value,
        startBeforeUnit: startBefore.unit,
        repeatEveryValue: repeatEvery.value,
        repeatEveryUnit: repeatEvery.unit,
        notifyAfterDeadline: notificationSettings.notifyAfterDeadline,
        stopOnComplete: notificationSettings.stopOnComplete,
      };
    }
    return {
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00',
      importance: 'MEDIUM',
      notificationsEnabled: true,
      startBeforeValue: 2,
      startBeforeUnit: 'hours',
      repeatEveryValue: 30,
      repeatEveryUnit: 'minutes',
      notifyAfterDeadline: false,
      stopOnComplete: true,
    };
  });

  const [errors, setErrors] = useState({});

  const convertToMinutes = (value, unit) => {
    if (unit === 'days') return value * MINUTES_PER_DAY;
    if (unit === 'hours') return value * MINUTES_PER_HOUR;
    return value;
  };

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Il titolo è obbligatorio';
    if (!formData.dueDate) newErrors.dueDate = 'La data è obbligatoria';
    if (!formData.dueTime) newErrors.dueTime = "L'ora è obbligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.dueDate, formData.dueTime]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? e.target.checked : undefined;
      setFormData((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    },
    []
  );

  const handleNumberChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: Math.max(1, value) }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) return;

      const notificationSettings = {
        startBefore: convertToMinutes(formData.startBeforeValue, formData.startBeforeUnit),
        repeatEvery: convertToMinutes(formData.repeatEveryValue, formData.repeatEveryUnit),
        stopOnComplete: formData.stopOnComplete,
        notifyAfterDeadline: formData.notifyAfterDeadline,
      };

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        dueDate: new Date(formData.dueDate),
        dueTime: formData.dueTime,
        importance: formData.importance,
        notificationSettings: formData.notificationsEnabled ? notificationSettings : DEFAULT_TASK_NOTIFICATIONS,
      };

      if (mode === 'edit' && item) {
        updateItem(item.id, {
          ...taskData,
          type: 'TASK',
          updatedAt: new Date(),
        });
      } else {
        addTask(taskData);
      }

      navigate('/');
    },
    [formData, mode, item, navigate, validate, updateItem, addTask]
  );

  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    formData,
    errors,
    importanceOptions,
    timeUnitOptions,
    handleChange,
    handleNumberChange,
    handleSubmit,
    handleCancel,
  };
}
