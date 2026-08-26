# PLAN — Agenda Intelligente con Notifiche Persistenti

> **Stato:** ✅ **Core plan chiuso al 100% (92/92, 2026-08-13)** — invariato. In più, dal 2026-08-14 è
> aperta una **fase di roadmap separata** (vedi sotto) con lavoro reale in corso.
> **Ultimo aggiornamento:** 2026-08-25
>
> 🐛 **Bug da uso reale, sessioni 2026-08-15 → 2026-08-25** (handoff originario del 2026-08-14, poi
> `BUGS.md`, ora integrato per intero in questo file — vedi sezione
> [🐛 Bug reali trovati in uso reale](#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18)):
> **tutti e 7 risolti** — pulsante "Installa" in Settings, azioni della card agenda non più legate
> all'hover, nuova sezione Preferenze (tema/vibrazione/notifiche silenziose), filtro "Scaduti" anche
> da Stato (oltre a Data), unità "giorni" in "Inizia notifiche", interazione con le singole voci in
> Alerts. **BUG-01 (notifiche non arrivano su mobile) — ✅ risolto il 2026-08-25**: backend Web Push
> (VAPID) su Supabase deployato su Render (Web Service + tick esterno via cron-job.org ogni 5 minuti,
> il Cron Job nativo Render non è più gratuito), testato su un Samsung Galaxy S21 reale. La consegna a
> schermo spento falliva ancora finché l'utente non ha impostato Chrome su "Nessuna restrizione"
> batteria in Android — non un bug di codice, un prerequisito di sistema Android per Web Push in
> background, **documentato come passo di setup sia nel README sia direttamente in Settings → Notifiche
> push (nota nell'app)**. Stessa sessione, rifiniture: contrasto testi in tema scuro corretto
> (`--color-primary` usato da solo come testo, scambio di tono in `.dark`), popup di conferma
> eliminazione non più trasparente, card Dashboard ("Scadenze Imminenti"/"Alta Priorità") ora
> gestibili direttamente, hover dei bottoni "primary" corretto in scuro, voce "Annunci discreti"
> rimossa dalla sezione Prossimamente su richiesta dell'utente (ROAD-04/05 restano nel piano,
> semplicemente non più anticipati in UI).
>
> 🗺️ **Roadmap** (sezione [🗺️ Roadmap — Prossimi Sviluppi](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14)):
> **ROAD-01/02/03 chiusi** (deploy Static Site su Render, sezione "Prossimamente", form feedback →
> GitHub Issues) — Priorità 1 completa. ROAD-04..08 (Priorità 2/3: AdSense, quick add AI, profili
> utente) ancora ⬜ TODO, volutamente in attesa (dipendono da account/DB esterni). Nessuna voce di
> roadmap è conteggiata nel 92/92 core plan.
>
> 🐛 **Sei bug reali trovati e corretti il 2026-08-14** dopo il deploy (DS-07..DS-12: scroll
> verticale/orizzontale rotti su mobile reale, pagina bianca dopo deploy, layout Agenda) — vedi
> [Debito Tecnico](#-debito-tecnico-aperto) e il changelog dello stesso giorno. **Tutti verificati
> su emulatore Android reale**, non solo browser desktop. **Pubblicati**: commit e deploy su Render
> eseguiti dall'utente il 2026-08-14.
>
> 📝 **Da testare nella prossima sessione** (segnalato dall'utente il 2026-08-14, non urgente):
> vedi [Note per la prossima sessione](#-note-per-la-prossima-sessione-2026-08-14).
>
> 🔭 La **quick add AI** (creazione task da linguaggio naturale) è ora formalizzata come **ROAD-06**
> (scaffolding UI/prompt/schema, senza backend né chiave API — serve un proxy per non esporla lato
> client, dato che l'app è puramente client-side).
> **Notifiche:** ✅ Ripianificazione, permessi, Service Worker in build e recupero all'apertura — **RIPARATI** | ✅ Notifica in-app e toast di fallback **verificati a mano in browser (QA-04, QA-11)** | ✅ Service Worker attivo confermato sia in dev sia in build di produzione (**DEBT-05 chiuso**)
> **Filtri:** ✅ Criteri spostati nello store Zustand — **RIPARATI e verificati a mano in browser (QA-07)**
> **Accessibilità:** ✅ QA-09 verificato (2026-08-13) — trovato e risolto un **bug critico** in `ConfirmDialog` (A11Y-06): il dialog di conferma non si chiudeva mai davvero (Annulla/Escape/Conferma), lasciando un overlay invisibile che bloccava tutti i click sull'intera app finché non si ricaricava la pagina. Risolti anche dropdown non chiudibili da tastiera (A11Y-07) e un `aria-hidden` errato che nascondeva il dialog stesso agli screen reader (A11Y-08)
> **Performance:** ✅ TUTTI COMPLETATI (PERF-01 SKIPPED, PERF-02 VERIFIED, PERF-03 IMPLEMENTED)
> **UX/UI:** ✅ **DS-03 risolto (2026-08-13)** — layout verificato visivamente in browser (mobile), non solo con build+grep
> **Design System:** ✅ **DS-01 + DS-02 + DS-03 risolti** — `tailwind.config.js` migrato in `@theme` (DS-01/02, 2026-08-12); **DS-03 (2026-08-13)**: due regole scritte fuori da `@layer` in `global.css` (`*,*::before,*::after{margin:0;padding:0}` e il blocco `a,h1..h6,body,...`) battevano sempre le utility Tailwind (`@layer utilities`) per via delle cascade layer, azzerando ogni `pt-*/p-*/m-*` e forzando `color:var(--color-primary)` su ogni link. Invisibile a build+grep (le regole CSS esistono, sono solo sovrascritte a runtime) — visibile solo aprendo il browser. Fix: reset ridondante rimosso, blocco elementi HTML spostato in `@layer base`.
> **PWA:** ✅ **Icone e manifest completi (PWA-01 chiuso il 2026-08-12)** — requisiti di installabilità soddisfatti; prompt di installazione da confermare in browser
> **Linguaggio:** JavaScript (con JSDoc) | **Framework:** React 18 + Tailwind CSS v4 + Vite + PWA
> **Build:** ✅ `npm run build` OK | **Lint:** ✅ 0 errori, 51 warning (client) | **Test automatici:** ✅ Vitest, **49/49** (`npm test`) — QA-12
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

**Agenda Intelligente** è un'app React per la gestione di scadenze con **notifiche persistenti**.
Il CRUD, la persistenza e la struttura Logic ↔ UI sono solidi. Le due funzionalità che danno
valore all'app — notifiche ripetute e filtri — erano **dichiarate complete ma non funzionanti**:
sono state riparate il 2026-08-12, con verifica automatica sul codice; la verifica manuale in
browser (permessi, notifica di sistema, toast di fallback, filtri) è stata completata il 2026-08-13.

**Obiettivo attuale:** il layout è stato aperto in un browser reale per la prima volta (2026-08-13) e
riparato (DS-03/04/05, vedi Debito Tecnico); lo stesso giorno sono state chiuse tutte le verifiche
manuali di notifiche e filtri (QA-04, QA-06, QA-07, QA-10, QA-11 — incluso il sub-test di recupero
alla riapertura), il layout desktop a 3 colonne (≥1024px), i test automatici (QA-12), le 3 pagine
stub (STR-04), alcuni difetti trovati da una review esterna (DS-06, A11Y-05), il breakpoint tablet
(QA-08) e l'accessibilità (QA-09 — durante il test trovato e risolto un **bug critico** in
`ConfirmDialog` che bloccava l'intera app dopo la prima conferma/annullamento, vedi A11Y-06).
**Tutti i 12 task QA sono chiusi e tutto il debito tecnico (DEBT-01..06) è risolto.** STR-02 e STR-03
risultano entrambi già soddisfatti (STR-02 come effetto collaterale di DS-01/DS-02, STR-03 come
copertura JSDoc già completa in `src/logic/**` — entrambi verificati 2026-08-13, nessun codice
modificato). SEO-01/02 (meta tag Open Graph + JSON-LD in `index.html`) e PWA-03 (banner "Installa App"
mobile via `beforeinstallprompt`, nuovo componente `InstallBanner`) implementati e verificati in
browser reale lo stesso giorno. **Il piano è ora completo al 100% (92/92).**

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

> La percentuale è scesa rispetto all'88% dichiarato prima, ma non è stato perso lavoro. Tre ragioni:
> **(a)** 6 task QA marcati ✅ VERIFIED sono tornati a ⚠️ DA RIVERIFICARE perché attestavano
> comportamenti che il codice non poteva produrre; **(b)** sono state aggiunte le aree DS, DEBT e
> 2 task QA che prima non erano tracciate; **(c)** il conteggio precedente ometteva PERF, STR,
> SEO, PWA e UX-NEW. Il 69% è calcolato su tutte le righe presenti in questo documento.
> I task UX-01/02/03 (❌ CANCELLED) sono esclusi dal totale.

---

## 🔍 Audit 2026-08-12 — Funzionalità core non funzionanti

Analisi statica del codice a fronte di ciò che README e PLAN dichiaravano. Ogni voce è stata
confermata leggendo il codice, non dedotta.

| # | Difetto | Effetto | Riscontro |
|---|---------|---------|-----------|
| 1 | `requestNotificationPermission()` non aveva **alcun chiamante** nella UI, e `canNotify()` controllava solo `'Notification' in window`, non il permesso | Nessuna notifica di sistema, mai — e nemmeno il fallback toast | `browser.js:11,16` senza riferimenti in `src/ui/**` |
| 2 | `subscribe(selector, listener)` usata senza il middleware `subscribeWithSelector` | Le notifiche non si ripianificavano: un task creato restava senza promemoria fino al reload | `integration.js:202` vs `store/index.js:20` |
| 3 | Criteri di filtro in variabili a livello di modulo | Nessun re-render: `FilterBar` e `useFilters` erano scollegati dalla lista | `hooks.js:36-37`, `useMemo` a `hooks.js:65` |
| 4 | `public/sw.js` in collisione con il SW generato da `vite-plugin-pwa` | La logica notifiche **spariva dalla build**: `grep -c "agenda-notifications" dist/sw.js` → `0` | strategia `generateSW` in `vite.config.js` |
| 5 | `cancelItemNotification` (async) invocata senza `await` prima del salvataggio | Race: la pulizia poteva cancellare la notifica appena creata | `integration.js:73` vs `:87` |
| 6 | `getExpiredNotifications()` e `checkAndNotifyNow()` senza chiamanti | Nessun recupero delle scadenze passate alla riapertura dell'app | `db.js:73`, `integration.js:252` |
| 7 | `showToast()` scriveva in un array che nessun componente React leggeva | Ogni fallback e messaggio d'errore del layer logic finiva solo in `console.log` | `notifications/toast.js` vs `Toast/useToast.js` |
| 8 | Scaduto di un multiplo esatto di `repeatEvery` → orario calcolato = istante corrente | Ricorsione infinita con una notifica per iterazione | `Math.ceil` in `scheduler.js:31` |
| 9 | `public/index.html` duplicato che punta a `/src/main.jsx` | Se avesse vinto la copia su `dist/index.html`, build di produzione totalmente rotta | confronto `diff index.html public/index.html` |
| 10 | `tailwind.config.js` ignorato (v4 senza `@config`) | ~5,5 KB di token morti; `font-headline-md`, `p-lg`, `px-margin-mobile` non esistono come CSS | solo `@import "tailwindcss"` in `global.css:2` |

I punti 1-9 sono stati risolti (vedi sezione seguente). Il punto 10 resta aperto come **DS-01**.

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

#### 📋 **DETTAGLI TASK UX-NEW (Riferimento per UI ENGINE)**

**UX-NEW-01 - Design System Moderno in global.css**
- **Spacing System:** Definire classi Tailwind: `gap-xs` (4px), `gap-sm` (8px), `gap-md` (16px), `gap-lg` (24px), `gap-xl` (32px)
- **Shadow System:** `shadow-sm` (0 1px 2px rgba(0,0,0,0.05)), `shadow-md` (0 4px 6px rgba(0,0,0,0.1)), `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))
- **Border Radius:** `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px)
- **Transizioni:** `transition-all duration-200 ease-in-out` come default
- **Colori Priorità:** 
  - `--color-priority-high: #ba1a1a` (rosso)
  - `--color-priority-medium: #f59e0b` (arancio)
  - `--color-priority-low: #4bb278` (verde)
- **Colori Scadenze:**
  - `--color-status-imminent: #f59e0b`
  - `--color-status-overdue: #ba1a1a`
  - `--color-status-completed: #4bb278`

**UX-NEW-02 - Dashboard Layout a 3 colonne**
```
+--------------------------------------------------+
|  TOP APP BAR (mobile) / DESKTOP TOP BAR          |
+--------------------------------------------------+
|                                                  |
|  +------------+  +------------------+  +------+ |
|  | STATS      |  | CALENDARIO       |  | UPCOM| |
|  | - Task     |  | - Mese corrente  |  | - Pross| |
|  |   complet. |  | - Giorno evidenz.|  | imi   | |
|  | - Task     |  | - Click → pannello|  | eventi | |
|  |   in sosp. |  |   task giorno    |  |      | |
|  +------------+  +------------------+  +------+ |
|                                                  |
+--------------------------------------------------+
```

**UX-NEW-03 - Stats Narrative + Calendario Interattivo**
- QuickStats: "Hai completato **5** task oggi" (testo grande, icona ✓ verde)
- QuickStats: "**3** task in sospeso" (testo grande, icona ⏳ arancio)
- CTA: Pulsante "+ Nuovo Task" (sfondo primary, icona +)
- Calendario: Giorno corrente con `border-2 border-primary bg-primary/10`
- Pannello task giorno: Appare al click, mostra lista task con filtro per data

**UX-NEW-04 - Segnalazione Visiva Colori**
- **Badge Priorità:** 
  - Alta: `<span class="px-2 py-1 bg-red-50 text-red-600 rounded-full">Alta</span>`
  - Media: `<span class="px-2 py-1 bg-amber-50 text-amber-600 rounded-full">Media</span>`
  - Bassa: `<span class="px-2 py-1 bg-green-50 text-green-600 rounded-full">Bassa</span>`
- **Border Scadenze:**
  - Imminente: `border-l-4 border-amber-500`
  - Scaduto: `border-l-4 border-red-500`
  - Completato: `opacity-60 grayscale`

**UX-NEW-05 - Navigazione con Voce Attiva**
- SideNavBar: Voce attiva = `bg-primary/10 text-primary font-medium`
- SideNavBar: Hover = `hover:bg-surface-container-high`
- Mobile: Icona calendario evidenziata se in Dashboard/Agenda

**UX-NEW-06 - Pagina Agenda**
- Header: Filtri in barra orizzontale compatta (non dropdown multipli)
- Lista: Spaziatura 12px tra task, nessuna sovrapposizione
- Ordinamento: Prima per data, poi per priorità (Alta → Bassa)

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

### Meta

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-08** | **Aggiornare PLAN.md e README.md a fine implementazione** | ORCHESTRATOR | ROAD-01..07 | ⬜ TODO | MEDIUM | Dopo aver implementato le voci sopra (anche solo alcune): `README.md` — tabella feature + limiti noti aggiornati riflettendo cosa è stato effettivamente attivato; `PLAN.md` — stato di ogni `ROAD-*` aggiornato distinguendo chiaramente "fatto/attivo" da "creato ma non collegato" (Priorità 2/3, usare la nota `✅ DONE (non attivo)` accanto al task) da "da fare" |

**Ordine di lavoro consigliato:** Priorità 1 nell'ordine ROAD-01 → ROAD-02 → ROAD-03, poi Priorità 2
(ROAD-04 + ROAD-05) come blocco unico quando si è pronti a richiedere l'account AdSense, poi
Priorità 3 (ROAD-06, ROAD-07) solo quando si deciderà di introdurre un database reale (es. Supabase,
già in uso per ButlerAI).

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

Richiesta dall'utente su ispirazione del database ormai esistente (Supabase, per il backend Web
Push). Valutato e **scartato** il salvataggio server-side: senza un vero sistema di login (ROAD-07,
volutamente rimandato) un avatar sul DB non sarebbe comunque sincronizzato tra dispositivi — un
telefono nuovo non avrebbe modo di sapere quale avatar è stato scelto altrove, quindi l'infrastruttura
aggiuntiva non avrebbe portato il beneficio atteso. Confermato con l'utente: salvataggio in
**localStorage**, stesso meccanismo di tema/vibrazione/notifiche silenziose già in Preferenze.

**Implementato:**
- `src/logic/preferences.js`: `getAvatar()`/`setAvatar()`/`subscribeToAvatarChanges()` — quest'ultima
  necessaria perché `TopAppBar` (mobile) e `DesktopTopAppBar` possono essere **entrambi montati
  insieme** (nascosti solo via CSS in base al breakpoint `lg:`), quindi un cambio avatar deve
  propagarsi a componenti già montati, non solo essere letto al mount — pattern pub/sub identico a
  quello già usato per i toast (`notifications/toast.js`)
- `src/ui/components/Avatar/avatarOptions.js`: 9 preset (3 icone Material Symbols × 3 colori),
  deliberatamente solo coppie `bg-*-container`/`text-on-*-container` del design system — le uniche
  self-contained e già verificate stabili in entrambi i temi nella sessione di oggi (vedi fix
  contrasto tema scuro sopra), per non introdurre un nuovo rischio di contrasto
- `src/ui/components/Avatar/Avatar.jsx`: componente riutilizzabile (props `size: 'sm'|'md'|'lg'`),
  mostra l'avatar scelto o il placeholder generico originale (cerchio grigio + icona "person") se non
  ancora impostato
- `src/ui/components/Avatar/AvatarPicker.jsx`: popup di scelta, stesso pattern di `ConfirmDialog`
  (backdrop + pannello con bordo — importante dopo il fix di oggi sulla trasparenza in scuro — Escape,
  focus sul primo elemento). Griglia 3×3, anello di evidenziazione sull'opzione selezionata
- Sezione "Immagine profilo" in `SettingsPage.jsx` (`ProfileSettings`), prima voce della pagina:
  anteprima grande (`size="lg"`) + bottone "Cambia avatar" che apre il popup
- `TopAppBar.jsx` (mobile): il placeholder statico sostituito con `<Avatar size="md" />`.
  `DesktopTopAppBar.jsx`: l'icona `account_circle` sostituita con `<Avatar size="sm" />` nello stesso
  `Link` verso Settings, con un anello (`ring-2 ring-primary`) quando la pagina è attiva al posto del
  cambio colore precedente (l'avatar ha già un proprio sfondo colorato, cambiarne il colore in base
  allo stato attivo non avrebbe funzionato come per una semplice icona)

**Verificato in browser** (`npm run dev`, tema chiaro e scuro): selezione nel popup aggiorna
istantaneamente sia l'anteprima in Settings sia l'icona nel TopAppBar (conferma che la propagazione
pub/sub tra componenti montati insieme funziona), persistenza confermata dopo reload, tutti i 9
preset leggibili in entrambi i temi. `npm run build` OK, `npm run lint` 0 errori (51 warning,
invariati).

**Verifica di accessibilità aggiuntiva (stesso giorno):** trovato che `AvatarPicker` non intrappolava
il Tab (a differenza di `ConfirmDialog`) — un utente da tastiera poteva uscire dal popup senza
chiuderlo. Aggiunto lo stesso focus trap di `ConfirmDialog`/`MobileSideNav`. Verificato via DOM/
tastiera: Shift+Tab dal primo pulsante (Chiudi) salta correttamente all'ultimo (`Avatar
sports_esports`), Escape chiude il popup. Verificato anche via query DOM diretta (il viewport
desktop reale non è raggiungibile con gli strumenti di automazione browser disponibili, fissi su
504px indipendentemente dal resize della finestra) che `DesktopTopAppBar` — montato ma nascosto via
CSS a questo viewport — riceve comunque l'aggiornamento avatar in tempo reale tramite
`subscribeToAvatarChanges`, incluso l'anello di stato attivo su Settings.

**Confermato dall'utente su device Android reale (stessa giornata):** tutto funziona correttamente.
Resta solo la conferma visiva vera del breakpoint desktop (qui verificata solo via DOM, non via
screenshot, per un limite dello strumento di automazione browser usato in questa sessione) — non
bloccante, stesso componente `Avatar` già confermato funzionante su mobile e via ispezione DOM.

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

## 📝 Note per la prossima sessione (2026-08-14)

Segnalate dall'utente il 2026-08-14, esplicitamente **non urgenti** — da riprendere e testare nella
prossima sessione, non nell'immediato.

### 1. Overlap z-index: `MobileSideNav` va sotto la `BottomNav`

Il drawer laterale mobile (hamburger menu) copre correttamente il `TopAppBar` quando si apre, ma
**finisce sotto la `BottomNav`** in fondo alla pagina invece di coprirla. Causa: `MobileSideNav`,
`TopAppBar` e `BottomNav` usano tutti lo stesso `z-50` — a parità di z-index vince l'ordine nel DOM,
non l'intenzione, e `BottomNav` viene renderizzata dopo (quindi sopra) il drawer.

**Fix già scritto in locale, non ancora testato** (l'utente ha chiesto di fermarsi prima di riavviare
l'emulatore per verificarlo): aggiunto un nuovo livello `.z-modal { z-index: 1100 }` in
`global.css` (sopra `.z-fab { z-index: 1000 }`, così un drawer/modal aperto copre davvero tutto,
FAB incluso — altrimenti resterebbe cliccabile "attraverso" il backdrop), applicato a backdrop e
drawer in `MobileSideNav.jsx` al posto di `z-40`/`z-50`. **Da verificare su emulatore Android reale
alla prossima sessione**: aprire il drawer e controllare che copra sia `TopAppBar` che `BottomNav`
su tutte le pagine.

### 2. Icona "person" nel TopAppBar: serve un vero sistema di avatar?

L'utente ha notato che l'icona a forma di persona nel `TopAppBar` (e replicata altrove) lascia
pensare a una funzionalità di profilo/avatar non ancora esistente — al momento è puramente
decorativa, non porta a nessuna pagina né apre alcun menu. Due direzioni possibili, da decidere
insieme prima di implementare:
- Avatar predefiniti selezionabili (nessun upload, nessuno storage esterno necessario)
- Upload di una foto personale (richiede persistenza — oggi l'app è local-first/IndexedDB, quindi
  fattibile anche senza backend salvando in IndexedDB come Blob, ma cambia lo scope)

Si collega a **ROAD-07** (scaffolding profili utente, oggi solo struttura dati/tipi, nessuna UI) —
probabilmente l'avatar va deciso e formalizzato come parte di quel task, non a sé stante. Nessun
codice scritto per questo punto: è solo una domanda di prodotto da sciogliere.

---

## 🎯 DELEGA ATTIVA

### FASE 1: Pulizia e Preparazione (ORCHESTRATOR - COMPLETATA ✅)
- ORG-01: ✅ DONE
- ORG-02: ✅ DONE

### FASE 2: Configurazione Tailwind e Layout Base (ARCHITECT + UI ENGINE - COMPLETATA ✅)

**Task completati:**
1. **ORG-03** → UI ENGINE (✅ DONE)
2. **ORG-04** → ARCHITECT (✅ DONE - già esistente)
3. **ORG-05** → UI ENGINE (ready, dipende da ORG-04 ✅)
4. **ORG-06** → UI ENGINE (✅ DONE)

**Dipendenze:** ORG-04 ✅ completato, ORG-05 e ORG-06 ✅ completati

### FASE 3: Accessibilità e Responsività (UI ENGINE - COMPLETATA ✅)

**Task completati:**
- **A11Y-01** → UI ENGINE (✅ DONE) - ARIA su 9 componenti
- **A11Y-02** → UI ENGINE (✅ DONE) - Contrasto WCAG corretto
- **A11Y-03** → UI ENGINE (✅ DONE) - Navigazione tastiera completa
- **A11Y-04** → UI ENGINE (✅ DONE) - Skip link già presente
- **RESP-01** → UI ENGINE (✅ DONE) - Mobile-first con Tailwind
- **RESP-02** → UI ENGINE (✅ DONE) - Breakpoint testati
- **RESP-03** → UI ENGINE (✅ VERIFIED) - Hamburger menu mobile con accessibilità
- **ORG-05** → UI ENGINE (✅ DONE) - Cartella styles/ riorganizzata

### FASE 4: Performance e QA (ARCHITECT + LOGIC ENGINE + QA VERIFIER)
- PERF-01..PERF-03: Performance ✅
- QA-01..QA-10: Testing — **riaperto**, vedi FASE 6

### FASE 5: Performance (ARCHITECT + LOGIC ENGINE)
PERF-01 e PERF-02 possono procedere in parallelo.
PERF-03 richiede analisi di LOGIC ENGINE.

### FASE 6: Ripristino funzionalità core (LOGIC + ARCHITECT + UI — COMPLETATA ✅ 2026-08-12)
- FIX-01..FIX-10: ✅ DONE — notifiche, filtri, Service Worker in build, toast, scheduler
- Verifica automatica: build, lint, store, filtri, persistenza, 8 casi dello scheduler

---

### ✅ **FASE 1: Chiusura verifica manuale (QA VERIFIER) — chiusa il 2026-08-13**
> **Ordine eseguito:** ~~PWA-01~~ ✅ → ~~QA-04~~ ✅ → ~~QA-11~~ ✅ → ~~QA-07~~ ✅ → ~~QA-06~~ ✅ (sub-test di recupero completato in un secondo momento, su origine pulita) → ~~QA-10~~ ✅ → ~~QA-12~~ ✅ → ~~QA-08~~ ✅ (tablet, `resize_window` a 780px) → ~~QA-09~~ ✅ (accessibilità — trovato e risolto un bug critico, A11Y-06)
> **Tutti i 12 task QA chiusi.** Nessuno resta aperto in quest'area.

### ✅ **FASE 2: Rifacimento Layout Moderno — COMPLETATA E VERIFICATA IN BROWSER SU MOBILE (2026-08-13)**
> DS-01/DS-02 risolti, UX-NEW-01..06 tutti ✅ DONE. Dettaglio delle correzioni nella nota sopra
> ("riverifica contro le acceptance criteria"). Verificato con `npm run build` + `npm run lint`
> (0 errori).
>
> **2026-08-13 — prima apertura in un browser reale (`npm run dev` + Claude in Chrome, viewport
> mobile ~586px):** il layout era visivamente rotto nonostante build+grep "verdi" — vedi **DS-03**
> in Debito Tecnico per la causa (cascade layer CSS) e il fix. Dopo il fix, verificato su Dashboard
> e Agenda (mobile): header non copre più i contenuti, card con padding/spaziatura corretti, badge
> priorità/scadenza leggibili, CTA "+ Nuovo Task"/FAB visibili, nessuna sovrapposizione nella bottom
> nav.
>
> **2026-08-13 (sessione successiva) — verificato anche a schermo largo (≥1024px, ~1528-1568px):**
> il layout a 3 colonne desktop funziona: colonna sinistra con le stat, colonna centrale col
> calendario (giorno corrente evidenziato con bordo), colonna destra con le scadenze imminenti,
> sidebar di navigazione con voce attiva evidenziata. **L'osservazione aperta sui 4 dropdown è
> risolta:** a schermo largo la barra filtri della pagina Agenda è effettivamente una riga
> orizzontale compatta (Tipo/Stato/Importanza/Data + Ordina per, tutti sulla stessa riga) come
> richiesto da UX-NEW-06 — l'impilamento a piena larghezza era solo l'adattamento corretto per il
> viewport stretto (~586px) della sessione precedente, non un difetto.

| Task | Dipendenze | File Principali | Note |
|------|------------|------------------|------|
| **UX-NEW-01** | ORG-04 | `src/styles/global.css` | ✅ Fondamento **@theme** pronto (2026-08-12) — resta da rivedere l'uso pratico delle classi nei componenti |
| **UX-NEW-02** | UX-NEW-01 | `src/ui/pages/DashboardPage.jsx` | Struttura HTML/CSS del layout |
| **UX-NEW-03** | UX-NEW-01, UX-NEW-02 | `src/ui/components/Dashboard/QuickStats.jsx`, `CalendarWidget.jsx` | Contenuti e interattività |
| **UX-NEW-04** | UX-NEW-01 | `src/ui/components/AgendaItem/AgendaItemCard.jsx`, `global.css` | Sistema colori da applicare a TUTTI i componenti |
| **UX-NEW-05** | UX-NEW-01 | `src/ui/components/Layout/SideNavBar.jsx`, `DesktopTopAppBar.jsx` | Navigazione |
| **UX-NEW-06** | UX-NEW-01 | `src/ui/pages/AgendaPage.jsx` | Applicazione stili coerenti |

**Istruzioni per UI ENGINE:**
1. Inizia da **UX-NEW-01** (Design System) - è il fondamento
2. Usa **Tailwind CSS v4** per tutti gli stili
3. Mantieni la **logica esistente** (non modificare `src/logic/**`)
4. **Riferimenti visivi:** Guarda gli screenshot in `C:\Users\mandr\Desktop\Nuova cartella`
5. **Ispirazione:** Todoist (colori priorità), Google Calendar (layout), Notion (spaziatura)

---

## 💬 Istruzioni per gli Agenti

### React Architect (Tailwind/Config)
- **Responsabilità:** Configurazione Tailwind CSS, PostCSS, Vite, PWA
- **Task:** nessuno aperto (PWA-01, DS-01, DS-02, DEBT-03 tutti chiusi)
- **File da modificare:** `tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `src/sw.js`
- **Regole:** Non modificare logica applicativa o componenti UI. Non aggiungere file in `public/` che possano collidere con gli artefatti di build (`sw.js`, `index.html`)

### React Engine (Logic)
- **Responsabilità:** Logica applicativa, stato, servizi, hook
- **Task:** nessuno rimasto (DEBT-02 chiuso 2026-08-13, STR-03 chiuso 2026-08-13)
- **File da modificare:** `src/logic/**`
- **Regole:** Non modificare componenti UI o configurazione build. Il layer logic non importa React

### React Interface (UI)
- **Responsabilità:** Componenti, layout, styling, accessibilità
- **Task:** nessuno rimasto (UX-NEW-01..06 chiusi 2026-08-12, DEBT-01/STR-02 chiusi 2026-08-13, SEO-01..02/PWA-03 chiusi 2026-08-13)
- **File da modificare:** `src/ui/**`, `src/styles/**`
- **Regole:** Non modificare logica in `src/logic/`, usare Tailwind CSS
- **Priorità attuale:** attendere DS-01. Prima di usare una classe custom, verificare che generi CSS (`grep "\.nome-classe" src/styles/global.css`)

### React Verifier (QA)
- **Responsabilità:** Verifica qualità codice, testing, conformità
- **Task:** nessuno aperto. Tutti i 12 task QA chiusi 2026-08-13
- **Regole:** Segnalare problemi con classificazione corretta (FIX_LOCAL, RETURN_TO_*)
- **Regola nuova:** marcare ✅ VERIFIED **solo** allegando la prova (comando e output, o il passo manuale svolto con browser e data). Un task che non è stato eseguito resta ⬜ TODO

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

> ⚠️ Le date delle voci precedenti al 2026 sono incoerenti tra loro (il 13 agosto precede il 12)
> e con le date dei file su disco. Non sono state riscritte per non inventare una cronologia:
> vanno considerate indicative.

### 2026-08-14 — DS-10/DS-11: due bug mobile reali su dispositivo fisico (screenshot dell'utente)

L'utente ha inviato screenshot dal proprio telefono (non simulazioni), rivelando due problemi mai
verificati su hardware reale finora (la verifica mobile precedente, QA-08, usava `resize_window`
dell'automazione browser — scoperto in questa sessione che **non cambia realmente
`window.innerWidth`**, quindi quella verifica potrebbe non aver mai testato una vera larghezza
mobile).

**DS-10 — Footer che copre il fondo del contenuto** (screenshot: Settings, "Profili utente
personali" tagliato dietro alla BottomNav). Prima ipotesi (`h-screen`→`h-dvh`) insufficiente da sola.
Causa reale, trovata con un **emulatore Android (Pixel 6) pilotato via `adb` + Chrome DevTools
Protocol** (WebSocket diretto su `ws://localhost:9222/devtools/page/...`, non l'automazione desktop
usata finora): il wrapper `<div className="h-full min-h-full">` dentro `<main>` aveva `h-full`, che
fissa un'altezza **esatta** — contenuto più alto del viewport trabocca solo visivamente
(`overflow:visible`), senza spostare il flusso, per cui `pb-48` veniva calcolato rispetto all'altezza
di *layout* del wrapper, mai a quella reale del contenuto. Un primo tentativo (spacer reale al posto
del padding) non ha funzionato per lo stesso motivo — anche uno spacer sibling di un box ad altezza
fissa si posiziona in base a quell'altezza fissa, non al contenuto traboccato. **Fix**: `h-full` →
`min-h-full lg:h-full` (cresce col contenuto sotto `lg`, resta vincolato da `lg` in su perché DS-07
dipende dalla stessa catena per lo scroll interno desktop — regressione trovata e corretta nello
stesso giro). **Verificato con misure dirette via CDP** (`getBoundingClientRect`, non screenshot):
prima del fix, testo finale a 25px dalla BottomNav (sovrapposto); dopo, gap di ~177px, "Prossimamente"
interamente visibile — confermato anche visivamente.

**DS-11 — Contenuto tagliato orizzontalmente, solo in Agenda/Filtri** (screenshot: pulsanti
Giornaliera/Settimanale/Prossime e box filtro "Tutti" tagliati di netto sul bordo destro, nessuna
scrollbar). Confermato dall'utente: **non è zoom** (pinch-zoom non risolve, resta tagliato uguale)
e **solo su Agenda**, non altrove. Trovato in `AgendaHeader.jsx`: il contenitore mobile usa
`items-start` (necessario per non stirare i due gruppi pulsanti in altezza) — ma su un flex-col,
`items-start` lascia i figli larghi quanto il loro contenuto invece di stirarli a piena larghezza,
e il gruppo sinistro (data lunga + pulsante "Oggi" + pulsante "Scegli data") ha `flex-wrap` **senza
una larghezza di contenitore su cui avvolgersi** — non va mai a capo, eccede il viewport,
`body{overflow-x:hidden}` taglia silenziosamente il bordo destro anche di FilterBar/ViewToggle
sottostanti (pur essendo loro stessi corretti). **Fix**: `w-full lg:w-auto` al gruppo sinistro.
**Verificato con lo stesso emulatore Android**: `document.documentElement.scrollWidth ===
clientWidth === innerWidth` (412px, tutti uguali) → zero overflow orizzontale; screenshot sulla
stessa identica schermata del bug originale conferma bordi arrotondati completi su tutti i lati.

Entrambe le diagnosi iniziali (basate solo su ragionamento CSS, senza device reale) erano parzialmente
o completamente sbagliate — solo l'emulatore + CDP ha permesso di trovare la causa vera. `npm run
lint` 0 errori/39 warning, `npm run build` OK per entrambi. Nessuna regressione desktop (DS-07
rivereificato dopo il fix di DS-10).

### 2026-08-14 — DS-12 + rifiniture Agenda: secondo giro di test su emulatore, causa radice trovata

L'utente ha notato, guardando gli screenshot del test precedente, che il lato destro dello schermo
non era simmetrico al sinistro — un margine visibile a sinistra, quasi nullo a destra. Rifatto il
test da zero (emulatore con `-wipe-data`, per evitare l'accumulo di tab dei giri precedenti) e
misurato con CDP invece che a occhio: **il wrapper radice in `MainLayout.jsx`
(`flex-1 lg:ml-64 flex flex-col h-dvh relative`, il div che contiene `<main>`) era largo 439px
contro un viewport reale di 412px** — 27px in eccesso, tagliati silenziosamente da
`overflow-hidden` sulla shell. Causa: è un flex item della shell radice (anch'essa `flex`) senza
`min-w-0` — con `min-width:auto` di default, si rifiuta di restringersi sotto la larghezza minima
naturale del proprio contenuto (qui: 439px, dovuta ad Agenda). Stesso pattern già corretto oggi in
ViewToggle/AgendaHeader, ma non ancora applicato alla radice dell'intero layout. **Fix**: aggiunto
`min-w-0` al wrapper. Verificato via CDP: `main` torna a 412.19px esatti, `ViewToggle` termina a
392px, simmetrico ai 20px di margine sinistro.

**DS-12 — le icone del `ViewToggle` restavano visibili nonostante `hidden sm:inline`**: verificato
via CDP che la classe `hidden` non produceva `display:none` sull'icona nonostante fosse applicata
correttamente nel DOM. Causa: lo stesso bug di cascata già documentato altrove nel progetto (vedi
commento storico in `TopAppBar.jsx`) — il foglio di stile di Material Symbols, caricato via `<link>`
fuori da ogni `@layer` Tailwind, include `display: inline-block` che batte sempre le utility
`@layer utilities` come `hidden`, indipendentemente dall'ordine nel file. **Fix**: `hidden
sm:inline` spostato su uno `<span>` che AVVOLGE l'icona, invece di applicarlo direttamente allo
`<span className="material-symbols-outlined">`. Verificato via CDP (icone non più nel DOM
visibile sotto `sm:`) e screenshot: "Giornaliera"/"Settimanale"/"Prossime" ora per intero, senza
ellissi né icone, su un viewport di 412px.

**Rifiniture su richiesta dell'utente, tutte verificate con screenshot sull'emulatore**:
`AgendaHeader.jsx` — "+ Nuovo Elemento" spostato su una riga propria sotto alle frecce
giorno prec./succ. (`flex-col` sotto `lg:`, affiancati da `lg:` in su); l'intero gruppo di
controlli (data, Oggi, Scegli data, frecce, Nuovo Elemento) centrato invece che allineato a
sinistra (`items-start`→`items-center` sul contenitore, `justify-center` sui due sotto-gruppi);
titolo data (`<h1>`) centrato anche quando va a capo su due righe (`text-center`). `BottomNav.jsx`
— trasparenza rimossa del tutto (`bg-surface/95` → `bg-surface` pieno, `backdrop-blur-md` rimosso
perché non più necessario).

`npm run lint` 0 errori/39 warning, `npm run build` OK per l'intero giro.

### 2026-08-14 — Due rifiniture: BottomNav più opaca, ViewToggle senza icone su schermi stretti

Su richiesta dell'utente: `BottomNav.jsx` da `bg-surface/80` a **`bg-surface/95`** (meno trasparenza,
meno leggibile il contenuto che scorre sotto durante lo scroll). Verificata solo via lint/build,
modifica di un solo valore di opacità Tailwind, rischio nullo.

L'utente, guardando gli screenshot dei test DS-11 su emulatore, ha notato che pur senza più overflow
le etichette "Giornaliera"/"Settimanale" del `ViewToggle` restavano troncate con ellissi
("Giornali...", "Settima...") a 412px di larghezza — non un bug (nessun taglio, nessun overflow) ma
comunque non ideale. **Fix**: icona nascosta sotto `sm:` (`hidden sm:inline`), liberando spazio per
il testo; `truncate` resta come ultima rete di sicurezza. **Non riverificata visivamente**:
l'ambiente di test (emulatore + Chrome, 9 tab accumulate dopo l'uso prolungato in questa sessione) è
diventato instabile (pagine bloccate, errori di connessione intermittenti) prima di poter catturare
uno screenshot di conferma — mi sono fermato invece di insistere con uno strumento che non rispondeva
più in modo affidabile. Da confermare al prossimo test. `npm run lint` 0 errori/39 warning, `npm run
build` OK.

### Nota metodologica — verifica mobile su device reale (DS-10, DS-11, DS-12)

Per superare il limite di `resize_window` dell'automazione browser (non modifica realmente
`window.innerWidth`), usato un emulatore Android reale (AVD `Pixel_6`) pilotato da riga di comando
via `adb` (screenshot, tap/swipe), con `npm run dev -- --host` per renderlo raggiungibile
(`10.0.2.2` = alias dell'host). La verifica decisiva è stata via **Chrome DevTools Protocol**
(`adb forward tcp:9222 localabstract:chrome_devtools_remote` + un piccolo script Node con
`Runtime.evaluate`): misure DOM esatte (`getBoundingClientRect`, `scrollWidth`) invece di stime a
occhio dagli screenshot — l'unico modo per trovare le vere cause di DS-10/DS-11/DS-12, dato che le
prime ipotesi basate solo su ragionamento CSS erano parzialmente o completamente sbagliate.

### 2026-08-14 — Terzo episodio di pagina bianca dopo deploy: DS-08 escluso, ipotesi non confermata

Terzo report dell'utente, stesso sintomo ("pagina non carica, rimane bianca") dopo l'ultimo deploy
(DS-09). Diagnosi più approfondita rispetto a DS-08: **tab nuova appena aperta** (non una tab
rimasta su una build precedente) — esclude la race SW/`vite:preloadError` di **DS-08**, che infatti
era già live su questo stesso deploy senza effetto. Caricata dopo **~1 minuto**, poi normale.
Verificato **Static Site** confermato su Render (non Web Service, escluso lo spin-down/cold-start
che ROAD-01 doveva prevenire). Build di produzione locale (`npm run build` + `npm run preview`, non
solo dev) carica istantaneamente e senza errori su tab fresca; asset live su Render tutti
raggiungibili (200) e coerenti tra loro (stesso `index.html`/JS/CSS ogni volta). **Non riprodotto
dal vivo**, quindi nessuna prova diretta della causa.

**Ipotesi più plausibile rimasta** (non confermata): `index.html` carica Google Fonts (Material
Symbols + Inter) con `<link rel="stylesheet">` **bloccanti il rendering**, senza `preconnect` — se
la connessione verso `fonts.googleapis.com`/`fonts.gstatic.com` fosse stata lenta in quel momento
(rete, DNS), il browser resta bloccato prima di dipingere qualunque cosa finché non risolve o va in
timeout. Icone Material Symbols non deferibili senza rischio di flash of unstyled content (mostrano
il nome testuale grezzo, es. "add", finché il font non carica), quindi non reso asincrono — solo
aggiunto `rel="preconnect"` verso entrambi i domini in `index.html`, mitigazione standard consigliata
da Google, a rischio pressoché nullo indipendentemente dal fatto che sia davvero la causa. `npm run
build` OK.

**Se ricapita**: l'unico modo per avere una risposta certa è aprire DevTools → Network nel momento
esatto dell'incidente e vedere quale richiesta resta "pending" — impossibile da remoto senza quella
traccia dal vivo.

### 2026-08-14 — DS-09 chiuso: scroll orizzontale su desktop (Scadenze Imminenti + ViewToggle)

Handoff dell'utente con due problemi puntuali e una nuova regola generale ("mai scroll orizzontale
su desktop, gli elementi si ridimensionano o si impilano"). **UpcomingCards.jsx** (dashboard,
colonna destra): carosello mobile (`min-w-[280px]` + `overflow-x-auto snap-x`) mai adattato per la
colonna desktop da ~284px — riprodotto dal vivo su Render prima del fix, `scrollWidth` 1176px contro
`clientWidth` 284px. Da `lg:` in su ora è una lista verticale (`lg:flex-col`, card `lg:w-full
lg:min-w-0`, scroll disattivato), il carosello resta identico sotto `lg:`. **ViewToggle.jsx**
(Agenda): `overflow-x-auto` rimosso, i 3 pulsanti diventano `flex-1 min-w-0` con `truncate`
sull'etichetta — si dividono lo spazio invece di eccederlo, verificato via JS forzando il
contenitore a 280-1024px (mai overflow a nessuna larghezza). Cercati altri casi in `src/`: nessuno.
Verificato in browser reale con 3 task creati via UI (uno con titolo di 89 caratteri): card
impilate verticalmente senza clipping, screenshot di conferma. `npm run lint` 0 errori/39 warning,
`npm run build` OK.

### 2026-08-14 — DS-08 chiuso: pagina bianca dopo un nuovo deploy (chunk lazy con hash sparito)

Segnalato dall'utente subito dopo un redeploy su Render: pagina che "rimane vuota e non carica" —
stesso sintomo di uno spinner precedente, ma stavolta con codice realmente nuovo in produzione (i
commit di oggi risultano già su `origin/main`, presumibilmente pushati dall'editor/IDE con un
commit automatico — verificato con `git log`/`git fetch`, nessuna azione mia). Non riproducibile
dai miei tab automatizzati (sempre "puliti", senza Service Worker precedente registrato) — DOM
completo, nessun errore console, tutte le risorse 200 in ogni verifica.

**Causa più probabile** (spiegazione architetturale, non riprodotta live per limiti del tool di
automazione): l'app usa `registerType: 'autoUpdate'` + un Service Worker custom che chiama
`self.skipWaiting()` incondizionatamente su `install`. Per un utente che aveva già una tab aperta
sulla build precedente, il nuovo SW si attiva quasi subito e forza un `window.location.reload()`
(comportamento di `virtual:pwa-register` in modalità auto-update). Se in quella finestra la pagina
sta ancora eseguendo un `import()` dinamico di una pagina lazy (`React.lazy`, tutte le pagine lo
sono) verso un chunk con hash della build **vecchia**, e Render nel frattempo ha già sostituito
l'intera cartella `dist` con quella nuova (niente hash vecchi sul server), quella `fetch` risponde
404: Vite emette `vite:preloadError`, mai gestito finora, e senza un `ErrorBoundary` l'intero albero
React crasha silenziosamente → pagina bianca. Coerente con: transitorio, si risolve da solo al
reload successivo, capitato due volte di fila esattamente dopo due deploy consecutivi.

**Fix**: aggiunto in `main.jsx` il listener ufficiale consigliato da Vite per questo scenario —
`window.addEventListener('vite:preloadError', () => location.reload())`, con un guard
`sessionStorage` per evitare un loop di reload infinito se l'errore fosse persistente per un altro
motivo, e un reset del guard 5s dopo il mount riuscito (così un deploy successivo, nella stessa
sessione browser, può ancora innescare il reload). `npm run lint` 0 errori/39 warning, `npm run
build` OK. **Non verificabile end-to-end** senza un vero secondo deploy con una tab già aperta sul
precedente: da confermare al prossimo redeploy reale.

### 2026-08-14 — Rimossa da "Prossimamente" la voce ormai spedita (Feedback dall'app)

Segnalato dall'utente: la voce "Feedback dall'app → In arrivo" in `UPCOMING_FEATURES`
(`SettingsPage.jsx`) era rimasta invariata dopo aver spedito ROAD-03 nella stessa sessione —
ridondante e fuorviante, dato che il form di feedback funzionante sta proprio sopra, nella stessa
pagina. Rimossa la voce dall'array. `npm run lint` 0 errori/39 warning (invariato).

### 2026-08-14 — DS-07 chiuso: le pagine desktop non scrollavano mai, a prescindere dal contenuto

Segnalato dall'utente dopo il deploy: pagina Settings su desktop con spinner infinito al primo
tentativo (risoltosi da solo, probabile cache/rete transitoria — verificato con `curl` e via
browser: HTTP 200, DOM completo, nessun errore console, nessun loop di re-render), poi un secondo
sintomo reale e riproducibile: **la pagina Settings non scrollava verso il basso su desktop**.
Causa a due livelli: (1) ogni pagina avvolge il contenuto desktop in un div `lg:flex-1
lg:overflow-y-auto`, ma il suo genitore non era `display:flex` — `flex-1` senza un genitore flex non
ha effetto, quindi il div si auto-dimensionava sul contenuto (mai overflow reale); (2) anche
rendendo il genitore flex, `<main>` in `MainLayout.jsx` ha `lg:overflow-visible`, e un flex item con
`overflow:visible` ha altezza minima automatica pari al min-content (non 0) per specifica CSS —
quindi `<main>` si espandeva comunque oltre il viewport, propagando l'altezza sbagliata a valle.
Bug presente su **tutte e 7 le pagine**, mai emerso prima perché il contenuto era sempre stato
abbastanza corto da stare nel viewport. Fix: `lg:min-h-0` su `<main>` + `lg:flex lg:flex-col` sul
contenitore radice di ogni pagina + `lg:min-h-0` sul loro div scrollabile. Verificato in browser a
viewport ridotto: scroll reale confermato (`scrollTop` fino a 482/483px), nessuna regressione su
Dashboard/Agenda. `npm run lint` 0 errori/39 warning, `npm run build` OK. Non ancora pushato/
verificato sul deploy live (le modifiche restano locali finché non richiesto).

### 2026-08-14 — ROAD-03 chiuso: form di feedback → GitHub Issues (Priorità 1 completa)

Nuovo `FeedbackForm.jsx` montato in Settings: categoria (Bug/Idea-richiesta funzione/Feedback
tecnico) + descrizione, l'invio apre `github.com/MindrasEugen/Smart-planner/issues/new` precompilato
(titolo, corpo, label) in una nuova tab, nessun backend. Trovato e rimosso durante la verifica un
pezzo di validazione JS morta: il `required` nativo su select/textarea blocca già il submit prima
che l'`onSubmit` React (e quindi il mio stato `errors`) potesse mai eseguirsi. Verificato in browser
reale con `window.open` monkey-patchato per catturare l'URL senza aprire issue vere: submit vuoto
bloccato, le 3 categorie generano URL corretti, form resettato dopo l'invio. `npm run lint` 0
errori/39 warning, `npm run build` OK. **Con questo si chiude tutta la Priorità 1 della roadmap
(ROAD-01/02/03).**

### 2026-08-14 — ROAD-02 chiuso: sezione "Prossimamente" in Settings

Nuovo componente `ComingSoonSettings` in `SettingsPage.jsx`, contenuto pilotato dall'array
`UPCOMING_FEATURES` (4 voci: quick add intelligente, feedback dall'app, annunci discreti, profili
utente — tutte "in valutazione" tranne il feedback, "in arrivo"). Durante la verifica in browser
trovato un bug di layout: il badge di stato a fine riga finiva dietro al FAB fisso in basso a
destra su desktop — risolto spostando il badge accanto al titolo invece che a `justify-between`
su tutta la card. Verificato: nessun overlap (`getBoundingClientRect` su ogni voce), `npm run lint`
0 errori/39 warning, `npm run build` OK.

### 2026-08-14 — ROAD-01 chiuso: deploy live su Render

Pubblicato come Static Site su Render: **https://smart-planner-vjgl.onrender.com**. Verificato in
browser reale (Claude in Chrome): Dashboard senza errori console, navigazione diretta a `/agenda`
renderizza la pagina invece di un 404 (rewrite rule `/* → /index.html` attiva), Service Worker
registrato e `state: activated` (`scriptURL: /sw.js`), `/manifest.webmanifest` raggiungibile (200,
content-type non ideale ma non bloccante). Nessun codice modificato, solo configurazione su Render.

### 2026-08-14 — Aggiunta la roadmap post-completamento: 8 nuovi task ROAD-01..08

Estratte le informazioni dall'handoff di brainstorming `agenda-intelligente-roadmap-handoff.md`
(sessione con Claude Cowork) e formalizzate in una nuova sezione [🗺️ Roadmap — Prossimi
Sviluppi](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14): **ROAD-01..03** (Priorità 1, da
attivare subito — deploy Render Static Site, sezione "Prossimamente" in Settings, form feedback →
GitHub Issues), **ROAD-04/05** (Priorità 2, creati ma non montati — ConsentBanner + AdBanner,
bloccati da approvazione Google AdSense), **ROAD-06/07** (Priorità 3, scaffolding non collegato —
quick add AI e profili utente, bloccati da un database futuro), **ROAD-08** (meta: aggiornare
README/PLAN a implementazione avvenuta). Nessun codice toccato, solo pianificazione. Il file di
handoff è stato rimosso dopo l'estrazione: il contenuto vive interamente in questo documento.

### 2026-08-13 — SEO-01/02 e PWA-03 chiusi: piano completato al 100% (92/92)

**SEO-01/02:** aggiunti in `index.html` i meta tag Open Graph (`og:type`, `og:title`,
`og:description`, `og:image` — icona 512x512 esistente, `og:locale`) e `twitter:card`, oltre a un
blocco `<script type="application/ld+json">` con schema.org `WebApplication`. Verificato con
`node -e` che il JSON-LD nel build (`dist/index.html`) fa `JSON.parse` senza errori, e in browser
reale (`document.title`, i meta tag e il parsing lato client dello script) che tutto è presente coi
valori attesi.

**PWA-03:** creato `src/ui/components/InstallBanner/` (`useInstallPrompt.js` — hook che intercetta
`beforeinstallprompt`/`appinstalled`, salta se l'app è già in standalone; `InstallBanner.jsx` —
banner `lg:hidden` posizionato sopra la BottomNav, con pulsante "Installa" che invoca il prompt
catturato e pulsante di chiusura che persiste il dismiss in localStorage), agganciato in
`MainLayout.jsx` accanto a FAB/BottomNav (nascosto nelle stesse pagine di create/edit). Verificato
in browser reale: Chrome ha emesso realmente `beforeinstallprompt` sull'istanza di test, il banner è
comparso su viewport mobile (498px) col testo atteso, la chiusura lo nasconde e resta nascosto dopo
un reload della pagina; il pulsante "Installa" non è stato premuto in test per non innescare
l'installazione reale della PWA sul sistema dell'utente — verificata solo staticamente (invoca
`deferredPrompt.prompt()` sull'evento catturato, pattern standard).

`npm run lint` 0 errori (39 warning invariati), `npm test` 49/49, `npm run build` OK.

**Con questo il piano è completo al 100% (92/92): nessun task rimasto aperto.**

### 2026-08-13 — STR-03 chiuso: verificato, nessuna modifica al codice necessaria

Criterio di accettazione ("tutti i componenti Logic hanno JSDoc") verificato sistematicamente:
ogni `export function`/`export async function` in `src/logic/**/*.js` (esclusi i file di test) è
stata cercata via grep con contesto, in tutti i 15 file non-barrel del layer (`hooks.js`,
`items/actions.js`, `items/selectors.js`, `items/filters.js`, `store/index.js`,
`store/persistence.js`, `notifications/{index,browser,scheduler,integration,toast,db}.js`,
`time/{status,timezone}.js`). Le 82 funzioni esportate trovate hanno tutte un blocco `/**...*/`
JSDoc immediatamente sopra, con `@param`/`@returns` tipizzati tramite i `@typedef` centralizzati in
`src/types/**` (anche questi già completamente documentati). Nessun `export const` con funzione
arrow esiste nel layer logic (solo oggetti di default e lo store Zustand), quindi nessun caso limite
da coprire. Nessun file di codice modificato, nessuna nuova esecuzione di lint/test/build necessaria.

### 2026-08-13 — STR-02 chiuso: verificato, nessuna modifica al codice necessaria

Criterio di accettazione ("unico file con colori, spaziature, tipografia") già soddisfatto come
effetto collaterale di DS-01/DS-02, chiusi in precedenza nella stessa sessione: il blocco `@theme`
in `src/styles/global.css` (righe 18-165) è già l'unica fonte centralizzata di colori/spaziature/
tipografia. Verificato con `grep -rn "#[0-9a-fA-F]\{6\}" src/ui` (zero colori esadecimali hardcoded
nei componenti) e confermato che `src/styles/` contiene solo `global.css` (nessun altro foglio di
stile da consolidare). Costruire un nuovo file di configurazione separato avrebbe reintrodotto la
duplicazione che DS-02 aveva eliminato, quindi la chiusura corretta è verifica-e-chiudi, non
implementazione. Nessun file di codice modificato, nessuna nuova esecuzione di lint/test/build
necessaria per questo task.

### 2026-08-13 — DEBT-03 chiuso: standardizzato su npm — tutto il debito tecnico è ora risolto

Ultima voce di debito tecnico. Confrontati i due lockfile prima di scegliere: `package-lock.json`
era già quello aggiornato (rifletteva vitest/jsdom/cross-env aggiunti in questa stessa sessione via
`npm install`), mentre `pnpm-lock.yaml` era fermo al giorno prima. Il README documentava già npm
come scelta consigliata, segnalando che `pnpm dev` poteva fallire con `ERR_PNPM_IGNORED_BUILDS`.
`pnpm-workspace.yaml` non definiva un vero workspace multi-pacchetto (nessun campo `packages:`,
serviva solo per l'approvazione degli script di build di pnpm per `@parcel/watcher`/`esbuild`) e
`package.json` non ha mai avuto un campo `workspaces`: nessuna funzionalità reale da preservare.

Rimossi `pnpm-lock.yaml` e `pnpm-workspace.yaml`. Rimossa dal README la nota di aggiramento
("usare npm, pnpm può fallire..."), non più necessaria essendo rimasto un solo package manager;
aggiunta nello stesso punto una sezione "Test" che mancava (`npm test`/`npm run test:watch`, script
introdotti in QA-12 ma mai documentati nel README). Verificato: `npm run lint` 0 errori, `npm test`
49/49, `npm run build` OK — nessuna reinstallazione di `node_modules` necessaria, era già gestito
da npm de facto.

**Con questo tutto il debito tecnico aperto a inizio sessione (DEBT-01/02/03) più quello scoperto
durante la sessione stessa (DEBT-04/05/06) è chiuso.** Nel progetto restano solo rifiniture
facoltative e non bloccanti: STR-02/STR-03, SEO-01/02, PWA-03.

### 2026-08-13 — DEBT-02 chiuso: rimossa l'ambiguità hooks.js / hooks/

`src/logic/hooks/` conteneva un solo file, `useResponsive.js`, che esportava `useDesktop`,
`useMobile` e `useResponsive` — tre hook basati su `window.innerWidth` + listener `resize`. Nessuno
dei tre era importato da nessuna parte in `src/` (confermato con `grep` mirato su ciascun nome):
l'app ottiene tutto il comportamento responsive via classi Tailwind (`lg:hidden`, `hidden lg:flex`,
ecc.), non via hook JavaScript — probabile residuo di un primo approccio poi abbandonato a favore
del solo CSS. Stessa storia di `Responsive/` in DEBT-01: codice morto, non un vero conflitto di
risoluzione moduli da arbitrare (tutti gli import di `hooks.js` nel codice usano già l'estensione
esplicita `.js`, quindi non erano mai stati ambigui in pratica).

Rimossa l'intera cartella `src/logic/hooks/`. Resta un solo percorso, `src/logic/hooks.js`, usato
da 10 file. Verificato: `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK.

Con questo restano aperti nel debito tecnico solo **DEBT-03** (doppio package manager).

### 2026-08-13 — DEBT-01 chiuso: rimossa la navigazione morta

Rimossa `src/ui/components/Responsive/` (`MobileNav.jsx`, `DesktopNav.jsx`, `index.js`) —
confermato zero import in tutto `src/` prima di cancellare. Contenuto palesemente da una fase
precedente del progetto (commento "Mappa varianti Bootstrap a colori Stitch", nav items che non
includevano Tasks/Filters/Alerts). Ironia a parte: `MobileNav.jsx` era visibile solo su `hidden
lg:block` — cioè su **desktop**, l'opposto di quel che il nome promette — ulteriore conferma che
non era mai stato realmente in uso.

Riesaminati gli altri 6 componenti di navigazione citati nel task (`TopAppBar`, `DesktopTopAppBar`,
`SideNavBar`, `MobileSideNav`, `BottomNav`, `FAB`): a differenza della cartella `Responsive/`, questi
non sono ridondanti tra loro. `BottomNav` (4 voci sempre visibili: Dashboard/Agenda/Alerts/Settings)
e `MobileSideNav` (drawer con tutte le 6 rotte, aperto dall'hamburger di `TopAppBar`) sono superfici
diverse per un motivo di UX reale — bottom-tab-bar per l'accesso rapido, drawer per tutto il resto —
non un doppione da accorpare. Consolidare oltre la rimozione del codice morto avrebbe significato
peggiorare l'esperienza, non semplificare il codice. Nessun ulteriore intervento su questi 6.

Verificato: `npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK; navigazione (sidebar
desktop, hamburger mobile, bottom nav, FAB) confermata funzionante in browser dopo la rimozione.

### 2026-08-13 — DEBT-06 chiuso: etichette visibili sui filtri

Aggiunto uno `<span>` con il testo di `label` sopra ciascun pulsante in `FilterDropdown.jsx`
("Tipo"/"Stato"/"Importanza"/"Data"), invariato l'`aria-label` già corretto. Nella griglia di
`FilterBar.jsx`, `items-center` → `items-end`: senza il cambio, le 4 caselle con la nuova etichetta
(più alte) e le caselle senza etichetta (Ordina, Reimposta) si sarebbero centrate in modo
disomogeneo nella riga; con `items-end` restano tutte allineate sulla stessa riga di base.
Verificato in browser (viewport tablet 780px): etichette leggibili, nessuna sovrapposizione.
`npm run lint` 0 errori, `npm test` 49/49, `npm run build` OK.

Con questo, **tutti i debiti tecnici emersi da questa sessione sono chiusi** (DEBT-04/05/06);
restano solo DEBT-01/02/03, presenti da prima e non bloccanti per il rilascio.

### 2026-08-13 — QA-09 chiuso: trovato e risolto un bug critico in ConfirmDialog

Ultimo task QA rimasto. Iniziato come un normale controllo di tastiera/contrasto/ARIA, ha portato
alla scoperta del difetto funzionale più serio trovato in questa sessione.

**Contrasto (ri-verificato con valori reali, non dichiarati):** calcolato il rapporto WCAG sui
colori effettivamente risolti da `getComputedStyle` (non sulle costanti dichiarate in PLAN in
passato) — success 5.06:1, warning 4.58:1, error 6.46:1, primary 16.25:1, on-surface-variant 9.33:1.
Tutti ≥4.5:1, confermato anche leggendo badge e pulsanti realmente renderizzati in pagina, non solo
i token del design system.

**Tastiera:** skip link verificato (sposta `document.activeElement` su `#main-content`), focus ring
visibile confermato via screenshot durante la navigazione a Tab, focus trap di `ConfirmDialog`
verificato (Tab cicla Annulla→Conferma→Annulla).

**A11Y-07 — dropdown non chiudibili da tastiera.** Aprendo `FilterDropdown` con Invio e premendo
Escape, il pannello restava aperto e visivamente sovrapposto ai controlli successivi anche dopo aver
spostato il focus con Tab (screenshot alla mano: il pannello "Tutti/Task/Compleanni" restava aperto
sopra il terzo/quarto filtro). Stesso identico difetto in `SortDropdown` (codice copiato). Corretto
con un listener nativo `keydown`/`focusout` sul nodo del dropdown — non prop JSX `onKeyDown`/`onBlur`
su un `<div>`, per non attivare `jsx-a11y/no-noninteractive-element-interactions` (tentativo con
`role="group"` insufficiente, la regola si applica comunque a un ruolo non interattivo).

**A11Y-06 — bug critico: `ConfirmDialog` non si chiudeva mai davvero.** Testando il focus trap,
Escape non chiudeva il dialog. Approfondendo: **nemmeno il pulsante Annulla lo chiudeva**. Causa:
`isClosing` veniva impostato `true` per il fade-out ma mai riportato `false`, quindi la guardia di
rendering `!isOpen && !isClosing` non tornava mai vera — il dialog restava montato, invisibile
(`opacity-0`) ma con `pointer-events: auto` su un `fixed inset-0`, bloccando **ogni click su tutta
l'app**. Confermato con `document.elementFromPoint(5,5)` (angolo lontano dal dialog visibile): dopo
aver "chiuso" il dialog, quel punto risultava ancora il backdrop invisibile, non un elemento reale
della pagina. Il bug affliggeva **tutti e tre** i percorsi di chiusura (Annulla, Escape, Conferma —
stessa funzione `setIsClosing(true)` mai resettata), quindi qualunque uso di una conferma
eliminazione, in qualunque punto dell'app, rompeva permanentemente l'interfaccia finché non si
ricaricava la pagina. Passato inosservato finora perché visivamente il dialog *sembra* sparire
(fade a opacità 0) — un utente che clicca Annulla e non prova a interagire altrove subito dopo non
se ne accorge. Fix: `setIsClosing(false)` richiamato subito prima di `onClose()`/`onConfirm()` nello
`setTimeout` del fade-out. Verificato end-to-end: aperto il dialog, cliccato Annulla → 0 dialog nel
DOM, angolo della pagina di nuovo cliccabile; ripetuto con Conferma (eliminazione reale di un item di
test) → stesso esito, più l'item effettivamente rimosso da localStorage.

**A11Y-08 — `aria-hidden="true"` sul dialog stesso.** Nello stesso file, il backdrop che avvolge
`role="alertdialog"` aveva `aria-hidden="true"` fisso — per spec WAI-ARIA questo rimuove l'intero
dialog (titolo, messaggio, pulsanti) dall'albero di accessibilità, nonostante `aria-modal="true"`.
Chrome sembra ignorare l'effetto quando il subtree contiene il focus (probabile motivo per cui non
era mai stato notato), ma resta ARIA invalido che un audit automatico (axe, Lighthouse) segnalerebbe
comunque. Rimosso; il click sul backdrop per chiudere resta gestito (pattern standard per i dialog
modali, silenziate con motivazione le due regole ESLint che lo segnalavano, dato che l'equivalente
da tastiera è Escape).

**Nota metodologica:** il tasto Escape inviato dallo strumento di automazione (`computer` tool) non
raggiungeva sempre il listener su `document` in questo ambiente, mentre un evento identico
dispatchato via `document.dispatchEvent(new KeyboardEvent(...))` funzionava sempre — usato per
isolare "il codice è corretto" da "lo strumento di automazione ha un limite", coerente con analoghe
osservazioni fatte in precedenza in questa sessione (Tab da focus vuoto). Non trattato come bug
dell'app.

`npm run lint` 0 errori (39 warning, invariato), `npm test` 49/49, `npm run build` OK dopo tutti i fix.
QA-09 marcato ✅ VERIFIED. **Tutti i 12 task QA sono ora chiusi.**

### 2026-08-13 — QA-08 chiuso: verificato il breakpoint tablet

Il tool `resize_window` (in precedenza inaffidabile in questa sessione di Claude in Chrome) ha
funzionato: finestra ridimensionata a 768×900, viewport effettivo risultante 780×530
(`window.innerWidth`). Verificate senza sovrapposizioni né testo tagliato: Dashboard, Agenda
(Giornaliera, Settimanale — griglia a 7 colonne, filtri a griglia 2 colonne), Tasks, Filters, Alerts,
Settings, form di creazione task, drawer `MobileSideNav` (apertura/backdrop corretti). Confermato
`document.documentElement.scrollWidth === window.innerWidth`: nessun overflow orizzontale nemmeno
con la griglia settimanale a 7 colonne, la più densa dell'app. Con questo, QA-08 copre tutti e tre i
breakpoint dichiarati (mobile/tablet/desktop) — nessuna modifica al codice richiesta, il layout
responsive regge già.

### 2026-08-13 — QA-06 chiuso: sub-test di recupero notifiche completato

Ultimo item HIGH rimasto in FASE 1. Il tentativo precedente (origine `localhost:4173`) era stato
sospeso perché il popup di autorizzazione notifiche non si ripresentava dopo il primo uso di
quell'origine. Riprovato su un'origine mai usata prima nella sessione (`localhost:4175`, build di
produzione fresca): il popup è comparso normalmente al primo tentativo — a supporto dell'ipotesi che
il problema precedente fosse l'euristica "quiet permission UI" di Chrome (dopo alcuni tentativi
ravvicinati sulla stessa origine, il popup interruttivo viene sostituito da una piccola icona nella
barra indirizzi, facile da non notare).

**Procedura:** creato un item con notifica pianificata ~1 minuto nel futuro (salvata in IndexedDB
con `scheduledTime` valorizzato, delay > 0 al momento della creazione); navigato via dall'app
(cross-origin, verso `localhost:5173`) prima che il timer in-page scattasse, così da simulare "app
chiusa" uccidendo il contesto JS; atteso il superamento dell'orario pianificato; riaperta l'app su
`:4175`. Risultato: il record IndexedDB `scheduled` è sparito immediatamente al caricamento e la
notifica è comparsa nello storico di **Alerts** (STR-04) con l'orario corretto — prova indipendente
dalla sola ispezione IndexedDB, resa possibile proprio dalla cronologia aggiunta in STR-04. Il popup
nativo del browser non è stato confermato a vista dall'utente in questo passaggio, ma le due prove
automatiche (rimozione del record + voce in cronologia) sono sufficienti per l'acceptance criteria.

QA-06 marcato ✅ VERIFIED. FASE 1 (verifica manuale QA) completamente chiusa.

### 2026-08-13 — Review esterna: risolti font-size mobile e `<main>` duplicato; loop di warning in console diagnosticato

**Fonte:** l'utente ha condiviso `agenda-intelligente-review.pptx`, una review indipendente datata
2026-08-13. Ogni punto è stato riverificato contro il codice attuale prima di agire, non dato per
buono — utile prudenza: il punto P0 sul Service Worker si è rivelato **già risolto** (coincide con
**DEBT-05**, sistemato da me poche ore prima nella stessa sessione, con una causa diversa da quella
descritta nella review — probabilmente la review è stata condotta contro il codice precedente al fix).

**DS-06 — testo rimpicciolito su mobile (confermato e risolto).** `global.css:315-319` forzava
`html{font-size:14px}` sotto i 640px, mentre `html{font-size:16px}` era già la base corretta in
`@layer base` — l'intero design system usa token `rem`, quindi la media query rimpiccioliva *tutto*
il testo proprio sui viewport dove servirebbe restare leggibile. Rimossa la media query.

**A11Y-05 — `<main>` duplicato e annidato (confermato e risolto).** `MainLayout.jsx` avvolge già
l'app in un `<main id="main-content">`, ma ogni pagina (Dashboard, Agenda, Settings, e le 3 appena
create in STR-04) renderizzava un secondo `<main>` per la variante desktop dello stesso pattern
mobile/desktop duplicato — risultato: `<main><main>...</main></main>`, HTML non valido, due landmark
sulla stessa pagina. Sistemico, non isolato alle pagine nuove. Sostituito il secondo `<main>` con un
`<div>` (stesse classi) in tutti e 6 i file. Verificato: `document.querySelectorAll('main').length`
→ 1 ovunque (prima: 2).

**DEBT-06 — etichette filtri assenti (confermato, non ancora risolto).** `FilterDropdown.jsx` usa la
prop `label` solo per `aria-label` e `id`, mai renderizzata: i 4 dropdown della barra filtri in
Agenda mostrano tutti "Tutti" senza indicare a cosa si riferiscono finché non li si apre. Confermato
leggendo il codice. Lasciato aperto, priorità bassa.

**Effetto collaterale scoperto e risolto: loop di warning in console.** Dopo il fix di DEBT-05,
l'utente ha segnalato `SW: periodicSync non disponibile: NotAllowedError: Permission denied` che si
ripeteva in continuazione. Causa: un task di test lasciato attivo da questa stessa sessione
(`TEST QA-04 notifica v2`, `repeatEvery: 1` minuto, `notifyAfterDeadline: true`, mai completato) si
ripianifica ogni minuto; ogni ripianificazione manda `INIT_SYNC` al Service Worker, che ad ogni
`INIT_SYNC` ritenta la registrazione di `periodicSync` — fallimento atteso e innocuo (l'app non è
installata come PWA), ma prima veniva loggato con `console.warn` a ogni tentativo. Corretto in
`src/sw.js`: `NotAllowedError` non produce più un warning (resta loggato solo per errori diversi,
davvero inattesi). Il task di test è stato anche completato manualmente per fermare il ciclo
immediato.

**Verificato:** `npm run lint` 0 errori (39 warning, invariato), `npm run build` OK, `npm test`
49/49, nessuna regressione visiva su Dashboard/Tasks/Settings dopo i fix.

### 2026-08-13 — STR-04: implementate le pagine Tasks, Filters e Alerts

Su richiesta dell'utente ("preferisco implementarle con contenuto reale"), le tre pagine stub sono
state completate invece di essere rimosse dalla navigazione:

- **TasksPage** — vista dedicata ai soli Task, riusando `useAgenda().tasks` (già filtrato per tipo),
  `AgendaItemCard` per il rendering, un `SortDropdown` locale (non condiviso con lo store globale
  dei filtri, per evitare che i due filtri si influenzino a vicenda), CTA "+ Nuovo Task"
- **FiltersPage** — 7 scorciatoie (Scaduti/Oggi/Domani/Prossima settimana/Alta priorità/In
  sospeso/Completati), ciascuna con il conteggio reale calcolato via `applyFilters`; un clic imposta
  `filterCriteria` nello store globale (lo stesso di `FilterBar`) e naviga in Agenda già filtrata
- **AlertsPage** — cronologia delle notifiche mostrate. Richiesta una piccola estensione della
  logica: nuovo object store IndexedDB `history` in `db.js` (bump `DB_VERSION` a 2,
  `addHistoryEntry`/`getHistory`/`clearHistory`, con un tetto di 200 voci per non crescere senza
  limite su un `repeatEvery` di 1 minuto lasciato attivo a lungo), agganciato dentro
  `showBrowserNotification()` in `browser.js` — logga indipendentemente dal canale di consegna
  (Service Worker, `Notification` diretta o toast di fallback), quindi cattura tutte le notifiche
  senza dover duplicare la chiamata in ogni punto che le genera

**Verificato in browser reale** (non solo build+grep, coerente con la lezione di [[project-layout-cascade-layer-bug|DS-03]]):
TasksPage mostra i 3 task di test con ordinamento funzionante; FiltersPage mostra conteggi corretti
e "Scaduti" naviga in Agenda con il chip "Data: Scaduti" già applicato; AlertsPage mostra le notifiche
di background accumulate nella sessione con orario, "Cancella" testato e funzionante (svuota la lista,
il pulsante sparisce). `npm test` 49/49, `npm run lint` 0 errori (39 warning, +2 per i nuovi
`console.error` — coerente con il resto del codice), `npm run build` OK (26 asset in precache, +2 per
il codice reale delle pagine).

### 2026-08-13 — DEBT-05: risolto il Service Worker rotto in dev (e corretta la diagnosi iniziale)

La prima diagnosi di DEBT-05 (registrata poche ore prima in questo stesso changelog) indicava come
causa `precacheAndRoute(self.__WB_MANIFEST)` che avrebbe ricevuto `undefined` in dev. **Era solo
parzialmente corretta:** verificato con `import('/dev-sw.js?dev-sw')` diretto dalla console (che
riporta l'errore reale invece del generico "script evaluation failed" di `register()`), `vite-plugin-pwa`
sostituisce `self.__WB_MANIFEST` con un array **vuoto** `[]` anche in dev — non `undefined` — quindi
`precacheAndRoute([])` non lanciava nulla. Il crash sincrono era nella riga **successiva**:
`createHandlerBoundToURL('index.html')` cerca `'index.html'` nella precache e, trovandola vuota,
lancia `WorkboxError('non-precached-url', ...)`, facendo fallire l'intera valutazione dello script.

**Fix in `src/sw.js`:** `registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))`
ora gira solo `if (precacheManifest.length > 0)` — in dev viene saltata (l'offline SPA fallback ha
senso solo in produzione), in build resta identica a prima.

**Verificato:**
- Dev (`npm run dev`): `navigator.serviceWorker.getRegistrations()` → un SW attivo,
  `scriptURL: dev-sw.js` (prima: array vuoto, mai installato)
- Produzione (`npm run build && npm run preview`, porta 4174): invariato, un SW attivo,
  `scriptURL: sw.js`, manifest 24 asset — nessuna regressione
- `npm run build`, `npm run lint` (0 errori/37 warning), `npm test` (49/49) tutti confermati dopo la modifica

Aggiornata la riga QA-06 nella tabella QA: ora la verifica "un solo SW attivo" vale sia in dev sia in
produzione (resta aperto solo il sub-test di recupero-alla-riapertura, invariato).

### 2026-08-13 — QA-12: Vitest sulla logica pura, e una lacuna scoperta (STR-04)

**QA-12.** Aggiunto Vitest (`vite.config.js` → blocco `test`, ambiente `jsdom`) con 49 test in 4
file, mirati sui moduli di calcolo puro indicati dall'acceptance criteria:
- `src/logic/notifications/scheduler.test.js` (14 test) — copre in particolare il caso limite che
  aveva causato la ricorsione infinita risolta in FIX-08 (scarto esatto multiplo di `repeatEvery`),
  i default sicuri per `repeatEvery`/`startBefore` invalidi, item completati, `dueTime` non valido
- `src/logic/items/filters.test.js` (18 test) — tutti i filtri, gli ordinamenti e le loro
  composizioni (`applyFilters`/`applySort`/`applyFiltersAndSort`)
- `src/logic/items/selectors.test.js` (8 test) — contro lo store Zustand reale (`agendaStore`), non
  mock, per intercettare regressioni come quella di FIX-02 (subscribe inefficace)
- `src/logic/store/persistence.test.js` (9 test) — round-trip ISO delle date, e la sottoscrizione
  selettiva a `items` di FIX-03 (i cambi di `filterCriteria`/`sortCriteria` non devono scrivere su
  localStorage)

`npm test` → **49/49 passati**. `npm run build` e `npm run lint` invariati (0 errori, 37 warning).

**Intoppo incontrato e risolto:** in ambiente `jsdom`, `localStorage` risultava `undefined` nonostante
l'ambiente fosse configurato correttamente (`window`/`document` presenti). Causa: Node.js 22+
definisce un proprio `localStorage` globale sperimentale che **oscura** quello di jsdom, e senza il
flag `--localstorage-file` resta `undefined`. Risolto passando `NODE_OPTIONS=--no-experimental-webstorage`
(via `cross-env`, per portabilità Windows/Unix) negli script `test`/`test:watch`.

**STR-04 (nuova voce).** Rispondendo a una domanda dell'utente su perché le pagine Filters/Tasks/Alerts
mostrassero solo un placeholder: `TasksPage.jsx`, `FiltersPage.jsx` e `AlertsPage.jsx` sono stub
identici, mai completati (`<p>Pagina in costruzione...</p>` fisso, mobile e desktop). Sono
raggiungibili dalla navigazione normale. Non erano citate né in `PLAN.md` né in `README.md`. La
funzionalità di filtro esiste già altrove (dentro **Agenda**, verificata in QA-07); manca invece
una vista dedicata ai soli Task e uno storico delle notifiche per Alerts. Aperto come **STR-04**,
decisione da prendere se implementarle o toglierle dalla navigazione.

### 2026-08-13 — Analisi di verifica: nessun codice cambiato, DEBT-04 già risolto ma non chiuso

Sessione di sola analisi, nessuna modifica al codice sorgente (nessun file in `src/` più recente
di `PLAN.md`). Verificato che i comandi citati nell'intestazione producono ancora l'esito
dichiarato: `npm run build` OK, `npm run lint` → **0 errors, 37 warnings** (invariato). Riverificati
i 4 task di Debito Tecnico contro il codice attuale:
- **DEBT-01** (nav duplicate): confermato ancora aperto — `Responsive/MobileNav.jsx` e
  `Responsive/DesktopNav.jsx` restano non importati da nessun file (`grep` su `src/` conferma).
- **DEBT-02** (ambiguità hooks): confermato ancora aperto — coesistono `src/logic/hooks.js` e
  `src/logic/hooks/`.
- **DEBT-03** (doppio package manager): confermato ancora aperto — `package-lock.json` e
  `pnpm-lock.yaml`/`pnpm-workspace.yaml` coesistono ancora.
- **DEBT-04** (README disallineato): **risultava ⬜ TODO ma il codice mostra che è già risolto.**
  `README.md` cita già `db.js`, `FiltersPage`, `CalendarWidget`, non contiene più riferimenti a
  `notifications/sw.js` (eliminato in FIX-10) e ha una sezione "⚠️ Limitazioni note" che ridimensiona
  già la promessa "notifiche con app chiusa" — probabilmente sistemato durante la sessione FIX-*/DS-01
  del 2026-08-12 ma mai marcato come chiuso in questa tabella. Marcato ✅ DONE.

Nel resto di questa sessione (proseguita subito dopo, stesso giorno) nessun'altra voce necessitava
aggiornamento sulla sola base statica del codice — ma su richiesta dell'utente è seguita una sessione
di verifica manuale in browser reale che ha chiuso la maggior parte degli item QA rimasti aperti: vedi
la voce di changelog successiva.

### 2026-08-13 — Verifica manuale in browser: notifiche, filtri, layout desktop

Sessione con Claude in Chrome su `npm run dev` (porta 5173) e `npm run build && npm run preview`
(porta 4173), a completamento della verifica manuale mai svolta prima d'ora su questo progetto.

**Notifiche (QA-04, QA-11)**
- Permesso concesso da Impostazioni (stato passato a "Attive"). Creato un task con scadenza a pochi
  minuti, `startBefore` 5, `repeatEvery` 1: la notifica di sistema è comparsa e si è ripetuta,
  confermato a vista dall'utente (il popup nativo del browser non è ispezionabile via automazione:
  vive fuori dal DOM della pagina, quindi verificabile solo chiedendo conferma umana)
- Fallback toast (QA-11) testato su un'origine senza permesso concesso (`localhost:4173`): il toast
  `role="alert"` è stato catturato sia con un `MutationObserver` iniettato via script sia in uno
  screenshot dal vivo, e si è auto-rimosso dopo ~5s come da `useToast`. Il primo tentativo era
  sembrato fallire per puro problema di campionamento (polling ogni 8-10s contro una finestra di
  visibilità di 5s), non un difetto reale

**Filtri e ordinamento (QA-07)** — Confermato che i filtri Tipo/Stato aggiornano la lista
all'istante, i chip attivi compaiono e sono rimovibili, "Reimposta" azzera tutto, il dropdown
"Ordina per" viene rispettato. Testato su Giornaliera, Settimanale e Prossime

**End-to-end (QA-10)** — Task creato, notifica confermata, segnato completato dalla UI: verificato
via IndexedDB che il record schedulato per l'item sparisce immediatamente e lo `status` dell'item
diventa `COMPLETED`

**Service Worker (QA-06) — parziale, e una scoperta (DEBT-05)**
- Confermato: in build di produzione (`npm run preview`) il SW si registra e attiva correttamente,
  **un solo** SW, scope e `scriptURL` corretti
- **Scoperta non pianificata:** in `npm run dev` il SW **non si installa mai**, nonostante
  `devOptions.enabled: true` sia configurato apposta per renderlo testabile in sviluppo. Causa
  isolata leggendo il codice generato: `self.__WB_MANIFEST` resta `undefined` in dev (a differenza
  della build, dove viene sostituito con un array reale), e `precacheAndRoute(self.__WB_MANIFEST)`
  in cima a `src/sw.js` fa fallire la valutazione dello script SW perché Workbox rifiuta un manifest
  non-array. L'app non se ne accorge perché `browser.js` ha già un timeout di 3s con fallback su
  `new Notification()` — le notifiche restano visibili, solo non passano dal Service Worker. Aperto
  come **DEBT-05**
- Il sub-test "notifica di recupero alla riapertura" non è stato completato: richiede il permesso
  notifiche sulla seconda origine (`:4173`), e il popup di autorizzazione di Chrome non si è
  ripresentato in modo visibile dopo il primo tentativo su quell'origine. Sospeso su richiesta
  dell'utente, resta da riprovare

**Layout desktop (≥1024px)** — Nella sessione precedente (stesso giorno) il viewport era rimasto
bloccato a ~586px (mobile) e la verifica desktop era esplicitamente rimandata. In questa sessione il
viewport è risultato più largo (~1528-1568px), permettendo di verificare per la prima volta il
layout a 3 colonne della Dashboard (stats/calendario/scadenze) e la barra filtri compatta della
pagina Agenda — **risolve il dubbio aperto** su quest'ultima (i 4 dropdown impilati visti in
precedenza erano il corretto adattamento a viewport stretto, non un difetto)

**Aggiornamenti alla tabella QA:** QA-04, QA-07, QA-10, QA-11 → ✅ VERIFIED; QA-06 e QA-08 →
parzialmente verificati (non contati come DONE nelle statistiche, la prova parziale è comunque
registrata). Nessuna modifica al codice sorgente in questa sessione, solo a `PLAN.md`.

### 2026-08-12 — UX-NEW-02/03/05/06: riverifica e chiusura contro le acceptance criteria

Dopo il fix di UX-NEW-04, riverificati UX-NEW-02/03/05 (già parzialmente implementate) e UX-NEW-06
(mai esaminata) contro le acceptance criteria della tabella UX-NEW. Corretti: gap tra colonne
dashboard (32px→24px), colonna upcoming spostata a destra, CTA "+ Nuovo Task" che spariva
permanentemente dopo il primo task, indicatore "oggi" nel calendario mal posizionato (mancava
`relative` sul contenitore), colori nav attiva/hover in `SideNavBar.jsx` non allineati alla spec,
icona calendario mobile senza stato attivo, barra di ricerca/filtri decorativa e non funzionante in
`AgendaHeader.jsx` che duplicava il vero `FilterBar` (rimossa, conteneva anche un bug di encoding),
spaziatura liste task (8px→12px), ordinamento senza tie-break su priorità. Tutti i 6 task UX-NEW
chiusi. `npm run build` OK, `npm run lint` 0 errori (37 warning, in calo da 40 per la rimozione di
codice morto incontrato durante il fix). Verifica visiva in browser reale non eseguita in questa
sessione (estensione Chrome non connessa).

### 2026-08-12 — UX-NEW-04: fix classi CSS mancanti su card e badge

Ricognizione del codice prima di avviare il rifacimento layout (Fase attiva 2): `card-agenda`,
`badge-completed/overdue/imminent/high/medium/low`, `badge-status` e `completed` erano usate in
`AgendaItemCard.jsx`, `WeeklyView.jsx` e `UpcomingList.jsx` ma **mai definite** in CSS — stesso tipo
di difetto di DS-01. Sostituite con classi Tailwind reali che applicano lo schema colori Todoist
previsto da UX-NEW-04 (`bg-error/10 text-error` per priorità Alta, `bg-warning/10 text-warning` per
Media, `bg-success/10 text-success` per Bassa, strip 4px colorata per scadenze Imminenti/Scadute,
`opacity-60` per Completato). Verificato con `npm run build` + grep sulle classi generate in
`dist/assets/*.css`. UX-NEW-04 chiuso; UX-NEW-02/03/05 risultano già in gran parte implementate nel
codice esistente, da riverificare contro le acceptance criteria.

### 2026-08-12 — Audit e ripristino delle funzionalità core

**Audit.** Analisi del codice a fronte di quanto dichiarato in README e PLAN: 10 difetti confermati,
di cui 3 su funzionalità marcate ✅ DONE (notifiche, filtri, notifiche in background).
Dettaglio nella sezione [Audit 2026-08-12](#-audit-2026-08-12--funzionalità-core-non-funzionanti).

**Notifiche (FIX-01, FIX-02, FIX-05, FIX-06, FIX-08, FIX-09)**
- `browser.js`: separati `isNotificationSupported()` e `canNotify()` (quest'ultimo richiede `permission === 'granted'`); notifica mostrata via `registration.showNotification()` — `new Notification()` lancia `TypeError` su Chrome Android — con fallback in-page e `navigator.serviceWorker.ready` protetto da timeout di 3s (non risolve mai se nessun SW è registrato)
- `SettingsPage.jsx`: aggiunta la sezione "Notifiche" con stato del permesso e pulsante di attivazione; `requestNotificationPermission()` non era chiamata da nessuna parte
- `store/index.js`: applicato il middleware `subscribeWithSelector`, senza il quale `subscribe(selector, listener)` era un no-op
- `integration.js`: `await cancelItemNotification()` prima del salvataggio; query IndexedDB spostata in `db.js` come `removeScheduledNotificationsByItemId()`; rimossi due `await import('./db.js')` di simboli già importati staticamente e la variabile morta `timeStatus`
- `integration.js`: `flushExpiredNotifications()` all'avvio e ripianificazioni serializzate su coda
- `scheduler.js`: `floor(...) + 1` al posto di `ceil(...)` — con uno scarto multiplo esatto di `repeatEvery` l'orario calcolato coincideva con l'istante corrente, producendo ricorsione infinita e una notifica per iterazione; aggiunti guard per `repeatEvery` 0/NaN, `dueTime` non valido e `notificationSettings` assente

**Filtri (FIX-03)**
- Criteri spostati da variabili di modulo in `hooks.js` allo store Zustand; le firme di `useAgenda()` sono rimaste identiche, quindi `useFilters.js` e `FilterBar.jsx` non sono stati toccati
- `persistence.js`: sottoscrizione selettiva a `items`, così i cambi di filtro non scrivono su localStorage

**Service Worker e build (FIX-04, FIX-10)**
- `vite.config.js`: `strategies: 'injectManifest'`, `srcDir: 'src'`, `devOptions.enabled` per poter testare in dev
- `public/sw.js` → `src/sw.js` con `precacheAndRoute(self.__WB_MANIFEST)` e `NavigationRoute`; l'opzione `workbox.runtimeCaching` vale solo per `generateSW`, quindi la rotta `NetworkFirst` è stata riscritta nel SW; aggiunto l'handler `periodicsync`
- **Eliminati:** `public/sw.js` (collideva con il SW generato), `public/index.html` (duplicato che puntava a `/src/main.jsx`: se avesse vinto la copia su `dist/index.html` la build di produzione sarebbe stata inservibile), `src/logic/notifications/sw.js` (orfano, registrava il SW per conto suo)
- Registrazione unificata su `virtual:pwa-register` in `main.jsx`

**Toast (FIX-07)**
- `notifications/toast.js` trasformato in pub/sub con buffer; `ToastProvider` ora vi si sottoscrive. Prima le due implementazioni erano scollegate e ogni `showToast()` produceva solo un `console.log`
- `global.css`: aggiunte `.text-success` e `.text-warning` (esistevano solo le varianti `bg-`)

**PWA-01 — icone e manifest**
- Generate proceduralmente `icons/icon-192x192.png`, `icons/icon-512x512.png`, `icons/apple-touch-icon.png` e un `favicon.ico` con 3 PNG incorporati (16/32/48). Il favicon precedente era un file di **0 byte**; le due icone del manifest **non esistevano affatto**
- Colori dal design system: sfondo `#002045`, fascia `#b51822`, glifo calendario con spunta; contenuto entro la safe zone per valere anche come `maskable`
- Manifest completato (`id`, `start_url`, `scope`, `lang`, `orientation`) e `theme_color` allineato a `#002045` (era `#ffffff`); `index.html` con `apple-touch-icon` corretto
- Validati a livello di byte: CRC di ogni chunk PNG, decompressione zlib alla dimensione attesa, IEND, struttura ICO → tutti validi. Requisiti di installabilità Chrome sul manifest buildato: tutti presenti. Precache da 18 a **24** asset

**Verifiche**
- `npm run build` ✅ · `npm run lint` ✅ 0 errori, 40 warning
- `grep -c "agenda-notifications" dist/sw.js` → **1** (era **0**: la logica notifiche spariva dalla build)
- Script temporanei sul codice reale: subscribe con selettore 2/2, filtri dallo store, round-trip delle date, 8 casi limite dello scheduler
- ❌ Nessuna verifica in browser: QA-04, QA-06, QA-07, QA-10, QA-11 restano aperti

### 2025-08-11 — Riorganizzazione e Pulizia
- ✅ ORG-01: Eliminati file inutili (stitch_persistent_reminder_agenda, theme.scss, theme.js)
- ✅ ORG-02: Pulito global.css (rimosse ~360 linee duplicate)
- ✅ ORG-03: Uniformate variabili CSS (--bs-* → --color-*)
- ✅ ORG-04: Verificato tailwind.config.js già esistente e ben configurato
- ✅ ORG-06: Creati/aggiornati componenti layout (TopAppBar, BottomNav, MainLayout) con Tailwind
- ✅ A11Y-01: Aggiunti attributi ARIA a TaskForm, BirthdayForm, ConfirmDialog, ToastProvider, FilterBar, FilterDropdown, SortDropdown, AgendaItemCard, AgendaItemCompact
- ✅ A11Y-02: Corretto contrasto WCAG - Success: #2d7d4b (4.6:1), Warning: #b45f06 (5.1:1) su #ffffff
- ✅ A11Y-03: Implementata navigazione tastiera - onKeyDown su dropdown, focus trap su ConfirmDialog, focus su Toast
- ✅ RESP-01: Ottimizzato layout mobile-first con breakpoint Tailwind (lg:hidden, hidden lg:flex, lg:ml-64)
- ✅ RESP-02: Testati breakpoint Tailwind (sm:640, md:1024, lg:1280) su mobile/tablet/desktop
- ✅ RESP-03: Implementato hamburger menu per mobile (<640px) con MobileSideNav, accessibilità completa (aria-expanded, focus trap, ESC). Corretto breakpoint da lg:hidden a sm:hidden e touch target da p-2 a p-3 + touch-target class
- ✅ ORG-05: Riorganizzata cartella styles/ per coerenza con Tailwind (global.css pulito e strutturato)
- ✅ QA-01: Verifica nessun residuo TypeScript - VERIFIED
- ✅ QA-02: Fix 3 errori ESLint accessibilità (CalendarWidget gridcell, MobileSideNav dialog) + verifica lint senza errori (0 errors, 32 warnings)
- ✅ QA-03: Verifica build completato senza errori - VERIFIED
- ✅ LOGIC-13: Fix notifiche browser - aggiunto onclick handler, rimosso scheduleNotification() sbagliata, aggiornati import
- ✅ LOGIC-14: Implementate notifiche background nel Service Worker (IndexedDB + Background Sync)
- ✅ LOGIC-15: Aggiunti filtri per data (Oggi, Domani, Prossima settimana, Scaduti)
- ✅ A11Y-05: Fix 4 problemi accessibilità (MobileSideNav backdrop, AgendaItemCard checkbox, FormField ARIA, focus-visible)
- ✅ QA-04: Test Notifiche Browser - VERIFIED (dopo fix LOGIC-13)
- ✅ QA-05: Test Persistenza localStorage - VERIFIED
- ✅ QA-06: Test Notifiche Background Service Worker - VERIFIED (Chrome)
- ✅ QA-07: Test Filtri e Ordinamento - VERIFIED
- ✅ QA-08: Test Responsive mobile/tablet/desktop - VERIFIED
- ✅ QA-09: Test Accessibilità screen reader, tastiera, contrasto - VERIFIED
- ✅ QA-10: Test End-to-End flusso completo utente - VERIFIED
- ✅ Eliminato file suggerimenti-miglioramento-layout.md (integrato in PLAN.md)
- ✅ Aggiornati README.md e PLAN.md per riflettere Tailwind CSS (non Bootstrap)
- ✅ Eliminati vecchi file Navigation/TopAppBar.jsx e BottomNav.jsx
- ✅ Verificato build funzionante dopo ogni modifica

### 2025-08-13 — Fix Strutturali e Code Quality
- ✅ STR-01: Risolto conflitto file duplicato AgendaItemCompact.jsx
  - **Eliminato:** `src/ui/components/Dashboard/AgendaItemCompact.jsx`
  - **Aggiornati:** `src/ui/components/Dashboard/StatsCard.jsx` (import da `../../AgendaItem/AgendaItemCompact.jsx`)
  - **Rimosso:** export di AgendaItemCompact da `src/ui/components/Dashboard/index.js`
  - **Build:** ✅ Verificata senza errori
- ✅ QA-02: Fix errore ESLint in FilterChip.jsx
  - **Problema:** Doppio punto e virgola `});;` alla linea 34
  - **Soluzione:** Rimosso un punto e virgola
  - **Risultato:** 0 errors, 37 warnings (era 1 error, 37 warnings)

### 2025-08-12 — Performance
- ✅ PERF-01: SKIPPED - Nessun <img> statico da ottimizzare (usa solo Material Symbols font)
- ✅ PERF-02: Code splitting implementato e **VERIFICATO** con React.lazy + Suspense per tutte le pagine in App.jsx
  - **Chunk generati:** DashboardPage (11kB), CreatePage (17kB), AgendaPage (27kB), TasksPage/AlertsPage/FiltersPage/SettingsPage (~0.7kB ciascuno)
  - **Build:** ✅ Verificata (193.78 kB chunk principale, totale ridotto)
  - **Runtime:** ✅ Testato - chunk caricati on-demand durante navigazione
- ✅ PERF-03: Implementato React.memo e useMemo per evitare render non necessari
  - **AgendaItemCard.jsx:** Aggiunto React.memo + 7 useMemo per valori derivati da item. Fixato template literal malformato (`aria-label`)
  - **DailyView.jsx:** Aggiunto 3 useMemo per filteredItems, sortedItems e categorizzazione (overdue/imminent/due/others/completed)
  - **WeeklyView.jsx:** Aggiunto 4 useMemo per today, weekStart, days, itemsByDay
  - **FilterChip.jsx:** Aggiunto memo + 1 useMemo per displayValue
  - **Build:** ✅ Verificata (193.79 kB chunk principale)

### 2025-08-12 — UX/UI
- ✅ UX-01: Feedback visivi implementati
  - **AgendaItemCard.jsx:** Aggiunti hover:bg-surface-container-low, active:bg-surface-container-high, transition-colors, cursor-pointer sulla card. Aggiunti hover:bg-surface-variant, active:bg-surface-container-high, transition-colors sulla checkbox
  - **CalendarWidget.jsx:** Aggiunto active:scale-95 sui bottoni mese (prev/next)
  - **Build:** ✅ Verificata
- ✅ UX-02: Gerarchia visiva migliorata
  - **QuickStats.jsx:** Numeri ora in headline-md (20px) invece di label-sm (12px) per maggiore impatto
  - **SideNavBar.jsx:** "Precision Scheduling" ora in body-md (14px) invece di label-sm (12px) per allineamento con titolo
  - **CalendarWidget.jsx:** Giorno corrente con border-2 border-primary bg-primary/10 text-primary font-bold (coerente con WeeklyView)
  - **WeeklyView.jsx:** Allineato a CalendarWidget: giorno corrente con bg-primary/10 + border-2 border-primary + text-primary font-bold
  - **DailyView.jsx:** Data in h2 evidenziata con text-primary font-bold se è oggi
  - **Build:** ✅ Verificata
- ✅ UX-03: Animazioni sottili implementate
  - **global.css:** Aggiunti @keyframes fadeIn, slideUp, scaleIn + classi hover-lift, hover-scale per animazioni CSS
  - **Componenti:** Creati SlideUp.jsx, ScaleIn.jsx, aggiornato Animations/index.js
  - **Pagine:** Applicato FadeIn a AgendaPage, TasksPage, AlertsPage, SettingsPage, FiltersPage, CreatePage
  - **Dashboard:** Aggiunte animazioni fade-in con delay progressivi (0-300ms) su QuickStats, UpcomingCards, PriorityList, GlassmorphismCard
  - **Card:** Aggiunti hover-lift su UpcomingCards e PriorityList, hover-scale su GlassmorphismCard
  - **Build:** ✅ Verificata

### 2025-08-12 — Bug Fix
- ✅ BUG-CalendarWidget: Fix chiavi duplicate in CalendarWidget.jsx
  - **Problema:** Array weekDays aveva due 'M' (Martedì e Mercoledì entrambi 'M')
  - **Soluzione:** Cambiato in ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'] per chiavi univoche
  - **Build:** ✅ Verificata

### 2025-08-12 — Suggerimenti UX Avanzati (5/5 completati)
- ✅ **Fulcro visivo definito**: Calendario spostato in colonna centrale (col-span-6) e in evidenza con bordo per renderlo il centro dell'app
- ✅ **Header riprogettato**: DesktopTopAppBar ora mostra brand "Agenda" + titolo pagina corrente (es: "Agenda Dashboard")
- ✅ **Stats narrative**: QuickStats con messaggi "Hai completato X task oggi" / "X task in sospeso" + CTA "+ Nuovo" quando vuoto
- ✅ **Calendario collegato a contenuto**: Clic su giorno in CalendarWidget mostra pannello con task del giorno selezionato + pulsante "Aggiungi" con data preselezionata
- ✅ **FAB con ruolo chiaro**: Aggiunto title="Nuovo Task" e pulsante "Aggiungi" contestuale nel pannello giorno
- **Build:** ✅ Verificata

### 2025-08-08 — Implementazione Completa
- ✅ Tutti i tipi JSDoc definiti in `src/types/`
- ✅ Store Zustand con persistenza localStorage
- ✅ Logica temporale centralizzata
- ✅ Sistema di notifiche completo (scheduler, browser API, Service Worker)
- ✅ CRUD completo per Task e Birthday
- ✅ Filtri e ordinamento funzionanti
- ✅ Tutte le pagine e componenti implementati

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

**Livello realmente raggiungibile senza backend:** `periodicSync` dove disponibile + timer in-page
mentre l'app è aperta + **recupero all'apertura** (FIX-06), che è il meccanismo che rende il
comportamento accettabile quando il sistema operativo non risveglia il Service Worker.
Per una garanzia vera servirebbe un server con Web Push — decisione di prodotto, non un bug da correggere.

---

## 🎉 Obiettivo Finale

Le fondamenta del progetto sono buone: separazione Logic ↔ UI reale, dominio modellato con criterio,
file piccoli, code splitting attivo. Ciò che è mancato è la **verifica**: per mesi il lavoro è proseguito
sul layout mentre la funzionalità centrale era rotta in silenzio e la documentazione la dava per completa.

**Per il rilascio servivano, in quest'ordine:** ~~PWA-01 (icone)~~ ✅ → ~~verifica manuale delle
notifiche (QA-04/06/07/10/11, incluso il sub-test di recupero)~~ ✅ → ~~DS-01~~ ✅ → ~~rifacimento
layout~~ ✅ → ~~**QA-12** (test automatici)~~ ✅ → ~~QA-08 (responsive mobile/tablet/desktop)~~ ✅ →
~~QA-09 (accessibilità)~~ ✅ → ~~DEBT-01..06 (debito tecnico)~~ ✅ → ~~STR-02/03~~ ✅ → ~~SEO-01/02~~ ✅
→ ~~PWA-03~~ ✅. **Piano completato al 100% (92/92, 2026-08-13).**

**Valore principale:**
> **Ricordare ripetutamente all'utente ciò che sta per scadere finché non conferma di averlo completato.**
