# Piano: Autenticazione utenti + fix Row Level Security — Smart-Planner

Documento preparato per essere eseguito dall'agente Claude nel terminale di VS Code, aperto sulla cartella del progetto. Contiene sia il contesto (cosa c'è oggi nel database Supabase) sia i passi da seguire, in ordine, per aggiungere la registrazione/login reale e sistemare il problema di sicurezza segnalato dal Security Advisor di Supabase.

## Contesto — stato attuale del database

Progetto Supabase: **Smart-Planner** (ref `vhyqsdabneswjymlytbe`, regione eu-west-1)
URL progetto: `https://vhyqsdabneswjymlytbe.supabase.co`

Il Security Advisor segnala **RLS (Row Level Security) disabilitata** su 3 tabelle pubbliche, tutte raggiungibili dall'anon key senza alcuna restrizione:

| Tabella | Colonne attuali | Chiave primaria | Righe |
|---|---|---|---|
| `public.items` | `id, title, due_date, due_time, status, notification_settings, updated_at` | `id` | 1 |
| `public.subscriptions` | `endpoint, p256dh, auth, vibrate, silent, created_at` | `endpoint` | 4 |
| `public.sent_notifications` | `item_id, next_time, sent_at` | `item_id, next_time` | 1 |

**Il problema di fondo**: nessuna di queste tabelle ha una colonna che indichi a quale utente appartiene la riga. Anche abilitando RLS "a secco" non si potrebbero scrivere policy sensate, perché manca il concetto di proprietario. Per questo la soluzione corretta è far coincidere il lavoro di "aggiungere la registrazione" con il fix di sicurezza: sono la stessa attività.

I dati esistenti sono pochissimi (4 subscriptions, 1 item, 1 notifica inviata) — quasi certamente dati di test. Va deciso se migrarli assegnandoli a un utente reale o se è più semplice azzerarli e ripartire puliti dopo l'attivazione dell'auth.

## Obiettivo finale

1. Un utente può registrarsi e fare login con email/password (o altro provider, da concordare) tramite Supabase Auth.
2. Ogni `item`, `subscription` e `sent_notification` è collegata a un utente specifico.
3. RLS è abilitata su tutte e tre le tabelle, con policy che permettono a ciascun utente di leggere/scrivere solo le proprie righe.
4. L'app (frontend) gestisce sessione, login, logout, e passa sempre l'utente autenticato quando crea/legge dati.
5. Il Security Advisor di Supabase non segnala più errori su queste tabelle.

## Step da seguire

### 1. Esplorare il codebase

Prima di scrivere codice, l'agente deve capire come è strutturato il progetto attuale:
- Framework frontend usato (React, Next.js, Vue, vanilla JS, altro?)
- Dove viene inizializzato il client Supabase (cerca `createClient` da `@supabase/supabase-js`)
- Dove vengono creati/letti/aggiornati gli `items` (probabilmente un service o hook dedicato)
- Dove viene registrata la `subscription` alle notifiche push (probabilmente vicino al service worker / `pushManager.subscribe`)
- Se esiste già una qualche forma di sessione utente o è tutto anonimo

### 2. Abilitare Supabase Auth

- Nel dashboard Supabase (o via configurazione), attivare il provider **Email** (signup + login, con o senza conferma email — da decidere in base a quanto deve essere rigido il flusso).
- Se in futuro serve login social (Google, Apple, ecc.), può essere aggiunto dopo: non è bloccante per questo step.
- Verificare le impostazioni di redirect URL / site URL se l'app fa conferma email.

### 3. Migrazione dello schema (SQL)

Da rivedere ed eseguire come migrazione Supabase (`supabase migration new add_user_ownership` oppure direttamente da SQL editor). Bozza:

