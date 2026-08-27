# PLAN — Agenda Intelligente con Notifiche Persistenti

> **Stato:** ✅ **Core plan chiuso al 100% (92/92, 2026-08-13)**. Dal 2026-08-14 è aperta una fase di
> roadmap separata (vedi sotto), con lavoro reale in corso. **Ultimo aggiornamento:** 2026-08-27
>
> 🎨 **Sessione più recente (2026-08-27)**: 11/12 punti di fix UX da uso reale implementati e
> verificati — Quick Add AI con Gemini (auto-save quando la frase specifica data/ora), dashboard
> cliccabile e con auto-pulizia dei task completati, avatar zodiacali. Dettaglio in
> [Fix UX da uso reale](#-fix-ux-da-uso-reale--sessione-2026-08-27). README.md rivisto in profondità
> nella stessa sessione.
>
> 🐛 **Bug da uso reale**: tutti risolti, incluso BUG-01 (notifiche non arrivavano su mobile),
> chiuso il 2026-08-25 con un backend Web Push dedicato (VAPID), testato su device Android reale.
> Dettaglio in [Bug reali trovati in uso reale](#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18).
>
> 🗺️ **Roadmap**: ROAD-01/02/03 chiusi (Priorità 1). ROAD-06 (Quick Add AI) chiuso il 2026-08-27.
> ROAD-07 (profili utente: RLS attiva, scaffolding auth pronto) in corso. Dettaglio in
> [Roadmap — Prossimi Sviluppi](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14).
>
> Notifiche, Filtri, Accessibilità, Performance, Design System e PWA: tutti ✅ chiusi e verificati in
> browser reale — cronologia in [Debito Tecnico](#-debito-tecnico-aperto), numeri in
> [Stato Attuale](#-stato-attuale).
>
> **Linguaggio:** JavaScript (con JSDoc) | **Framework:** React 18 + Tailwind CSS v4 + Vite + PWA
> **Build:** ✅ OK | **Lint:** ✅ 0 errori | **Test automatici:** ✅ Vitest, 49/49 (`npm test`)
> **Design Reference:** Google Stitch - Cognitive Protocol

---

## 📌 Legenda

| Stato | Significato |
|-------|-------------|
| ⬜ TODO | Da fare |
| 🟡 IN_PROGRESS | In lavorazione |
| ✅ DONE | Completato e verificato |
| 🔴 BLOCKER | Rompe una funzionalità dichiarata |
| ⚠️ DA RIVERIFICARE | Marcato DONE in passato ma senza prova; richiede verifica manuale |

> **Nota sulla verifica:** in questo progetto "DONE" è stato usato anche per lavoro mai eseguito in un browser reale.
> Da ora: **✅ DONE solo con la prova a fianco** (comando eseguito, output, o passo manuale svolto).

---

## 🎯 Panoramica Progetto

**Agenda Intelligente** è un'app React per la gestione di scadenze con **notifiche persistenti**:
promemoria ripetuti finché l'utente non conferma di aver completato ciò che scade. CRUD, persistenza,
notifiche (in-app e Web Push ad app chiusa), filtri, layout responsive, accessibilità, PWA e SEO sono
tutti completi e verificati manualmente in browser reale (dettaglio storico in
[Debito Tecnico](#-debito-tecnico-aperto)). **Il core plan è chiuso al 100% (92/92, 2026-08-13).**

Dal 2026-08-14 il lavoro prosegue su una roadmap separata (non conteggiata nel 92/92): vedi
[Roadmap](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14) per cosa è attivo e cosa resta da fare.

---

## 📊 Stato Attuale

| Area | Total | DONE | % | Note |
|------|-------|------|---|------|
| ARCHITETTURA (ARCH) | 3 | 3 | 100% | |
| LOGICA (LOGIC) | 12 | 12 | 100% | difetti corretti in FIX-02/03/05/08 |
| UI | 12 | 12 | 100% | |
| **IMPLEMENTAZIONE CORE** | **27** | **27** | **100%** | |
| RIORGANIZZAZIONE (ORG) | 6 | 6 | 100% | |
| ACCESSIBILITÀ (A11Y) | 8 | 8 | 100% | A11Y-05..08 aperti e chiusi 2026-08-13 (`<main>` duplicato, bug critico ConfirmDialog, dropdown non chiudibili da tastiera, aria-hidden errato) |
| RESPONSIVITÀ (RESP) | 3 | 3 | 100% | da riverificare ora che DS-01 è risolto (classi di spaziatura oggi generano CSS) |
| PERFORMANCE (PERF) | 3 | 3 | 100% | |
| **STRUTTURA (STR)** | **4** | **4** | **100%** | Tutti chiusi 2026-08-13 |
| **FIX FUNZIONALI (FIX)** | **10** | **10** | **100%** | ✅ 2026-08-12 |
| **QA** | **12** | **12** | **100%** | Tutti i task QA verificati 2026-08-13 |
| **DESIGN SYSTEM (DS)** | **2** | **2** | **100%** | ✅ DS-01 + DS-02 chiusi 2026-08-12: layout sbloccato |
| **PWA** | **3** | **3** | **100%** | Tutti chiusi 2026-08-13 (PWA-01 il 2026-08-12) |
| **SEO** | **2** | **2** | **100%** | Tutti chiusi 2026-08-13 |
| **DEBITO TECNICO (DEBT)** | **6** | **6** | **100%** | Tutto il debito tecnico chiuso 2026-08-13 |
| **RIFACIMENTO LAYOUT (UX-NEW)** | **6** | **6** | **100%** | Tutti chiusi 2026-08-12 |
| **TOTALE** | **92** | **92** | **100%** | Tutti i task chiusi 2026-08-13 |
| **ROADMAP (ROAD)** | **8** | **3** | **38%** | Nuova fase aggiunta 2026-08-14 (handoff brainstorming), **non conteggiata nel TOTALE sopra** — il core plan resta chiuso al 100%. ROAD-01 (deploy), ROAD-02 (sezione Prossimamente) e ROAD-03 (form feedback) chiusi — Priorità 1 completa. Vedi sezione [🗺️ Roadmap](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14) |
| **BUG (uso reale, 2026-08-15 → 08-25)** | **7** | **7** | **100%** | Handoff da uso reale (segnalati 2026-08-14), **non conteggiato nel TOTALE sopra**. BUG-01 (notifiche mobile): backend Web Push deployato su Render, testato e confermato funzionante su device reale (Samsung Galaxy S21) il 2026-08-25, incluso a schermo spento. Vedi sezione [🐛 Bug reali trovati in uso reale](#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18) |

> I task UX-01/02/03 (❌ CANCELLED) sono esclusi dal totale.

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

## 🧹 Debito Tecnico (aperto)

> Nonostante il titolo (mantenuto invariato per non rompere i link), è **tutto risolto** — nessuna
> voce ancora aperta. Cronologia tecnica dei bug di layout mobile più insidiosi del progetto, utile
> come riferimento per non reintrodurli.

| ID | Task | Owner | Stato | Priority | Acceptance |
|----|------|-------|-------|----------|------------|
| **DS-03** | **Regole fuori da `@layer` in `global.css` sovrascrivevano le utility Tailwind** — `*,*::before,*::after{margin:0;padding:0}` (duplicato del preflight, già in `@layer base`) azzerava `pt-16`, `p-lg`, `mb-1`, ecc. in tutta l'app; il blocco `a{color:var(--color-primary);text-decoration:underline}` (non layered) rendeva illeggibile ogni link con `text-on-*` custom (es. "+ Nuovo Task" testo blu su sfondo blu, icona "+" del FAB invisibile) | ARCHITECT | ✅ **DONE (2026-08-13)** | **HIGH** | Reset duplicato rimosso; blocco `html/body/h1-h6/a/button/:focus-visible/img/input` spostato in `@layer base`. Verificato in browser (`npm run dev`, viewport mobile): header non copre più i contenuti, card hanno padding, "+ Nuovo Task" e icona FAB visibili. `npm run build` conferma `box-sizing:border-box;margin:0;padding:0` presente una sola volta (dentro `@layer base`) invece di due |
| **DS-04** | `Layout/TopAppBar.jsx` nascondeva l'header mobile con `sm:hidden` (breakpoint 640px) mentre `BottomNav`/`SideNavBar` usano `lg:hidden`/`hidden lg:flex` (1024px): tra 640-1024px l'app perdeva sia la sidebar desktop sia il TopAppBar mobile | UI ENGINE | ✅ **DONE (2026-08-13)** | MEDIUM | `TopAppBar.jsx`: `sm:hidden` → `lg:hidden`, coerente con gli altri componenti di navigazione |
| **DS-05** | Nessun link/NavLink della navigazione (`BottomNav`, `SideNavBar`, `MobileSideNav`, `TopAppBar`, `FAB`, CTA "+ Nuovo Task"/"+ Nuovo Elemento") resettava la sottolineatura ereditata dalla regola base `a{text-decoration:underline}` | UI ENGINE | ✅ **DONE (2026-08-13)** | LOW | Aggiunta classe `no-underline` a tutti i Link/NavLink dei componenti di navigazione e delle CTA principali |
| **DS-06** | **Il testo rimpiccioliva sotto i 640px** — `global.css:315-319` forzava `html{font-size:14px}` in un `@media (max-width:639px)`, mentre l'intero design system usa token `rem`: ogni misura di testo si riduceva del 12,5% proprio su mobile, dove servirebbe restare leggibile (es. "+ Nuovo Task" da 11px dichiarati a 9,6px reali, sotto ai 44px minimi anche l'altezza tocco dei pulsanti). Scoperto da una review esterna (`agenda-intelligente-review.pptx`, 2026-08-13) | UI ENGINE | ✅ **DONE (2026-08-13)** | **HIGH** | Rimossa la media query da `global.css`; resta solo `html{font-size:16px}` già definito in `@layer base` — i token rem tornano automaticamente alle dimensioni previste, su tutti i viewport. Verificato: `getComputedStyle(document.documentElement).fontSize` → `16px` |
| ~~DEBT-01~~ | ~~Consolidare i componenti di navigazione~~ | UI ENGINE | ✅ **DONE (2026-08-13)** | MEDIUM | **Rimossa** l'intera cartella `src/ui/components/Responsive/` (`MobileNav.jsx`, `DesktopNav.jsx`, `index.js`) — confermato zero import prima di cancellare (`grep` su tutto `src/`), contenuto palesemente superato (commenti tipo "Mappa varianti Bootstrap a colori Stitch", nav items non allineati alle route attuali). **Riesaminati i restanti 6** (`TopAppBar`, `DesktopTopAppBar`, `SideNavBar`, `MobileSideNav`, `BottomNav`, `FAB`): non sono duplicati tra loro, sono complementari — `BottomNav` (4 scorciatoie sempre visibili) e `MobileSideNav` (drawer con tutte le 6 rotte) sono superfici diverse per un motivo di UX reale (bottom-tab-bar + hamburger drawer è un pattern mobile standard), non un doppione da fondere. Nessun ulteriore accorpamento consigliato. Verificato: `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK, navigazione confermata funzionante in browser dopo la rimozione |
| ~~DEBT-02~~ | ~~Ambiguità `src/logic/hooks.js` e `src/logic/hooks/`~~ | LOGIC ENGINE | ✅ **DONE (2026-08-13)** | MEDIUM | `src/logic/hooks/` conteneva solo `useResponsive.js` (`useDesktop`/`useMobile`/`useResponsive`), **mai importato da nessuna parte** (confermato con `grep` su tutto `src/`) — l'app gestisce il responsive interamente via classi Tailwind (`lg:hidden` ecc.), non con hook JS basati su `resize`. Cartella rimossa: resta un solo percorso, `src/logic/hooks.js`, quello davvero usato da 10 file. Verificato: `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK |
| ~~DEBT-03~~ | ~~Doppio package manager~~ | ARCHITECT | ✅ **DONE (2026-08-13)** | MEDIUM | Scelto **npm**: `package-lock.json` era il lockfile aggiornato (rifletteva già vitest/jsdom/cross-env aggiunti in questa sessione), `pnpm-lock.yaml` era fermo al giorno prima; il README stesso raccomandava già npm segnalando che pnpm falliva con `ERR_PNPM_IGNORED_BUILDS`; `pnpm-workspace.yaml` non definiva nemmeno un vero workspace (nessun campo `packages:`, serviva solo per l'approvazione script di pnpm) e `package.json` non ha un campo `workspaces`. Rimossi `pnpm-lock.yaml` e `pnpm-workspace.yaml`; rimossa la nota di aggiramento dal README, aggiunta una sezione "Test" mancante nello stesso punto. Verificato: `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK |
| ~~DEBT-06~~ | ~~I 4 dropdown della barra filtri in Agenda mostravano tutti "Tutti" senza etichetta visibile~~ | UI ENGINE | ✅ **DONE (2026-08-13)** | LOW | Aggiunto uno `<span>` con il testo di `label` ("Tipo"/"Stato"/"Importanza"/"Data") sopra ciascun pulsante in `FilterDropdown.jsx`; `aria-label` lasciato invariato (già corretto per gli screen reader). Griglia di `FilterBar.jsx` passata da `items-center` a `items-end` così le 4 caselle con etichetta, il dropdown Ordina e il pulsante Reimposta restano allineati sulla stessa riga di base invece di centrarsi in modo disomogeneo. Verificato visivamente in browser (viewport tablet 780px): etichette leggibili, nessuna sovrapposizione, `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK |
| DEBT-04 | ~~Riallineare README.md al codice~~ | ORCHESTRATOR | ✅ **DONE (verificato 2026-08-13)** | MEDIUM | Nessuna affermazione del README contraddetta dal codice. Verifica 2026-08-13: `README.md` già cita `db.js` (riga 130), `FiltersPage` (146), `CalendarWidget` (154, 193); nessun riferimento a `notifications/sw.js` (eliminato); sezione dedicata "⚠️ Limitazioni note" ridimensiona già la promessa "notifiche con app chiusa" in linea con [Limiti reali](#-limiti-reali-delle-notifiche-con-app-chiusa). Il riallineamento risale evidentemente al lavoro del 2026-08-12 (FIX-*/DS-01/PWA-01), solo mai marcato come chiuso in questa tabella |
| **DS-07** | **Le pagine desktop non scrollavano mai, a prescindere dal contenuto** — ogni pagina avvolge il proprio contenuto desktop in un div `lg:flex-1 lg:overflow-y-auto`, ma il suo genitore (il contenitore radice della pagina, `h-full` senza `flex`) non era un flex container: `flex-1` non ha alcun effetto su un figlio il cui genitore non è `display:flex`, quindi il div si auto-dimensionava sul contenuto e non c'era mai un reale overflow da scrollare (`scrollHeight === clientHeight` sempre). A monte, `<main>` in `MainLayout.jsx` ha `lg:overflow-visible`: per specifica CSS un flex item con `overflow:visible` ha un'altezza minima automatica pari al **min-content** (non 0), quindi `<main>` si espandeva oltre il viewport per contenere tutto il contenuto della pagina, propagando l'altezza sbagliata a tutta la catena `h-full` sottostante. Bug presente su **tutte** le pagine (Dashboard/Agenda/Tasks/Filters/Alerts/Settings/Create), mai emerso perché il contenuto era sempre stato abbastanza corto da stare nel viewport — scoperto dall'utente il 2026-08-14 dopo l'aggiunta delle nuove sezioni di Settings (ROAD-02/03), che hanno reso il contenuto abbastanza alto da esporlo | UI ENGINE | ✅ **DONE (2026-08-14)** | **HIGH** | Aggiunto `lg:min-h-0` a `<main>` in `MainLayout.jsx` (permette all'elemento di restringersi sotto il suo min-content pur restando `overflow-visible`); aggiunto `lg:flex lg:flex-col` al contenitore radice di tutte le 7 pagine e `lg:min-h-0` al loro div `lg:flex-1 lg:overflow-y-auto` (permette a quel div di restringersi al posto di crescere con il contenuto). Verificato in browser reale a viewport ridotto (650px di altezza): `Settings` — prima `scrollHeight === clientHeight` (1069 === 1069, nessuno scroll possibile) nonostante il contenuto eccedesse la viewport; dopo, `main.clientHeight` correttamente vincolato a 586px, `canScroll: true`, scroll reale con la rotellina del mouse fino a `scrollTop: 482` (quasi il massimo). Nessuna regressione su Dashboard/Agenda (screenshot + console puliti). `npm run lint` 0 errori/39 warning, `npm run build` OK |
| **DS-08** | **Pagina bianca per un utente con una tab già aperta subito dopo un nuovo deploy** — `registerType: 'autoUpdate'` + `self.skipWaiting()` incondizionato su `install` in `src/sw.js` fanno sì che il nuovo Service Worker si attivi quasi subito e forzi un `location.reload()`; se in quel momento un `import()` dinamico di una pagina lazy sta ancora puntando a un chunk con hash della build precedente (già sparito da Render, che sostituisce l'intera `dist`), la fetch fallisce 404, Vite emette `vite:preloadError` mai gestito, e senza `ErrorBoundary` l'albero React crasha silenziosamente. Segnalato dall'utente due volte di fila subito dopo due deploy consecutivi, mai riprodotto nei tab di verifica (sempre senza SW precedente) — spiegazione architetturale, non confermata con un secondo deploy live | ARCHITECT | ✅ **DONE (2026-08-14)** | **HIGH** | Aggiunto in `main.jsx` il listener ufficiale di Vite per questo scenario, `vite:preloadError` → `location.reload()`, con guard `sessionStorage` anti-loop e reset 5s dopo il mount riuscito. `npm run lint` 0 errori/39 warning, `npm run build` OK. **Da confermare al prossimo redeploy reale** (non verificabile senza una tab già aperta sulla build precedente al momento del deploy) |
| **DS-09** | **Scroll orizzontale su desktop in due punti** — (1) `UpcomingCards.jsx` (sezione "Scadenze Imminenti", colonna destra della dashboard desktop): scritto come carosello mobile con card a larghezza fissa `min-w-[280px]` dentro `flex overflow-x-auto snap-x`, ma renderizzato invariato anche nella colonna desktop (~280-320px, `lg:col-span-3` su 12): troppo stretta perfino per una singola card, scrollbar orizzontale con testo tagliato a metà — riprodotto dal vivo su Render (`scrollWidth` 1176px vs `clientWidth` 284px). (2) `ViewToggle.jsx` (Giornaliera/Settimanale/Prossime in Agenda): `overflow-x-auto` aggiunto deliberatamente in una sessione precedente perché su schermi stretti la riga eccedeva il contenitore, tagliata silenziosamente dall'`overflow-hidden` della shell radice in `MainLayout.jsx` — non riprodotto dal vivo in questa sessione (resize del viewport del browser di automazione non funzionante), ma il codice stesso documentava il problema in un commento. Nuova regola esplicita del progetto: mai scroll orizzontale su desktop, gli elementi si ridimensionano o si impilano; su mobile solo scroll verticale | UI ENGINE | ✅ **DONE (2026-08-14)** | **HIGH** | **UpcomingCards**: da `lg:` in su il contenitore passa da riga (`flex`) a colonna (`lg:flex-col`), scroll orizzontale disattivato (`lg:overflow-x-visible lg:snap-none`), le card passano da `min-w-[280px]` fisso a `lg:w-full lg:min-w-0` (il carosello con snap/swipe resta invariato sotto `lg:`, dove ha senso). **ViewToggle**: rimosso `overflow-x-auto`; i 3 pulsanti diventano `flex-1 min-w-0` (si dividono lo spazio disponibile e si restringono insieme, mai overflow) con l'etichetta in `truncate` come rete di sicurezza estrema; l'`overflow-hidden` della shell radice lasciato invariato (serve all'architettura di scroll dell'intera app, DS-07/DS-08 — non è la causa da rimuovere, la vera causa era il componente che eccedeva). Cercati altri `overflow-x-auto`/`overflow-x-scroll` in tutto `src/`: nessun altro caso (solo `body{overflow-x:hidden}` in `global.css`, safety net globale legittimo, invariato). **Verificato in browser reale** (3 task creati via UI, uno con titolo di 89 caratteri, viewport 1528px): sezione desktop "Scadenze Imminenti" → `containerScrollWidth === containerClientWidth` (284px, nessun overflow), `flexDirection: column`, card impilate verticalmente (top 128px e 390px, non affiancate), titolo lungo interamente visibile su più righe, screenshot di conferma. **ViewToggle**: contenitore forzato via JS a 1024/600/375/320/280px → `scrollWidth === clientWidth` a **ogni** larghezza testata, etichette sempre leggibili per intero senza troncamento anche al limite di 280px. `npm run lint` 0 errori/39 warning, `npm run build` OK |
| **DS-10** | **Su mobile reale il footer/FAB copriva permanentemente il fondo del contenuto scrollabile, anche a scroll ultimato** — causa reale (diagnosticata e risolta con un emulatore Android + Chrome DevTools Protocol via `adb`, non con l'automazione desktop): il wrapper `<div className="h-full min-h-full">` subito dentro `<main>` in `MainLayout.jsx` aveva `h-full` (height:100%, un'altezza **fissa**). Quando il contenuto reale di una pagina supera quell'altezza fissa, trabocca solo **visivamente** (`overflow: visible`, nessun contenitore interno ha un proprio scroll) senza spostare il flusso: `pb-48` su `<main>` veniva quindi calcolato rispetto all'altezza di *layout* del wrapper (mai più alta del viewport), non rispetto a dove il contenuto finiva davvero — l'ultimo testo di ogni pagina lunga restava a ~25px dal fondo invece dei 192px attesi. Il tentativo iniziale di sostituire `pb-48` con uno spacer reale (`<div className="h-48" />` dopo il wrapper) non ha funzionato per lo stesso motivo: anche lo spacer, come sibling del wrapper a altezza fissa, veniva posizionato in base all'altezza di *layout* del wrapper, non a quella del suo contenuto traboccato. `h-dvh` (invece di `h-screen`) in due punti resta comunque applicato come miglioramento corretto ma separato (mismatch reale tra `100vh` e l'altezza visibile sui browser mobili con barra indirizzi dinamica) — non era la causa di questo bug specifico | UI ENGINE | ✅ **DONE (2026-08-14), verificata su device reale** | **HIGH** | Wrapper cambiato da `h-full` a **`min-h-full lg:h-full`**: sotto `lg` (`min-height:100%`) il div può crescere oltre il viewport quando il contenuto lo richiede, trascinando `pb-48` di `<main>` nel punto corretto; da `lg` in su torna `h-full` (altezza vincolata) perché **DS-11** (rifacimento layout dashboard/pagine desktop, stesso giorno) dipende da questa stessa catena `h-full`/`min-h-0` per il proprio scroll interno (`lg:overflow-y-auto`) — con solo `min-h-full` su desktop quello scroll smetteva di funzionare (regressione trovata e corretta nello stesso giro di verifica). **Verificato con emulatore Android reale (Pixel 6, Chrome) via CDP** (`adb forward tcp:9222`, misure `getBoundingClientRect()`/`scrollHeight` dirette + screenshot): prima del fix, testo finale a 25px dalla BottomNav (sovrapposto); dopo, gap di ~177px, sezione "Prossimamente" interamente visibile, confermato anche visivamente. Desktop rivereificato dopo il fix: `canScroll: true` su Settings, nessuna regressione su Dashboard (screenshot + console puliti). `npm run lint` 0 errori/39 warning, `npm run build` OK |
| **DS-11** | **Contenuto tagliato orizzontalmente in Agenda/Filtri su mobile reale, nessuno scroll** — `AgendaHeader.jsx`: gruppo sinistro (data + bottoni "Oggi"/"Scegli data") con `flex-wrap` dentro un genitore `items-start` (necessario per non stirare i due gruppi in altezza), che però lascia i figli larghi quanto il contenuto invece che a piena larghezza — `flex-wrap` senza una larghezza di contenitore su cui avvolgersi non va mai a capo, eccede il viewport, `body{overflow-x:hidden}` taglia il bordo destro. Confermato dall'utente non essere zoom (pinch-zoom non risolve) e isolato ad Agenda (non la shell globale) | UI ENGINE | ✅ **DONE (2026-08-14), verificata su device reale** | **HIGH** | Aggiunto `w-full lg:w-auto` al gruppo sinistro in `AgendaHeader.jsx`. `FilterBar`/`FilterDropdown`/`ViewToggle` riesaminati, già corretti (non la causa). **Verificato con emulatore Android reale (Pixel 6, Chrome) via CDP**: `document.documentElement.scrollWidth === clientWidth === innerWidth` (412px, tutti uguali) → **zero overflow orizzontale**. Screenshot di conferma sulla stessa identica schermata del bug originale (Agenda, filtri aperti): "Tutti"/"Reimposta"/ViewToggle ora interamente contenuti nello schermo, bordi arrotondati visibili su tutti i lati (prima tagliati di netto a destra) |
| **DS-12** | **Overflow orizzontale residuo dopo DS-11, e icone `ViewToggle` non nascondibili** — (1) il wrapper radice in `MainLayout.jsx` (`flex-1 lg:ml-64 flex flex-col h-dvh relative`) è un flex item della shell radice senza `min-w-0`: si rifiutava di restringersi sotto la larghezza minima naturale del contenuto di Agenda (439px misurati contro 412px di viewport reale), tagliato silenziosamente da `overflow-hidden` — stesso pattern di ViewToggle/AgendaHeader ma non ancora applicato alla radice. (2) `hidden sm:inline` sull'icona del `ViewToggle` non aveva effetto: il foglio di stile Material Symbols (fuori da ogni `@layer` Tailwind) impone `display:inline-block` con priorità più alta di qualunque utility `@layer`-based. Segnalato dall'utente confrontando gli screenshot ("il lato destro non è centrato"), diagnosticato con emulatore Android + CDP (misure dirette, non screenshot) | UI ENGINE | ✅ **DONE (2026-08-14), verificata su device reale** | **HIGH** | `min-w-0` aggiunto al wrapper radice di `MainLayout.jsx`. `hidden sm:inline` spostato su uno `<span>` che avvolge l'icona invece che sull'icona stessa. Verificato via CDP: `main` esatto a 412.19px, `ViewToggle` simmetrico (392px destro = 20px sinistro), icone assenti dal DOM visibile sotto `sm:`. Screenshot di conferma |
| ~~DEBT-05~~ | ~~Il Service Worker non si installava mai in `npm run dev`~~ | ARCHITECT | ✅ **DONE (2026-08-13)** | MEDIUM | **Causa reale** (la prima diagnosi era parzialmente sbagliata — vedi nota): in dev `vite-plugin-pwa` sostituisce `self.__WB_MANIFEST` con un array **vuoto** `[]` (non `undefined`), quindi `precacheAndRoute([])` non lancia nulla. Il crash sincrono era nella riga **successiva**: `createHandlerBoundToURL('index.html')` cerca `'index.html'` nella precache e, trovandola vuota, lancia subito `WorkboxError('non-precached-url', ...)` — fa fallire l'intera valutazione dello script del SW, che quindi non si installa mai. Confermato con `import('/dev-sw.js?dev-sw')` diretto dalla console, che riporta l'errore per esteso (invece del generico "script evaluation failed" di `register()`). **Fix:** in `src/sw.js`, `registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))` ora gira solo `if (precacheManifest.length > 0)` — in dev viene saltata (non serve comunque, l'offline SPA fallback ha senso solo in produzione), in build resta invariata. **Verificato:** in dev, `navigator.serviceWorker.getRegistrations()` → un SW attivo, `scriptURL: dev-sw.js`; in produzione (`npm run preview`, porta 4174) invariato, un SW attivo, `scriptURL: sw.js`, manifest 24 asset. `npm run build`, `npm run lint` (0 errori/37 warning) e `npm test` (49/49) tutti confermati dopo la modifica |

---

## 🗺️ Roadmap — Prossimi Sviluppi (handoff 2026-08-14)

> Fonte: sessione di brainstorming del 2026-08-14 con Claude (Cowork), raccolta in
> `agenda-intelligente-roadmap-handoff.md` (rimosso dopo l'estrazione in questo documento — il
> contenuto vive qui). Il core plan (92/92, vedi sopra) resta chiuso: questi sono **nuovi** task,
> non conteggiati nel TOTALE.
>
> **Priorità 1** va implementata e **attivata subito** (nessun account esterno o DB necessario).
> **Priorità 2** va creata ma tenuta **spenta/non montata** in UI finché non si ottiene l'account
> Google AdSense. **Priorità 3** va **scaffoldata ma non collegata**: struttura pronta, nessun wiring
> reale, perché dipende da un database futuro (l'app resta local-first/IndexedDB per ora).

### Priorità 1 — da implementare e attivare subito

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-01** | **Deploy su Render come Static Site** | ORCHESTRATOR | - | ✅ **DONE (2026-08-14)** | **HIGH** | Live su **https://smart-planner-vjgl.onrender.com** come Static Site (non Web Service): SPA React/Vite puramente client-side, evita lo spin-down/cold-start dei Web Service gratuiti, a costo zero. Build command `npm run build`, publish directory `dist`. Verificato in browser reale: Dashboard carica senza errori console; navigazione diretta a `/agenda` (simula refresh su rotta non-home) renderizza la pagina invece di un 404 → rewrite rule `/* → /index.html` configurata correttamente; Service Worker registrato e **attivo** (`scriptURL: /sw.js`, `state: activated`); `/manifest.webmanifest` raggiungibile (200), servito con `content-type: binary/octet-stream` invece di `application/manifest+json` (dettaglio minore, non blocca l'installabilità su Chrome) |
| **ROAD-02** | **Sezione "Prossimamente" in Settings** | UI ENGINE | - | ✅ **DONE (2026-08-14)** | **HIGH** | Nuova sezione in `SettingsPage.jsx` (componente `ComingSoonSettings`), contenuto pilotato dall'array `UPCOMING_FEATURES` (`{ titolo, descrizione, stato }`, non JSX hardcoded). 4 voci: quick add intelligente (in valutazione), feedback dall'app (in arrivo — ROAD-03), annunci discreti (in valutazione), profili utente personali (in valutazione). Linguaggio vago sui tempi, nessuna data. **Bug di layout trovato e corretto durante la verifica**: il badge di stato allineato a fine riga (`justify-between` su tutta la larghezza della card) finiva dietro al FAB fisso in basso a destra — spostato accanto al titolo (`flex items-center gap-2`), indipendente dalla larghezza viewport. Verificato in browser reale (`npm run dev`): le 4 voci renderizzano coi testi attesi, nessun overlap col FAB (controllato via `getBoundingClientRect()` su ciascun `<li>` contro il FAB, tutti `overlap:false`), nessun errore console. `npm run lint` 0 errori/39 warning (invariato), `npm run build` OK |
| **ROAD-03** | **Form di feedback categorizzato → GitHub Issues** | UI ENGINE | ROAD-02 | ✅ **DONE (2026-08-14)** | **HIGH** | `src/ui/components/Feedback/FeedbackForm.jsx`, montato in Settings: select categoria (**Bug** → label `bug` / **Idea-richiesta funzione** → `enhancement` / **Feedback tecnico** → `feedback tecnico`) + textarea descrizione, entrambi `required`; l'invio apre in una nuova tab `github.com/MindrasEugen/Smart-planner/issues/new?title=...&body=...&labels=...` precompilato in base alla categoria, poi resetta il form. Nessun backend: solo `window.open` con `URLSearchParams`. **Bug trovato e corretto durante la verifica**: uno stato `errors`/`setErrors` con validazione JS personalizzata era codice morto — i `required` HTML nativi su select/textarea bloccano già il submit (e quindi il mio `onSubmit`) prima che potesse mai eseguirsi, confermato con `element.validity.valid`/`validationMessage`; rimosso, la validazione nativa del browser basta. Verificato in browser reale (`npm run dev`, monkey-patch di `window.open` per catturare l'URL senza aprire una issue vera): submit vuoto bloccato (nessun `open` chiamato), le 3 categorie generano titolo/label/host/path corretti (`github.com/MindrasEugen/Smart-planner/issues/new`), form resettato dopo l'invio, nessun errore in console dopo un reload pulito. `npm run lint` 0 errori/39 warning (invariato), `npm run build` OK |

### Priorità 2 — creati ma **NON attivi** (bloccati da approvazione account esterno, non da DB)

> **Nota 2026-08-25:** su richiesta dell'utente, rimossa la voce teaser "Annunci discreti" dalla
> sezione "Prossimamente" di Settings (`UPCOMING_FEATURES` in `SettingsPage.jsx`) — non si vuole più
> anticipare la cosa agli utenti per ora. **ROAD-04/05 restano nel piano** come possibilità futura,
> stato invariato (⬜ TODO, mai implementati): la rimozione ha toccato solo il testo annuncio in UI,
> non il codice/piano sottostante.

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-04** | **ConsentBanner (consenso privacy/cookie)** | UI ENGINE | attivare in coppia con ROAD-05 | ⬜ TODO | MEDIUM | `ConsentBanner.jsx`: barra/modal Accetta/Rifiuta, salvata in `localStorage` (chiave `cookie-consent`). Google Consent Mode v2: `gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied'})` di default, `update` a `granted` su accettazione. Aggiunta pagina/sezione Privacy Policy raggiungibile dalle Settings (uso previsto di cookie e Google AdSense). **Il banner NON va montato nell'app** finché gli annunci (ROAD-05) non sono attivi — non c'è ancora nulla per cui chiedere consenso |
| **ROAD-05** | **AdBanner (placeholder Google AdSense)** | UI ENGINE | - | ⬜ TODO | MEDIUM | `AdBanner.jsx`: spazio a dimensione fissa riservato (90px altezza) in fondo a Settings, per evitare layout shift quando conterrà l'annuncio reale. Per ora placeholder statico ("Spazio pubblicitario"). La vera integrazione (`adsbygoogle`) + ROAD-04 vanno attivate **insieme**, solo dopo approvazione account Google AdSense (prerequisito fuori dal codice: creare l'account, aggiungere `ads.txt` in `public/`) |

### Priorità 3 — scaffolding creato, **non collegato** (dipende da un database futuro)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-06** | **Quick add AI — Gemini + rate limit** | UI ENGINE + LOGIC ENGINE | - | ✅ **DONE (2026-08-26)** | LOW | Pipeline completa (non solo scaffolding), riusa il backend Express già deployato su Render per il Web Push (zero costo di hosting aggiuntivo). **Backend**: `server/src/ai.js` (Gemini via REST, `responseSchema` per output strutturato), `server/src/routes/quickAdd.js` (`POST /api/quick-add`, dietro lo stesso `requireSyncSecret` degli altri endpoint), rate limit **5/giorno per dispositivo** (non per utente: non esiste ancora login, vedi ROAD-07) via tabella `quick_add_usage` (RLS abilitata a secco, stessa postura delle altre tabelle), `GEMINI_API_KEY`/`GEMINI_MODEL`/`QUICK_ADD_DAILY_LIMIT` in `server/.env.example` + `render.yaml`. **Frontend** (delegato a Mistral, poi revisionato): `src/logic/ai/deviceId.js`, `src/logic/ai/quickAdd.js` (stesso pattern `authedFetch`/`isXConfigured` di `sync.js`), `QuickAddInput.jsx` montato in `CreatePage.jsx` solo per task nuovi, `initialData` propagato a `TaskForm.jsx`/`useTaskForm.js`. **Bug trovato e corretto in revisione**: `QuickAddInput.jsx` aveva un `return null` scritto PRIMA delle `useState` (violazione Rules of Hooks), spostato dopo. **Scoperta in verifica**: `gemini-2.5-flash` non è più disponibile per nuovi utenti (l'API risponde 404 e suggerisce il successore) — default cambiato a **`gemini-3.6-flash`** in `ai.js`/`.env.example`/`render.yaml`. **Verificato end-to-end con una `GEMINI_API_KEY` reale** (server locale su porta 3099, DB reale `vhyqsdabneswjymlytbe`): estrazione corretta di titolo/data (relativa, "venerdì" → data giusta)/ora/importanza (dedotta da "importante" → HIGH) su testo libero reale; 5 chiamate consecutive stesso `deviceId` → `remaining` scende 4→3→2→1→0, la 6ª risponde **429** col messaggio corretto; un `deviceId` diverso non è affetto dal limite dell'altro; testo >500 caratteri → 400; `deviceId`/`text` mancanti → 400; richiesta senza `Authorization` → 401. Dati di test ripuliti da `quick_add_usage` dopo la verifica. `npm run lint` 0 errori/53 warning, `npm run build` OK, `npm test` server 4/4 |
| **ROAD-07** | **Sistema di profili utente reale (auth Supabase + RLS)** | LOGIC ENGINE + UI ENGINE | - | 🟡 IN_PROGRESS | LOW | **2026-08-26**: fix di sicurezza critico applicato — RLS abilitata "a secco" su `items`/`subscriptions`/`sent_notifications` (migrazione `enable_rls_lockdown_public_tables`, verificato via Security Advisor: solo notice INFO residue, nessun errore). Scaffolding auth completo, non ancora attivo end-to-end: `src/logic/auth/` (client Supabase, `signUp`/`signIn`/`signOut`, `useAuthSession`), `src/ui/components/Auth/` (`LoginForm`, `RegisterForm`, `ProtectedRoute`), `src/ui/pages/LoginPage.jsx` + `RegisterPage.jsx` montati su `/login`+`/register` in `App.jsx` (raggiungibili, ma inerti: senza `.env` locale `signIn`/`signUp` restituiscono sempre "Supabase Auth non configurato"). Migrazione SQL vera pronta in `supabase/drafts/add_user_ownership_and_rls.sql` (colonna `user_id`, policy `auth.uid()`, dati di test esistenti da cancellare — decisione presa, non ancora eseguita). Manca ancora: `.env` locale con credenziali Supabase, `ProtectedRoute` applicata alle route esistenti, esecuzione della migrazione vera, verifica con due utenti reali. **Target: entro fine settembre 2026** (annunciato in Settings → Prossimamente, date volutamente vaghe per scelta dell'utente) |

**ROAD-07 — passi ancora da fare, non coperti sopra** (da `piano-fix-rls-e-autenticazione.md`, integrato qui e poi rimosso):
- Attivare il provider **Email** in Supabase Auth (dashboard progetto `vhyqsdabneswjymlytbe`) — decidere se richiedere conferma email o no. Non ancora fatto.
- **Decisione prodotto aperta**: cosa succede a un utente non loggato quando l'auth sarà attiva — redirect obbligato a `/login`, o l'app resta usabile in modalità limitata/anonima? Da decidere con l'utente prima di collegare `ProtectedRoute` alle route esistenti.
- Ogni `item`/`subscription` creato dal client dovrà includere `user_id: session.user.id`; le letture non dovranno più filtrare a mano lato client (RLS restituisce già solo le righe dell'utente loggato) — basta garantire che le richieste passino da un client Supabase autenticato, non con l'anon key nuda.
- **Checklist di verifica finale** prima di considerare ROAD-07 davvero DONE: login con due utenti diversi → ognuno vede solo i propri item/subscription; una chiamata con la sola anon key (nessuna sessione) → RLS blocca, nessuna riga restituita; Security Advisor ri-eseguito e pulito; invio notifiche push ancora funzionante dopo l'attivazione (tocca `subscriptions`/`sent_notifications`, ora protette da RLS).

### Meta

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-08** | **Aggiornare PLAN.md e README.md a fine implementazione** | ORCHESTRATOR | ROAD-01..07 | ⬜ TODO | MEDIUM | Dopo aver implementato le voci sopra (anche solo alcune): `README.md` — tabella feature + limiti noti aggiornati riflettendo cosa è stato effettivamente attivato; `PLAN.md` — stato di ogni `ROAD-*` aggiornato distinguendo chiaramente "fatto/attivo" da "creato ma non collegato" (Priorità 2/3, usare la nota `✅ DONE (non attivo)` accanto al task) da "da fare" |

**Ordine di lavoro:** Priorità 1 (ROAD-01/02/03) chiusa. Priorità 2 (ROAD-04/05) in attesa
dell'account Google AdSense. Priorità 3: ROAD-06 chiuso, **ROAD-07 (profili utente) è il prossimo
lavoro grosso** — vedi checklist sopra.

---

## 🎨 Fix UX da uso reale — sessione 2026-08-27

> Handoff ricevuto come `prompt-fix-ux-agenda-intelligente.md` (root del repo, non committato — file
> di lavoro dell'utente, poi cancellato una volta integrato qui): 5 punti "alta priorità" emersi
> dall'uso reale dell'app online, discussi uno per uno con l'utente prima di implementare (non presi
> alla lettera: 2 punti sono stati corretti in corso d'opera rispetto a come erano scritti nel
> prompt, vedi sotto). **Verificato ad ogni passo**: `npm run lint` (0 errori), `npm run build`,
> `npm test` (49/49 client, 4/4 server), più verifica visiva reale (Playwright headless
> mobile-viewport, e per il punto 1 anche emulatore Android reale via CDP). Seconda parte della
> stessa sessione — ulteriori richieste emerse in conversazione, non dal prompt originale — in fondo
> a questa sezione. **Tutto committato** (`fbbda6e`, `c9b31b5`, `245b85e`).

| # | Cosa | Stato | Dettaglio |
|---|------|-------|-----------|
| 1 | Nav bar bassa sparita in creazione task | ✅ DONE | Non era un bug nascosto: `hideNav` in `MainLayout.jsx` nascondeva deliberatamente `BottomNav` su `/create/*`+`/edit/*`. Tolta la `BottomNav` da quella condizione (il `FAB` resta nascosto lì, correttamente). Riprodotto il malinteso iniziale (avevo capito "sparisce dopo il salvataggio", non riproducibile) prima di capire che il problema era "sparisce mentre sei sulla schermata stessa" |
| 2 | "Scadenze Imminenti" carosello orizzontale su mobile | ✅ DONE | Era design intenzionale (commentato nel codice), non un bug — confermato col l'utente che il cambio è voluto. `UpcomingCards.jsx`: lista verticale a larghezza piena anche su mobile, tolto `overflow-x-auto`/`snap-x`, aggiunto `break-words` su titolo/descrizione per evitare overflow orizzontale |
| 3 | Quick Add — salvataggio automatico | ✅ DONE | Guardrail deciso insieme all'utente (non "auto-save sempre"): Gemini ora restituisce anche `dateSpecified`/`timeSpecified` (booleani, true solo se il testo conteneva un riferimento esplicito, anche vago). Task salvato subito **solo se entrambi true**; altrimenti resta il flusso attuale (form pre-compilato, revisione manuale). Aggiunto toast di conferma con pulsante **Annulla** (estesa `useToast`/`Toast.jsx` con un `action` opzionale) che cancella il task appena creato. Verificato con chiamate reali a Gemini: "venerdì alle 15" → auto-save; "comprare il latte" (niente data/ora) → form; "domani" senza ora → form (il gate richiede *entrambi*) |
| 4 | Dashboard — categorie cliccabili con filtro | ✅ DONE | La Dashboard reale (`DashboardPage.jsx`) è diversa da un componente `Dashboard.jsx` che avevo letto per primo — quello è **codice morto**, mai importato: analisi iniziale corretta a metà lavoro. Aggiunte sezioni Media/Bassa priorità (prima solo Alta) via `getMediumPriorityItems`/`getLowPriorityItems` (nuovi selector, riusano `getItemsByImportance` già esistente); `PriorityList.jsx` generalizzato con `title`+`importance`, intestazione cliccabile → naviga in Agenda con quel filtro. Aggiunto nuovo valore filtro **"Imminenti"** in `useFilters.js`/`filters.js` (`dateFilter: 'IMMINENT'`, stesso criterio della card Dashboard) — si inserisce nel dropdown "Data" già esistente in `FilterBar.jsx`, nessuna nuova UI. "Scadenze Imminenti" ora cliccabile anch'essa |
| 5 | Avviso sonoro per le scadenze | ⬜ RIMANDATO | Su richiesta dell'utente, non implementato ora — da riprendere in futuro. Nota tecnica lasciata in sospeso: un audio personalizzato può suonare solo ad app aperta (foreground), non da un push in background (limite del Service Worker, non di questo progetto) |

### Seconda parte della sessione — richieste emerse in conversazione (non dal prompt originale)

| # | Cosa | Stato | Dettaglio |
|---|------|-------|-----------|
| 6 | Task completati nascosti dalla Dashboard a fine giornata | ✅ DONE | Nuovo `isStaleCompleted(item)` in `selectors.js`: nasconde dalla Dashboard (non dai dati, restano sempre in Agenda) i task completati la cui giornata di scadenza è passata. Applicato in `hooks.js` a `upcomingItems`/`overdueItems`/`highPriorityItems`/`mediumPriorityItems`/`lowPriorityItems` — **filtrati anche per `type === 'TASK'`**, perché durante la verifica è emerso un bug reale preesistente: i Compleanni comparivano comunque in quelle liste (nessun filtro le escludeva), bypassando del tutto la finestra temporale del punto 7 sotto |
| 7 | Compleanno visibile in Dashboard solo in una finestra, non tutto l'anno | ✅ DONE | Nuovo `getUpcomingBirthdayForDashboard()` in `selectors.js`: mostra il compleanno solo tra "prima notifica" (scadenza − `startBefore`) e fine della giornata del compleanno. `nextBirthday` esposto da `useAgenda()`, sostituisce il vecchio `birthdays[0]` (mostrava sempre il primo compleanno in assoluto, senza criterio) |
| 8 | Nota "task completati rimossi a fine giornata" in Dashboard | ✅ DONE | Nuovo `AutoCleanupNotice.jsx`: compare a ogni apertura dell'app, sparisce da sola dopo 30s con fade-out (`animate-fade-out`, nuovo keyframe in `global.css`), o subito col tasto ✕. Verificato con `page.clock` di Playwright (visibile a 29s, in dissolvenza a 30.5s, rimossa dal DOM dopo il fade-out) |
| 9 | Toast troppo trasparente | ✅ DONE | `Toast.jsx`: sfondo passato da `bg-{colore}/10` (10% opacità) a `bg-surface-container-lowest` solido + bordo colorato pieno a sinistra, `shadow-lg` + `border-outline-variant`. Verificato con una vera notifica di auto-save Quick Add |
| 10 | Colore priorità Bassa poco visibile | ✅ DONE | `PriorityList.jsx`: da `bg-tertiary-container` (`#003f23`, verde quasi nero) a `bg-tertiary-fixed` (`#91f8b8`, stesso verde ma chiaro) — stesso token della palette, non cambia tra i temi |
| 11 | Click categorie Dashboard → vista "Prossime" automatica | ✅ DONE | `viewMode` spostato dallo stato locale di `AgendaView.jsx` allo store condiviso (stesso pattern di `filterCriteria`/`sortCriteria`), con `setViewMode`. I 4 click Dashboard (Alta/Media/Bassa Priorità, Scadenze Imminenti) impostano `viewMode: 'upcoming'` insieme al filtro, prima di navigare. Verificato: click "Alta Priorità" con due task futuri → arriva su Agenda con tab "Prossime" già attiva e task raggruppati per data |
| 12 | Avatar sostituiti con segni zodiacali | ✅ DONE | Primo tentativo con simboli Unicode (U+2648–U+2653, verificato prima che Material Symbols non abbia icone zodiacali) — **scartato dall'utente**, troppo dipendente dal font di sistema, esito visivo incoerente. Provate diverse direzioni di riferimento (icone monolinea, IconScout multicolore, medaglioni dorati, badge a contorno colorato) prima che l'utente fornisse **12 immagini disegnate da lui** (PNG 260×260, linea nera su trasparente, un file per segno in `public/avatars/`). Colore gestito via **CSS mask** (`mask-image`/`-webkit-mask-image` + `background-color: currentColor`, nuovo helper `maskStyle()` in `Avatar.jsx`, riusato da `AvatarPicker.jsx`) invece che via colore intrinseco dell'immagine — resta un solo colore (`primary-container`) come richiesto, gestito da Tailwind/tema come tutto il resto. Chi aveva scelto un vecchio avatar torna al placeholder di default (nessuna migrazione, comportamento già gestito) |

Verificato ad ogni punto: `npm run lint` (0 errori), `npm run build`, `npm test` (49/49), più verifica
visiva reale in browser (Playwright, incluso `page.clock` per il timer della nota e una vera chiamata
Gemini per il toast).

---

## 🐛 Bug reali trovati in uso reale — sessioni 2026-08-15 → 2026-08-18

> Handoff scritto dopo un uso reale dell'app il 2026-08-14 (sessione interrotta a metà indagine per
> una caduta di connessione), tenuto inizialmente nel file separato `BUGS.md` e **integrato per
> intero in questo documento il 2026-08-18** (file `BUGS.md` eliminato, contenuto non perso).
> 6 bug risolti e verificati il 2026-08-15; BUG-01 (il più importante, lasciato volutamente per
> ultimo) approfondito e in gran parte implementato il 2026-08-18.
> **Non conteggiato nel TOTALE core plan** (92/92 resta invariato), stesso trattamento della Roadmap.

| ID | Task | Owner | Stato | Prova |
|----|------|-------|-------|-------|
| BUG-01 | Le notifiche non arrivano da telefono nonostante il consenso dato | LOGIC | 🟡 **IN PROGRESS (2026-08-18)** — causa identificata, backend costruito e verificato in locale, deploy + test su device mancanti | Dettaglio completo nella sottosezione **BUG-01** subito sotto la tabella |
| BUG-02 | Manca il pulsante/link per installare l'app in Settings | UI ENGINE | ✅ **DONE (2026-08-15)** | `useInstallPrompt.js`: `isInstallable` (disponibilità reale del prompt) separato da `canInstall` (usato solo da `InstallBanner`, legato al dismiss) e `isInstalled`. Nuova sezione `InstallSettings` in `SettingsPage.jsx`: bottone "Installa" quando disponibile, istruzioni manuali (testo diverso per iOS) quando no. Verificato in browser: sezione visibile, fallback testuale confermato; ramo `canInstall` già osservato funzionante via `InstallBanner` nella stessa sessione |
| BUG-03 | Nessuna impostazione reale in Settings (tema/vibrazione/volume) | LOGIC + UI | ✅ **DONE (2026-08-15, tema esteso a tutta l'app il 2026-08-25)** | Nuovo modulo `src/logic/preferences.js`. **Tema**: collegato un meccanismo dark mode **già presente ma mai attivato** (`@custom-variant dark` in `global.css`, usato solo da `TopAppBar`/`BottomNav`/`MobileSideNav` senza che nulla aggiungesse mai la classe `.dark`) — `applyTheme()`/`watchSystemTheme()` lo attivano, chiamate da `main.jsx` prima del render. ⚠️→✅ **Limite noto risolto (2026-08-25)**: copriva solo la navigazione perché i 3 componenti avevano `dark:` scritte a mano verso **altri token della stessa palette chiara** (es. `surface-dim: #d7dadc`, comunque chiaro) — il resto dell'app usa i token `@theme` (`bg-surface`, `text-on-surface`, badge di stato) che sono custom property statiche, mai ridefinite per `.dark`. Aggiunto un blocco `.dark { --color-surface: ...; ... }` in `global.css` che ridefinisce a runtime superficie/sfondo/testo/outline **e** i colori di stato (error/danger/warning/success schiariti, altrimenti illeggibili su sfondo quasi nero — es. `#ba1a1a` su `#101418` è 2.9:1, sotto AA) — essendo le stesse custom property lette da ogni utility Tailwind, la cascata aggiorna automaticamente tutta l'app senza toccare i componenti (i 3 `dark:` esistenti restano, ora puntano a token realmente scuri). Introdotto anche `--color-on-warning` (fisso, non derivato da `on-surface`) e aggiornate le uniche 2 istanze di `bg-warning text-on-surface` (badge "Imminente" in `AgendaItemCompact.jsx`, bottone conferma in `ConfirmDialog.jsx`) che altrimenti sarebbero diventate testo chiaro su ambra in dark mode. **Verificato in browser reale** (`npm run dev`): toggle Chiaro/Scuro/Sistema in Settings ora scurisce davvero Dashboard, Agenda, Tasks, form di creazione (non solo nav); creato un task di test scaduto/alta priorità, badge "Alta" (rosa chiaro su tinta scura) e strip "Scaduto" leggibili; tornare a Chiaro ripristina esattamente l'aspetto originale. `npm run build` OK, `npm run lint` 0 errori (51 warning, invariati, preesistenti). **Vibrazione**: opzione `vibrate` passata a `showNotification()` in `browser.js` (non `navigator.vibrate()`, inutilizzabile da un Service Worker). **Volume → "Notifiche silenziose"**: confermato con `grep` che non esiste alcun audio nel progetto: un controllo volume avrebbe governato il nulla, sostituito con l'opzione standard `silent` della Notification API. Persistenza dopo refresh verificata in browser per tutte e tre |
| BUG-04 | Le 3 azioni al hover di un task coprono/sovrappongono il testo | UI ENGINE | ✅ **DONE (2026-08-15)** | `AgendaItemCard.jsx`: `onMouseEnter`/`onMouseLeave` rimossi, sostituiti da un pulsante kebab (`more_vert`) sempre visibile che apre un pannello azioni **sotto** la card (opzione B delle due proposte nel bug report) — click e tap identici, nessuna logica separata per mobile. Verificato in browser: titolo mai più troncato all'apertura del pannello |
| BUG-05 | Manca "Scaduti" nella tendina filtro Stato | LOGIC + UI | ✅ **DONE (2026-08-15)** | Era già presente correttamente nella tendina **Data** (`dateOptions`, `OVERDUE` → `filterOverdue`/`getTimeStatus`). Su richiesta esplicita dell'utente, aggiunto **anche** a **Stato**: instradato non su `filterByStatus` ma sul campo `overdueOnly` di `FilterCriteria`, già gestito da `applyFilters` in `filters.js` ma mai collegato a nessun controllo UI finora. Verificato in browser (2 item di test, uno scaduto e uno futuro): filtro Stato→Scaduti isola solo l'item scaduto |
| BUG-06 | "Inizia notifiche" senza l'unità "giorni" | UI ENGINE | ✅ **DONE (2026-08-15)** | Aggiunta `{ value: 'days', label: 'giorni' }` a `timeUnitOptions` in `useTaskForm.js`, `convertToMinutes` gestisce `×1440` (scheduler invariato, lavora già solo in minuti). **Bug collaterale corretto nello stesso punto**: in edit mode il valore mostrato per "ore" non veniva diviso per 60 (un salvataggio senza toccare il campo avrebbe silenziosamente moltiplicato il valore ×60) — sostituita l'euristica con `minutesToFormUnit()`, converte solo se la divisione è esatta. Verificato in browser: dropdown mostra "minuti/ore/giorni" in entrambi i selettori |
| BUG-07 | In Alerts non si può interagire con i singoli allarmi | UI ENGINE | ✅ **DONE (2026-08-15)** | Nuova `removeHistoryEntry(id)` in `db.js`. In `AlertsPage.jsx`: bottone "×" per eliminazione singola su ogni voce; titolo cliccabile verso `/edit/:itemId` **solo se** il task collegato esiste ancora in `useAgenda().items` (evita di aprire un edit "fantasma" se l'item è stato eliminato nel frattempo). Verificato in browser (2 voci di test in IndexedDB, una con `itemId` valido e una orfana): navigazione ok sulla voce collegata, eliminazione singola non tocca l'altra voce, "Cancella tutto" invariato |

Tutti i punti BUG-02..07 verificati con `npm run lint` (0 errori/39 warning), `npm run build` OK,
`npm test` (49/49) e a mano in browser (Chrome via Claude in Chrome, dev server locale).

> 📝 Rimane aperta anche la nota del 2026-08-14 sullo z-index di `MobileSideNav` (fix scritto ma non
> ancora testato su device reale, vedi sezione sotto): non toccata nelle sessioni 2026-08-15/18, da
> riprendere insieme al deploy/test di BUG-01.

### BUG-01 — dettaglio completo (2026-08-18)

Segnalazione originale: su mobile, pur avendo autorizzato le notifiche, i promemoria non arrivano.

**Causa identificata:** non è un bug di codice, è un limite architetturale. Con l'app puramente
client-side, nessuno dei meccanismi esistenti sopravvive alla chiusura dell'app/schermo bloccato:
- `setTimeout` in pagina (`integration.js`) — solo se l'app è aperta in primo piano
- `periodicSync` (`sw.js`) — richiede la PWA installata e comunque Chrome decide lui l'intervallo
  reale (ore, non i 15 minuti richiesti), throttlato in base al site engagement
- `push` nel Service Worker (`sw.js`) — canale corretto ma **era codice morto**: nessun codice
  chiamava mai `pushManager.subscribe()`, e senza un backend che invii le push non può funzionare
  comunque

Dato che il valore centrale dell'app è "insistere" con promemoria ripetuti anche a telefono chiuso,
si è deciso con l'utente di costruire un **backend minimo per Web Push reale (VAPID)** — l'unico
meccanismo che consegna notifiche puntuali indipendentemente dallo stato dell'app. Piano completo in
`C:\Users\mandr\.claude\plans\agile-honking-pelican.md`.

**Fatto:**
- Nuovo `server/` (Node/Express): endpoint `POST/DELETE /api/subscribe`, `POST /api/sync`,
  `GET /api/tick`; riusa `calculateNextNotificationTime` da `src/logic/notifications/scheduler.js`
  via import relativo (stessa logica di ricorrenza del client, nessuna duplicazione), con una
  finestra di controllo dedicata (`isDueWithinWindow` in `server/src/tick.js`) invece dei helper
  client-side tarati per un tick al secondo. Storage su **Supabase** (Postgres, connessione diretta
  via il pacchetto `postgres` — l'utente aveva già un account, e il tick ogni 5 minuti tiene comunque
  il progetto attivo evitando la sospensione per inattività del piano gratuito). Dedupe delle
  notifiche già inviate per evitare doppi invii tra tick sovrapposti.
- **Scoperta critica corretta:** `parseDateTime()` in `src/logic/time/timezone.js` usa
  `Date.setHours()`, dipendente dal fuso orario del processo — sui container Render (default UTC)
  ogni orario calcolato sarebbe stato sbagliato di qualche ora, senza errori visibili. Il server
  rifiuta di avviarsi se `TZ` non è esplicitamente `Europe/Rome` (`server/src/index.js`).
- Client: `src/logic/notifications/push.js` (sottoscrizione push), `src/logic/notifications/sync.js`
  (sincronizzazione item/subscription col backend, debounced), nuova sezione "Notifiche push" in
  `SettingsPage.jsx`, `src/sw.js` completato (handler `push` ora scrive anche nello storico Alerts).
- `render.yaml` (root) per i due nuovi servizi (Web Service + Cron Job ogni 5 minuti su
  `/api/tick`), senza toccare la configurazione del sito statico esistente.

**Verificato in automatico:** `npm test` (client, 49/49) e `npm test` (server, 4/4 — incluso il caso
che ha motivato la finestra dedicata) passati; `npm run build` OK (`sw.js` compila correttamente con
`injectManifest`); `npm run lint` 0 errori. Storage passato da Turso/SQLite (scelta iniziale) a
Supabase su richiesta dell'utente — `db.js` era scritto dietro un'interfaccia isolata apposta per
rendere lo storage sostituibile senza toccare route/tick. Il flusso completo (subscribe → sync →
tick, dedupe confermato su due tick consecutivi con una sola riga in `sent_notifications`) è stato
**verificato con un round-trip reale contro il progetto Supabase dell'utente**
(`vhyqsdabneswjymlytbe`, pooler "Transaction" porta 6543): server avviato in locale, `initDB()` crea
le tre tabelle senza errori, `curl` su subscribe/sync/tick con item e subscription di test, dati
ispezionati direttamente nel DB e poi ripuliti. Il server rifiuta l'avvio se `DATABASE_URL` manca,
con messaggio esplicito (verificato anche questo).

**NON verificato (richiede deploy reale + telefono, per lo standard di test di questo progetto — vedi
`server/.env.example` per le variabili da configurare):**
- Creazione dei servizi Render (Web Service + Cron Job), variabili d'ambiente in produzione
- Flusso reale `pushManager.subscribe()` + prompt permesso su Chrome Android
- Consegna end-to-end con app completamente chiusa e schermo bloccato — il punto centrale di questo bug
- Notifica arrivata via push visibile in Alerts (scrittura IndexedDB dal SW senza pagina aperta)
- Soak test di qualche ora per valutare se Cron Job + piano gratuito Render produce ritardi accettabili

### Sessione 2026-08-25 — deploy backend BUG-01, test su device reale (Samsung Galaxy S21)

**Deploy completato:** Web Service `agenda-push-server` (Render, Frankfurt) creato via API con le
variabili di `server/.env` locale + un `SYNC_SECRET` nuovo generato per produzione (diverso da quello
di sviluppo). Il Cron Job gratuito non è più disponibile su Render (piano minimo ora Starter, a
pagamento): sostituito con un cron esterno gratuito (**cron-job.org**, unico tra i servizi free
considerati a supportare header HTTP personalizzati, necessari per `Authorization: Bearer
$SYNC_SECRET`) che chiama `/api/tick` ogni 5 minuti — stesso intervallo di `TICK_WINDOW_MINUTES` sul
server, come richiesto dal commento in `tick.js` per non perdere occorrenze tra un tick e l'altro.
Static site ridistribuito con `VITE_SYNC_API_URL`/`VITE_SYNC_SECRET`/`VITE_VAPID_PUBLIC_KEY` allineati
al backend. Verificato: `/api/tick` risponde 200 con un invio reale forzato manualmente
(`{"ok":true,"sent":1}`), riga in Supabase `subscriptions` con endpoint `fcm.googleapis.com` (push
reale, non mock) dopo l'attivazione dal telefono.

**Test su device reale (Samsung Galaxy S21):**
- ✅ **Installazione PWA** confermata
- ✅ **Tema scuro** confermato su device reale (dopo il fix sotto)
- ✅ **Notifica push con schermo acceso** arrivata (sia tramite invio manuale sia tramite tick)
- 🟡→✅ **Notifica push con schermo spento: prima NON arrivava, poi risolta cambiando le impostazioni
  batteria del device.** Diagnosi in due passaggi: (1) inizialmente sospettato anche un tick esterno
  non funzionante — nei log Render, nella finestra in cui l'item di test (sempre scaduto, ripetizione
  ogni 5 minuti) è rimasto attivo, non risultava alcun invio automatico per ~40 minuti, solo un riavvio
  a freddo del piano free coincidente con la riapertura dell'app. Ipotesi scartata dall'esito finale:
  Render non espone log a livello di singola richiesta su questo piano, quindi l'assenza nei log non
  era prova che il cron non giravo, solo assenza di visibilità — **da non fidarsi in futuro
  dell'assenza di request-log su Render free come prova di "non è mai stato chiamato"**. (2) Causa
  reale confermata dall'utente: **ottimizzazione batteria di Android (One UI)**, che sospendeva Chrome
  in background prima che potesse processare l'evento `push` del Service Worker — esattamente
  l'ipotesi iniziale. Risolta impostando **Impostazioni → App → Chrome → Batteria → "Nessuna
  restrizione"** sul device. **Verificato dall'utente su Samsung Galaxy S21: notifica push arrivata a
  schermo spento.** Resta da confermare separatamente il caso "app completamente disinstallata dai
  recenti/forzatamente chiusa" (non ancora testato in modo isolato dal caso schermo spento), e va
  documentato nel README come passo di setup obbligatorio per l'utente finale (non automatizzabile
  da codice: è un'impostazione di sistema che l'utente deve attivare a mano dopo l'installazione)

**Quattro bug reali trovati durante il test, corretti nella stessa sessione:**
- **Molti testi poco leggibili in tema scuro** ("bisogna trovare il giusto equilibrio tra testo e
  sfondo", segnalato dall'utente) — causa: `--color-primary` (`#002045`, navy quasi nero, pensato per
  testo scuro su sfondo chiaro) è usato da solo come colore di testo/icona/bordo in tutta l'app (voce
  di navigazione attiva, badge/chip filtro, link, evidenziazione "oggi" nel calendario) e non solo
  come sfondo pieno dei bottoni (`bg-primary text-on-primary`) — a differenza di secondary/tertiary e
  di tutti i token `-container`, sempre usati in coppie bg+on- autosufficienti. Il blocco `.dark`
  aggiunto in questa sessione (vedi sopra) non lo copriva: risultato, testo blu notte praticamente
  invisibile su sfondo quasi nero in decine di punti dell'app. Fix: **scambio di tono** in `.dark`,
  `--color-primary` ↔ `--color-on-primary` (riusando gli stessi due valori già nella palette:
  `#adc7f7`, cioè `--color-primary-fixed-dim`, e il navy originale) — stesso principio del "tone swap"
  di Material Design 3 per i temi scuri. I bottoni restano leggibili (ora sfondo chiaro + testo scuro,
  invertito ma comunque ad alto contrasto), testo/icone/bordi diventano visibili sul nuovo sfondo
  scuro. Verificato in browser (`npm run dev`, toggle Chiaro/Scuro): CTA "+ Nuovo Task", FAB, "Abilita
  notifiche", toggle tema attivo, tutti passati da illeggibili a testo scuro su sfondo azzurro chiaro
  ben distinguibile.
  **Rifinitura 2026-08-25 (stessa giornata): risolto anche il limite noto sull'hover** —
  `hover:bg-primary-container` (11 occorrenze in 8 file: `AgendaHeader`, `QuickStats`, `FeedbackForm`,
  `BirthdayForm`, `TaskForm`, `FAB`, `DashboardPage`, `SettingsPage`×3) restava invariato tra i temi:
  in scuro, durante l'hover il testo `on-primary` (ora scuro) finiva su uno sfondo `primary-container`
  (navy scuro, invariato) — contrasto basso per la durata dell'hover. Stesso difetto anche per un
  bottone testuale isolato (`StatsCard.jsx`: `text-primary hover:text-primary-container`, testo chiaro
  su testo scuro in hover). Fix: sostituito `hover:bg-primary-container`/`hover:text-primary-container`
  con `hover:brightness-90`/`hover:opacity-70` — l'hover scurisce/attenua il colore invece di
  scambiarlo con un token indipendente dal tema, quindi resta sempre abbinato correttamente al testo
  in entrambi i temi, senza dover toccare `--color-primary-container` (che altrove è ancora usato in
  coppie self-contained `bg-primary-container text-on-primary-container`, es. voce di nav attiva, e
  sarebbe stato rotto da una modifica diretta del token). Verificato in browser: hover sul FAB in
  scuro, "+" resta scuro e leggibile (prima sarebbe sparito su sfondo navy)
- **Popup di conferma eliminazione troppo trasparente in tema scuro** — `ConfirmDialog.jsx` era
  l'unico componente in tutto il progetto a usare `bg-surface-container-lowest` **senza** il
  `border border-outline-variant` che ogni altra card/pannello ha sempre. Invisibile in chiaro
  (card bianca su backdrop scurito, contrasto enorme comunque), ma in scuro la card quasi nera si
  confondeva col backdrop `bg-black/50` altrettanto scuro dietro. Fix: aggiunto il bordo mancante,
  ora coerente col resto dell'app. Verificato in browser (chiaro e scuro): bordo visibile, testo
  leggibile
- **Scadenze imminenti e Alta priorità in Dashboard non gestibili direttamente** — `UpcomingCards.jsx`
  e `PriorityList.jsx` erano puramente di sola lettura (nessun `onClick`, nessuna checkbox
  funzionante, nessun pulsante), a differenza di `AgendaItemCard`/`AgendaItemCompact` che riusano già
  `AgendaItemActions` (completa/modifica/elimina). Fix: estratta la riga di ciascuna lista in un
  sotto-componente (`UpcomingCard`/`PriorityItem`, necessario per usare `useState` per item dentro una
  `.map()`), aggiunto lo stesso pattern kebab-button-apre-pannello di `AgendaItemCard` (già verificato
  su touch per **BUG-04**) con `AgendaItemActions`; in `PriorityList` anche la checkbox statica è
  diventata interattiva (`toggleComplete`, stesso pattern accessibile di `AgendaItemCard`). Verificato
  in browser: kebab apre il pannello su entrambe le sezioni, checkbox aggiorna le statistiche e lo
  stato in tempo reale, `ConfirmDialog` di eliminazione integrato e funzionante. `npm run build` OK,
  `npm run lint` 0 errori (51 warning, invariati)

**Rifinitura aggiuntiva, stessa giornata:**
- **`MobileSideNav` (drawer hamburger mobile): unico modo per chiudere era toccare fuori dal menu**
  — Escape esisteva ma solo da tastiera (inutile su touch), nessun controllo visibile. Segnalato
  dall'utente come poco chiaro. Fix: aggiunto un pulsante "×" sempre visibile in alto a destra
  nell'header del drawer (`aria-label="Chiudi menu"`), stesso pattern icon-button hover/active già
  usato altrove nell'app — il click sul backdrop e Escape restano entrambi validi, si aggiungono, non
  si sostituiscono. Verificato in browser (viewport mobile): X visibile e cliccabile, chiude il drawer
  correttamente. `npm run build` OK, `npm run lint` 0 errori

### ✨ Nuova funzionalità: Immagine profilo (2026-08-25)

Prima versione: 9 preset icona Material Symbols + colore, salvati in **localStorage** (non
server-side: senza login — ROAD-07, volutamente rimandato — un avatar sul DB non sarebbe comunque
sincronizzato tra dispositivi, stesso meccanismo di tema/vibrazione/notifiche silenziose). Sostituita
il 2026-08-27 dai 12 avatar zodiacali (vedi [Fix UX da uso reale](#-fix-ux-da-uso-reale--sessione-2026-08-27)),
ma l'architettura (`preferences.js` con pub/sub `subscribeToAvatarChanges`, componente `Avatar`
riutilizzabile, `AvatarPicker` con focus trap) è rimasta la stessa.

### Verifica finale dei bug 2026-08-15 (BUG-02..07)

- ✅ Verificato che le nuove impostazioni (BUG-03) persistano dopo il refresh della pagina — tema,
  vibrazione e notifiche silenziose tutti confermati persistenti; il tema scuro copre oggi solo la
  navigazione (limite noto sopra)
- ✅ Verificato il comportamento scelto per il hover (BUG-04) in browser desktop: nessun hover
  coinvolto nel fix finale (bottone kebab sempre visibile, click/tap identici) — **da confermare
  comunque su Android Studio** che il tap non lasci il pannello "appiccicato" aperto in modo strano
  su schermi piccoli
- ✅ Verificato che "Scaduti" nel filtro (BUG-05) mostri effettivamente solo gli item scaduti,
  coerente con la logica già usata altrove in `getTimeStatus` — testato sia da Data che, ora, da Stato
- ✅ Verificato che con "giorni" selezionato (BUG-06) l'orario di inizio notifica calcolato sia
  corretto: `convertToMinutes`/`minutesToFormUnit` verificati per simmetria (create→edit→create),
  scheduler invariato (lavora solo in minuti)
- ✅ Verificato che eliminare/interagire con una singola voce in Alerts (BUG-07) non rompa il
  pulsante "Cancella tutto" — testato in sequenza nella stessa sessione
- ⚠️ Il pulsante "Installa" in Settings (BUG-02): verificato in browser desktop solo il ramo
  fallback (testo istruzioni); il ramo `isInstallable` (bottone "Installa" reale) era già stato
  osservato funzionante via `InstallBanner` nella stessa sessione ma non ri-testato identico nella
  nuova sezione di Settings. **Da confermare su Android Studio** insieme al resto dei punti mobile

---

---

---

## 💬 Istruzioni per gli Agenti

Regole standing, valide per chiunque lavori su questo progetto:
- `src/logic/` non importa React; `src/ui/` non contiene logica di dominio.
- Nessun file in `public/` che collida con un artefatto di build (`sw.js`, `index.html`).
- Prima di usare una classe Tailwind custom, verificare che generi CSS: `grep "\.nome-classe" src/styles/global.css`.
- ✅ DONE/VERIFIED **solo** allegando la prova (comando e output, o il passo manuale svolto con browser reale e data). Un task non eseguito resta ⬜ TODO.

---

## 🚀 Come Avviare il Progetto

### Sviluppo
```bash
npm install
npm run dev
# http://localhost:5173
```

### Produzione
```bash
npm run build
npm run preview
```

### Test
```bash
npm test          # esegue tutta la suite una volta
npm run test:watch  # modalità watch
```

---

## 📝 Changelog

> Il changelog voce-per-voce (2026-08-08 → 2026-08-26) è stato rimosso il 2026-08-27 perché
> duplicava quasi verbatim il contenuto già nelle sezioni tematiche sopra (Debito Tecnico, Task
> Completati, Bug reali, Fix UX). Per la cronologia dettagliata di un bug specifico, cercare il suo
> ID (es. DS-10, BUG-03, A11Y-06) nella sezione a cui appartiene — non qui.

---

## ⚠️ Note Importanti

1. **Framework CSS:** Il progetto usa **Tailwind CSS v4**, non Bootstrap 5
2. **`tailwind.config.js` non è attivo:** in v4 serve `@config` o un blocco `@theme` (DS-01). Prima di usare una classe custom, verificare che produca davvero CSS
3. **File eliminati:** `stitch_persistent_reminder_agenda/`, `theme.scss`, `theme.js`, `public/sw.js`, `public/index.html`, `src/logic/notifications/sw.js`
4. **Niente duplicati in `public/`:** i file lì dentro vengono copiati in `dist/` e possono sovrascrivere gli artefatti di build. È così che il Service Worker custom è sparito dalla produzione per mesi
5. **Un solo punto di registrazione del SW:** `virtual:pwa-register` in `main.jsx`. Non aggiungere `navigator.serviceWorker.register()` altrove
6. **Variabili CSS:** Preferire schema `--color-*` invece di `--bs-*`
7. **Struttura:** Mantenere separazione Logic ↔ UI. Il layer logic non importa React: per comunicare con la UI usa il pub/sub dei toast, non chiamate dirette
8. **JSDoc:** Tutti i contratti devono essere documentati

---

## 📡 Limiti reali delle "notifiche con app chiusa"

Il web **non offre notifiche programmate garantite senza un backend push**. Va detto esplicitamente
perché README e PLAN hanno promesso più di quanto sia tecnicamente ottenibile:

- `sync` (Background Sync) è **one-shot** e scatta al ritorno della connettività: non è un timer. Ri-registrarlo dentro il proprio handler non produce un check periodico affidabile
- `periodicSync` esiste solo su Chromium, richiede la **PWA installata** (quindi PWA-01) e l'intervallo lo decide il browser, non l'app
- `setTimeout` in pagina funziona solo mentre l'app è aperta

**Livello raggiungibile senza backend:** `periodicSync` dove disponibile + timer in-page mentre
l'app è aperta + **recupero all'apertura** (FIX-06). **Per una garanzia vera serve un server con
Web Push — esiste da BUG-01 (2026-08-25, `server/`, VAPID)**: è il canale che consegna
puntualmente anche a telefono bloccato, con l'unico limite pratico noto nella sezione
"Limitazioni note" di [README.md](README.md) (restrizioni batteria Android).

---

## 🎉 Obiettivo Finale

> **Ricordare ripetutamente all'utente ciò che sta per scadere finché non conferma di averlo completato.**

Lezione della fase di audit (2026-08-12): per mesi il lavoro era proseguito sul layout mentre la
funzionalità centrale era rotta in silenzio, con la documentazione che la dava per completa senza
prova. Da qui la regola standing in [Istruzioni per gli Agenti](#-istruzioni-per-gli-agenti):
✅ solo con la prova allegata.
