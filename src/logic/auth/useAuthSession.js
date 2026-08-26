/**
 * @typedef {Object} AuthSessionState
 * @property {Object | null} session - Sessione Supabase corrente, o null se non loggato
 * @property {Object | null} user - Utente corrente, o null se non loggato
 * @property {boolean} loading - True finché lo stato iniziale della sessione non è noto
 */

import { useState, useEffect } from 'react';
import { getSupabaseClient } from './supabaseClient.js';

/**
 * Espone lo stato di autenticazione corrente e si aggiorna su login/logout/refresh token.
 * Bozza non ancora usata da nessuna pagina: verrà collegata a `ProtectedRoute`
 * con l'aggiornamento cloud-sync.
 * @returns {AuthSessionState}
 */
export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}