```sql
-- 1. Aggiungere la colonna user_id alle tabelle che rappresentano dati personali
alter table public.items
  add column user_id uuid references auth.users(id) on delete cascade;

alter table public.subscriptions
  add column user_id uuid references auth.users(id) on delete cascade;

-- sent_notifications eredita l'ownership da items tramite item_id,
-- quindi non serve necessariamente una colonna user_id propria:
-- la policy RLS può fare riferimento a items tramite una subquery/join.
-- Se in futuro sent_notifications deve esistere senza un item collegato,
-- valutare di aggiungere user_id anche qui.

-- 2. Decidere sui dati esistenti (pochi, probabilmente di test):
--    opzione A: cancellarli
-- delete from public.sent_notifications;
-- delete from public.items;
-- delete from public.subscriptions;
--    opzione B: assegnarli manualmente a un utente reale dopo la sua registrazione
-- update public.items set user_id = '<uuid-utente>' where user_id is null;

-- 3. Rendere user_id obbligatorio una volta migrati/puliti i dati
alter table public.items
  alter column user_id set not null;

alter table public.subscriptions
  alter column user_id set not null;

-- 4. Abilitare RLS
alter table public.items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.sent_notifications enable row level security;

-- 5. Policy: ogni utente vede/modifica solo le proprie righe
create policy "Users manage their own items"
  on public.items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own subscriptions"
  on public.subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own sent_notifications"
  on public.sent_notifications
  for all
  using (
    exists (
      select 1 from public.items
      where items.id = sent_notifications.item_id
      and items.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.items
      where items.id = sent_notifications.item_id
      and items.user_id = auth.uid()
    )
  );
```

Note importanti:
- Non eseguire alla cieca: rivedere insieme quale opzione scegliere per i dati esistenti (cancellare vs migrare).
- `sent_notifications` probabilmente viene scritta da un job/edge function lato server (per inviare le notifiche), non direttamente dal client con la sessione dell'utente. Se è così, quella scrittura andrà fatta con la **service role key** (che bypassa RLS), non con l'anon key — verificare come viene effettivamente inviata la notifica prima di finalizzare la policy.

### 4. Aggiornare il frontend

- Aggiungere schermate/flusso di **registrazione** e **login** (form email + password, gestione errori, eventuale conferma email).
- Gestire la **sessione**: mantenere l'utente loggato tra i refresh (Supabase Auth gestisce già il refresh token, va solo collegato all'app), mostrare stato loggato/non loggato, aggiungere logout.
- Ovunque venga creato un `item`, includere `user_id: session.user.id` nell'insert (oppure impostare un default a livello DB con `auth.uid()`, ma è più esplicito farlo lato client).
- Ovunque venga registrata una `subscription` push, collegarla allo `user_id` dell'utente loggato invece che solo all'endpoint del dispositivo.
- Le query di lettura non devono più filtrare manualmente per utente: con RLS attiva, Supabase restituirà automaticamente solo le righe dell'utente loggato. Va solo garantito che le richieste vengano fatte con un client autenticato (sessione valida), non con l'anon key "nuda".
- Decidere cosa succede se un utente non loggato apre l'app: redirect al login, o una modalità limitata? (da chiarire con l'utente/prodotto, non tecnico).

### 5. Verifica finale

- Provare a fare login con due utenti diversi e controllare che ciascuno veda solo i propri `items`/`subscriptions`.
- Provare una chiamata con la sola anon key (senza sessione) e verificare che non ritorni righe (RLS blocca correttamente).
- Ri-eseguire il Security Advisor di Supabase (o richiederlo a Claude) per confermare che l'errore RLS sia sparito.
- Controllare che l'invio delle notifiche push continui a funzionare (dato che tocca `subscriptions` e `sent_notifications`, tabelle ora protette da RLS).

## Riferimenti rapidi

- Project ref: `vhyqsdabneswjymlytbe`
- URL: `https://vhyqsdabneswjymlytbe.supabase.co`
- Anon/publishable key: già presente probabilmente nel `.env` del progetto — non serve rigenerarla per questo lavoro, va solo affiancata dal login reale.
- Documentazione RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Documentazione Auth: https://supabase.com/docs/guides/auth

---
*Documento generato da Claude (Cowork) il 26/08/2026, dopo aver ispezionato lo schema reale del progetto Smart-Planner via MCP Supabase. Da usare come traccia operativa per l'agente Claude nel terminale, che dovrà adattare i dettagli implementativi allo stack effettivo del progetto.*
