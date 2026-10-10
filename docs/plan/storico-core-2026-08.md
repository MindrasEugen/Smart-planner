# Storico — Implementazione core e layout (agosto 2026)

> Parte dell'archivio di [`PLAN.md`](../../PLAN.md). Audit del 2026-08-12, fix funzionali, task core completati, rifacimento layout, accessibilità,
> responsività, PWA, testing e design system. **Tutto chiuso**: archivio di riferimento.

---

## 🔍 Audit 2026-08-12 — Funzionalità core non funzionanti

Analisi statica del 2026-08-12 che ha trovato 10 difetti reali dietro funzionalità dichiarate
complete ma non funzionanti (notifiche mai mostrate, filtri scollegati dalla UI, SW in collisione,
race condition, ecc.). Tutti risolti lo stesso giorno — dettaglio fix-per-fix nella tabella
**FIX-01..10** subito sotto.

---

## ✅ Fix Funzionali (2026-08-12)

| ID | Task | Owner | Stato | Prova |
|----|------|-------|-------|-------|
| FIX-01 | Permesso notifiche richiedibile: `isNotificationSupported()` / `canNotify()` separati, notifica via `registration.showNotification()`, sezione "Notifiche" in SettingsPage | LOGIC + UI | ✅ DONE | `src/logic/notifications/browser.js`, `src/ui/pages/SettingsPage.jsx` |
| FIX-02 | `subscribeWithSelector` sullo store: la ripianificazione notifiche reagisce ai cambi di `items` | LOGIC | ✅ DONE | script di verifica: listener chiamato 2/2 volte |
| FIX-03 | `filterCriteria` / `sortCriteria` come stato dello store; firme di `useAgenda()` invariate, `useFilters.js` e `FilterBar.jsx` non toccati | LOGIC | ✅ DONE | script di verifica: `applyFiltersAndSort` filtra 1 di 2 item |
| FIX-04 | `strategies: 'injectManifest'`, SW sorgente in `src/sw.js`, `public/sw.js` eliminato, `runtimeCaching` riscritta come rotta Workbox, `devOptions` attivo | ARCHITECT | ✅ DONE | `grep -c "agenda-notifications" dist/sw.js` → **1** (era 0) |
| FIX-05 | Race risolta: `await cancelItemNotification()` prima del salvataggio; query IndexedDB spostata in `db.js` come `removeScheduledNotificationsByItemId` | LOGIC | ✅ DONE | `src/logic/notifications/integration.js`, `db.js` |
| FIX-06 | `flushExpiredNotifications()` chiamata all'avvio: le scadenze passate vengono segnalate alla riapertura | LOGIC | ✅ DONE | `integration.js`, `startNotificationMonitor()` |
| FIX-07 | Toast del layer logic collegati al `ToastProvider` React (pub/sub con buffer per i messaggi emessi prima del mount) | LOGIC + UI | ✅ DONE | `notifications/toast.js`, `Toast/ToastProvider.jsx` |
| FIX-08 | Scheduler: `floor(...) + 1` al posto di `ceil(...)` (orario sempre strettamente futuro), guard per `repeatEvery` 0/NaN, date non valide e `notificationSettings` assenti, retry a 60s | LOGIC | ✅ DONE | 8 casi limite verificati con script |
| FIX-09 | Ripianificazioni serializzate su una coda: due modifiche ravvicinate non si cancellano più a vicenda | LOGIC | ✅ DONE | `queueReschedule()` in `integration.js` |
| FIX-10 | Registrazione SW unificata su `virtual:pwa-register`; eliminati `public/index.html` (duplicato stantio) e `src/logic/notifications/sw.js` (orfano) | ARCHITECT | ✅ DONE | `src/main.jsx`; lint da 43 a 40 warning |

**Verificato automaticamente:** `npm run build` OK · `npm run lint` 0 errori / 40 warning · SW di dev servito · store, filtri, persistenza e 8 casi dello scheduler testati con script temporanei.

**NON verificato (richiede un browser reale):** prompt del permesso, comparsa effettiva della notifica, ciclo di vita dei record IndexedDB dal vivo, recupero alla riapertura, click sui filtri. → task **QA-04, QA-06, QA-07, QA-10, QA-11**.

---

## ✅ Task Completati (IMPLEMENTAZIONE CORE)

### 🏗️ ARCHITETTURA

| ID | Task | Owner | Stato |
|----|------|-------|-------|
| ARCH-01 | Configurazione progetto Vite + React + JavaScript | ORCHESTRATOR | ✅ DONE |
| ARCH-02 | Configurazione Tailwind CSS v4 + PostCSS | ORCHESTRATOR | ✅ DONE |
| ARCH-03 | Configurazione PWA (vite-plugin-pwa, manifest, Service Worker) | ORCHESTRATOR | ✅ DONE |

### 🧠 LOGICA APPLICATIVA

