# Agenda Intelligente con Notifiche Persistenti

> **Stato:** ✅ **Piano core completo al 100% (2026-08-13)** — tutte le funzionalità core, i task QA e il debito tecnico chiusi e verificati manualmente in browser. **Live su Render**: frontend https://smart-planner-vjgl.onrender.com, backend Web Push https://agenda-push-server.onrender.com. Dettaglio completo in [`PLAN.md`](PLAN.md).
>
> Progetto **React 18 + JavaScript + JSDoc + Tailwind CSS v4 + PWA** per la gestione di scadenze con sistema di promemoria persistenti.
>
> **Design Reference:** Google Stitch Cognitive Protocol
> **Piano di lavoro e stato dei task:** [`PLAN.md`](PLAN.md)
>
> 🔭 **Non è considerato un progetto definitivamente chiuso**: dal 2026-08-14 è tracciata una
> **roadmap di 8 nuovi task** (`ROAD-01..08` in [`PLAN.md`](PLAN.md#️-roadmap--prossimi-sviluppi-handoff-2026-08-14)).
> **ROAD-01/02/03 già live**: deploy su Render come Static Site, sezione "Prossimamente" e form di
> feedback → GitHub Issues nelle Settings. Ancora da fare: consenso privacy/cookie e placeholder
> AdSense (creati ma non montati, in attesa dell'approvazione dell'account Google AdSense), e
> scaffolding non collegato per la **quick add AI** (creazione task da linguaggio naturale —
> l'utente scrive/detta una frase e l'AI pre-compila titolo/data/ora/importanza nel form; serve
> ancora un backend/proxy per non esporre la chiave API lato client) e per un futuro sistema di
> profili utente, entrambi in attesa di un database reale.
>
> 📱 Il 2026-08-14 sono stati trovati e corretti 6 bug di layout mobile mai emersi prima (verificati
> su emulatore Android reale, non solo browser desktop) — dettaglio in [`PLAN.md`](PLAN.md#-debito-tecnico-aperto)
> (DS-07..DS-12).
>
> 🐛 Dal 2026-08-15 sono stati ripresi 7 bug segnalati da un uso reale dell'app: **tutti e 7 risolti**,
> l'ultimo (notifiche non recapitate su mobile) il 2026-08-25 con un backend Web Push dedicato
> (`server/`, deploy su Render + Supabase) — dettaglio in
> [`PLAN.md`](PLAN.md#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18).

---

## 🎯 Obiettivo

Sviluppare una **agenda personale intelligente** che aiuti l'utente a non dimenticare attività, appuntamenti, scadenze e compleanni tramite **notifiche ripetute** fino al completamento dell'elemento.

Il valore principale dell'app è:
> **Ricordare ripetutamente all'utente ciò che sta per scadere finché non conferma di averlo completato.**

---

## 📋 Panoramica Funzionalità

| Area | Descrizione | Stato |
|------|-------------|-------|
| **Gestione Elementi** | Creazione/modifica/eliminazione di Task e Compleanni | ✅ Funzionante |
| **Scadenze** | Data + ora configurabili separatamente | ✅ Funzionante |
| **Persistenza** | Salvataggio su localStorage, date serializzate ISO | ✅ Funzionante |
| **Importanza** | 3 livelli (Bassa/Media/Alta) per priorità e visualizzazione | ✅ Funzionante |
| **Agenda** | Vista giornaliera/settimanale/prossime + filtri, con scorciatoie rapide in Filtri | ✅ Funzionante |
| **Dashboard** | Panoramica immediata: imminenti, scaduti, alta priorità, compleanni, calendario | ✅ Funzionante |
| **Filtri** | Per tipo, stato, importanza, data + 7 scorciatoie rapide (pagina Filtri) | ✅ Funzionante |
| **Notifiche (app aperta)** | Promemoria ripetuti e configurabili, con cronologia (pagina Alerts) | ✅ Funzionante |
| **Notifiche (app chiusa)** | Web Push (VAPID) con backend su Render + Supabase | ✅ Funzionante, verificato su device reale — richiede un passo di setup lato utente, vedi [Limitazioni note](#️-limitazioni-note) |
| **PWA installabile** | Manifest + icone + banner "Installa App" su mobile, e pulsante equivalente sempre raggiungibile in Settings | ✅ Funzionante |
| **Preferenze** | Tema (chiaro/scuro/sistema), vibrazione e notifiche silenziose, in Settings | ✅ Funzionante, tema scuro esteso a tutta l'app (verificato su device reale) |
| **Immagine profilo** | Scelta avatar (9 preset icona+colore) al posto del placeholder generico, in Settings | ✅ Funzionante — salvata in localStorage, non sincronizzata tra dispositivi (nessun account/login nel progetto) |
| **Tailwind CSS** | Stili utility-first per UI responsive | ✅ Tema custom attivo (vedi sotto) |
| **Design System** | Tema personalizzato da Google Stitch | ✅ `@theme` in `global.css` — unica sorgente di verità |
| **SEO** | Meta tag Open Graph + structured data JSON-LD | ✅ Funzionante |
| **Test automatici** | Vitest, layer logic | ✅ 49/49 (`npm test`) |
| **Deploy** | Static Site su Render | ✅ Live — https://smart-planner-vjgl.onrender.com |
| **Sezione "Prossimamente"** | Anteprima roadmap nelle Settings, pilotata da un array | ✅ Funzionante |
| **Feedback** | Form categorizzato → issue GitHub precompilata, nessun backend | ✅ Funzionante |

---

## ⚠️ Limitazioni note

Punti da conoscere prima di lavorare sul progetto. Storico completo in [`PLAN.md`](PLAN.md).

<a id="tema-tailwind-ora-attivo"></a>
### Il tema Tailwind (nota storica — DS-01/DS-02 risolti il 2026-08-12)

`src/styles/global.css` conteneva solo `@import "tailwindcss"`. In **Tailwind v4** un `tailwind.config.js` viene letto soltanto se dichiarato con `@config` (o se i token sono definiti in un blocco `@theme`) — non accadeva nessuno dei due, quindi tutto `tailwind.config.js` era codice morto e classi come `font-headline-md`, `p-lg`, `gap-md`, `px-margin-mobile` non producevano CSS pur essendo usate in tutta la UI.

**Fix applicato:** tutti i token (colori, spacing, border-radius, box-shadow, font, typography) sono stati migrati in un blocco `@theme` dentro `src/styles/global.css`, insieme a `@plugin` per `@tailwindcss/forms`/`@tailwindcss/container-queries` e `@custom-variant dark` per `dark:`. Il vecchio `tailwind.config.js` è stato rinominato in `tailwind.config.js.deprecated` (tenuto solo per riferimento, non più letto da nulla) — così anche il doppio sistema colori (config **+** CSS vars manuali in `:root`) è sparito: `global.css` è ora l'unica sorgente di verità.

Eccezione: Tailwind v4 non ha un namespace `@theme` per `z-index`/`width` con chiavi nominate (solo `--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--spacing-*`, ecc. sono supportati — verificato in `node_modules/tailwindcss/theme.css`). Per questo `z-fab`, `z-navbar`, `w-nav-desktop`, `w-sidebar` restano 4 classi scritte a mano in `global.css`, non duplicate altrove.

**Prova:** dopo `npm run build`, `grep -oE "\.(gap-md|p-lg|font-body-md|text-headline-md|z-fab)\{[^}]*\}" dist/assets/index-*.css` restituisce tutte le regole. `npm run lint` invariato a 0 errori/40 warning.

**Prima di usare una classe custom, verificare comunque che esista in `global.css`:**
```bash
grep "\.nome-classe" src/styles/global.css
```

### Tema scuro (risolto il 2026-08-25)

In Settings → Preferenze si può scegliere Chiaro/Scuro/Sistema: la scelta persiste e si applica
davvero (`.dark` su `<html>`, gestito da `src/logic/preferences.js`) a **tutta l'app**, non solo alla
navigazione. I token colore (`--color-surface`, `--color-on-surface`, `--color-error`, ecc.) generati
da `@theme` in `global.css` vengono ridefiniti dentro un blocco `.dark { ... }`: ogni utility Tailwind
che li referenzia si aggiorna automaticamente in cascata. `--color-primary` (usato anche da solo come
colore di testo/icona/bordo, non solo come sfondo bottoni) è scambiato di tono con `--color-on-primary`
in scuro, altrimenti il navy quasi nero risulterebbe invisibile su sfondo scuro. Verificato su device
reale (Samsung Galaxy S21).

### Notifiche con app chiusa (Web Push, risolto il 2026-08-25) — richiede un passo di setup manuale

Il web non offre notifiche programmate garantite senza un backend push: `sync`/`periodicSync` sono
opportunistici e non danno garanzie, `setTimeout` in pagina funziona solo ad app aperta. Per questo
esiste un **backend dedicato** (`server/`, Node/Express su Render + Postgres su Supabase) che manda
Web Push reali (VAPID) indipendentemente dallo stato dell'app — l'unico meccanismo web che consegna
puntualmente anche a telefono bloccato. Un cron esterno (il Cron Job nativo di Render non è più
gratuito) chiama `/api/tick` ogni 5 minuti.

⚠️ **Su Android, se il sistema limita l'app/il browser in background, le notifiche push arrivano in
ritardo o non arrivano affatto** — non è un bug del progetto, è la gestione batteria del telefono che
sospende il processo prima che possa ricevere il push. **Passo di setup consigliato dopo
l'installazione**: Impostazioni Android → App → Chrome (o il nome dell'app se installata come PWA) →
Batteria → **"Nessuna restrizione"**. Verificato che risolve il problema su un Samsung Galaxy S21
reale (One UI); la stessa impostazione — o l'equivalente su altri produttori (Xiaomi/MIUI,
Huawei, Oppo, Vivo) — va cercata caso per caso. La stessa nota è mostrata direttamente in Settings →
Notifiche push, nell'app.

---

## 🖼️ Icone

Le icone sono **generate proceduralmente**, non disegnate a mano: uno script senza dipendenze
rasterizza il glifo con supersampling 4x e codifica PNG e ICO a livello di byte, usando i colori
del design system (sfondo `#002045`, fascia `#b51822`).

| File | Uso |
|------|-----|
| `public/icons/icon-192x192.png` | manifest (`any` + `maskable`) |
| `public/icons/icon-512x512.png` | manifest (`any` + `maskable`) |
| `public/icons/apple-touch-icon.png` | iOS, 180x180 |
| `public/favicon.ico` | favicon, 3 PNG incorporati (16/32/48) |

Il contenuto sta entro la safe zone centrale, quindi le stesse immagini valgono anche come
`maskable` su Android.

```bash
npm run icons          # rigenera tutte le icone in public/
npm run build
npm run icons:verify   # valida i file in dist/: CRC dei chunk PNG, zlib, IEND, struttura ICO
```

Per cambiare l'aspetto, modificare la palette o la geometria in `scripts/generate-icons.mjs`
(coordinate normalizzate 0..1). Sostituirle con file disegnati a mano è altrettanto lecito,
purché restino **opache** e con il glifo entro il **60% centrale**, altrimenti il ritaglio
`maskable` di Android lo taglia.

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
│   ├── store/
│   │   ├── index.js                # useAgendaStore + subscribeWithSelector; items, filterCriteria, sortCriteria
│   │   └── persistence.js          # saveToStorage, loadFromStorage, setupStorePersistence (sottoscritta ai soli items)
│   ├── items/
│   │   ├── actions.js              # createTask, createBirthday, addItem, updateItem, deleteItem, toggleComplete
│   │   ├── selectors.js            # getTasks, getBirthdays, getUpcomingItems, getOverdueItems, getHighPriorityItems
│   │   ├── filters.js              # applyFilters, applySort, applyFiltersAndSort
│   │   └── index.js
│   ├── notifications/
│   │   ├── scheduler.js            # calculateNextNotificationTime (orario sempre strettamente futuro), shouldNotifyNow
│   │   ├── browser.js              # isNotificationSupported, canNotify, getNotificationPermission,
│   │   │                           # requestNotificationPermission, showBrowserNotification, getServiceWorkerRegistration
│   │   ├── db.js                   # IndexedDB: save/remove/getExpired/removeByItemId delle notifiche pianificate
│   │   ├── integration.js          # setupAutoNotifications, cancelItemNotification, flushExpiredNotifications
│   │   ├── push.js                 # subscribeToPush, unsubscribeFromPush, getExistingPushSubscription (Push API)
│   │   ├── sync.js                 # syncSubscriptionToServer, deleteSubscriptionFromServer, isSyncConfigured
│   │   ├── toast.js                # pub/sub verso il ToastProvider React (showToast, subscribeToToasts)
│   │   └── index.js                # barrel
│   └── time/
│       ├── status.js               # getTimeStatus (FAR, IMMINENT, DUE, OVERDUE)
│       └── timezone.js             # parseDateTime, getCurrentDateInTZ, formatTime, isSameDay
│
├── ui/
│   ├── App.jsx                     # Routing con React.lazy + Suspense
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── AgendaPage.jsx
│   │   ├── CreatePage.jsx
│   │   ├── TasksPage.jsx
│   │   ├── AlertsPage.jsx          # Cronologia notifiche mostrate (IndexedDB)
│   │   ├── FiltersPage.jsx         # 7 scorciatoie di filtro rapide
│   │   └── SettingsPage.jsx        # Permesso notifiche, preferenze, installazione PWA, feedback
│   └── components/
│       ├── Layout/                 # MainLayout, TopAppBar, DesktopTopAppBar, SideNavBar, MobileSideNav, BottomNav
│       ├── Navigation/             # FAB
│       ├── InstallBanner/          # Banner "Installa App" (beforeinstallprompt), mobile only
│       ├── AgendaItem/             # AgendaItem, AgendaItemCard, AgendaItemActions, AgendaItemCompact
│       ├── AgendaView/             # AgendaView, AgendaHeader, DailyView, WeeklyView, UpcomingList, ViewToggle
│       ├── Dashboard/              # Dashboard, QuickStats, CalendarWidget, UpcomingCards, PriorityList,
│       │                           # UpcomingSection, OverdueSection, HighPrioritySection, BirthdaysSection,
│       │                           # CompletedSection, StatsCard, GlassmorphismCard
│       ├── Filters/                # FilterBar, FilterChip, FilterDropdown, SortDropdown, useFilters
│       ├── Forms/                  # TaskForm, BirthdayForm, FormField, useTaskForm, useBirthdayForm
│       ├── Toast/                  # ToastProvider, Toast, useToast
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
└── main.jsx                        # Entry point: registra il SW, avvia persistenza e notifiche

server/                             # Backend Web Push (VAPID), deploy separato su Render
├── src/
│   ├── index.js                    # Entry point Express, valida le env var richieste all'avvio
│   ├── auth.js                     # Verifica Authorization: Bearer $SYNC_SECRET
│   ├── db.js                       # Interfaccia storage (Postgres/Supabase), tabelle isolate dal client
│   ├── tick.js                     # runTick/isDueWithinWindow — riusa calculateNextNotificationTime dal client
│   └── routes/
│       ├── subscribe.js            # POST/DELETE /api/subscribe
│       ├── sync.js                 # POST /api/sync — mirror minimo degli item
│       └── tick.js                 # GET /api/tick — chiamato dal cron esterno
└── .env.example                    # Variabili richieste, vedi Setup Progetto sotto
```

---

## 🛠️ Tecnologie

| Tecnologia | Versione | Uso | Motivazione |
|------------|---------|-----|-------------|
| **React** | ^18.2.0 | Framework UI | Standard industria |
| **JavaScript + JSDoc** | - | Tipizzazione | Modello dati forte senza step di compilazione |
| **Vite** | ^5.0.8 | Bundler | Velocità di sviluppo |
| **Zustand** | ^4.4.7 | State Management | Leggero; middleware `subscribeWithSelector` per le sottoscrizioni mirate |
| **react-router-dom** | ^6.20.0 | Routing | Navigazione tra le pagine |
| **vite-plugin-pwa** | ^0.17.0 | PWA | Strategia **`injectManifest`**: il SW è `src/sw.js` |
| **Workbox** | ^7.0.0 | Service Worker | `workbox-precaching`, `workbox-routing`, `workbox-strategies`, `workbox-expiration`, `workbox-window` |
| **Tailwind CSS** | ^4.3.3 | Stili utility-first | ⚠️ tema custom non attivo, vedi Limitazioni |
| **localStorage** | - | Persistenza dati | Semplice, sufficiente per un MVP monoutente |
| **IndexedDB** | - | Notifiche pianificate | Accessibile anche dal Service Worker |
| **Notifications API** | - | Notifiche browser | Standard web |
| **date-fns** | ^2.30.0 | Manipolazione date | Usata in `WeeklyView` e `CalendarWidget` |
| **uuid** | ^9.0.0 | ID univoci | `items/actions.js`, `Toast/useToast.js` |
| **@mindraseugen/utility-kit** | ^1.0.0 | Utility condivise | Solo `fadeIn` in `Animations/FadeIn.jsx` |

> `sass` è ancora fra le devDependencies ma non esiste più alcun file `.scss`: rimuovibile.

---

## 🚀 Setup Progetto

### Prerequisiti
- Node.js 18+
- npm 9+

### Installazione
```bash
npm install
npm run dev
```

L'app sarà disponibile su **http://localhost:5173** (o la prima porta libera successiva).

Il **Service Worker è attivo anche in sviluppo** (`devOptions.enabled` in `vite.config.js`): serve per poter testare le notifiche senza fare una build.

### Build per Produzione
```bash
npm run build
npm run preview
```

### Lint
```bash
npm run lint     # atteso: 0 errori (il limite è --max-warnings 100)
```

### Test
```bash
npm test          # esegue tutta la suite una volta (Vitest)
npm run test:watch  # modalità watch
```

### Backend Web Push (opzionale, solo per sviluppare/testare le notifiche ad app chiusa)

Il frontend funziona anche senza: `isSyncConfigured()` nasconde la sezione "Notifiche push" in
Settings se `VITE_SYNC_API_URL`/`VITE_SYNC_SECRET` non sono impostate. Per lavorare sul backend
(cartella `server/`, Node/Express + Postgres):

```bash
cd server
cp .env.example .env   # compila TZ, SYNC_SECRET, VAPID_*, DATABASE_URL — vedi i commenti nel file
npm install
npm start               # ascolta su PORT (default 3000)
npm test                 # suite del server (tick, finestra di controllo)
```

In produzione gira come Web Service su Render (`server/`, root dir `server`) più un cron esterno che
chiama `GET /api/tick` ogni `TICK_WINDOW_MINUTES` (default 5) — il Cron Job nativo di Render non è
più gratuito. Il frontend deployato ha bisogno delle stesse `VAPID_PUBLIC_KEY`/`SYNC_SECRET` del
server, esposte come `VITE_VAPID_PUBLIC_KEY`/`VITE_SYNC_SECRET` a build-time.

### Cloud-sync / Autenticazione (in arrivo, bozza non ancora attiva)

L'app supporterà a breve **login/registrazione e sincronizzazione dati su più dispositivi** tramite
Supabase Auth (progetto Smart-Planner), atteso per **fine settembre 2026**. Il codice esiste già come
bozza nelle cartelle `src/logic/auth/` e `src/ui/components/Auth/`, ma **non è ancora collegato
all'app**: oggi l'app funziona esattamente come prima, senza alcun login richiesto. `items` e
`subscriptions` sono già sincronizzati su Supabase (per il backend Web Push, vedi sopra), ma senza
alcun concetto di proprietario: sono dati anonimi/condivisi finché questa feature non collega ogni
riga a uno `user_id` reale (vedi `supabase/drafts/add_user_ownership_and_rls.sql`).

Per chi in futuro vorrà provare la feature una volta attivata: copiare `.env.example` in `.env` e
valorizzare `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` con le credenziali del progetto Supabase.

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
   [Limitazioni note](#️-limitazioni-note).

**Regole da rispettare:**
- Un solo punto di registrazione del SW: `registerSW()` da `virtual:pwa-register` in `main.jsx`. Non aggiungere `navigator.serviceWorker.register()` altrove.
- Mai attendere `navigator.serviceWorker.ready` senza timeout: non risolve **mai** se nessun SW è registrato.
- Il layer logic non importa React: per parlare con la UI usa il pub/sub in `notifications/toast.js`.

---

## 📝 Convenzioni

### Nomi File
- **PascalCase** per componenti React (`AgendaItem.jsx`)
- **camelCase** per funzioni/hook (`useTaskForm.js`)
- **SCREAMING_SNAKE_CASE** per costanti (`DEFAULT_SORT_CRITERIA`)

### Tipi JSDoc
- Tutti i tipi condivisi in `src/types/`, nessuna duplicazione nei componenti
- `@typedef` per i tipi complessi, `@param` e `@returns` sulle funzioni pubbliche

### Store Zustand
- **Un solo store** centrale (`logic/store/index.js`), che contiene `items`, `filterCriteria` e `sortCriteria`
- **Selector** per i dati derivati; i componenti non ricalcolano ciò che i selettori già espongono
- Lo stato condiviso va nello store, **mai** in variabili a livello di modulo: non provocano re-render

### Cartelle
- `src/logic/` non importa React; `src/ui/` non contiene logica di dominio
- Nessun file in `public/` che possa collidere con un artefatto di build (`sw.js`, `index.html`)

---

## 🎨 Design System

### Cognitive Protocol (da Google Stitch)
**"Effortless Precision"** — interfaccia noise-free che permette di gestire schedule complessi con calma e controllo: whitespace generoso, allineamento sistematico, palette restrittiva, motion sottile.

> I token qui sotto sono definiti nel blocco `@theme` di `src/styles/global.css`, l'unica sorgente di verità per colori, spaziature e tipografia (vedi [nota storica](#tema-tailwind-ora-attivo)).

### Color Palette
| Ruolo | Hex | Uso |
|-----------------|-----|-----|
| Primary | `#002045` | Navigazione, azioni primarie |
| Primary Container | `#1a365d` | Contenitori primari |
| Secondary | `#b51822` | Alta priorità, scaduto |
| Secondary Container | `#d93537` | Contenitori secondari |
| Tertiary | `#002713` | Compleanni |
| Tertiary Container | `#003f23` | Contenitori terziari |
| Error | `#ba1a1a` | Errori |
| Success | `#2d7d4b` | Completato (WCAG AA, 4.6:1 su bianco) |
| Warning | `#b45f06` | Avvisi (WCAG AA, 5.1:1 su bianco) |

### Surface Colors
| Livello | Hex | Uso |
|--------|-----|-----|
| Base | `#f7fafc` | Sfondo base |
| Cards | `#ffffff` | Sfondo card |

### Typography (Inter Font)
| Token | Size | Weight | Uso |
|-------|------|--------|-----|
| display-date | 34px | 700 | Date ancore |
| headline-lg | 24px | 600 | Titoli principali |
| headline-md | 20px | 600 | Titoli secondari |
| body-lg | 16px | 400 | Testo corpo |
| body-md | 14px | 400 | Testo standard |
| label-caps | 12px | 700 | Badge |

### Spacing (baseline 4px)
**xs:** 4px · **sm:** 8px · **md:** 16px (gutter) · **lg:** 24px · **xl:** 32px

### Shapes
Container e card 6px · Badge 4px · FAB circolare

---

## 🎯 Come Usare l'App

### Dashboard
Panoramica con stato rapido, scadenze imminenti, alta priorità, prossimi compleanni e calendario.

### Agenda
Vista cronologica con header, filtri e elementi con strip colorati.

### Nuovo Elemento
Form per Task (con notifiche configurabili) o Compleanno (ricorrenza annuale).

### Impostazioni
Attivazione del permesso notifiche e stato corrente dell'autorizzazione.

### Notifiche
- **Ripetute** fino al completamento dell'elemento
- **Configurabili**: quando iniziare, ogni quanto, se continuare dopo la scadenza
- **Recuperate alla riapertura** se il browser non ha risvegliato il Service Worker

---

## 📄 Riferimenti
- **Piano dettagliato, audit e stato dei task:** [`PLAN.md`](PLAN.md)
- **Roadmap prossimi sviluppi (ROAD-01..08):** [`PLAN.md` § Roadmap](PLAN.md#️-roadmap--prossimi-sviluppi-handoff-2026-08-14)
- **Bug da uso reale, tutti risolti:** [`PLAN.md` § Bug reali](PLAN.md#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18)
- **Design Reference:** Google Stitch — Cognitive Protocol
