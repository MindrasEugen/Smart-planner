/**
 * Register Page — form di registrazione.
 * Delega la logica di autenticazione a signUp(); non è ancora collegato alle route dell'app.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm.jsx';
import { signUp } from '../../logic/auth/index.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setServerError(null);

    const { user, error } = await signUp(email, password);

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
        <RegisterForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
        <Link
          to="/login"
          className="text-sm text-primary hover:underline text-center block mt-2"
        >
          Hai già un account? Accedi
        </Link>
      </div>
    </div>
  );
}
