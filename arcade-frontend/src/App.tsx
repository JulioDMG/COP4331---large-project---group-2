import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SnakePage from './pages/SnakePage';
import MinesweeperPage from './pages/MinesweeperPage';
import TictactoePage from './pages/TictactoePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/snake" element={<SnakePage />} />
          <Route path="/minesweeper" element={<MinesweeperPage />} />
          <Route path="/tictactoe" element={<TictactoePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;