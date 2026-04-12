import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Status = 'loading' | 'success' | 'error';

export default function VerificationConfirmation() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [status, setStatus]   = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please use the link from your email.');
      return;
    }

    // Call the backend to validate the JWT and mark the user as verified
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async res => {
        const body = await res.json();
        if (res.ok) {
	  loginWithToken(body.data.token, body.data.user);
          setStatus('success');
          setMessage('Your email has been verified!');
        } else {
          setStatus('error');
          setMessage(body.error ?? 'Verification failed. The link may have expired.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      });
  }, [location.search]);

  /* ── Styles ── */
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '2rem',
  };

  const accentColor = status === 'success' ? '#00ffff' : status === 'error' ? '#f87171' : '#94a3b8';

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: `1px solid ${accentColor}44`,
    borderRadius: '16px',
    padding: '3rem 2.5rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: `0 0 40px ${accentColor}14`,
    transition: 'border-color 0.4s, box-shadow 0.4s',
  };

  const iconWrapStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    borderRadius: '50%',
    background: `${accentColor}18`,
    border: `2px solid ${accentColor}66`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.4rem',
    transition: 'background 0.4s, border-color 0.4s',
  };

  const headingStyle: React.CSSProperties = {
    color: accentColor,
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: '0 0 0.75rem',
    letterSpacing: '0.5px',
    transition: 'color 0.4s',
  };

  const subStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.65,
    margin: '0 0 1.75rem',
  };

  const primaryBtnStyle: React.CSSProperties = {
    background: '#00ffff',
    border: 'none',
    color: '#0a0a1a',
    padding: '0.7rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 700,
    marginRight: '0.75rem',
    transition: 'opacity 0.2s',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid rgba(0, 255, 255, 0.35)',
    color: '#00ffff',
    padding: '0.65rem 1.6rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  };

  /* ── Spinner ── */
  const spinnerStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    border: '4px solid rgba(0,255,255,0.15)',
    borderTop: '4px solid #00ffff',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
    margin: '0 auto',
  };

  const icon = status === 'loading' ? null : status === 'success' ? '✅' : '❌';

  const heading =
    status === 'loading' ? 'Verifying…'
    : status === 'success' ? 'Email Verified!'
    : 'Verification Failed';

  return (
    <div style={pageStyle}>
      {/* Keyframes injected inline – avoids needing an extra CSS file */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={cardStyle}>
        <div style={iconWrapStyle}>
          {status === 'loading' ? <div style={spinnerStyle} /> : icon}
        </div>

        <h1 style={headingStyle}>{heading}</h1>

        <p style={subStyle}>{message || 'Please wait while we verify your email…'}</p>

        {status === 'success' && (
          <button
            type="button"
            style={primaryBtnStyle}
            onMouseEnter={e => ((e.target as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.target as HTMLButtonElement).style.opacity = '1')}
            onClick={() => navigate('/login')}
          >
            Go to Login →
          </button>
        )}

        {status === 'error' && (
          <>
            <button
              type="button"
              style={primaryBtnStyle}
              onMouseEnter={e => ((e.target as HTMLButtonElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.target as HTMLButtonElement).style.opacity = '1')}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
            <button
              type="button"
              style={secondaryBtnStyle}
              onMouseEnter={e =>
                Object.assign((e.target as HTMLButtonElement).style, {
                  background: 'rgba(0,255,255,0.08)',
                })
              }
              onMouseLeave={e =>
                Object.assign((e.target as HTMLButtonElement).style, {
                  background: 'transparent',
                })
              }
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

