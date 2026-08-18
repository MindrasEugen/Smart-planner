import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDueWithinWindow } from './tick.js';

const ONE_MINUTE_MS = 60000;
const FIVE_MINUTES_MS = 5 * ONE_MINUTE_MS;

/**
 * Costruisce un item PENDING la cui prima notifica (calculateNextNotificationTime)
 * cade esattamente `aheadMs` millisecondi nel futuro, sfruttando il ramo piu'
 * prevedibile dello scheduler (prima notifica, before-deadline): quando
 * `now < startTime`, calculateNextNotificationTime restituisce sempre e solo
 * `startTime`, indipendentemente da repeatEvery.
 * @param {number} aheadMs - Quanto nel futuro deve cadere la notifica
 */
function buildItemDueIn(aheadMs) {
  const due = new Date(Date.now() + aheadMs + 10 * ONE_MINUTE_MS);
  const startBeforeMinutes = 10; // startTime = due - 10min = "adesso" + aheadMs
  const hh = String(due.getHours()).padStart(2, '0');
  const mm = String(due.getMinutes()).padStart(2, '0');

  return {
    id: 'test-item',
    title: 'Test',
    dueDate: due,
    dueTime: `${hh}:${mm}`,
    status: 'PENDING',
    notificationSettings: {
      startBefore: startBeforeMinutes,
      repeatEvery: 30,
      notifyAfterDeadline: false,
    },
  };
}

test('un\'occorrenza tra 3 minuti e\' dovuta con la finestra server (5 min) ma non con quella client (1 min)', () => {
  const item = buildItemDueIn(3 * ONE_MINUTE_MS);

  assert.equal(isDueWithinWindow(item, ONE_MINUTE_MS), null);
  assert.notEqual(isDueWithinWindow(item, FIVE_MINUTES_MS), null);
});

test('un\'occorrenza ben oltre la finestra non e\' dovuta', () => {
  const item = buildItemDueIn(20 * ONE_MINUTE_MS);
  assert.equal(isDueWithinWindow(item, FIVE_MINUTES_MS), null);
});

test('un\'occorrenza imminente (1 minuto) e\' dovuta', () => {
  // Margine di un minuto intero (non pochi secondi) per non ricadere, per un
  // pelo di esecuzione del test, nel ramo "elapsed" dello scheduler invece
  // che in quello "prima notifica" su cui si basa buildItemDueIn
  const item = buildItemDueIn(ONE_MINUTE_MS);
  assert.notEqual(isDueWithinWindow(item, FIVE_MINUTES_MS), null);
});

test('un item completato non e\' mai dovuto', () => {
  const item = { ...buildItemDueIn(0), status: 'COMPLETED' };
  assert.equal(isDueWithinWindow(item, FIVE_MINUTES_MS), null);
});
