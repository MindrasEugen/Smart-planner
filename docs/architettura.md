# Architettura

> Struttura del codice (frontend e `server/`) e funzionamento interno delle notifiche. Torna al [README](../README.md).

---

## 🏗️ Architettura

```
src/
├── types/                          # Tipi JSDoc condivisi
│   ├── index.js                    # Importance, Status, ItemType, NotificationSettings
│   ├── agendaItem.js               # Task, Birthday, AgendaItem
│   ├── status.js                   # TimeStatus
│   ├── notifications.js            # NotificationSettings
│   └── timezone.js                 # Tipi per timezone
│
├── logic/                          # Logica applicativa (NO React)
│   ├── hooks.js                    # useAgenda — hook principale (dati, filtri, CRUD)
│   ├── preferences.js              # Tema, vibrazione, notifiche silenziose — localStorage
│   ├── platform.js                 # isNativeApp — web/PWA oppure app nativa Capacitor
│   ├── store/
│   │   ├── index.js                # useAgendaStore + subscribeWithSelector; items, filterCriteria, sortCriteria
│   │   └── persistence.js          # saveToStorage, loadFromStorage, setupStorePersistence (sottoscritta ai soli items)
│   ├── items/
│   │   ├── actions.js              # createTask, createBirthday, addItem, updateItem, deleteItem, toggleComplete
│   │   ├── selectors.js            # getTasks, getBirthdays, getUpcomingItems, getOverdueItems, getHighPriorityItems
│   │   ├── filters.js              # applyFilters, applySort, applyFiltersAndSort
│   │   └── index.js
│   ├── notifications/
│   │   ├── scheduler.js            # calculateNextNotificationTime (orario sempre strettamente futuro), shouldNotifyNow,
│   │   │                           # calculateUpcomingNotificationTimes (ripetizioni pianificate in anticipo, app nativa)
│   │   ├── native.js               # App Android: notifiche locali (@capacitor/local-notifications), canali, permessi
│   │   ├── browser.js              # isNotificationSupported, canNotify, getNotificationPermission,
│   │   │                           # requestNotificationPermission, showBrowserNotification, getServiceWorkerRegistration
│   │   ├── db.js                   # IndexedDB: save/remove/getExpired/removeByItemId delle notifiche pianificate
│   │   ├── integration.js          # setupAutoNotifications, cancelItemNotification, flushExpiredNotifications
│   │   ├── push.js                 # subscribeToPush, unsubscribeFromPush, getExistingPushSubscription (Push API)
│   │   ├── sync.js                 # syncSubscriptionToServer, deleteSubscriptionFromServer, isSyncConfigured
│   │   ├── toast.js                # pub/sub verso il ToastProvider React (showToast, subscribeToToasts)
│   │   └── index.js                # barrel
│   ├── time/
│   │   ├── status.js               # getTimeStatus (FAR, IMMINENT, DUE, OVERDUE)
│   │   └── timezone.js             # parseDateTime, getCurrentDateInTZ, formatTime, isSameDay
│   ├── auth/                       # Bozza login Supabase (ROAD-07), non ancora attiva
│   │   ├── supabaseClient.js       # getSupabaseClient, isAuthConfigured (null senza VITE_SUPABASE_*)
│   │   ├── authActions.js          # signUp, signIn, signOut
│   │   └── useAuthSession.js       # hook della sessione corrente
│   └── ai/                         # Quick Add: client per il backend Gemini
│       ├── deviceId.js             # getDeviceId — id dispositivo persistito in localStorage, per il rate limit
│       └── quickAdd.js             # requestQuickAdd, isQuickAddConfigured
│
├── ui/
│   ├── App.jsx                     # Routing con React.lazy + Suspense
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── AgendaPage.jsx
│   │   ├── CreatePage.jsx
│   │   ├── TasksPage.jsx
│   │   ├── LoginPage.jsx           # /login — bozza ROAD-07, inerte senza VITE_SUPABASE_*
│   │   ├── RegisterPage.jsx        # /register — idem
│   │   ├── AlertsPage.jsx          # Cronologia notifiche mostrate (IndexedDB)
│   │   ├── FiltersPage.jsx         # 7 scorciatoie di filtro rapide
│   │   └── SettingsPage.jsx        # Notifiche (web o native), preferenze, installazione PWA, feedback
│   └── components/
│       ├── Layout/                 # MainLayout, TopAppBar, DesktopTopAppBar, SideNavBar, MobileSideNav, BottomNav
│       ├── Navigation/             # FAB
│       ├── InstallBanner/          # Banner "Installa App" (beforeinstallprompt), mobile only
│       ├── AgendaItem/             # AgendaItem, AgendaItemCard, AgendaItemActions, AgendaItemCompact
│       ├── AgendaView/             # AgendaView, AgendaHeader, DailyView, WeeklyView, UpcomingList, ViewToggle
│       ├── Dashboard/              # QuickStats, CalendarWidget, UpcomingCards, PriorityList, StatsCard,
│       │                           # GlassmorphismCard, AutoCleanupNotice, sezioni (Overdue, Upcoming,
│       │                           # HighPriority, Birthdays, Completed)
│       ├── Feedback/               # FeedbackForm → issue GitHub precompilata
│       ├── Auth/                   # LoginForm, RegisterForm, ProtectedRoute (bozza ROAD-07)
│       ├── Filters/                # FilterBar, FilterChip, FilterDropdown, SortDropdown, useFilters
│       ├── Forms/                  # TaskForm, BirthdayForm, FormField, QuickAddInput, useTaskForm, useBirthdayForm
│       ├── Toast/                  # ToastProvider, Toast, useToast
│       ├── Avatar/                 # Avatar, AvatarPicker, avatarOptions (12 segni zodiacali)
│       ├── Animations/             # FadeIn, SlideUp, ScaleIn
│       ├── ConfirmDialog.jsx
│       ├── EmptyState.jsx
│       ├── LoadingSpinner.jsx
│       └── index.js
│
├── styles/
│   └── global.css                  # @import "tailwindcss" + variabili tema + utility scritte a mano
│
├── sw.js                           # Service Worker (sorgente per injectManifest) — NON metterlo in public/
└── main.jsx                        # Entry point: registra il SW (solo web), avvia persistenza e notifiche

android/                            # Progetto Android generato da Capacitor (appId com.m.e.t.agenda)
                                    # src/main/res: icone (pnpm icons:android), splash, ic_stat_notify
capacitor.config.json               # appId, nome app, webDir=dist, icona/colore delle notifiche

server/                             # Backend Web Push (VAPID) + Quick Add AI, deploy separato su Render
├── src/
│   ├── index.js                    # Entry point Express, valida le env var richieste all'avvio
│   ├── auth.js                     # Verifica Authorization: Bearer $SYNC_SECRET
│   ├── db.js                       # Interfaccia storage (Postgres/Supabase), tabelle isolate dal client
│   ├── tick.js                     # runTick/isDueWithinWindow — riusa calculateNextNotificationTime dal client
│   ├── ai.js                       # extractTaskFromText — chiama Gemini via REST per la Quick Add
│   └── routes/
│       ├── subscribe.js            # POST/DELETE /api/subscribe
│       ├── sync.js                 # POST /api/sync — mirror minimo degli item
│       ├── quickAdd.js             # POST /api/quick-add — estrazione AI + rate limit 5/giorno per dispositivo
│       └── tick.js                 # GET /api/tick — chiamato dal cron esterno
└── .env.example                    # Variabili richieste, vedi Setup Progetto sotto
```

