// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveToStorage, loadFromStorage, setupStorePersistence } from './persistence.js';
import { agendaStore } from './index.js';

const STORAGE_KEY = 'agenda_intelligente_v1';

function makeItem(overrides = {}) {
  const now = new Date(2026, 7, 13, 10, 0, 0, 0);
  return {
    id: 'a',
    type: 'TASK',
    status: 'PENDING',
    importance: 'MEDIUM',
    dueDate: now,
    dueTime: '12:00',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('saveToStorage / loadFromStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('salva e ricarica gli item con le date come istanze Date reali (round-trip ISO)', () => {
    const item = makeItem();
    saveToStorage({ items: [item] });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toContain(item.dueDate.toISOString());

    const loaded = loadFromStorage();
    expect(loaded.items).toHaveLength(1);
    expect(loaded.items[0].dueDate).toBeInstanceOf(Date);
    expect(loaded.items[0].dueDate.getTime()).toBe(item.dueDate.getTime());
    expect(loaded.items[0].createdAt).toBeInstanceOf(Date);
    expect(loaded.items[0].updatedAt).toBeInstanceOf(Date);
  });

  it('restituisce null se non c\'e\' nulla salvato', () => {
    expect(loadFromStorage()).toBeNull();
  });

  it('non lancia eccezioni se il contenuto salvato e\' JSON non valido', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(() => loadFromStorage()).not.toThrow();
    expect(loadFromStorage()).toBeNull();
  });
});

describe('setupStorePersistence — sottoscrizione selettiva a items', () => {
  let unsubscribe;

  beforeEach(() => {
    localStorage.clear();
    agendaStore.getState().resetStore();
    unsubscribe = setupStorePersistence(agendaStore);
  });

  afterEach(() => {
    unsubscribe();
    agendaStore.getState().resetStore();
    localStorage.clear();
  });

  it(
    'cambiare filterCriteria o sortCriteria NON scrive su localStorage ' +
      '(regressione FIX-03: solo i cambi di items devono persistere)',
    () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      agendaStore.getState().setFilterCriteria({ type: 'TASK' });
      agendaStore.getState().setSortCriteria({ field: 'importance', ascending: false });

      expect(setItemSpy).not.toHaveBeenCalled();
      setItemSpy.mockRestore();
    }
  );

  it('aggiungere un item scrive su localStorage', () => {
    const item = makeItem();
    agendaStore.getState().addItem(item);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(raw).toContain(item.id);
  });

  it('il round-trip attraverso lo store reale preserva gli item salvati', () => {
    const item = makeItem({ id: 'roundtrip' });
    agendaStore.getState().addItem(item);

    const loaded = loadFromStorage();
    expect(loaded.items.map((i) => i.id)).toContain('roundtrip');
  });
});
