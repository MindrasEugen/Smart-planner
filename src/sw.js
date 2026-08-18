// Service Worker per Agenda Intelligente - Notifiche Background
//
// Compilato da vite-plugin-pwa con strategia 'injectManifest': questo file
// e' la sorgente, non un asset statico. NON duplicarlo in public/,
// altrimenti la copia statica sovrascrive il bundle generato.

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

const NOTIFICATION_DB = 'agenda-notifications';
const NOTIFICATION_STORE = 'scheduled';
const HISTORY_STORE = 'history';
// Deve restare allineata a DB_VERSION in src/logic/notifications/db.js:
// e' la stessa IndexedDB, aperta da entrambi i contesti (pagina e SW)
const NOTIFICATION_DB_VERSION = 2;
// Stesso tetto di db.js: repeatEvery puo' arrivare a 1 minuto, senza un
// limite lo storico crescerebbe senza controllo su un uso prolungato
const MAX_HISTORY_ENTRIES = 200;
const SYNC_TAG = 'check-notifications';
const PERIODIC_SYNC_MIN_INTERVAL = 15 * 60 * 1000;
// Pattern vibrazione standard, stesso valore di src/logic/notifications/browser.js
const VIBRATION_PATTERN = [200, 100, 200];

// ========== PRECACHING (gestito da Workbox) ==========
// __WB_MANIFEST e' sostituito in fase di build con l'elenco degli asset;
// in dev (devOptions.enabled) diventa un array vuoto.
const precacheManifest = self.__WB_MANIFEST || [];
precacheAndRoute(precacheManifest);

// SPA: qualsiasi navigazione offline serve index.html dalla precache.
// Solo se il manifest non e' vuoto: con un manifest vuoto (dev)
// createHandlerBoundToURL('index.html') lancia subito un WorkboxError
// ("non-precached-url", l'URL non e' nella precache) perche' non trova
// 'index.html' nella lista — e fa fallire l'intera valutazione dello
// script del SW, impedendone l'installazione anche in sviluppo.
if (precacheManifest.length > 0) {
  registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
}

// Risorse esterne (font Google, icone Material): equivalente della vecchia
// runtimeCaching NetworkFirst, che con injectManifest non e' piu' applicabile
registerRoute(
  ({ url }) => url.origin !== self.location.origin,
  new NetworkFirst({
    cacheName: 'external-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

// ========== NOTIFICHE PUSH ==========
// Consegnate dal backend (server/) anche ad app completamente chiusa: e'
// il canale che risolve BUG-01, a differenza di periodicsync/sync sotto
// (opportunistici, mai garantiti quando l'app non e' installata o comunque
// throttlati pesantemente da Chrome).
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  event.waitUntil(
    (async () => {
      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        tag: data.tag,
        data: data.data,
        // Il SW non ha accesso al localStorage della pagina: le preferenze
        // vibrazione/silenziose viaggiano nel payload della push, sincronizzate
        // dal client via /api/subscribe (vedi src/logic/notifications/sync.js)
        vibrate: data.vibrate ? VIBRATION_PATTERN : undefined,
        silent: Boolean(data.silent),
      });
      // Stesso storico usato dalle notifiche locali (src/logic/notifications/db.js,
      // consultato da AlertsPage): senza questa scrittura le notifiche arrivate
      // via push mentre l'app e' chiusa non comparirebbero mai in Alerts
      await addHistoryEntry({
        id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        itemId: data.data?.itemId,
        title: data.title,
        body: data.body ?? '',
        shownAt: Date.now(),
      }).catch((e) => console.error('SW: Errore salvataggio storico notifica push:', e));
    })()
  );
});

// ========== INDEXEDDB HELPERS ==========
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOTIFICATION_DB, NOTIFICATION_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(NOTIFICATION_STORE)) {
        db.createObjectStore(NOTIFICATION_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
      }
    };
  });
}

async function addHistoryEntry(entry) {
  const db = await openNotificationDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(HISTORY_STORE).put(entry);
  });
  await trimHistory(db);
}

