# Funzionalità

> Cosa fa l'app nel dettaglio, stato di ogni funzione, come si usa e limiti noti. Torna al [README](../README.md).

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
| **Dashboard** | Panoramica: scadenze imminenti, priorità Alta/Media/Bassa (ciascuna cliccabile → Agenda già filtrata sulla vista "Prossime"), prossimo compleanno (solo quando si avvicina, non tutto l'anno), calendario. I task completati spariscono da soli a fine giornata (restano sempre in Agenda) | ✅ Funzionante |
| **Quick Add AI** | Scrivi una frase libera, l'AI (Gemini) estrae titolo/data/ora/importanza. Se la frase specifica data e ora, il task si salva subito (con "Annulla"); altrimenti pre-compila il form per la revisione. Limite 5/giorno per dispositivo | ✅ Funzionante — richiede il backend configurato, vedi [Setup Progetto](sviluppo.md#-setup-progetto) |
| **Filtri** | Per tipo, stato, importanza, data (incluso "Imminenti") + 7 scorciatoie rapide (pagina Filtri) | ✅ Funzionante |
| **Notifiche (app aperta)** | Promemoria ripetuti e configurabili, con cronologia (pagina Alerts) | ✅ Funzionante |
| **App Android** | App nativa (Capacitor 8, appId `com.m.e.t.agenda`) con notifiche locali: arrivano ad app chiusa e offline, senza dipendere dal server | 🟡 Verificata su emulatore, da provare su telefono reale — vedi [App Android](sviluppo.md#app-android-capacitor) |
| **Notifiche (app chiusa)** | Web Push (VAPID) con backend su Render + Supabase | ✅ Funzionante, verificato su device reale — richiede un passo di setup lato utente, vedi [Limitazioni note](#️-limitazioni-note) |
| **PWA installabile** | Manifest + icone + banner "Installa App" su mobile, e pulsante equivalente sempre raggiungibile in Settings | ✅ Funzionante |
| **Preferenze** | Tema (chiaro/scuro/sistema), vibrazione e notifiche silenziose, in Settings | ✅ Funzionante, tema scuro esteso a tutta l'app (verificato su device reale) |
| **Immagine profilo** | Scelta avatar (12 segni zodiacali, illustrazioni proprie, stesso colore via CSS mask) al posto del placeholder generico, in Settings | ✅ Funzionante — salvata in localStorage, non sincronizzata tra dispositivi (nessun account/login nel progetto) |
| **Tailwind CSS** | Stili utility-first per UI responsive | ✅ Tema custom attivo (vedi sotto) |
| **Design System** | Tema personalizzato da Google Stitch | ✅ `@theme` in `global.css` — unica sorgente di verità |
| **SEO** | Meta tag Open Graph + structured data JSON-LD | ✅ Funzionante |
| **Test automatici** | Vitest, layer logic | ✅ 54/54 (`pnpm test`) |
| **Deploy** | Static Site su Render | ✅ Live — https://smart-planner-vjgl.onrender.com |
| **Sezione "Prossimamente"** | Anteprima roadmap nelle Settings, pilotata da un array | ✅ Funzionante |
| **Feedback** | Form categorizzato → issue GitHub precompilata, nessun backend | ✅ Funzionante |

---

## 🎯 Come Usare l'App

### Dashboard
Panoramica con stato rapido, scadenze imminenti, priorità Alta/Media/Bassa e prossimo compleanno —
ogni categoria è cliccabile e porta in Agenda già filtrata. I task completati spariscono da soli a
fine giornata.

### Agenda
Vista cronologica con header, filtri e elementi con strip colorati.

### Nuovo Elemento
Form per Task (con notifiche configurabili) o Compleanno (ricorrenza annuale), oppure Quick Add con
AI: scrivi una frase libera e lascia che sia l'AI a pre-compilare (o salvare subito) il task.

### Impostazioni
Attivazione del permesso notifiche e stato corrente dell'autorizzazione.

### Notifiche
- **Ripetute** fino al completamento dell'elemento
- **Configurabili**: quando iniziare, ogni quanto, se continuare dopo la scadenza
- **Recuperate alla riapertura** se il browser non ha risvegliato il Service Worker

---

## ⚠️ Limitazioni note

> **App Android nativa**: le notifiche sono locali, programmate dal telefono stesso all'orario
> esatto, anche ad app chiusa e senza internet — i limiti qui sotto riguardano la **versione web**.
> Resta solo il risparmio energetico aggressivo di alcuni produttori (Xiaomi, Huawei, Oppo…): se un
> promemoria non arriva, escludere l'app dall'ottimizzazione della batteria.

### Notifiche con app chiusa (Web Push) — richiede un passo di setup manuale su Android

Un backend dedicato (`server/`, Node/Express su Render + Postgres su Supabase) invia notifiche push
reali (VAPID) indipendentemente dallo stato dell'app — l'unico meccanismo web che consegna
puntualmente anche a telefono bloccato.

⚠️ **Su Android, se il sistema limita l'app/il browser in background, le notifiche push arrivano in
ritardo o non arrivano affatto** — non è un bug del progetto, è la gestione batteria del telefono che
sospende il processo prima che possa ricevere il push. **Passo di setup consigliato dopo
l'installazione**: Impostazioni Android → App → Chrome (o il nome dell'app se installata come PWA) →
Batteria → **"Nessuna restrizione"**. Verificato che risolve il problema su un Samsung Galaxy S21
reale (One UI); la stessa impostazione — o l'equivalente su altri produttori (Xiaomi/MIUI,
Huawei, Oppo, Vivo) — va cercata caso per caso. La stessa nota è mostrata direttamente in Settings →
Notifiche push, nell'app.
