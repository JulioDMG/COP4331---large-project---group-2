import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="app">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Log out?</p>
            <div className="modal-buttons">
              <button type="button" className="modal-confirm" onClick={handleConfirmLogout}>OK</button>
              <button type="button" className="modal-cancel" onClick={handleCancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <header className="top-bar">
        <button type="button" className="login-button" onClick={handleLoginClick}>
          {isAuthenticated && user ? user.username : 'Login'}
        </button>
      </header>

      <main className="hero">
        <h1>Arcade</h1>
        <p>Choose a game and start playing.</p>

        {/* Leaderboard Section */}
        <section className="leaderboard-section">
          <h2 className="leaderboard-title">Leaderboard</h2>

          {/* Game Tabs */}
          <div className="leaderboard-tabs">
            {GAMES.map((game) => (
              <button
                key={game}
                type="button"
                className={`leaderboard-tab ${selectedGame === game ? 'active' : ''}`}
                onClick={() => setSelectedGame(game)}
              >
                {GAME_LABELS[game]}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="leaderboard-card">
            {loadingBoard ? (
              <p className="leaderboard-empty">Loading...</p>
            ) : leaderboard.length === 0 ? (
              <p className="leaderboard-empty">No scores yet for this game.</p>
            ) : (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className={
                        index === 0 ? 'rank-gold' :
                        index === 1 ? 'rank-silver' :
                        index === 2 ? 'rank-bronze' : ''
                      }
                    >
                      <td>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </td>
                      <td>{entry.userId?.username ?? 'Unknown'}</td>
                      <td>{entry.value} {entry.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Games Section */}
        <section className="games-section">
          <h2>Available Games</h2>

          <div className="game-card">
            <h3>Tic-Tac-Toe</h3>
            <p>Play a classic game and track your results later.</p>
            <button type="button" className="play-button" onClick={handlePlayClick}>
              Play Tic-Tac-Toe
            </button>
          </div>

          <div className="game-card">
            <h3>Minesweeper</h3>
            <p>Clear the board, avoid the mines, and test your logic.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/minesweeper') : navigate('/login')}>
              Play Minesweeper
            </button>
          </div>

          <div className="game-card">
            <h3>Snake</h3>
            <p>Collect food, grow longer, and avoid crashing.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/snake') : navigate('/login')}>
              Play Snake
            </button>
          </div>

          <div className="game-card">
            <h3>Sudoku</h3>
            <p>Solve the puzzle and test your logic skills.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/sudoku') : navigate('/login')}>
              Play Sudoku
            </button>
          </div>

          {/* <div className="game-card">
            <h3>Battleship</h3>
            <p>Find the enemy ships and sink the fleet.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/battleship') : navigate('/login')}>
              Play Battleship
            </button>
          </div> */}

          <div className="game-card">
            <h3>Dino Run</h3>
            <p>Jump over obstacles and survive as long as you can.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/dinorun') : navigate('/login')}>
              Play Dino Run
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;