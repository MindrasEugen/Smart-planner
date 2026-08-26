/**
 * Login Page — form di accesso.
 * Delega la logica di autenticazione a signIn(); non è ancora collegato alle route dell'app.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm.jsx';
import { signIn } from '../../logic/auth/index.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setServerError(null);

    const { user, error } = await signIn(email, password);

    if (error) {
      setServerError(error.message);
      setSubmitting(false);
    } else if (user) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
        <Link
          to="/register"
          className="text-sm text-primary hover:underline text-center block mt-2"
        >
          Non hai un account? Registrati
        </Link>
      </div>
    </div>
  );
}