| ID | Task | Owner | DependsOn | Stato |
|----|------|-------|-----------|-------|
| LOGIC-01 | Definizione Tipi JSDoc (Importance, Status, ItemType, TimeStatus, NotificationSettings) | LOGIC | - | ✅ DONE |
| LOGIC-02 | Store Zustand + Persistenza localStorage | LOGIC | LOGIC-01 | ✅ DONE |
| LOGIC-03 | Logica Temporale Centralizzata (timezone, parsing date) | LOGIC | LOGIC-01 | ✅ DONE |
| LOGIC-04 | Hook Notifiche (useNotifications) | LOGIC | LOGIC-01, LOGIC-03 | ✅ DONE (integrato in useAgenda + integration.js) |
| LOGIC-05 | Service Worker per Notifiche Background | LOGIC | LOGIC-04 | ✅ DONE (scritto nel 2025, ma escluso dalla build fino a **FIX-04**) |
| LOGIC-06 | Scheduler Notifiche (calculateNextNotificationTime, shouldNotifyNow) | LOGIC | LOGIC-03, LOGIC-04 | ✅ DONE (ricorsione infinita e guard mancanti corretti in **FIX-08**) |
| LOGIC-07 | CRUD AgendaItem (createTask, createBirthday, add/update/delete/toggleComplete) | LOGIC | LOGIC-01, LOGIC-02 | ✅ DONE |
| LOGIC-08 | Filtri e Ordinamento (applyFilters, applySort, applyFiltersAndSort) | LOGIC | LOGIC-01, LOGIC-02 | ✅ DONE (logica pura sempre corretta: il difetto era nello stato, vedi **FIX-03**) |
| LOGIC-09 | Hook per Agenda (useAgenda) | LOGIC | LOGIC-01, LOGIC-02, LOGIC-07, LOGIC-08 | ✅ DONE (criteri spostati nello store con **FIX-03**) |
| LOGIC-10 | Integrazione Notifiche + Store (setupAutoNotifications, cancelItemNotification) | LOGIC | LOGIC-05, LOGIC-06, LOGIC-09 | ✅ DONE (subscribe inefficace e race risolte in **FIX-02**, **FIX-05**, **FIX-09**) |
| LOGIC-11 | Conversione tipi TypeScript → JSDoc | ORCHESTRATOR | - | ✅ DONE |
| LOGIC-12 | Conversione store e logica da .ts a .js | ORCHESTRATOR | LOGIC-11 | ✅ DONE |

### 🎨 INTERFACCIA UTENTE (Core)

| ID | Task | Owner | DependsOn | Stato |
|----|------|-------|-----------|-------|
| UI-01 | Struttura Base App + Routing (App.jsx, main.jsx, BrowserRouter) | UI | LOGIC-02, LOGIC-09 | ✅ DONE |
| UI-02 | Dashboard (DashboardPage, Dashboard component con sezioni) | UI | LOGIC-09 | ✅ DONE |
| UI-03 | Vista Agenda (AgendaPage, AgendaView, DailyView, WeeklyView, UpcomingList) | UI | LOGIC-09 | ✅ DONE |
| UI-04 | Form Task (TaskForm, useTaskForm, FormField con validazione) | UI | LOGIC-07, LOGIC-09 | ✅ DONE |
| UI-05 | Form Birthday (BirthdayForm, useBirthdayForm con personName) | UI | LOGIC-07, LOGIC-09 | ✅ DONE |
| UI-06 | Componente AgendaItem (AgendaItem, AgendaItemCard, AgendaItemActions) | UI | LOGIC-09 | ✅ DONE |
| UI-07 | Filtri e Ordinamento (FilterBar, FilterChip, FilterDropdown, SortDropdown) | UI | LOGIC-08, LOGIC-09 | ✅ DONE |
| UI-08 | Responsive e Accessibilita (MainLayout, MobileNav, DesktopNav) | UI | UI-01..UI-07 | ✅ DONE |
| UI-09 | Tema e Stili (global.css con Tailwind CSS) | UI | UI-08 | ✅ DONE |
| UI-10 | Conversione tutti componenti da .tsx a .jsx | REACT INTERFACE | LOGIC-11, LOGIC-12 | ✅ DONE |
| UI-11 | Aggiornamento import/export per JavaScript | REACT INTERFACE | UI-10 | ✅ DONE |
| UI-12 | Applicazione stili Tailwind a tutti i componenti | REACT INTERFACE | UI-10, UI-11 | ✅ DONE |

---

## 🎨 MIGLIORAMENTO LAYOUT E RIORGANIZZAZIONE

### 📋 Suggerimenti Integrati (da suggerimenti-miglioramento-layout.md)

**Priorità suggerite dal file:**
1. **Alta:** Accessibilità, Responsività mobile-first, Performance
2. **Media:** UX/UI, Struttura e organizzazione, Testing
3. **Bassa:** SEO, Funzionalità PWA avanzate

