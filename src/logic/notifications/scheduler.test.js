import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateNextNotificationTime, shouldNotifyNow } from './scheduler.js';

/**
 * Costruisce un item minimo per i test, con dueDate/dueTime nel formato
 * atteso da parseDateTime (dueDate: Date "grezza", dueTime: "HH:mm").
 */
function makeItem({
  status = 'PENDING',
  dueDate,
  dueTime = '12:00',
  startBefore = 60,
  repeatEvery = 30,
  notifyAfterDeadline = false,
} = {}) {
  return {
    status,
    dueDate,
    dueTime,
    notificationSettings: { startBefore, repeatEvery, notifyAfterDeadline },
  };
}

/** now fisso: 2026-08-13T10:00:00 locale */
const NOW = new Date(2026, 7, 13, 10, 0, 0, 0);

describe('calculateNextNotificationTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("restituisce null per item completati, anche se altrimenti dovrebbero notificare", () => {
    const item = makeItem({
      status: 'COMPLETED',
      dueDate: new Date(2026, 7, 13),
      dueTime: '11:00',
    });
    expect(calculateNextNotificationTime(item)).toBeNull();
  });

  it('restituisce null se dueTime produce una data non valida', () => {
    const item = makeItem({ dueDate: new Date(2026, 7, 13), dueTime: 'not-a-time' });
    expect(calculateNextNotificationTime(item)).toBeNull();
  });

  it("scadenza futura, prima dell'inizio della finestra: restituisce l'orario di inizio", () => {
    // due 14:00, startBefore 60min => finestra inizia alle 13:00, now e' le 10:00
    const item = makeItem({ dueDate: new Date(2026, 7, 13), dueTime: '14:00', startBefore: 60 });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 13, 0, 0, 0));
  });

  it("scadenza futura, dentro la finestra: restituisce il prossimo multiplo di repeatEvery", () => {
    // due 11:00, startBefore 60 => finestra 10:00-11:00, repeatEvery 20, now 10:00 esatto
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '11:00',
      startBefore: 60,
      repeatEvery: 20,
    });
    const next = calculateNextNotificationTime(item);
    // elapsed=0 => notificationsSent=0 => prossima tra 20 min
    expect(next).toEqual(new Date(2026, 7, 13, 10, 20, 0, 0));
  });

  it('scadenza futura, prossimo slot oltre la scadenza e notifyAfterDeadline=false: restituisce null', () => {
    // due 10:05, startBefore 10 => finestra 09:55, repeatEvery 30 => prossimo slot 10:25 > due (10:05)
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '10:05',
      startBefore: 10,
      repeatEvery: 30,
      notifyAfterDeadline: false,
    });
    expect(calculateNextNotificationTime(item)).toBeNull();
  });

  it('scadenza futura, prossimo slot oltre la scadenza e notifyAfterDeadline=true: lo restituisce comunque', () => {
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '10:05',
      startBefore: 10,
      repeatEvery: 30,
      notifyAfterDeadline: true,
    });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 10, 25, 0, 0));
  });

  it('scadenza passata, notifyAfterDeadline=false: restituisce null (si ferma)', () => {
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '09:00',
      notifyAfterDeadline: false,
    });
    expect(calculateNextNotificationTime(item)).toBeNull();
  });

  it(
    'scadenza passata di un multiplo esatto di repeatEvery: NON restituisce l\'istante ' +
      'corrente (regressione FIX-08 — con ceil() invece di floor()+1 sarebbe "now", causando ' +
      'notifiche a raffica)',
    () => {
      // due 09:00, now 10:00 => scarto esatto di 60 minuti, repeatEvery 60
      const item = makeItem({
        dueDate: new Date(2026, 7, 13),
        dueTime: '09:00',
        repeatEvery: 60,
        notifyAfterDeadline: true,
      });
      const next = calculateNextNotificationTime(item);
      expect(next.getTime()).toBeGreaterThan(NOW.getTime());
      expect(next).toEqual(new Date(2026, 7, 13, 11, 0, 0, 0));
    }
  );

  it('scadenza passata, notifyAfterDeadline=true: prossimo multiplo futuro di repeatEvery', () => {
    // due 09:00, now 10:00, scarto 60min, repeatEvery 25 => prossimo multiplo dopo 60 e' 75min => 10:15
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '09:00',
      repeatEvery: 25,
      notifyAfterDeadline: true,
    });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 10, 15, 0, 0));
  });

  it('repeatEvery 0 non produce una raffica: usa il minimo di 1 minuto', () => {
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '09:00',
      repeatEvery: 0,
      notifyAfterDeadline: true,
    });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 10, 1, 0, 0));
  });

  it('repeatEvery NaN usa il minimo di 1 minuto', () => {
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '09:00',
      repeatEvery: NaN,
      notifyAfterDeadline: true,
    });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 10, 1, 0, 0));
  });

  it('repeatEvery negativo usa il minimo di 1 minuto', () => {
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '09:00',
      repeatEvery: -30,
      notifyAfterDeadline: true,
    });
    const next = calculateNextNotificationTime(item);
    expect(next).toEqual(new Date(2026, 7, 13, 10, 1, 0, 0));
  });

  it('startBefore 0/negativo/NaN equivalgono a "nessun anticipo" (finestra che parte alla scadenza)', () => {
    const dueDate = new Date(2026, 7, 13);
    for (const startBefore of [0, -10, NaN]) {
      const item = makeItem({ dueDate, dueTime: '10:30', startBefore, repeatEvery: 10 });
      const next = calculateNextNotificationTime(item);
      // finestra inizia a dueDate stesso (10:30): now(10:00) < startTime => restituisce startTime
      expect(next).toEqual(new Date(2026, 7, 13, 10, 30, 0, 0));
    }
  });

  it('notificationSettings assente non lancia eccezioni e usa i default sicuri', () => {
    const item = {
      status: 'PENDING',
      dueDate: new Date(2026, 7, 13),
      dueTime: '14:00',
    };
    expect(() => calculateNextNotificationTime(item)).not.toThrow();
    const next = calculateNextNotificationTime(item);
    // startBefore assente => 0 => finestra parte alla scadenza stessa
    expect(next).toEqual(new Date(2026, 7, 13, 14, 0, 0, 0));
  });
});

describe('shouldNotifyNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('true quando la prossima notifica e\' entro 60s da ora', () => {
    // finestra che inizia esattamente ora (due 10:01, startBefore 1min => startTime 10:00 = now);
    // con repeatEvery 1 il primo slot cade esattamente 60s dopo l'inizio finestra
    const item = makeItem({
      dueDate: new Date(2026, 7, 13),
      dueTime: '10:01',
      startBefore: 1,
      repeatEvery: 1,
    });
    expect(shouldNotifyNow(item)).toBe(true);
  });

  it('false quando la prossima notifica e\' lontana nel tempo', () => {
    const item = makeItem({ dueDate: new Date(2026, 7, 13), dueTime: '18:00', startBefore: 30 });
    expect(shouldNotifyNow(item)).toBe(false);
  });

  it('false per item completati (nessuna prossima notifica)', () => {
    const item = makeItem({
      status: 'COMPLETED',
      dueDate: new Date(2026, 7, 13),
      dueTime: '10:30',
    });
    expect(shouldNotifyNow(item)).toBe(false);
  });
});
