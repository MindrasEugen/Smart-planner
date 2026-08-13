import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../../../logic/hooks.js';
import { DEFAULT_BIRTHDAY_NOTIFICATIONS } from '../../../logic/items/actions.js';

/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 * @typedef {import('../../../types/agendaItem.js').Birthday} Birthday
 * @typedef {import('../../../types/notifications.js').NotificationSettings} NotificationSettings
 * @typedef {import('../../../types/status.js').Importance} Importance
 */

/**
 * @typedef {Object} BirthdayFormData
 * @property {string} personName
 * @property {string} title
 * @property {string} description
 * @property {string} dueDate
 * @property {string} dueTime
 * @property {Importance} importance
 * @property {boolean} notificationsEnabled
 * @property {number} startBeforeValue
 * @property {'hours' | 'days'} startBeforeUnit
 * @property {number} repeatEveryValue
 * @property {'hours' | 'days'} repeatEveryUnit
 * @property {boolean} notifyAfterDeadline
 * @property {boolean} stopOnComplete
 */

/**
 * @typedef {Object} UseBirthdayFormProps
 * @property {AgendaItem | null} [item]
 * @property {'create' | 'edit'} mode
 */

export const importanceOptions = [
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Bassa' },
];

export const birthdayTimeUnitOptions = [
  { value: 'hours', label: 'ore' },
  { value: 'days', label: 'giorni' },
];

/**
 * Custom hook per gestione form compleanni
 * @param {UseBirthdayFormProps} props
 * @returns {Object} formData, errors, handlers
 */
export function useBirthdayForm({ item, mode }) {
  const navigate = useNavigate();
  const { addBirthday, updateItem } = useAgenda();

  const [formData, setFormData] = useState(() => {
    if (mode === 'edit' && item && item.type === 'BIRTHDAY') {
      const dueDate = item.dueDate instanceof Date ? item.dueDate.toISOString().split('T')[0] : '';
      const { notificationSettings } = item;

      const startBeforeInHours = notificationSettings.startBefore / 60;
      const startBeforeInDays = startBeforeInHours / 24;
      const startBeforeValue = startBeforeInDays >= 1 ? startBeforeInDays : startBeforeInHours;
      const startBeforeUnit = startBeforeInDays >= 1 ? 'days' : 'hours';

      const repeatEveryInHours = notificationSettings.repeatEvery / 60;
      const repeatEveryInDays = repeatEveryInHours / 24;
      const repeatEveryValue = repeatEveryInDays >= 1 ? repeatEveryInDays : repeatEveryInHours;
      const repeatEveryUnit = repeatEveryInDays >= 1 ? 'days' : 'hours';

      return {
        personName: item.personName,
        title: item.title,
        description: item.description || '',
        dueDate,
        dueTime: item.dueTime,
        importance: item.importance,
        notificationsEnabled: true,
        startBeforeValue: Math.max(1, Math.floor(startBeforeValue)),
        startBeforeUnit,
        repeatEveryValue: Math.max(1, Math.floor(repeatEveryValue)),
        repeatEveryUnit,
        notifyAfterDeadline: notificationSettings.notifyAfterDeadline,
        stopOnComplete: notificationSettings.stopOnComplete,
      };
    }
    return {
      personName: '',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '00:00',
      importance: 'HIGH',
      notificationsEnabled: true,
      startBeforeValue: 24,
      startBeforeUnit: 'hours',
      repeatEveryValue: 1,
      repeatEveryUnit: 'hours',
      notifyAfterDeadline: true,
      stopOnComplete: true,
    };
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.personName && !formData.title.trim()) {
      setFormData(prev => ({ ...prev, title: `Compleanno di ${formData.personName}` }));
    }
  }, [formData.personName, formData.title]);

  /**
   * Converte valore in minuti
   * @param {number} value
   * @param {'hours' | 'days'} unit
   * @returns {number}
   */
  const convertToMinutes = (value, unit) => {
    if (unit === 'days') return value * 24 * 60;
    if (unit === 'hours') return value * 60;
    return value;
  };

  /**
   * Valida il form
   * @returns {boolean}
   */
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.personName.trim()) newErrors.personName = "Il nome persona e' obbligatorio";
    if (!formData.dueDate) newErrors.dueDate = 'La data e\' obbligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.personName, formData.dueDate]);

  /**
   * Gestisce il cambio dei campi
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
   */
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

  /**
   * Gestisce il cambio dei campi numerici
   * @param {string} name
   * @param {number} value
   */
  const handleNumberChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: Math.max(1, value) }));
    },
    []
  );

  /**
   * Gestisce il submit del form
   * @param {React.FormEvent} e
   */
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

      const birthdayData = {
        personName: formData.personName.trim(),
        title: formData.title.trim() || `Compleanno di ${formData.personName.trim()}`,
        description: formData.description.trim() || undefined,
        dueDate: new Date(formData.dueDate),
        dueTime: formData.dueTime || '00:00',
        importance: formData.importance,
        notificationSettings: formData.notificationsEnabled ? notificationSettings : {
          startBefore: 1440,
          repeatEvery: 60,
          stopOnComplete: true,
          notifyAfterDeadline: true,
        },
      };

      if (mode === 'edit' && item) {
        updateItem(item.id, {
          ...birthdayData,
          type: 'BIRTHDAY',
          updatedAt: new Date(),
        });
      } else {
        addBirthday(birthdayData);
      }

      navigate('/');
    },
    [formData, mode, item, navigate, validate, updateItem, addBirthday]
  );

  /**
   * Gestisce l'annullamento
   */
  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    formData,
    errors,
    importanceOptions,
    timeUnitOptions: birthdayTimeUnitOptions,
    handleChange,
    handleNumberChange,
    handleSubmit,
    handleCancel,
  };
}
