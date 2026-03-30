import { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

type Tab = 'login' | 'register';

interface FormState {
  username: string;
  email: string;
  password: string;
}

interface AlertState {
  message: string;
  type: 'error' | 'success' | '';
}

function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to wherever they came from, or home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert]         = useState<AlertState>({ message: '', type: '' });
  const [form, setForm]           = useState<FormState>({ username: '', email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setAlert({ message: '', type: '' });
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setAlert({ message: '', type: '' });
    setForm({ username: '', email: '', password: '' });
  };

  const handleLogin = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setAlert({ message: 'Please fill in all fields.', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      setAlert({ message: 'Login successful! Redirecting…', type: 'success' });
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setAlert({ message: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [form, login, navigate, from]);

  const handleRegister = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setAlert({ message: 'Please fill in all fields.', type: 'error' });
      return;
    }
    if (form.password.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await register(form.username, form.email, form.password);
      setAlert({ message: 'Account created! Redirecting…', type: 'success' });
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setAlert({ message: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [form, register, navigate, from]);

  return (
    <div className="app login-page-wrapper">
      {/* Reuse the same top-bar structure as HomePage */}
      <header className="top-bar">
        <Link to="/" className="arcade-back-link">← Arcade</Link>
      </header>

      <main className="hero">
        <div className="login-card">

          {/* Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab${activeTab === 'login' ? ' active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`login-tab${activeTab === 'register' ? ' active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Register
            </button>
          </div>

          <h2 className="login-title">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="login-sub">
            {activeTab === 'login'
              ? 'Sign in to track your scores.'
              : 'Join the arcade and climb the leaderboard.'}
          </p>

          {/* Alert */}
          {alert.message && (
            <div className={`login-alert login-alert--${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} noValidate>
            {activeTab === 'register' && (
              <div className="login-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="PlayerOne"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="play-button login-submit" disabled={isLoading}>
              {isLoading
                ? 'Loading…'
                : activeTab === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
