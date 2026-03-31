import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (window.confirm('Log out?')) logout();
    } else {
      navigate('/login');
    }
  };

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // TODO: navigate to the game when ready
      navigate('/tictactoe');
    }
  };

  return (
    <div className="app">
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
            <button
              type="button"
              className="play-button"
              onClick={handlePlayClick}
            >
              Play Tic-Tac-Toe
            </button>
          </div>
        <div className="game-card">
          <h3>Minesweeper</h3>
          <p>Clear the board, avoid the mines, and test your logic.</p>
          <button
            type="button"
            className="play-button"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else {
                navigate('/minesweeper');
              }
            }}
          >
            Play Minesweeper
          </button>

        <div className="game-card">
          <h3>Snake</h3>
          <p>Collect food, grow longer, and avoid crashing.</p>
          <button
            type="button"
            className="play-button"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else {
                navigate('/snake');
              }
            }}
        >
            Play Snake
          </button>
        </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;