---

## 🔔 Come funzionano le notifiche

Utile da leggere prima di modificare `src/logic/notifications/`.

1. **Permesso.** Va richiesto esplicitamente: Impostazioni → *Abilita notifiche*. `canNotify()` è `true` solo con `Notification.permission === 'granted'`; senza permesso l'app ricade su un **toast** in pagina.
2. **Pianificazione.** `startNotificationMonitor()` si sottoscrive ai soli `items` dello store (serve `subscribeWithSelector`). A ogni cambiamento ripianifica tutto, con le ripianificazioni **serializzate su una coda** per non sovrapporsi.
3. **Doppio canale.** Ogni notifica viene salvata in **IndexedDB** (per il Service Worker) e pianificata con un `setTimeout` in pagina (fallback mentre l'app è aperta).
4. **Recupero.** All'avvio, `flushExpiredNotifications()` mostra e consuma le notifiche scadute rimaste in IndexedDB.
5. **Service Worker.** `src/sw.js` gestisce `sync`, `periodicsync`, `notificationclick` e i messaggi dal client. È compilato da `vite-plugin-pwa`: **non** va duplicato in `public/`.
6. **Web Push (canale che garantisce la consegna ad app chiusa).** Se il backend è configurato,
   "Attiva notifiche push" in Settings chiama `pushManager.subscribe()` e registra la subscription sul
   server (`src/logic/notifications/push.js` + `sync.js`). Il server (`server/`) confronta
   periodicamente gli item sincronizzati con l'orario corrente e invia una push reale (VAPID) tramite
   `web-push`; `src/sw.js` la riceve nell'evento `push` e la mostra anche a browser chiuso. Su Android
   richiede che l'app/il browser non siano soggetti a restrizioni batteria — vedi
   [Limitazioni note](funzionalita.md#️-limitazioni-note).
7. **App Android (Capacitor).** Nella WebView non esistono Notification API, Service Worker e Web
   Push: con `isNativeApp` i punti 3–6 sono saltati e `native.js` pianifica in anticipo, come
   notifiche locali di sistema, tutte le ripetizioni dei prossimi 14 giorni (max 60 per item, 400
   totali). Ogni modifica degli item e ogni ritorno in primo piano ripianifica da zero; le notifiche
   scattate ad app chiusa vengono registrate nello storico (pagina Alerts) alla riapertura.

**Regole da rispettare:**
- Un solo punto di registrazione del SW: `registerSW()` da `virtual:pwa-register` in `main.jsx`. Non aggiungere `navigator.serviceWorker.register()` altrove.
- Mai attendere `navigator.serviceWorker.ready` senza timeout: non risolve **mai** se nessun SW è registrato.
- Il layer logic non importa React: per parlare con la UI usa il pub/sub in `notifications/toast.js`.
