import React, { useState } from 'react';

type LoginPageProps = {
  onAuthSuccess?: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'login'
      ? 'http://localhost:8000/account/auth/auth/login'
      : 'http://localhost:8000/account/auth/auth/register';

    // Both Login and Register now send standard JSON
    const payload = mode === 'login'
      ? { email, password }
      : { email, password, full_name: name };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);

        let errorMessage = 'Authentication failed. Please try again.';
        if (errData?.detail) {
          if (typeof errData.detail === 'string') {
            errorMessage = errData.detail; // e.g. invalid credentials
          } else if (Array.isArray(errData.detail)) {
            // e.g., "Validation Error: body.email - Field required"
            errorMessage = `Validation Error: ${errData.detail[0].loc.join('.')} - ${errData.detail[0].msg}`;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Look for access_token based on your backend return statement
      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem('authToken', token);
      } else if (mode === 'login') {
        throw new Error("Login succeeded but no token was returned from the server.");
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">
        Sign in to manage your rides or create a new account.
      </p>

      <div className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-button ${mode === 'login' ? 'auth-toggle-button-active' : ''}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-toggle-button ${mode === 'signup' ? 'auth-toggle-button-active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="Alex Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email or university username</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Continue' : 'Create account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;