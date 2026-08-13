import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { agendaStore } from '../store/index.js';
import {
  getItems,
  getItemsByType,
  getItemsByStatus,
  getItemsByImportance,
  getTasks,
  getBirthdays,
  getHighPriorityItems,
  getUpcomingItems,
  getOverdueItems,
  getItemTimeStatus,
  getNextNotificationTime,
} from './selectors.js';

const NOW = new Date(2026, 7, 13, 10, 0, 0, 0);

function d(daysOffset, hours = 12) {
  const date = new Date(NOW);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, 0, 0, 0);
  return date;
}

function makeItem(overrides = {}) {
  return {
    id: overrides.id ?? 'x',
    type: 'TASK',
    status: 'PENDING',
    importance: 'MEDIUM',
    dueDate: d(0),
    dueTime: '12:00',
    createdAt: NOW,
    updatedAt: NOW,
    notificationSettings: { startBefore: 60, repeatEvery: 30, notifyAfterDeadline: false },
    ...overrides,
  };
}

describe('selectors (contro lo store Zustand reale)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    agendaStore.getState().resetStore();
  });

  afterEach(() => {
    agendaStore.getState().resetStore();
    vi.useRealTimers();
  });

  it('getItems legge lo stato attuale dello store', () => {
    expect(getItems()).toEqual([]);
    const item = makeItem({ id: 'a' });
    agendaStore.getState().addItem(item);
    expect(getItems()).toEqual([item]);
  });

  it('getItemsByType / getTasks / getBirthdays filtrano correttamente', () => {
    const task = makeItem({ id: 'task', type: 'TASK' });
    const birthday = makeItem({ id: 'birthday', type: 'BIRTHDAY' });
    agendaStore.setState({ items: [task, birthday] });

    expect(getItemsByType('TASK')).toEqual([task]);
    expect(getTasks()).toEqual([task]);
    expect(getBirthdays()).toEqual([birthday]);
    expect(getItemsByType(undefined)).toHaveLength(2);
  });

  it('getItemsByStatus filtra per stato', () => {
    const pending = makeItem({ id: 'pending', status: 'PENDING' });
    const completed = makeItem({ id: 'completed', status: 'COMPLETED' });
    agendaStore.setState({ items: [pending, completed] });

    expect(getItemsByStatus('COMPLETED')).toEqual([completed]);
  });

  it('getItemsByImportance / getHighPriorityItems filtrano per importanza', () => {
    const high = makeItem({ id: 'high', importance: 'HIGH' });
    const low = makeItem({ id: 'low', importance: 'LOW' });
    agendaStore.setState({ items: [high, low] });

    expect(getItemsByImportance('HIGH')).toEqual([high]);
    expect(getHighPriorityItems()).toEqual([high]);
  });

  it('getUpcomingItems restituisce solo gli item imminenti/in scadenza, ordinati per data', () => {
    // L'ora effettiva usata dal codice e' sempre dueTime (stringa), non l'ora
    // memorizzata nell'oggetto dueDate: va quindi impostata esplicitamente
    // perche' l'ordinamento dipenda davvero dall'orario, non dall'ordine di inserimento.
    const soon = makeItem({ id: 'soon', dueDate: d(0), dueTime: '11:00' });
    const soonest = makeItem({ id: 'soonest', dueDate: d(0), dueTime: '10:30' });
    const far = makeItem({ id: 'far', dueDate: d(5) });
    agendaStore.setState({ items: [soon, far, soonest] });

    expect(getUpcomingItems().map((i) => i.id)).toEqual(['soonest', 'soon']);
  });

  it('getOverdueItems restituisce solo gli item scaduti, ordinati per data', () => {
    const pastFar = makeItem({ id: 'pastFar', dueDate: d(-3) });
    const pastNear = makeItem({ id: 'pastNear', dueDate: d(-1) });
    const future = makeItem({ id: 'future', dueDate: d(1) });
    agendaStore.setState({ items: [future, pastNear, pastFar] });

    expect(getOverdueItems().map((i) => i.id)).toEqual(['pastFar', 'pastNear']);
  });

  it('getItemTimeStatus restituisce lo stato temporale di un item esistente, null se non trovato', () => {
    const overdue = makeItem({ id: 'overdue', dueDate: d(-1) });
    agendaStore.setState({ items: [overdue] });

    expect(getItemTimeStatus('overdue')).toBe('OVERDUE');
    expect(getItemTimeStatus('does-not-exist')).toBeNull();
  });

  it('getNextNotificationTime delega allo scheduler, null per item inesistenti o completati', () => {
    const pending = makeItem({ id: 'pending', dueDate: d(0), dueTime: '14:00', notificationSettings: { startBefore: 60, repeatEvery: 30, notifyAfterDeadline: false } });
    const completed = makeItem({ id: 'completed', status: 'COMPLETED' });
    agendaStore.setState({ items: [pending, completed] });

    expect(getNextNotificationTime('pending')).toEqual(new Date(2026, 7, 13, 13, 0, 0, 0));
    expect(getNextNotificationTime('completed')).toBeNull();
    expect(getNextNotificationTime('does-not-exist')).toBeNull();
  });
});
