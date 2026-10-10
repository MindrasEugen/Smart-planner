# PLAN — Agenda Intelligente con Notifiche Persistenti

> **Stato:** ✅ core plan chiuso (92/92, 2026-08-13) · bug da uso reale tutti risolti · roadmap in
> corso. **Ultimo aggiornamento:** 2026-10-10
>
> **In corso adesso:** ROAD-09 (app nativa Android con Capacitor, notifiche locali) e ROAD-07
> (profili utente). Dettaglio in [Roadmap — Prossimi Sviluppi](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14).
>
> 🗄️ **Infrastruttura (2026-10-10)**: tabelle spostate dal progetto Supabase Smart-Planner (in pausa,
> poi **cancellato**) al progetto condiviso **todo-list-app** (`qamvkevkddfwyxhbftoy`) con prefisso
> `AAA4_agenda_` (tabelle nuove, dati di test non copiati). Tick del backend chiamato da
> **cron-job.org** ogni 5 minuti (header `Authorization: Bearer <SYNC_SECRET>`, verificato 200 OK).
> Dipendenze del server aggiornate (`npm audit`: 0 vulnerabilità).
>
> **Linguaggio:** JavaScript (con JSDoc) | **Framework:** React 18 + Tailwind CSS v4 + Vite + PWA + Capacitor 8 (Android)
> **Build:** ✅ OK | **Lint:** ✅ 0 errori | **Test automatici:** ✅ Vitest, 54/54 (`pnpm test`)
> **Design Reference:** Google Stitch - Cognitive Protocol

## 🗂️ Indice

Questo file contiene solo ciò che è **attivo**: stato, roadmap aperta, regole per gli agenti, note.
Lo storico dei lavori chiusi è in `docs/plan/`, un file per argomento.