async function trimHistory(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite');
    const store = tx.objectStore(HISTORY_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const entries = request.result.sort((a, b) => b.shownAt - a.shownAt);
      for (const entry of entries.slice(MAX_HISTORY_ENTRIES)) {
        store.delete(entry.id);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getExpiredNotifications() {
  const now = Date.now();
  const db = await openNotificationDB();
  return new Promise((resolve) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readonly');
    const store = tx.objectStore(NOTIFICATION_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result.filter(n => n.scheduledTime <= now));
    req.onerror = () => resolve([]);
  });
}

async function removeNotification(id) {
  const db = await openNotificationDB();
  return new Promise((resolve) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.objectStore(NOTIFICATION_STORE).delete(id);
  });
}

async function saveScheduledNotification(notification) {
  const db = await openNotificationDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(NOTIFICATION_STORE).put(notification);
  });
}

// ========== CHECK NOTIFICHE SCADUTE ==========
async function checkAndShowExpiredNotifications() {
  try {
    const expired = await getExpiredNotifications();
    for (const notif of expired) {
      await self.registration.showNotification(notif.title, {
        body: notif.body,
        icon: '/icons/icon-192x192.png',
        data: notif.data,
        tag: notif.id,
      });
      await removeNotification(notif.id);
    }
    await registerBackgroundChecks();
  } catch (e) {
    console.error('SW: Errore check notifiche:', e);
  }
}

/**
 * Registra i meccanismi di risveglio disponibili.
 * Nota: 'sync' e' one-shot e legato alla connettivita', non e' un timer.
 * Il risveglio periodico reale richiede periodicSync (solo Chromium, PWA
 * installata, intervallo deciso dal browser); dove manca, il recupero
 * avviene all'apertura dell'app (flushExpiredNotifications).
 */
async function registerBackgroundChecks() {
  if (self.registration.periodicSync) {
    try {
      await self.registration.periodicSync.register(SYNC_TAG, {
        minInterval: PERIODIC_SYNC_MIN_INTERVAL,
      });
    } catch (e) {
      // NotAllowedError e' l'esito atteso quando l'app non e' installata come
      // PWA (permesso periodicSync mai concesso): questa funzione viene
      // richiamata a ogni ripianificazione di notifica (INIT_SYNC), quindi con
      // un item che si ripete spesso un console.warn qui produrrebbe un
      // warning ogni pochi minuti all'infinito. Silenziato quando e' proprio
      // il permesso mancante; altri errori restano visibili.
      if (e.name !== 'NotAllowedError') {
        console.warn('SW: periodicSync non disponibile:', e);
      }
    }
  }

  if (self.registration.sync) {
    try {
      await self.registration.sync.register(SYNC_TAG);
    } catch (e) {
      console.warn('SW: sync non disponibile:', e);
    }
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(checkAndShowExpiredNotifications());
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(checkAndShowExpiredNotifications());
  }
});

// ========== NOTIFICATION CLICK ==========
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        client.focus();
        if (event.notification.data?.url) {
          client.navigate(event.notification.data.url);
        }
      } else {
        self.clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});

// ========== MESSAGGI DAL CLIENT ==========
self.addEventListener('message', (event) => {
  const type = event.data?.type;

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (type === 'SCHEDULE_NOTIFICATION') {
    event.waitUntil(
      saveScheduledNotification(event.data.payload).catch(e => {
        console.error('SW: Errore salvataggio notifica:', e);
      })
    );
  } else if (type === 'CANCEL_NOTIFICATION') {
    event.waitUntil(
      removeNotification(event.data.id).catch(e => {
        console.error('SW: Errore cancellazione notifica:', e);
      })
    );
  } else if (type === 'INIT_SYNC') {
    event.waitUntil(
      registerBackgroundChecks().catch(e => {
        console.error('SW: Errore init sync:', e);
      })
    );
  }
});

// ========== LIFECYCLE ==========
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => registerBackgroundChecks())
  );
});