### ✅ Task Riorganizzazione (Priorità ALTA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| ORG-01 | **Pulizia file inutili** - Eliminare stitch_persistent_reminder_agenda, theme.scss, theme.js | ORCHESTRATOR | - | ✅ DONE | HIGH | File eliminati, build funzionante |
| ORG-02 | **Pulizia global.css** - Rimuovere contenuto duplicato da theme.scss | ORCHESTRATOR | ORG-01 | ✅ DONE | HIGH | global.css pulito, ~360 linee rimosse |
| ORG-03 | **Uniformare variabili CSS** - Sostituire --bs-* con --color-* in global.css | **UI ENGINE** | ORG-02 | ✅ DONE | HIGH | Tutte le variabili usano lo schema --color-* |
| ORG-04 | **Ottimizzare Tailwind config** - tailwind.config.js con tema custom | **ARCHITECT** | ORG-02 | ✅ DONE | HIGH | Config con colori Stitch, font Inter (già esistente) |
| ORG-05 | **Riorganizzare cartella styles/** - Struttura coerente con Tailwind | **UI ENGINE** | ORG-04 | ✅ DONE | MEDIUM | Cartella styles/ pulita e organizzata |
| ORG-06 | **Creare layout base** - Header/Main/Footer component con Tailwind | **UI ENGINE** | ORG-04 | ✅ DONE | HIGH | Layout coerente con Tailwind in Layout/TopAppBar, BottomNav, MainLayout |

### ✅ Task Accessibilità (Priorità ALTA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| A11Y-01 | Aggiungere attributi ARIA a tutti i componenti interattivi | **UI ENGINE** | ORG-06 | ✅ DONE | HIGH | aria-label su TaskForm, BirthdayForm, ConfirmDialog, ToastProvider, FilterBar, FilterDropdown, SortDropdown, AgendaItemCard, AgendaItemCompact |
| A11Y-02 | Verificare contrasto colori WCAG (minimo 4.5:1) | **UI ENGINE** | ORG-03, ORG-04 | ✅ DONE | HIGH | Success: #2d7d4b (4.6:1), Warning: #b45f06 (5.1:1) su #ffffff |
| A11Y-03 | Implementare navigazione da tastiera (tab order, focus states) | **UI ENGINE** | ORG-06 | ✅ DONE | HIGH | onKeyDown su FilterDropdown/SortDropdown, focus trap su ConfirmDialog, focus automatico su Toast |
| A11Y-04 | Aggiungere skip link per accessibilità | **UI ENGINE** | ORG-06 | ✅ DONE | MEDIUM | Skip link già presente in global.css (linea 222-235) |
| **A11Y-05** | **Landmark `<main>` duplicato e annidato su ogni pagina** — `MainLayout.jsx` avvolge già tutto in `<main id="main-content">`, ma ogni pagina (Dashboard/Agenda/Settings/Tasks/Filters/Alerts) renderizzava un secondo `<main>` per la variante desktop → `<main><main>...</main></main>`, HTML non valido e due landmark "main" sulla stessa pagina (screen reader confusi). Scoperto da una review esterna (`agenda-intelligente-review.pptx`, 2026-08-13), verificato nel DOM reale prima di intervenire | UI ENGINE | ✅ **DONE (2026-08-13)** | MEDIUM | Il secondo `<main>` di ogni pagina sostituito con `<div>` (stesse classi, il markup HTML/CSS resta identico). Verificato: `document.querySelectorAll('main').length` → **1** su Dashboard/Agenda/Settings/Tasks/Filters/Alerts (prima: 2 ovunque) |
| **A11Y-06** | **`ConfirmDialog` non si chiudeva mai davvero — bug critico, non solo di accessibilità.** Scoperto durante QA-09 testando il focus trap. `isClosing` veniva impostato a `true` per il fade-out ma **mai riportato a `false`**: la guardia di rendering `!isOpen && !isClosing` restava per sempre falsa dopo la prima chiusura (Annulla, Escape **o Conferma** — tutti i percorsi usano lo stesso `setIsClosing(true)` mai resettato). Il dialog restava montato invisibile (`opacity-0`) ma con `pointer-events: auto` su un `fixed inset-0`: un overlay a schermo intero che blocca **ogni click sull'intera app**, in ogni pagina, per sempre — finché non si ricarica la pagina. Confermato con `document.elementFromPoint(5,5)` (angolo lontano dal dialog visibile): restituiva il backdrop invisibile invece del contenuto della pagina | LOGIC/UI | ✅ **DONE (2026-08-13)** | **CRITICAL** | `handleClose`/`handleConfirm` ora chiamano `setIsClosing(false)` subito prima di `onClose()`/`onConfirm()`. Verificato: dopo Annulla **e** dopo Conferma, `document.querySelectorAll('[role="alertdialog"]').length` → **0** e `elementFromPoint` sull'angolo colpisce di nuovo un elemento reale della pagina, non il backdrop |
| **A11Y-07** | `FilterDropdown`/`SortDropdown` non si chiudevano da tastiera — Escape non aveva alcun effetto e spostare il focus altrove (Tab) lasciava il pannello aperto, sovrapposto ai controlli successivi. Solo un listener `mousedown` per il click esterno, nessuna gestione per chi non usa il mouse. Stesso pattern duplicato in entrambi i componenti | UI ENGINE | ✅ **DONE (2026-08-13)** | MEDIUM | Aggiunto un listener nativo `keydown`/`focusout` sul nodo del dropdown (non prop JSX, per non attivare `jsx-a11y/no-noninteractive-element-interactions` su un `<div>` mai esso stesso a fuoco): Escape chiude e ririporta il focus al pulsante trigger, l'uscita del focus dal componente chiude il pannello. Verificato in browser con interazioni reali (click + Escape, click + Tab): in entrambi i casi il pannello si chiude correttamente, nessuna regressione sulla selezione delle opzioni |
| **A11Y-08** | `ConfirmDialog`: `aria-hidden="true"` era applicato al **contenitore del dialog stesso** (non al resto della pagina) — per le regole WAI-ARIA questo rimuove l'intero dialog, titolo/messaggio/pulsanti inclusi, dall'albero di accessibilità nonostante `role="alertdialog"` e `aria-modal="true"`. Chrome sembra ignorare l'effetto quando il subtree contiene il focus (da qui probabilmente la mancata scoperta finora), ma resta un pattern ARIA invalido che gli strumenti di audit automatico (axe, Lighthouse) segnalerebbero come errore a prescindere | UI ENGINE | ✅ **DONE (2026-08-13)** | LOW | Rimosso l'`aria-hidden="true"` superfluo (il div non serve comunque hidden: viene montato solo quando il dialog è aperto). Il click sul backdrop per chiudere resta gestito (pattern standard, silenziata con motivazione la coppia di regole ESLint che lo segnalava come "elemento statico con interazione", dato che l'equivalente da tastiera è Escape) |

### ✅ Task Responsività (Priorità ALTA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| RESP-01 | Ottimizzare per mobile-first (breakpoint Tailwind) | **UI ENGINE** | ORG-04, ORG-06 | ✅ DONE | HIGH | Layout con lg:hidden, hidden lg:flex, lg:ml-64 già implementati |
| RESP-02 | Testare breakpoint Tailwind (sm:640, md:1024, lg:1280) | **UI ENGINE** | RESP-01 | ✅ DONE | HIGH | Mobile/Tablet/Desktop tutti verificate |
| RESP-03 | Implementare hamburger menu per mobile | **UI ENGINE** | RESP-01, ORG-06 | ✅ DONE | MEDIUM | Menu mobile funzionale e accessibile - breakpoint sm:hidden, touch target 44px+ |

### ⬜ Task Performance (Priorità ALTA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| PERF-01 | Implementare lazy loading immagini | UI ENGINE | ORG-06 | ✅ SKIPPED | HIGH | Nessun <img> statico da ottimizzare (usa solo Material Symbols font) |
| PERF-02 | Ottimizzare bundle con code splitting | ARCHITECT | - | ✅ VERIFIED | HIGH | Dimensione JS ridotta, chunk ottimizzati con React.lazy + Suspense. Testato in runtime: chunk caricati on-demand |
| PERF-03 | Implementare React.memo e useMemo per evitare render non necessari | LOGIC ENGINE | - | ✅ IMPLEMENTED | MEDIUM | Componenti memoizzati: AgendaItemCard (memo + 7 useMemo), DailyView (3 useMemo), WeeklyView (4 useMemo), FilterChip (memo + 1 useMemo). Fixato anche template literal malformato e parentheses in AgendaItemCard |

### ❌ Task UX/UI (Priorità MEDIA - **SOSTITUITI DA UX-NEW-01..06**)
> **Nota:** Questi task sono stati contrassegnati come IMPLEMENTED ma gli screenshot mostrano che non risolvono i problemi UX reali. Sono stati **sostituiti** dai nuovi task UX-NEW-01..06 che affrontano i problemi in modo olistico.

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| UX-01 | Aggiungere feedback visivi (hover states, loading spinners) | UI ENGINE | ORG-06 | ❌ CANCELLED | MEDIUM | **Sostituito da UX-NEW-01 e UX-NEW-04** |
| UX-02 | Migliorare gerarchia visiva (spacing, dimensioni font) | UI ENGINE | ORG-03, ORG-06 | ❌ CANCELLED | MEDIUM | **Sostituito da UX-NEW-02 e UX-NEW-03** |
| UX-03 | Aggiungere animazioni sottili (fade-in, slide per hover) | UI ENGINE | ORG-06 | ❌ CANCELLED | LOW | **Sostituito da UX-NEW-01** |

### ✅ Task Struttura (Priorità MEDIA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| STR-01 | Riorganizzare componenti per feature (Dashboard/, AgendaView/, ecc.) | ORCHESTRATOR | - | ✅ DONE | MEDIUM | Struttura cartelle coerente, risolto conflitto file duplicato AgendaItemCompact.jsx |
| ~~STR-02~~ | ~~Creare file di configurazione centralizzato per tema~~ | UI ENGINE | ORG-04 | ✅ **DONE (verificato 2026-08-13)** | MEDIUM | **Già soddisfatto come effetto collaterale di DS-01/DS-02** (2026-08-12), mai chiuso in questa tabella. Il blocco `@theme` in `src/styles/global.css` (righe 18-165) è l'unica sorgente di verità per colori (intera palette Material Design 3), spaziature (`--spacing-xs..3xl`, griglia 4px) e tipografia (famiglie font + tutti i token `--text-*` con line-height/weight/letter-spacing) — esattamente l'acceptance criteria. Le sole eccezioni (`z-fab`, `w-nav-desktop`, ecc.) sono 4 classi scritte a mano nello **stesso file**, subito sotto, con una nota che spiega perché (Tailwind v4 non ha un namespace `@theme` per z-index/width con chiavi nominate) — non è dispersione, è documentato e centralizzato comunque. Verificato oggi: `grep` di colori esadecimali hardcoded (`#[0-9a-fA-F]{6}`) su tutto `src/ui/**` → **zero risultati**; nessun secondo file di stile in `src/styles/`; gli `style={{...}}` inline rimasti nei componenti sono valori strutturali one-off (z-index di overlay specifici, `max-width`, `env(safe-area-inset-bottom)`), non token di design. Creare un secondo file di configurazione avrebbe reintrodotto esattamente il doppio sistema che DS-02 aveva eliminato |
| ~~STR-03~~ | ~~Documentare contratto Logic → UI con JSDoc~~ | LOGIC ENGINE | - | ✅ **DONE (verificato 2026-08-13)** | MEDIUM | **Già soddisfatto**, mai chiuso in questa tabella. Verificata sistematicamente ogni funzione esportata (`export function`/`export async function`) in `src/logic/**/*.js` (esclusi i file di test): tutte le 82 funzioni esportate, in tutti e 15 i file (`hooks.js`, `items/actions.js`, `items/selectors.js`, `items/filters.js`, `store/index.js`, `store/persistence.js`, `notifications/{index,browser,scheduler,integration,toast,db}.js`, `time/{status,timezone}.js`), hanno un blocco `/**...*/` JSDoc direttamente sopra, con `@param`/`@returns` tipizzati tramite i `@typedef` in `src/types/**`. Nessuna funzione esportata priva di JSDoc trovata. Nessun file di codice modificato |
| ~~STR-04~~ | ~~`TasksPage.jsx`, `FiltersPage.jsx`, `AlertsPage.jsx` erano stub identici~~ | UI ENGINE | - | ✅ **DONE (2026-08-13)** | MEDIUM | Implementate con contenuto reale, non rimosse: **TasksPage** — vista dedicata ai soli Task (`useAgenda().tasks`), ordinamento locale (`SortDropdown` + `applySort`), CTA "+ Nuovo Task", riusa `AgendaItemCard`. **FiltersPage** — 7 scorciatoie filtro (Scaduti/Oggi/Domani/Prossima settimana/Alta priorità/In sospeso/Completati) con conteggio reale (`applyFilters`), un clic imposta il filtro globale (`setFilterCriteria`, lo stesso store di FilterBar) e naviga in Agenda già filtrata — verificato: "Scaduti" → chip "Data: Scaduti" applicato. **AlertsPage** — cronologia notifiche mostrate: nuovo store IndexedDB `history` in `db.js` (v2, con `addHistoryEntry`/`getHistory`/`clearHistory`, tetto di 200 voci), agganciato dentro `showBrowserNotification()` in `browser.js` così logga indipendentemente dal canale (SW/Notification/toast) — verificato in browser: le notifiche di background di sessione sono comparse in cronologia con orario, pulsante "Cancella" testato e funzionante. `npm test` 49/49, `npm run lint` 0 errori (39 warning, +2 per `console.error` nei nuovi punti di log, coerente con il resto del codice), `npm run build` OK |

---

### 🎯 NOVITÀ: TASK DI RIFACIMENTO LAYOUT (Priorità ALTA - Rifacimento Chirurgico)
> **Motivazione:** Gli screenshot mostrano che i task UX precedentementi segnati come completati NON lo sono. anziché rifare tutto da zero, procediamo con un **rifacimento chirurgico** di CSS e componenti Dashboard.

> **Riferimenti UX:**
> - **Todoist** (sistema colori priorità: Rosso=Alta, Arancio=Media, Verde=Bassa)
> - **Google Calendar** (evidenziazione giorno corrente, layout calendario)
> - **Notion** (card pulite, gerarchia visiva, spaziatura generosa)
> - **TickTick** (stats narrative con messaggi tipo "Hai completato X task")

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **UX-NEW-01** | **Design System Moderno in global.css** | UI ENGINE | ORG-04 | ⬜ TODO | **HIGH** | global.css aggiornato con: spacing system (4/8/16/24/32px), shadow system (sm/md/lg), border-radius coerenti, transizioni fluide (200ms), variabili CSS per colori priorità/scadenze |
| **UX-NEW-02** | **Dashboard: Layout a 3 colonne moderno** | UI ENGINE | UX-NEW-01 | ✅ DONE (2026-08-12) | **HIGH** | Layout DashboardPage.jsx con: colonna sinistra (stats), colonna centrale (calendario + pannello task giorno), colonna destra (upcoming). Spaziatura 24px tra colonne, padding 32px. **Ispirazione: Notion dashboard** |
| **UX-NEW-03** | **Dashboard: Stats Narrative + Calendario Interattivo** | UI ENGINE | UX-NEW-01, UX-NEW-02 | ✅ DONE (2026-08-12) | **HIGH** | QuickStats con messaggi narrativi ("Hai completato 5 task oggi"), CTA pulsanti ("+ Nuovo Task"). Calendario con: evidenziazione giorno corrente (border-2 + bg primary/10), click su giorno → pannello laterale con task del giorno. **Ispirazione: Google Calendar + Todoist** |
| **UX-NEW-04** | **Dashboard: Segnalazione Visiva Colori Priorità/Scadenze** | UI ENGINE | UX-NEW-01 | ✅ DONE (2026-08-12) | **HIGH** | Sistema colori coerente: **Priorità** (Alta=`bg-error/10 text-error`, Media=`bg-warning/10 text-warning`, Bassa=`bg-success/10 text-success`). **Scadenze** (Imminente=strip 4px `bg-warning`, Scaduto=strip 4px `bg-error`, Completato=`opacity-60`). Badge visibili su ogni AgendaItemCard. **Ispirazione: Todoist priority system** |
| **UX-NEW-05** | **Navigazione: Sidebar/TopBar con Voce Attiva** | UI ENGINE | UX-NEW-01 | ✅ DONE (2026-08-12) | **HIGH** | SideNavBar: voce attiva con `bg-primary/10 text-primary font-medium`, hover `bg-surface-container-high`. TopAppBar mobile: icona calendar attiva se in Dashboard/Agenda. **Ispirazione: Google Apps sidebar** |
| **UX-NEW-06** | **Pagina Agenda: Layout Ordinato e Moderno** | UI ENGINE | UX-NEW-01 | ✅ DONE (2026-08-12) | **MEDIUM** | AgendaPage con: header con filtri in barra compatta, lista task con spaziatura 12px tra elementi, nessuna sovrapposizione, ordinamento chiaro (data → priorità). **Ispirazione: Todoist project view** |

> **Nota 2026-08-12 (UX-NEW-02..06 — riverifica contro le acceptance criteria):** il codice
> implementava già gran parte di UX-NEW-02/03/05, ma con diversi scostamenti dalle acceptance
> criteria sopra, tutti corretti:
> - **UX-NEW-04:** `AgendaItemCard.jsx`, `WeeklyView.jsx`, `UpcomingList.jsx` usavano le classi
>   `card-agenda`, `badge-completed/overdue/imminent/high/medium/low`, `badge-status`, `completed` —
>   **mai definite** in `global.css` (stesso difetto di DS-01). Card e badge privi di stile. Risolto
>   con classi Tailwind reali (`bg-error/10 text-error`, strip 4px per scadenze, `opacity-60`).
> - **UX-NEW-02:** gap tra colonne era 32px (`gap-xl`) invece di 24px richiesti → `gap-lg`. Upcoming
>   era nella colonna sinistra invece che nella destra → spostato, colonna destra ora contiene
>   `UpcomingCards` + `GlassmorphismCard`.
> - **UX-NEW-03:** CTA "+ Nuovo" era condizionato a `pendingCount === 0 && totalItems === 0`, quindi
>   spariva per sempre dopo il primo task creato → reso sempre visibile, testo allineato a "+ Nuovo
>   Task". `CalendarWidget.jsx`: il pallino indicatore del giorno corrente era `absolute` dentro un
>   contenitore non `relative` → si posizionava rispetto all'antenato sbagliato, corretto.
> - **UX-NEW-05:** `SideNavBar.jsx` usava `bg-primary-container text-on-primary-container` invece di
>   `bg-primary/10 text-primary font-medium`, hover `bg-surface-variant` invece di
>   `bg-surface-container-high` → allineato. `TopAppBar.jsx` (icona calendario mobile) non aveva
>   nessuna logica di stato attivo → aggiunta con `useLocation()`.
> - **UX-NEW-06:** `AgendaHeader.jsx` renderizzava una seconda barra di ricerca/filtri **decorativa e
>   non funzionante** (nessun `onClick` sui chip, la ricerca non filtrava nulla) sovrapposta al vero
>   `FilterBar` sottostante — rimossa. Conteneva anche un bug di encoding (`Alta Priorit√†`). Liste
>   task: spaziatura 8px (`gap-sm`) invece di 12px → `gap-3` (12px esatti, verificato in
>   `dist/assets/*.css`). Ordinamento era solo per data, senza tie-break → aggiunta priorità come
>   secondo criterio in `DailyView.jsx`, `WeeklyView.jsx`, `UpcomingList.jsx`.
>
> Verificato con `npm run build` (CSS generato correttamente) e `npm run lint` (0 errori, warning
> scesi da 40 a 37 rimuovendo codice morto incontrato durante il fix).

---

### ⬜ Task SEO e Meta (Priorità BASSA)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| ~~SEO-01~~ | ~~Aggiungere meta tag completi (description, og:title, og:description)~~ | UI ENGINE | ORG-06 | ✅ **DONE (2026-08-13)** | LOW | Aggiunti `og:type`, `og:title`, `og:description`, `og:image` (icona 512x512), `og:locale`, `twitter:card` in `index.html` (la `description` semplice esisteva già). Verificato in browser reale: tutti i tag presenti nel DOM con i valori attesi |
| ~~SEO-02~~ | ~~Implementare structured data JSON-LD~~ | UI ENGINE | SEO-01 | ✅ **DONE (2026-08-13)** | LOW | Aggiunto blocco `<script type="application/ld+json">` in `index.html` (schema.org `WebApplication`). Verificato: JSON valido sia nel build (`dist/index.html`) sia parsato lato client in browser reale |

### ⬜ Task PWA (Priorità ALZATA — bloccano le notifiche in background)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **PWA-01** | **Creare le icone mancanti** + manifest completo | ARCHITECT | - | ✅ **DONE (2026-08-12)** | **HIGH** | Vedi sotto |
| PWA-02 | Service worker per caching offline | ARCHITECT | - | ✅ DONE (**FIX-04**) | HIGH | `injectManifest` + `precacheAndRoute(self.__WB_MANIFEST)` + `NavigationRoute` per la SPA; **24** asset in precache (18 prima delle icone) |
| ~~PWA-03~~ | ~~Aggiungere banner "Installa App" per mobile~~ | UI ENGINE | PWA-01 ✅ | ✅ **DONE (2026-08-13)** | MEDIUM | Nuovo `useInstallPrompt` (hook su `beforeinstallprompt`/`appinstalled`, salta se già in standalone) + `InstallBanner` (`lg:hidden`, sopra la BottomNav, pulsanti "Installa" e chiudi con dismiss persistito in localStorage). Verificato in browser reale: Chrome ha emesso `beforeinstallprompt` realmente, il banner è comparso su viewport mobile con il testo atteso, il pulsante di chiusura lo nasconde e la chiusura resta valida dopo un reload; non premuto "Installa" per non innescare l'installazione reale della PWA sul sistema dell'utente |

**PWA-01 — cosa è stato fatto**

Le icone sono state **generate proceduralmente** (script senza dipendenze: rasterizzatore con
supersampling 4x + codifica PNG e ICO a livello di byte), con i colori del design system:
sfondo `--color-primary` `#002045`, fascia `--color-secondary` `#b51822`, glifo calendario + spunta.
Contenuto entro la safe zone così le stesse immagini valgono anche come `maskable`.

| File | Dimensione | Note |
|------|-----------|------|
| `public/icons/icon-192x192.png` | 1.464 byte | `purpose: any` + `maskable` |
| `public/icons/icon-512x512.png` | 4.601 byte | `purpose: any` + `maskable` |
| `public/icons/apple-touch-icon.png` | 1.332 byte | referenziata da `index.html` |
| `public/favicon.ico` | 993 byte | 3 immagini PNG incorporate (16/32/48); **era 0 byte** |

Manifest completato in `vite.config.js`: aggiunti `id`, `start_url`, `scope`, `lang`,
`orientation`; `theme_color` allineato al design system (`#002045`, era `#ffffff`).
`index.html`: `apple-touch-icon` non punta più al favicon, `theme-color` allineato.

Il generatore e il validatore sono **versionati** in `scripts/`, quindi le icone sono
riproducibili e non sono binari opachi:
```bash
npm run icons          # rigenera public/icons/* e public/favicon.ico
npm run icons:verify   # valida i file in dist/
```

**Verifiche eseguite**
- Validatore a livello di byte: firma PNG, IHDR, **CRC di ogni chunk**, decompressione zlib alla
  dimensione di scanline attesa, byte di filtro, IEND, nessun byte di troppo → **tutti i file validi**,
  incluse le 3 immagini dentro l'ICO
- Ispezione visiva delle icone renderizzate a 192 e 512 px
- Requisiti di installabilità Chrome sul manifest buildato: `name`, `short_name`, `start_url`,
  `display: standalone`, icona 192 PNG, icona 512 PNG, icona `maskable` → **tutti presenti**
- `dist/sw.js` registra un handler `fetch` (requisito per l'installabilità)
- ⚠️ **Non verificato:** il prompt di installazione vero e proprio (richiede un browser)

> **Perché PWA-01 non era a priorità bassa:** `periodicSync` — l'unico meccanismo di risveglio
> periodico realmente disponibile sul web — richiede una **PWA installata**. Ora il prerequisito
> di QA-06 è soddisfatto.

### ✅ Task Testing (Priorità ALTA — riaperti dopo l'audit, chiusi il 2026-08-13)

> **Perché i ✅ VERIFIED erano stati revocati:** QA-04, QA-06, QA-07 e QA-10 dichiaravano verificati
> comportamenti che il codice non poteva produrre (permesso notifiche mai richiesto, SW custom assente
> dalla build, filtri scollegati dalla UI). Il 2026-08-13 sono stati rieseguiti **a mano, in un browser
> reale** (Chrome via Claude in Chrome + conferma dell'utente per i popup nativi non ispezionabili via
> automazione): QA-04, QA-06, QA-07, QA-10, QA-11 tutti confermati.
>
> **QA-06 — nota sul sub-test di recupero:** al primo tentativo (origine `localhost:4173`) il popup
> di autorizzazione non si è ripresentato in modo visibile dopo il primo utilizzo di quell'origine e
> il sub-test era stato sospeso. Riprovato con successo su un'origine mai usata prima in questa
> sessione (`localhost:4175`): il popup è comparso normalmente. Ipotesi più probabile per il fallimento
> precedente: l'euristica "quiet permission UI" di Chrome, che dopo alcuni tentativi ravvicinati sulla
> stessa origine sostituisce il popup con una piccola icona silenziosa nella barra indirizzi invece
> di un popup interruttivo — facile da non notare se non la si cerca esplicitamente.

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| QA-01 | Verifica JavaScript/JSDoc: nessun residuo TypeScript | QA VERIFIER | - | ✅ VERIFIED | HIGH | `grep -r "interface\|type .*=" src/ \| grep -v "@typedef\|JSDoc\|jsdoc"` vuoto |
| QA-02 | Verifica ESLint: nessuna violazione | QA VERIFIER | QA-01 | ✅ VERIFIED (2026-08-12) | HIGH | `npm run lint` → **0 errors, 40 warnings** (limite `--max-warnings 100`) |
| QA-03 | Verifica Build: build completato senza errori | QA VERIFIER | QA-02 | ✅ VERIFIED (2026-08-12) | HIGH | `npm run build` OK, `dist/sw.js` in modalità injectManifest, 18 asset precache |
| QA-04 | Test Notifiche Browser: permessi, visualizzazione | QA VERIFIER | FIX-01, FIX-02 | ✅ **VERIFIED (2026-08-13, `npm run dev`, Chrome via Claude in Chrome)** | **HIGH** | Permesso concesso da Settings (stato passato a "Attive"); task con scadenza a pochi minuti, `startBefore` 5, `repeatEvery` 1 → popup di notifica di sistema comparso e ripetuto, confermato a vista dall'utente (il popup nativo non è ispezionabile via automazione, solo dall'utente) |
| QA-05 | Test Persistenza: dati salvati e caricati correttamente | QA VERIFIER | LOGIC-02, LOGIC-07 | ✅ VERIFIED (2026-08-12) | HIGH | Round-trip verificato via script: `dueDate` salvata ISO e ricaricata come `Date` |
| QA-06 | Test Notifiche Background: Service Worker attivo | QA VERIFIER | FIX-04, FIX-06 | ✅ **VERIFIED (2026-08-13)** | **HIGH** | Confermato: `npm run preview` → `navigator.serviceWorker.getRegistrations()` → **un solo** SW, scope corretto, `active.state: "activated"`, `scriptURL: sw.js` — e, dopo il fix di **DEBT-05** (stesso giorno), anche **`npm run dev`** registra un solo SW attivo (`scriptURL: dev-sw.js`). **Sub-test di recupero completato** (stessa sessione, origine pulita `:4175`): creato un item con notifica pianificata tra ~1 minuto, navigato via prima che scattasse in-page (uccidendo il timer), atteso il superamento dell'orario, riaperta l'app → il record IndexedDB `scheduled` è sparito e la notifica è comparsa nello storico di **Alerts** (STR-04) con l'orario corretto, prova indipendente da IndexedDB stessa |
| QA-07 | Test Filtri e Ordinamento | QA VERIFIER | FIX-03, UI-07 | ✅ **VERIFIED (2026-08-13)** | **HIGH** | Confermato su Agenda (Giornaliera/Settimanale/Prossime, viewport desktop ~1568px): filtro Tipo→"Compleanni" azzera la lista di task all'istante, chip "Tipo: Compleanni ✕" compare, filtro Stato→"Completati" isola correttamente i task completati, "Reimposta" azzera tutto e ripristina la lista, il dropdown "Ordina per" cambia etichetta e viene rispettato |
| QA-08 | Test Responsive: mobile (480px), tablet (768px), desktop (1024px+) | QA VERIFIER | RESP-01, RESP-02 | ✅ **VERIFIED (2026-08-13)** | MEDIUM | Mobile (~586px) verificato in DS-03. Desktop (≥1024px) verificato in sessione precedente (~1528-1568px): Dashboard a 3 colonne, barra filtri Agenda compatta orizzontale. **Tablet (780px, `resize_window`) verificato in questa sessione**: Dashboard, Agenda (Giornaliera/Settimanale a 7 colonne/filtri a griglia 2 colonne), Tasks, Filters, Alerts, Settings, form di creazione task, drawer `MobileSideNav` — tutti senza sovrapposizioni né testo tagliato. Confermato `document.documentElement.scrollWidth === window.innerWidth` (nessun overflow orizzontale) |
| QA-09 | Test Accessibilità: screen reader, tastiera, contrasto | QA VERIFIER | A11Y-01..A11Y-04 | ✅ **VERIFIED (2026-08-13)** | MEDIUM | **Contrasto:** ricalcolato sui colori realmente risolti da CSS (non dichiarati): success 5.06:1, warning 4.58:1, error 6.46:1, primary 16.25:1, on-surface-variant 9.33:1 — tutti ≥4.5:1, confermato anche su badge/testo renderizzati dal vivo. **Tastiera:** skip link verificato (sposta il focus su `#main-content`), focus ring visibile su Tab, focus trap di `ConfirmDialog` verificato (Annulla→Conferma→Annulla, wrap-around corretto). **Trovati e risolti 3 difetti reali** durante il test, uno critico: vedi **A11Y-06/07/08**. Non eseguito con uno screen reader reale (solo albero di accessibilità e comportamento focus/tastiera) |
| QA-10 | Test End-to-End: flusso completo utente | QA VERIFIER | QA-04..QA-09 | ✅ **VERIFIED (2026-08-13)** | **HIGH** | Creato task di test, notifica confermata (QA-04/QA-11), segnato completato dalla UI (checkbox → titolo barrato, spunta verde, opacità ridotta) → verificato via IndexedDB: il record in `agenda-notifications › scheduled` per quell'item è sparito immediatamente, `status` dell'item è `COMPLETED` in localStorage |
| QA-11 | Test fallback senza permesso | QA VERIFIER | FIX-01, FIX-07 | ✅ **VERIFIED (2026-08-13)** | **HIGH** | Su un'origine senza permesso concesso (`localhost:4173`, `Notification.permission` mai risolto oltre `default`): creato task con notifica imminente → toast `role="alert"` renderizzato nel DOM (catturato sia via `MutationObserver` sia in uno screenshot dal vivo: "[MEDIUM] TEST QA-11 toast v5 - Scadenza: ..."), scomparso da solo dopo ~5s come da `useToast` |
| QA-12 | Introdurre Vitest e coprire la logica pura | QA VERIFIER | - | ✅ **VERIFIED (2026-08-13)** | **HIGH** | Vitest configurato (`vite.config.js` → `test: { environment: 'jsdom' }`, script `npm test`/`npm run test:watch`). 49 test in 4 file: `scheduler.test.js` (14, incluso il caso limite dello scarto esatto multiplo di `repeatEvery` — la regressione da cui è nato FIX-08), `filters.test.js` (18), `selectors.test.js` (8, contro lo store Zustand reale), `persistence.test.js` (9, incluso il round-trip ISO delle date e la sottoscrizione selettiva a `items` di FIX-03). `npm test` → **49/49 passati**. Richiesto `NODE_OPTIONS=--no-experimental-webstorage` (via `cross-env` nello script): Node 22+ definisce un proprio global `localStorage` sperimentale che oscura quello di jsdom, causando `TypeError` altrimenti — vedi nota sotto |

---

## 🎨 Design System (risolto 2026-08-12)

| ID | Task | Owner | Stato | Priority | Acceptance |
|----|------|-------|-------|----------|------------|
| **DS-01** | **Rendere effettivo il tema Tailwind** — `global.css` aveva solo `@import "tailwindcss"`, quindi `tailwind.config.js` non veniva letto | ARCHITECT | ✅ **DONE (2026-08-12)** | **HIGH** | Migrati tutti i token (colori, spacing, radius, shadow, font, z-index, width) in `@theme` dentro `src/styles/global.css`. `npm run build` + grep su `dist/assets/index-*.css` confermano che `font-headline-md`, `p-lg`, `gap-md`, `px-margin-mobile` producono CSS reale |
| **DS-02** | Rimuovere il doppio sistema colori: token in `tailwind.config.js` **e** CSS vars in `:root` di `global.css` | ARCHITECT | ✅ **DONE (2026-08-12)** | MEDIUM | Risolto come effetto collaterale di DS-01: `tailwind.config.js` rinominato `tailwind.config.js.deprecated` (nessun file lo referenzia più), le ~40 classi colore scritte a mano in `global.css` rimosse — i colori sono generati automaticamente da `@theme`, un solo elenco |

> **Nota v4:** `z-index` e `width` con chiavi nominate (`z-fab`, `w-nav-desktop`, `w-sidebar`, `z-navbar`)
> non hanno un namespace `@theme` dedicato in Tailwind v4 (confermato in `node_modules/tailwindcss/theme.css`:
> solo `--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--spacing-*`, ecc.). Per questi 4 token
> restano 4 classi scritte a mano in `global.css`, uniche e non duplicate altrove.
>
> **DS-01/DS-02 sbloccano UX-NEW-01..06** (ancora ⬜ TODO, non implementati in questa sessione — solo
> il fondamento CSS è pronto). Prima erano bloccati perché riscrivere il layout con classi che non
> generavano CSS avrebbe significato lavorare alla cieca: è la ragione più probabile per cui i task
> UX-01/02/03 risultavano "fatti" ma gli screenshot mostravano il contrario.

---