| File | Contenuto | Stato |
|------|-----------|-------|
| **[`PLAN.md`](PLAN.md)** (questo) | [Stato Attuale](#-stato-attuale) · [Roadmap](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14) · [Istruzioni per gli Agenti](#-istruzioni-per-gli-agenti) · [Note Importanti](#️-note-importanti) · [Limiti notifiche ad app chiusa](#-limiti-reali-delle-notifiche-con-app-chiusa) | 🟡 Attivo |
| [`docs/plan/uso-reale-2026-08.md`](docs/plan/uso-reale-2026-08.md) | [Bug reali BUG-01..07](docs/plan/uso-reale-2026-08.md#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18) (incluso il backend Web Push, testato su Samsung Galaxy S21) e [Fix UX della sessione 2026-08-27](docs/plan/uso-reale-2026-08.md#-fix-ux-da-uso-reale--sessione-2026-08-27) (Quick Add AI, dashboard cliccabile, avatar) | ✅ Chiuso |
| [`docs/plan/debito-tecnico.md`](docs/plan/debito-tecnico.md) | Bug di layout/CSS più insidiosi (DS-*, DEBT-*): utile per non reintrodurli | ✅ Chiuso |
| [`docs/plan/storico-core-2026-08.md`](docs/plan/storico-core-2026-08.md) | Audit 2026-08-12, fix funzionali, task core, rifacimento layout, accessibilità, responsività, PWA, testing, design system | ✅ Chiuso |

> Per la cronologia di un bug specifico, cercare il suo ID (es. `BUG-03`, `DS-10`, `A11Y-06`) in
> tutta la cartella: `grep -rn "BUG-03" PLAN.md docs/plan/`.

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
[Debito Tecnico](docs/plan/debito-tecnico.md#-debito-tecnico-aperto)). **Il core plan è chiuso al 100% (92/92, 2026-08-13).**

Dal 2026-10-10 esiste anche come **app nativa Android** (Capacitor), con notifiche locali che non
dipendono da browser né server (ROAD-09).

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
| **ROADMAP (ROAD)** | **9** | **5** | **56%** | Nuova fase aggiunta 2026-08-14 (handoff brainstorming), **non conteggiata nel TOTALE sopra** — il core plan resta chiuso al 100%. ROAD-01 (deploy), ROAD-02 (sezione Prossimamente) e ROAD-03 (form feedback) chiusi — Priorità 1 completa. ROAD-06 (Quick Add AI) e ROAD-08 (documentazione) chiusi; ROAD-07 (profili) e ROAD-09 (app Android) in corso. Vedi sezione [🗺️ Roadmap](#️-roadmap--prossimi-sviluppi-handoff-2026-08-14) |
| **BUG (uso reale, 2026-08-15 → 08-25)** | **7** | **7** | **100%** | Handoff da uso reale (segnalati 2026-08-14), **non conteggiato nel TOTALE sopra**. BUG-01 (notifiche mobile): backend Web Push deployato su Render, testato e confermato funzionante su device reale (Samsung Galaxy S21) il 2026-08-25, incluso a schermo spento. Vedi sezione [🐛 Bug reali trovati in uso reale](docs/plan/uso-reale-2026-08.md#-bug-reali-trovati-in-uso-reale--sessioni-2026-08-15--2026-08-18) |

> I task UX-01/02/03 (❌ CANCELLED) sono esclusi dal totale.

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
| **ROAD-07** | **Sistema di profili utente reale (auth Supabase + RLS)** | LOGIC ENGINE + UI ENGINE | - | 🟡 IN_PROGRESS | LOW | **2026-08-26**: fix di sicurezza critico applicato — RLS abilitata "a secco" su `items`/`subscriptions`/`sent_notifications` (migrazione `enable_rls_lockdown_public_tables`, verificato via Security Advisor: solo notice INFO residue, nessun errore). Scaffolding auth completo, non ancora attivo end-to-end: `src/logic/auth/` (client Supabase, `signUp`/`signIn`/`signOut`, `useAuthSession`), `src/ui/components/Auth/` (`LoginForm`, `RegisterForm`, `ProtectedRoute`), `src/ui/pages/LoginPage.jsx` + `RegisterPage.jsx` montati su `/login`+`/register` in `App.jsx` (raggiungibili, ma inerti: senza `.env` locale `signIn`/`signUp` restituiscono sempre "Supabase Auth non configurato"). Migrazione SQL vera pronta in `supabase/drafts/add_user_ownership_and_rls.sql` (colonna `user_id`, policy `auth.uid()`, dati di test esistenti da cancellare — decisione presa, non ancora eseguita). Manca ancora: `.env` locale con credenziali Supabase, `ProtectedRoute` applicata alle route esistenti, esecuzione della migrazione vera, verifica con due utenti reali. **Target: entro fine settembre 2026** (annunciato in Settings → Prossimamente, date volutamente vaghe per scelta dell'utente) — **superato, nessuna nuova data**. **Aggiornamento 2026-10-10**: le tabelle ora sono `AAA4_agenda_items`/`AAA4_agenda_subscriptions`/`AAA4_agenda_sent_notifications`/`AAA4_agenda_quick_add_usage` nel progetto condiviso **todo-list-app** (RLS attiva senza policy, come prima); la bozza SQL è già aggiornata ai nuovi nomi. Attenzione: lì `auth.users` è condiviso con le altre app (AAA2_/AAA3_) |

**ROAD-07 — passi ancora da fare, non coperti sopra** (da `piano-fix-rls-e-autenticazione.md`, integrato qui e poi rimosso):
- Attivare il provider **Email** in Supabase Auth (dashboard progetto `qamvkevkddfwyxhbftoy` "todo-list-app", condiviso con altre app: attenzione, gli utenti Auth sono condivisi con le app AAA2_/AAA3_) — decidere se richiedere conferma email o no. Non ancora fatto.
- **Decisione prodotto aperta**: cosa succede a un utente non loggato quando l'auth sarà attiva — redirect obbligato a `/login`, o l'app resta usabile in modalità limitata/anonima? Da decidere con l'utente prima di collegare `ProtectedRoute` alle route esistenti.
- Ogni `item`/`subscription` creato dal client dovrà includere `user_id: session.user.id`; le letture non dovranno più filtrare a mano lato client (RLS restituisce già solo le righe dell'utente loggato) — basta garantire che le richieste passino da un client Supabase autenticato, non con l'anon key nuda.
- **Checklist di verifica finale** prima di considerare ROAD-07 davvero DONE: login con due utenti diversi → ognuno vede solo i propri item/subscription; una chiamata con la sola anon key (nessuna sessione) → RLS blocca, nessuna riga restituita; Security Advisor ri-eseguito e pulito; invio notifiche push ancora funzionante dopo l'attivazione (tocca `subscriptions`/`sent_notifications`, ora protette da RLS).

### Priorità 4 — App nativa (avviata 2026-10-10)

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-09** | **App nativa Android (Capacitor 8)** | ORCHESTRATOR | - | 🟡 IN_PROGRESS | MEDIUM | **2026-10-10**: progetto Android creato (`android/`, appId `com.m.e.t.agenda`, firma M.E.T.), iOS rimandato (nessun Mac). Decisione: **notifiche locali** (`@capacitor/local-notifications`) invece di push FCM — più puntuali (allarmi esatti di sistema, nessuna dipendenza da Render/cron), funzionano offline; le push native torneranno utili solo con il cloud-sync di ROAD-07. `src/logic/notifications/native.js`: pianificazione anticipata di tutte le ripetizioni (orizzonte 14 giorni, max 60/item e 400 totali), canali Android per vibrazione/silenzioso, storico Avvisi ricostruito dalla pianificazione precedente. Nuova `calculateUpcomingNotificationTimes` in `scheduler.js` (+5 test). Settings: sezione notifiche nativa (permesso Android 13+, "Sveglie e promemoria", avviso risparmio batteria); niente SW/push/installazione PWA nell'app. Icone e splash generati dal design esistente (`npm run icons:android`). **Verificato su emulatore Pixel 6 (Android 13)**: permesso richiesto all'avvio, allarme esatto registrato dal sistema, notifica ricevuta ad app chiusa (processo terminato). **Completato lo stesso giorno**: `ALLOWED_ORIGIN` su Render = sito + `https://localhost` (origine della WebView, verificato via header CORS); `.env` locale con `VITE_SYNC_*` → Quick Add AI **verificata dall'app su emulatore** ("Chiamare il dentista domani alle 10" → task creato, 5 notifiche pianificate 08:00–10:00); importanza tradotta nel titolo notifica (`[Media] …` invece di `[MEDIUM] …`, anche sul web); APK di debug consegnato all'utente. Manca: test su telefono reale; build firmata (keystore di release) per il Play Store; eventuali Android App Links dal dominio del sito |

### Meta

| ID | Task | Owner | DependsOn | Stato | Priority | Acceptance |
|----|------|-------|-----------|-------|----------|------------|
| **ROAD-08** | **Aggiornare PLAN.md e README.md a fine implementazione** | ORCHESTRATOR | ROAD-01..07 | ✅ **DONE (2026-10-10)** | MEDIUM | **Fatto 2026-10-10**: PLAN diviso in hub attivo + archivio `docs/plan/` (nessuna riga persa, verificato contro l'originale); README ridotto a 55 righe orientate all'utente, dettagli tecnici spostati senza perdite in `docs/funzionalita.md`, `docs/sviluppo.md`, `docs/architettura.md`, `docs/design-system.md`; tutta la documentazione riallineata allo stato reale (app Android, database todo-list-app, cron-job.org); link interni verificati con script. Da ripetere quando si chiudono ROAD-07/ROAD-09. Testo originale: Dopo aver implementato le voci sopra (anche solo alcune): `README.md` — tabella feature + limiti noti aggiornati riflettendo cosa è stato effettivamente attivato; `PLAN.md` — stato di ogni `ROAD-*` aggiornato distinguendo chiaramente "fatto/attivo" da "creato ma non collegato" (Priorità 2/3, usare la nota `✅ DONE (non attivo)` accanto al task) da "da fare" |

**Ordine di lavoro:** Priorità 1 (ROAD-01/02/03) chiusa. Priorità 2 (ROAD-04/05) in attesa
dell'account Google AdSense. Priorità 3: ROAD-06 chiuso, ROAD-07 (profili utente) in sospeso —
vedi checklist sopra. **In corso adesso: ROAD-09** (test su telefono reale, poi build firmata per
il Play Store).

---

## 💬 Istruzioni per gli Agenti

Regole standing, valide per chiunque lavori su questo progetto:
- `src/logic/` non importa React; `src/ui/` non contiene logica di dominio.
- Nessun file in `public/` che collida con un artefatto di build (`sw.js`, `index.html`).
- Prima di usare una classe Tailwind custom, verificare che generi CSS: `grep "\.nome-classe" src/styles/global.css`.
- **Niente `git commit`/`git push`**: li fa l'utente. A fine lavoro elencare i file modificati.
- **Solo pnpm, mai npm/npx** (dal 2026-10-10): `pnpm install`, `pnpm <script>`, `pnpm dlx` al posto di `npx`. Root e `server/` hanno ciascuno il proprio `pnpm-lock.yaml`; `server/pnpm-workspace.yaml` lo tiene separato dalla radice.
- Modifiche a notifiche/UI mobile: verificarle anche sull'emulatore Android (Android Studio), non solo nel browser desktop.
- ✅ DONE/VERIFIED **solo** allegando la prova (comando e output, o il passo manuale svolto con browser reale e data). Un task non eseguito resta ⬜ TODO.

---

## 🚀 Come Avviare il Progetto

### Sviluppo
```bash
pnpm install
pnpm dev
# http://localhost:5173
```

### Produzione
```bash
pnpm build
pnpm preview
```

### Test
```bash
pnpm test          # esegue tutta la suite una volta
pnpm test:watch  # modalità watch
```

### App Android
```bash
pnpm android:sync   # build web + copia in android/ (richiede .env con le VITE_*)
pnpm android:open   # apre Android Studio → Run ▶
```

Dettagli (backend, variabili, prerequisiti): [`docs/sviluppo.md`](docs/sviluppo.md).

---

## 📝 Changelog

> Il changelog voce-per-voce (2026-08-08 → 2026-08-26) è stato rimosso il 2026-08-27 perché
> duplicava quasi verbatim il contenuto già nelle sezioni tematiche, oggi archiviate in
> `docs/plan/` (Debito Tecnico, Task Completati, Bug reali, Fix UX). Per la cronologia dettagliata di un bug specifico, cercare il suo
> ID (es. DS-10, BUG-03, A11Y-06) in `docs/plan/` — non qui.

---

## ⚠️ Note Importanti

1. **Framework CSS:** Il progetto usa **Tailwind CSS v4**, non Bootstrap 5
2. **`tailwind.config.js` non è attivo:** in v4 serve `@config` o un blocco `@theme` (DS-01). Prima di usare una classe custom, verificare che produca davvero CSS
3. **File eliminati:** `stitch_persistent_reminder_agenda/`, `theme.scss`, `theme.js`, `public/sw.js`, `public/index.html`, `src/logic/notifications/sw.js`
4. **Niente duplicati in `public/`:** i file lì dentro vengono copiati in `dist/` e possono sovrascrivere gli artefatti di build. È così che il Service Worker custom è sparito dalla produzione per mesi
5. **Un solo punto di registrazione del SW:** `virtual:pwa-register` in `main.jsx`. Non aggiungere `navigator.serviceWorker.register()` altrove. Nell'app nativa il SW **non** viene registrato (`isNativeApp`)
6. **Variabili CSS:** Preferire schema `--color-*` invece di `--bs-*`
7. **Struttura:** Mantenere separazione Logic ↔ UI. Il layer logic non importa React: per comunicare con la UI usa il pub/sub dei toast, non chiamate dirette
8. **JSDoc:** Tutti i contratti devono essere documentati
9. **App Android:** il codice web è uno solo; le differenze passano da `isNativeApp` (`src/logic/platform.js`). Dopo ogni modifica al codice web: `pnpm android:sync` e reinstallare l'app
10. **Database condiviso:** il progetto Supabase todo-list-app ospita anche altre app: le tabelle di questa hanno **sempre** il prefisso `AAA4_agenda_`, e `auth.users` è comune a tutte

---

## 📡 Limiti reali delle "notifiche con app chiusa"

> **Vale solo per la versione web (PWA).** Dal 2026-10-10 l'**app nativa Android** (ROAD-09) non ha
> questi limiti: le notifiche sono **locali**, pianificate dal telefono stesso con gli allarmi esatti
> di sistema (`@capacitor/local-notifications`), senza browser, server né connessione. Verificato su
> emulatore: notifica consegnata all'orario esatto con l'app e il suo processo terminati. Resta solo
> il risparmio energetico aggressivo di alcuni produttori (avviso già presente in Impostazioni).
> Quanto segue descrive perché, **sul web**, serve il backend Web Push.

Il web **non offre notifiche programmate garantite senza un backend push**. Va detto esplicitamente
perché README e PLAN hanno promesso più di quanto sia tecnicamente ottenibile:

- `sync` (Background Sync) è **one-shot** e scatta al ritorno della connettività: non è un timer. Ri-registrarlo dentro il proprio handler non produce un check periodico affidabile
- `periodicSync` esiste solo su Chromium, richiede la **PWA installata** (quindi PWA-01) e l'intervallo lo decide il browser, non l'app
- `setTimeout` in pagina funziona solo mentre l'app è aperta

**Livello raggiungibile senza backend:** `periodicSync` dove disponibile + timer in-page mentre
l'app è aperta + **recupero all'apertura** (FIX-06). **Per una garanzia vera serve un server con
Web Push — esiste da BUG-01 (2026-08-25, `server/`, VAPID)**: è il canale che consegna
puntualmente anche a telefono bloccato, con l'unico limite pratico noto nella sezione
"Limitazioni note" di [docs/funzionalita.md](docs/funzionalita.md#️-limitazioni-note) (restrizioni batteria Android).

---

## 🎉 Obiettivo Finale

> **Ricordare ripetutamente all'utente ciò che sta per scadere finché non conferma di averlo completato.**

Lezione della fase di audit (2026-08-12): per mesi il lavoro era proseguito sul layout mentre la
funzionalità centrale era rotta in silenzio, con la documentazione che la dava per completa senza
prova. Da qui la regola standing in [Istruzioni per gli Agenti](#-istruzioni-per-gli-agenti):
✅ solo con la prova allegata.
