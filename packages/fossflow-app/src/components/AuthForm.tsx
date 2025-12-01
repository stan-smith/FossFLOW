import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import type { AuthCredentials } from '../services/authService';
import './AuthForm.css';

type AuthMode = 'login' | 'signup';

export function AuthForm() {
  const { t } = useTranslation('app');
  const { login, signup, error, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError(t('auth.validation.required'));
      return;
    }

    if (password.length < 8) {
      setLocalError(t('auth.validation.passwordLength'));
      return;
    }

    const credentials: AuthCredentials = {
      email: email.trim(),
      password,
      name: mode === 'signup' ? name.trim() || undefined : undefined
    };

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(credentials);
      } else {
        await signup(credentials);
      }
    } catch {
      // Error is handled by AuthContext; we just keep the form visible.
    } finally {
      setSubmitting(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="auth-form-container">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          {t('auth.loginTab')}
        </button>
        <button
          type="button"
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
        >
          {t('auth.signupTab')}
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="auth-field">
            <label htmlFor="auth-name">{t('auth.nameLabel')}</label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="auth-email">{t('auth.emailLabel')}</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="auth-password">{t('auth.passwordLabel')}</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={
              mode === 'signup' ? 'new-password' : 'current-password'
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {activeError && (
          <div className="auth-error">
            {activeError}
          </div>
        )}

        <button
          type="submit"
          className="auth-submit"
          disabled={submitting || loading}
        >
          {submitting || loading
            ? t('auth.submitting')
            : mode === 'login'
              ? t('auth.loginButton')
              : t('auth.signupButton')}
        </button>

        <div className="auth-hint">
          {mode === 'login'
            ? t('auth.loginHint')
            : t('auth.signupHint')}
        </div>
      </form>
    </div>
  );
}


