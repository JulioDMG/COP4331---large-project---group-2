import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tictactoeImg from '../assets/Arcade_tictactoe.png';
import minesweeperImg from '../assets/Arcade_minesweeper.png';
import snakeImg from '../assets/Arcade_snake.png';
import sudokuImg from '../assets/Arcade_sudoku.png';
import dinorunImg from '../assets/Arcade_dinorun.png';

const GAMES = ['tictactoe', 'minesweeper', 'snake', 'sudoku', 'dinorun'];

const GAME_LABELS: Record<string, string> = {
  tictactoe: 'Tic-Tac-Toe',
  minesweeper: 'Minesweeper',
  snake: 'Snake',
  sudoku: 'Sudoku',
  dinorun: 'Dino Run',
};

type LeaderboardEntry = {
  _id: string;
  userId: { username: string };
  value: number;
  unit: string;
};

function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState('snake');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingBoard(true);
      try {
        const res = await fetch(`/api/scores/leaderboard/${selectedGame}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setLeaderboard([]);
      } finally {
        setLoadingBoard(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGame]);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      setShowLogoutModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/tictactoe');
    }
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(2, 6, 23, 0.88)',
    border: '2px solid #ff00ff',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 0 18px rgba(0,255,255,0.25)',
    overflow: 'hidden',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '10px',
    border: '1px solid rgba(0,255,255,0.5)',
    boxShadow: '0 0 12px rgba(0,255,255,0.35)',
  };

  const playButtonStyle: React.CSSProperties = {
    marginTop: '14px',
    padding: '12px 18px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    background: '#00ffff',
    color: '#000',
    fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(0,255,255,0.7)',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: '999px',
    border: active ? '1px solid #00ffff' : '1px solid rgba(255,255,255,0.15)',
    background: active ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)',
    color: active ? '#00ffff' : '#cbd5e1',
    cursor: 'pointer',
    fontWeight: 700,
    boxShadow: active ? '0 0 10px rgba(0,255,255,0.25)' : 'none',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1a1a2e 0%, #0f172a 45%, #000 100%)',
        color: 'white',
        padding: '24px 16px 40px',
        fontFamily: 'monospace',
        boxSizing: 'border-box',
      }}
    >
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'rgba(2, 6, 23, 0.95)',
              border: '2px solid #00ffff',
              borderRadius: '18px',
              padding: '28px',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(0,255,255,0.45)',
              minWidth: '280px',
            }}
          >
            <p style={{ marginBottom: '18px', fontSize: '1.1rem', color: '#e2e8f0' }}>Log out?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleConfirmLogout}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: '#00ffff',
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: '0 0 12px rgba(0,255,255,0.7)',
                }}
              >
                OK
              </button>
              <button
                type="button"
                onClick={handleCancelLogout}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #00ffff',
                  cursor: 'pointer',
                  background: '#020617',
                  color: '#00ffff',
                  boxShadow: '0 0 10px rgba(0,255,255,0.35)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={handleLoginClick}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #00ffff',
              cursor: 'pointer',
              background: '#020617',
              color: '#00ffff',
              boxShadow: '0 0 10px rgba(0,255,255,0.5)',
              fontWeight: 'bold',
            }}
          >
            {isAuthenticated && user ? user.username : 'Login'}
          </button>
        </div>

        <div
          style={{
            background: 'rgba(2, 6, 23, 0.85)',
            border: '2px solid #00ffff',
            boxShadow: '0 0 25px rgba(0,255,255,0.45)',
            borderRadius: '22px',
            padding: '30px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '3rem',
                margin: '0 0 10px 0',
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                letterSpacing: '2px',
              }}
            >
              ARCADE
            </h1>
            <p style={{ color: '#facc15', margin: 0 }}>Choose a game and start playing.</p>
          </div>

          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                color: '#e879f9',
                marginBottom: '16px',
                textShadow: '0 0 8px rgba(232,121,249,0.45)',
              }}
            >
              Leaderboard
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '18px',
              }}
            >
              {GAMES.map((game) => (
                <button
                  key={game}
                  type="button"
                  onClick={() => setSelectedGame(game)}
                  style={tabStyle(selectedGame === game)}
                >
                  {GAME_LABELS[game]}
                </button>
              ))}
            </div>

            <div
              style={{
                background: '#0f172a',
                border: '2px solid #00ff88',
                borderRadius: '16px',
                padding: '18px',
                boxShadow: '0 0 20px rgba(0,255,255,0.25)',
                overflowX: 'auto',
              }}
            >
              {loadingBoard ? (
                <p style={{ color: '#cbd5e1', margin: 0 }}>Loading...</p>
              ) : leaderboard.length === 0 ? (
                <p style={{ color: '#cbd5e1', margin: 0 }}>No scores yet for this game.</p>
              ) : (
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    color: '#e2e8f0',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Rank</th>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Player</th>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry._id}>
                        <td style={{ padding: '10px', color: index === 0 ? '#facc15' : index === 1 ? '#cbd5e1' : index === 2 ? '#d97706' : '#e2e8f0' }}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </td>
                        <td style={{ padding: '10px' }}>{entry.userId?.username ?? 'Unknown'}</td>
                        <td style={{ padding: '10px' }}>{entry.value} {entry.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <h2
              style={{
                color: '#e879f9',
                marginBottom: '18px',
                textShadow: '0 0 8px rgba(232,121,249,0.45)',
              }}
            >
              Available Games
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '18px',
              }}
            >
              <div style={cardStyle}>
                <img src={tictactoeImg} alt="Tic-Tac-Toe" style={imageStyle} />
                <h3 style={{ marginTop: 0, color: '#00ffff' }}>Tic-Tac-Toe</h3>
                <p style={{ color: '#cbd5e1', paddingRight: '90px' }}>
                  Play a classic game and track your results later.
                </p>
                <button type="button" style={playButtonStyle} onClick={handlePlayClick}>
                  Play Tic-Tac-Toe
                </button>
              </div>

              <div style={cardStyle}>
                <img src={minesweeperImg} alt="Minesweeper" style={imageStyle} />
                <h3 style={{ marginTop: 0, color: '#00ffff' }}>Minesweeper</h3>
                <p style={{ color: '#cbd5e1', paddingRight: '90px' }}>
                  Clear the board, avoid the mines, and test your logic.
                </p>
                <button
                  type="button"
                  style={playButtonStyle}
                  onClick={() => isAuthenticated ? navigate('/minesweeper') : navigate('/login')}
                >
                  Play Minesweeper
                </button>
              </div>

              <div style={cardStyle}>
                <img src={snakeImg} alt="Snake" style={imageStyle} />
                <h3 style={{ marginTop: 0, color: '#00ffff' }}>Snake</h3>
                <p style={{ color: '#cbd5e1', paddingRight: '90px' }}>
                  Collect food, grow longer, and avoid crashing.
                </p>
                <button
                  type="button"
                  style={playButtonStyle}
                  onClick={() => isAuthenticated ? navigate('/snake') : navigate('/login')}
                >
                  Play Snake
                </button>
              </div>

              <div style={cardStyle}>
                <img src={sudokuImg} alt="Sudoku" style={imageStyle} />
                <h3 style={{ marginTop: 0, color: '#00ffff' }}>Sudoku</h3>
                <p style={{ color: '#cbd5e1', paddingRight: '90px' }}>
                  Solve the puzzle and test your logic skills.
                </p>
                <button
                  type="button"
                  style={playButtonStyle}
                  onClick={() => isAuthenticated ? navigate('/sudoku') : navigate('/login')}
                >
                  Play Sudoku
                </button>
              </div>

              <div style={cardStyle}>
                <img src={dinorunImg} alt="Dino Run" style={imageStyle} />
                <h3 style={{ marginTop: 0, color: '#00ffff' }}>Dino Run</h3>
                <p style={{ color: '#cbd5e1', paddingRight: '90px' }}>
                  Jump over obstacles and survive as long as you can.
                </p>
                <button
                  type="button"
                  style={playButtonStyle}
                  onClick={() => isAuthenticated ? navigate('/dinorun') : navigate('/login')}
                >
                  Play Dino Run
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;