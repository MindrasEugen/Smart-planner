# Storico — Bug e fix UX da uso reale (agosto 2026)

> Parte dell'archivio di [`PLAN.md`](../../PLAN.md). BUG-01..07 (incluso il backend Web Push di BUG-01) e i fix UX della sessione 2026-08-27.
> **Tutto chiuso**: archivio di riferimento.

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
