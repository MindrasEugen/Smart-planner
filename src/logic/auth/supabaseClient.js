/**
 * Client Supabase Auth — bozza non ancora collegata all'app.
 * Verrà attivata con l'aggiornamento cloud-sync (atteso entro fine settembre 2026,
 * vedi sezione "Prossimamente" in Settings). Nessun file esistente importa
 * ancora questo modulo.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

/**
 * @returns {boolean} True se le variabili d'ambiente Supabase Auth sono configurate in questo build
 */
export function isAuthConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Restituisce il client Supabase Auth (singleton), o null se non configurato.
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabaseClient() {
  if (!isAuthConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}
