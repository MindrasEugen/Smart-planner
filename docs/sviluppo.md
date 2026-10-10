# Sviluppo

> Setup locale, backend (Web Push, Quick Add AI), app Android, tecnologie, convenzioni e icone. Torna al [README](../README.md).

---

## 🚀 Setup Progetto

### Prerequisiti
- Node.js 22+ (richiesto da Capacitor 8; per la sola versione web basta Node 20+)
- pnpm 11 (`corepack enable` lo attiva; la versione esatta è fissata in `packageManager` nel `package.json`). **npm non va usato**: il progetto ha solo `pnpm-lock.yaml`
- Solo per l'app Android: Android Studio (con Android SDK) e JDK 21

### Installazione
```bash
pnpm install
pnpm dev
```

L'app sarà disponibile su **http://localhost:5173** (o la prima porta libera successiva).

Il **Service Worker è attivo anche in sviluppo** (`devOptions.enabled` in `vite.config.js`): serve per poter testare le notifiche senza fare una build.

### Build per Produzione
```bash
pnpm build
pnpm preview
```

### Lint
```bash
pnpm lint     # atteso: 0 errori (il limite è --max-warnings 100)
```

### Test
```bash
pnpm test          # esegue tutta la suite una volta (Vitest)
pnpm test:watch  # modalità watch
```

### Backend Web Push (opzionale, solo per sviluppare/testare le notifiche ad app chiusa)

Il frontend funziona anche senza: `isSyncConfigured()` nasconde la sezione "Notifiche push" in
Settings se `VITE_SYNC_API_URL`/`VITE_SYNC_SECRET` non sono impostate. Per lavorare sul backend
(cartella `server/`, Node/Express + Postgres):

```bash
cd server
cp .env.example .env   # compila TZ, SYNC_SECRET, VAPID_*, DATABASE_URL — vedi i commenti nel file
pnpm install
pnpm start               # ascolta su PORT (default 3000)
pnpm test                 # suite del server (tick, finestra di controllo)
```

In produzione gira come Web Service su Render (`server/`, root dir `server`) più un cron esterno
(**cron-job.org**) che chiama `GET /api/tick` ogni `TICK_WINDOW_MINUTES` (default 5) con l'header
`Authorization: Bearer <SYNC_SECRET>` — il Cron Job nativo di Render non è più gratuito. Il database
è il progetto Supabase condiviso **todo-list-app**, con tabelle prefissate `AAA4_agenda_`. Il frontend deployato ha bisogno delle stesse `VAPID_PUBLIC_KEY`/`SYNC_SECRET` del
server, esposte come `VITE_VAPID_PUBLIC_KEY`/`VITE_SYNC_SECRET` a build-time.

### Quick Add AI (opzionale, richiede una chiave Gemini)

Il frontend nasconde il campo "Quick add con AI" in creazione task se `VITE_SYNC_API_URL`/
`VITE_SYNC_SECRET` non sono configurate (stesso backend del Web Push, vedi sopra). Per attivarla
davvero serve anche una chiave Gemini lato server:

```bash
cd server
# nel .env già creato per il Web Push, aggiungere anche:
# GEMINI_API_KEY=<chiave da https://aistudio.google.com/apikey>
# GEMINI_MODEL=gemini-3.6-flash (default)
# QUICK_ADD_DAILY_LIMIT=5 (default, per dispositivo)
```

Senza `GEMINI_API_KEY`, `/api/quick-add` risponde sempre "AI non configurata" — il resto del server
(notifiche push) continua a funzionare normalmente.

### App Android (Capacitor)

L'app gira anche come app nativa Android (appId `com.m.e.t.agenda`), con lo stesso codice
React: Capacitor impacchetta la build di `dist/` in un progetto Android (`android/`).
iOS non è ancora configurato (serve un Mac con Xcode).

Differenze rispetto alla versione web, gestite automaticamente tramite `isNativeApp`
(`src/logic/platform.js`):
- **Notifiche locali** (`@capacitor/local-notifications`, `src/logic/notifications/native.js`)
  al posto di Service Worker e Web Push, che la WebView Android non supporta. Il telefono
  programma da solo gli avvisi (anche ad app chiusa e offline), entro 14 giorni e al
  massimo 400 avvisi: ogni apertura dell'app ripianifica ed estende l'orizzonte.
- Nessun Service Worker, banner di installazione o sezione "Notifiche push" in Impostazioni.

