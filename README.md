# Agenda Intelligente

Un'agenda personale che **non ti lascia dimenticare le cose**: ti ricorda ripetutamente ciò che
sta per scadere, finché non lo segni come fatto.

**Provala subito:** https://smart-planner-vjgl.onrender.com — oppure installa l'app Android.

---

## Cosa fa

- **Promemoria che insistono** — scegli quando iniziare ad avvisarti (es. 2 ore prima) e ogni quanto
  ripetere (es. ogni 30 minuti), anche dopo la scadenza. Si fermano solo quando completi l'impegno.
- **Scrivi come parli** — "Chiamare il dentista domani alle 10": l'intelligenza artificiale crea
  l'impegno da sola, con data, ora e importanza.
- **Tutto a colpo d'occhio** — la Dashboard mostra cosa scade a breve e cosa è più importante;
  l'Agenda ti dà la vista del giorno, della settimana e dei prossimi impegni.
- **Anche i compleanni** — con ricorrenza annuale, messi in evidenza quando si avvicinano.
- **Tua e personale** — tema chiaro o scuro, avatar, notifiche con o senza vibrazione e suono.

## Dove si usa

| | Come | Notifiche |
|---|---|---|
| **Web** (PC e telefono) | Apri il link sopra; su telefono puoi installarla dalla pagina Impostazioni | Arrivano anche ad app chiusa, dopo averle attivate in Impostazioni |
| **App Android** | Installa l'APK (in arrivo sul Play Store) | Arrivano anche ad app chiusa e **senza internet** |

> ⚠️ **Se le notifiche non arrivano su Android**: alcuni telefoni (Samsung, Xiaomi, Huawei, Oppo…)
> bloccano le app in background per risparmiare batteria. Vai in *Impostazioni Android → App →
> Agenda Intelligente (o Chrome, per la versione web) → Batteria → Nessuna restrizione*.

I tuoi impegni restano **sul tuo dispositivo**: non serve un account.

---

## Documentazione

| Documento | Contenuto |
|---|---|
| [Funzionalità](docs/funzionalita.md) | Ogni funzione nel dettaglio, come si usa, limiti noti |
| [Sviluppo](docs/sviluppo.md) | Avvio in locale, backend, app Android, tecnologie, convenzioni |
| [Architettura](docs/architettura.md) | Struttura del codice e funzionamento delle notifiche |
| [Design System](docs/design-system.md) | Colori, tipografia, spaziature |
| [PLAN](PLAN.md) | Stato del progetto, roadmap e storico dei lavori ([`docs/plan/`](docs/plan/)) |

Per sviluppatori, in breve:

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm test
```

React 18 · Tailwind CSS v4 · Vite · PWA · Capacitor (Android) — design di riferimento: Google Stitch
"Cognitive Protocol".
