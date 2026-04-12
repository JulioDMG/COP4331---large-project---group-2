import { useNavigate, useLocation } from 'react-router-dom';

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email may be passed via router state from the registration handler
  const email: string = (location.state as { email?: string })?.email ?? 'your email address';

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

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(0, 255, 255, 0.25)',
    borderRadius: '16px',
    padding: '3rem 2.5rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(0, 255, 255, 0.08)',
  };

  const iconWrapStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    borderRadius: '50%',
    background: 'rgba(0, 255, 255, 0.1)',
    border: '2px solid rgba(0, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
  };

  const headingStyle: React.CSSProperties = {
    color: '#00ffff',
    fontSize: '1.75rem',
    fontWeight: 700,
    margin: '0 0 0.75rem',
    letterSpacing: '0.5px',
  };

  const subStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: '0 0 0.5rem',
  };

  const emailHighlightStyle: React.CSSProperties = {
    color: '#e2e8f0',
    fontWeight: 600,
  };

  const dividerStyle: React.CSSProperties = {
    borderColor: 'rgba(0, 255, 255, 0.15)',
    margin: '2rem 0',
  };

  const noteStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '0.82rem',
    lineHeight: 1.55,
  };

  const backBtnStyle: React.CSSProperties = {
    marginTop: '1.75rem',
    background: 'transparent',
    border: '1px solid rgba(0, 255, 255, 0.35)',
    color: '#00ffff',
    padding: '0.6rem 1.6rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Envelope icon */}
        <div style={iconWrapStyle}>✉️</div>

        <h1 style={headingStyle}>Check Your Inbox</h1>

        <p style={subStyle}>
          An email has been sent to{' '}
          <span style={emailHighlightStyle}>{email}</span>.
        </p>

        <p style={subStyle}>
          Click the verification link inside to activate your Arcade account.
        </p>

        <hr style={dividerStyle} />

        <p style={noteStyle}>
          Didn't receive it? Check your spam folder. The link expires in&nbsp;30&nbsp;minutes.
          <br />
          If you still need help, contact support.
        </p>

        <button
          type="button"
          style={backBtnStyle}
          onMouseEnter={e =>
            Object.assign((e.target as HTMLButtonElement).style, {
              background: 'rgba(0,255,255,0.08)',
              boxShadow: '0 0 12px rgba(0,255,255,0.2)',
            })
          }
          onMouseLeave={e =>
            Object.assign((e.target as HTMLButtonElement).style, {
              background: 'transparent',
              boxShadow: 'none',
            })
          }
          onClick={() => navigate('/login')}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

