/**
 * Azioni di autenticazione (email/password) verso Supabase Auth.
 * Bozza non ancora collegata a nessuna UI: verrà usata da LoginForm/RegisterForm
 * con l'aggiornamento cloud-sync.
 */

import { getSupabaseClient } from './supabaseClient.js';

/**
 * Registra un nuovo utente con email e password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object | null, error: Error | null }>}
 */
export async function signUp(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null, error: new Error('Supabase Auth non configurato') };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, error };
}

/**
 * Effettua il login con email e password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object | null, error: Error | null }>}
 */
export async function signIn(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) return { user: null, error: new Error('Supabase Auth non configurato') };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, error };
}

/**
 * Effettua il logout dell'utente corrente.
 * @returns {Promise<{ error: Error | null }>}
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}