Prerequisiti: Android Studio (con Android SDK) e JDK 21. Poi:

```bash
cp .env.example .env              # compilare le variabili VITE_* (vedi commenti)
pnpm android:sync              # build web + copia in android/
pnpm android:open              # apre il progetto in Android Studio (Run ▶ su emulatore/telefono)
```

Dopo ogni modifica al codice web va rieseguito `pnpm android:sync`. Le icone Android si
rigenerano con `pnpm icons:android`. Per la Quick Add AI dall'app, `ALLOWED_ORIGIN` del
server deve includere `https://localhost` (l'origine della WebView Capacitor su Android).

### Cloud-sync / Autenticazione (in arrivo, bozza non ancora attiva)

L'app supporterà a breve **login/registrazione e sincronizzazione dati su più dispositivi** tramite
Supabase Auth (progetto condiviso todo-list-app: gli utenti Auth sono comuni alle altre app del progetto). Il codice esiste già come
bozza nelle cartelle `src/logic/auth/` e `src/ui/components/Auth/`, ma **non è ancora collegato
all'app**: oggi l'app funziona esattamente come prima, senza alcun login richiesto. `AAA4_agenda_items` e
`AAA4_agenda_subscriptions` sono già sincronizzati su Supabase (per il backend Web Push, vedi sopra), ma senza
alcun concetto di proprietario: sono dati anonimi/condivisi finché questa feature non collega ogni
riga a uno `user_id` reale (vedi `supabase/drafts/add_user_ownership_and_rls.sql`).

Per chi in futuro vorrà provare la feature una volta attivata: copiare `.env.example` in `.env` e
valorizzare `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` con le credenziali del progetto Supabase.

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
| **Tailwind CSS** | ^4.3.3 | Stili utility-first | Tema custom nel blocco `@theme` di `global.css` |
| **localStorage** | - | Persistenza dati | Semplice, sufficiente per un MVP monoutente |
| **IndexedDB** | - | Notifiche pianificate | Accessibile anche dal Service Worker |
| **Notifications API** | - | Notifiche browser | Standard web |
| **date-fns** | ^2.30.0 | Manipolazione date | Usata in `WeeklyView` e `CalendarWidget` |
| **uuid** | ^9.0.0 | ID univoci | `items/actions.js`, `Toast/useToast.js` |
| **@mindraseugen/utility-kit** | ^1.0.0 | Utility condivise | Solo `fadeIn` in `Animations/FadeIn.jsx` |
| **Google Gemini API** | gemini-3.6-flash | Estrazione AI per Quick Add | Chiamata REST diretta dal backend (`server/src/ai.js`), nessun SDK aggiunto |
| **Capacitor** | ^8.5.3 | App nativa Android | `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`; progetto in `android/`, config in `capacitor.config.json` |
| **@capacitor/local-notifications** | ^8.3.1 | Notifiche nell'app Android | Allarmi esatti di sistema, funzionano ad app chiusa e offline (`src/logic/notifications/native.js`) |
| **@supabase/supabase-js** | ^2.112.4 | Client Supabase Auth | Bozza non ancora collegata, vedi [Cloud-sync](#cloud-sync--autenticazione-in-arrivo-bozza-non-ancora-attiva) |

> `sass` è ancora fra le devDependencies ma non esiste più alcun file `.scss`: rimuovibile.

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
- **Un solo store** centrale (`logic/store/index.js`), che contiene `items`, `filterCriteria`, `sortCriteria` e `viewMode`
- **Selector** per i dati derivati; i componenti non ricalcolano ciò che i selettori già espongono
- Lo stato condiviso va nello store, **mai** in variabili a livello di modulo: non provocano re-render

### Cartelle
- `src/logic/` non importa React; `src/ui/` non contiene logica di dominio
- Nessun file in `public/` che possa collidere con un artefatto di build (`sw.js`, `index.html`)

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
pnpm icons          # rigenera tutte le icone in public/
pnpm build
pnpm icons:verify   # valida i file in dist/: CRC dei chunk PNG, zlib, IEND, struttura ICO
```

Per cambiare l'aspetto, modificare la palette o la geometria in `scripts/generate-icons.mjs`
(coordinate normalizzate 0..1). Sostituirle con file disegnati a mano è altrettanto lecito,
purché restino **opache** e con il glifo entro il **60% centrale**, altrimenti il ritaglio
`maskable` di Android lo taglia.
