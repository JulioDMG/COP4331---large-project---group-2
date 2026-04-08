import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Log out?</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-confirm"
                onClick={handleConfirmLogout}
              >
                OK
              </button>
              <button
                type="button"
                className="modal-cancel"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="top-bar">
        <button
          type="button"
          className="login-button"
          onClick={handleLoginClick}
        >
          {isAuthenticated && user ? user.username : 'Login'}
        </button>
      </header>

      <main className="hero">
        <h1>Arcade</h1>
        <p>Choose a game and start playing.</p>

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

          <div className="game-card">
            <h3>Battleship</h3>
            <p>Find the enemy ships and sink the fleet.</p>
            <button type="button" className="play-button" onClick={() => isAuthenticated ? navigate('/battleship') : navigate('/login')}>
              Play Battleship
            </button>
          </div>

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