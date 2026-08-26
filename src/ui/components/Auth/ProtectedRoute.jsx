import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSession } from '../../../logic/auth/index.js';
import LoadingSpinner from '../LoadingSpinner.jsx';

/**
 * @typedef {Object} ProtectedRouteProps
 * @property {React.ReactNode} children - Componente da renderizzare se l'utente è autenticato
 */

/**
 * Componente che protegge le route richiedendo autenticazione.
 * Mostra uno spinner durante la verifica della sessione, redirige a /login se non autenticato,
 * e renderizza i children se autenticato.
 * @param {ProtectedRouteProps} props
 * @returns {React.ReactNode}
 */
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuthSession();

  if (loading) {
    return <LoadingSpinner label="Verifica sessione..." />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
