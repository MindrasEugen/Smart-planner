-- BOZZA — NON ESEGUIRE ANCORA.
-- 2026-10-10: tabelle spostate dal progetto Smart-Planner al progetto
-- "todo-list-app" (qamvkevkddfwyxhbftoy) con prefisso AAA4_agenda_. I dati di
-- test citati sotto NON sono stati copiati (tabelle nuove, vuote). Nota: in
-- quel progetto auth.users e' condiviso con altre app (AAA2_/AAA3_).
-- Preparata durante la sessione del 2026-08-26 in vista dell'aggiornamento
-- cloud-sync atteso per fine settembre 2026 (vedi sezione "Prossimamente"
-- in Settings). Da rivedere ed eseguire come vera migrazione Supabase
-- (`supabase migration new add_user_ownership`) solo dopo aver finalizzato
-- il flusso di registrazione/login lato frontend.
--
-- Il lockdown RLS "a secco" (RLS abilitata, nessuna policy) è già stato
-- applicato il 2026-08-26 per chiudere l'alert critico del Security Advisor:
-- vedi migrazione "enable_rls_lockdown_public_tables". Questo file sostituirà
-- quel lockdown con policy vere basate su auth.uid() una volta pronto l'auth.
--
-- DECISIONE PRESA sui dati esistenti (step 2 sotto): cancellarli (opzione A).
-- Sono 4 subscriptions, 1 item, 1 sent_notification — quasi certamente dati
-- di test/sviluppo, nessun utente reale li usa oggi (l'app non ha ancora
-- login). Da riconfermare con l'utente subito prima di eseguire la
-- migrazione vera, non alla cieca.

-- 1. Colonna user_id sulle tabelle che rappresentano dati personali
alter table public."AAA4_agenda_items"
  add column user_id uuid references auth.users(id) on delete cascade;

alter table public."AAA4_agenda_subscriptions"
  add column user_id uuid references auth.users(id) on delete cascade;

-- sent_notifications eredita l'ownership da items tramite item_id: la policy
-- fa una subquery/join su items invece di avere una colonna user_id propria.

-- 2. Dati esistenti: cancellati (opzione A, vedi nota in testa al file).
delete from public."AAA4_agenda_sent_notifications";
delete from public."AAA4_agenda_items";
delete from public."AAA4_agenda_subscriptions";

-- opzione B (scartata): assegnarli a un utente reale dopo la sua registrazione
-- update public."AAA4_agenda_items" set user_id = '<uuid-utente>' where user_id is null;
-- update public."AAA4_agenda_subscriptions" set user_id = '<uuid-utente>' where user_id is null;

-- 3. Rendere user_id obbligatorio una volta migrati/puliti i dati
alter table public."AAA4_agenda_items"
  alter column user_id set not null;

alter table public."AAA4_agenda_subscriptions"
  alter column user_id set not null;

-- 4. Policy: ogni utente vede/modifica solo le proprie righe.
-- NOTA: il backend Express (server/) si connette con DATABASE_URL usando il
-- ruolo "postgres", che ha rolbypassrls=true (verificato il 2026-08-26) e
-- quindi bypassa queste policy per design — restano vincolanti solo per le
-- richieste che passano da PostgREST/supabase-js con anon/authenticated.
create policy "Users manage their own items"
  on public."AAA4_agenda_items"
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own subscriptions"
  on public."AAA4_agenda_subscriptions"
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own sent_notifications"
  on public."AAA4_agenda_sent_notifications"
  for all
  using (
    exists (
      select 1 from public."AAA4_agenda_items"
      where "AAA4_agenda_items".id = "AAA4_agenda_sent_notifications".item_id
      and "AAA4_agenda_items".user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public."AAA4_agenda_items"
      where "AAA4_agenda_items".id = "AAA4_agenda_sent_notifications".item_id
      and "AAA4_agenda_items".user_id = auth.uid()
    )
  );
