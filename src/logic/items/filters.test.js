import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  filterByType,
  filterByStatus,
  filterByImportance,
  filterByDate,
  filterUpcoming,
  filterOverdue,
  filterByToday,
  filterByTomorrow,
  filterByNextWeek,
  sortByDueDate,
  sortByImportance,
  sortByStatus,
  sortByCreationDate,
  applyFilters,
  applySort,
  applyFiltersAndSort,
} from './filters.js';

/** "Oggi" fissato per tutti i test: 2026-08-13T10:00:00 locale */
const TODAY = new Date(2026, 7, 13, 10, 0, 0, 0);

function d(daysOffset, hours = 12) {
  const date = new Date(TODAY);
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
    createdAt: TODAY,
    ...overrides,
  };
}

describe('filtri base', () => {
  const task = makeItem({ id: 'task', type: 'TASK' });
  const birthday = makeItem({ id: 'birthday', type: 'BIRTHDAY' });
  const pending = makeItem({ id: 'pending', status: 'PENDING' });
  const completed = makeItem({ id: 'completed', status: 'COMPLETED' });
  const high = makeItem({ id: 'high', importance: 'HIGH' });
  const low = makeItem({ id: 'low', importance: 'LOW' });

  it('filterByType filtra per tipo, e senza tipo restituisce una copia invariata', () => {
    const items = [task, birthday];
    expect(filterByType(items, 'TASK')).toEqual([task]);
    expect(filterByType(items, 'BIRTHDAY')).toEqual([birthday]);
    const all = filterByType(items, undefined);
    expect(all).toEqual(items);
    expect(all).not.toBe(items); // copia, non lo stesso array
  });

  it('filterByStatus filtra per stato', () => {
    const items = [pending, completed];
    expect(filterByStatus(items, 'PENDING')).toEqual([pending]);
    expect(filterByStatus(items, 'COMPLETED')).toEqual([completed]);
  });

  it('filterByImportance filtra per importanza', () => {
    const items = [high, low];
    expect(filterByImportance(items, 'HIGH')).toEqual([high]);
  });

  it('filterByDate filtra per giorno specifico ignorando l\'orario', () => {
    const morning = makeItem({ id: 'morning', dueDate: d(0, 8) });
    const evening = makeItem({ id: 'evening', dueDate: d(0, 22) });
    const otherDay = makeItem({ id: 'other', dueDate: d(1) });
    const result = filterByDate([morning, evening, otherDay], d(0));
    expect(result.map((i) => i.id).sort()).toEqual(['evening', 'morning']);
  });
});

describe('filtri temporali (dipendono da "oggi")', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('filterByToday prende solo gli item con scadenza oggi', () => {
    const today = makeItem({ id: 'today', dueDate: d(0) });
    const tomorrow = makeItem({ id: 'tomorrow', dueDate: d(1) });
    expect(filterByToday([today, tomorrow])).toEqual([today]);
  });

  it('filterByTomorrow prende solo gli item con scadenza domani', () => {
    const today = makeItem({ id: 'today', dueDate: d(0) });
    const tomorrow = makeItem({ id: 'tomorrow', dueDate: d(1) });
    expect(filterByTomorrow([today, tomorrow])).toEqual([tomorrow]);
  });

  it('filterByNextWeek esclude oggi e domani, include fino a +7 giorni', () => {
    // Il confine "nextWeek" e' calcolato a mezzanotte di oggi+7: un item alla
    // stessa data ma con orario successivo alla mezzanotte resterebbe escluso,
    // quindi il caso limite "in7" va messo esattamente a mezzanotte (0) per
    // restare dentro il confine incluso (<=).
    const today = makeItem({ id: 'today', dueDate: d(0) });
    const in3days = makeItem({ id: 'in3', dueDate: d(3) });
    const in7days = makeItem({ id: 'in7', dueDate: d(7, 0) });
    const in8days = makeItem({ id: 'in8', dueDate: d(8) });
    const result = filterByNextWeek([today, in3days, in7days, in8days]);
    expect(result.map((i) => i.id).sort()).toEqual(['in3', 'in7']);
  });

  it('filterOverdue prende solo gli item con scadenza passata', () => {
    const past = makeItem({ id: 'past', dueDate: d(-1) });
    const future = makeItem({ id: 'future', dueDate: d(1) });
    expect(filterOverdue([past, future])).toEqual([past]);
  });

  it('filterUpcoming prende gli item imminenti o in scadenza, non quelli lontani o scaduti', () => {
    const soon = makeItem({ id: 'soon', dueDate: d(0, 11) }); // tra 1 ora circa
    const far = makeItem({ id: 'far', dueDate: d(5) });
    const past = makeItem({ id: 'past', dueDate: d(-1) });
    const result = filterUpcoming([soon, far, past]);
    expect(result.map((i) => i.id)).toEqual(['soon']);
  });
});

