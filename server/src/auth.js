/**
 * Autenticazione minima: un unico segreto condiviso (bearer token), non un
 * vero sistema di account. App a singolo utente: serve solo a evitare che
 * questi endpoint restino una API di scrittura aperta a chiunque su internet.
 */

export function requireSyncSecret(req, res, next) {
  const expected = process.env.SYNC_SECRET;
  if (!expected) {
    // Server mal configurato: meglio rifiutare tutto che accettare senza controllo
    return res.status(500).json({ error: 'SYNC_SECRET non configurato sul server' });
  }

  const header = req.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (token !== expected) {
    return res.status(401).json({ error: 'Non autorizzato' });
  }

  next();
}
