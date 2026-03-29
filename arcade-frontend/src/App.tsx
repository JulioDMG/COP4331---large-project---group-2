import './App.css';

function App() {
  return (
    <div className="app">
      <header className="top-bar">
        <button type="button" className="login-button">Login</button>
      </header>

      <main className="hero">
        <h1>Arcade</h1>
        <p>Choose a game and start playing.</p>

        <section className="games-section">
          <h2>Available Games</h2>

          <div className="game-card">
            <h3>Tic-Tac-Toe</h3>
            <p>Play a classic game and track your results later.</p>
            <button type="button" className="play-button">Play Tic-Tac-Toe</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