describe('ordinamenti', () => {
  it('sortByDueDate ordina crescente o decrescente per data+ora combinate', () => {
    const early = makeItem({ id: 'early', dueDate: d(0), dueTime: '08:00' });
    const late = makeItem({ id: 'late', dueDate: d(0), dueTime: '20:00' });
    const asc = sortByDueDate([late, early], true);
    expect(asc.map((i) => i.id)).toEqual(['early', 'late']);
    const desc = sortByDueDate([early, late], false);
    expect(desc.map((i) => i.id)).toEqual(['late', 'early']);
  });

  it('sortByDueDate non muta l\'array originale', () => {
    const early = makeItem({ id: 'early', dueDate: d(0), dueTime: '08:00' });
    const late = makeItem({ id: 'late', dueDate: d(0), dueTime: '20:00' });
    const original = [late, early];
    sortByDueDate(original, true);
    expect(original).toEqual([late, early]);
  });

  it('sortByImportance ordina HIGH > MEDIUM > LOW (ascending=true = priorita\' decrescente)', () => {
    const low = makeItem({ id: 'low', importance: 'LOW' });
    const high = makeItem({ id: 'high', importance: 'HIGH' });
    const medium = makeItem({ id: 'medium', importance: 'MEDIUM' });
    const result = sortByImportance([low, high, medium], true);
    expect(result.map((i) => i.id)).toEqual(['high', 'medium', 'low']);
  });

  it('sortByStatus mette PENDING prima di COMPLETED quando ascending=true', () => {
    const completed = makeItem({ id: 'completed', status: 'COMPLETED' });
    const pending = makeItem({ id: 'pending', status: 'PENDING' });
    const result = sortByStatus([completed, pending], true);
    expect(result.map((i) => i.id)).toEqual(['pending', 'completed']);
  });

  it('sortByCreationDate ordina per createdAt', () => {
    const older = makeItem({ id: 'older', createdAt: new Date(2026, 0, 1) });
    const newer = makeItem({ id: 'newer', createdAt: new Date(2026, 6, 1) });
    const asc = sortByCreationDate([newer, older], true);
    expect(asc.map((i) => i.id)).toEqual(['older', 'newer']);
  });
});

describe('applyFilters / applySort / applyFiltersAndSort (composizione)', () => {
  const items = [
    makeItem({ id: 'a', type: 'TASK', status: 'PENDING', importance: 'HIGH', dueTime: '09:00' }),
    makeItem({ id: 'b', type: 'TASK', status: 'COMPLETED', importance: 'LOW', dueTime: '10:00' }),
    makeItem({ id: 'c', type: 'BIRTHDAY', status: 'PENDING', importance: 'MEDIUM', dueTime: '11:00' }),
  ];

  it('applyFilters combina piu\' criteri in AND', () => {
    const result = applyFilters(items, { type: 'TASK', status: 'PENDING' });
    expect(result.map((i) => i.id)).toEqual(['a']);
  });

  it('applyFilters con oggetto vuoto restituisce tutti gli item', () => {
    expect(applyFilters(items, {})).toHaveLength(3);
  });

  it('applySort smista in base al campo scelto', () => {
    const byImportance = applySort(items, { field: 'importance', ascending: true });
    expect(byImportance.map((i) => i.id)).toEqual(['a', 'c', 'b']);
  });

  it('applyFiltersAndSort filtra e poi ordina nello stesso passaggio', () => {
    const result = applyFiltersAndSort(
      items,
      { type: 'TASK' },
      { field: 'dueDate', ascending: false }
    );
    expect(result.map((i) => i.id)).toEqual(['b', 'a']);
  });
});
