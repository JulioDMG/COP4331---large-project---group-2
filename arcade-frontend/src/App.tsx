import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SnakePage from './pages/SnakePage';
import MinesweeperPage from './pages/MinesweeperPage';
import TictactoePage from './pages/TictactoePage';
import SudokuPage from './pages/SudokuPage';
import DinorunPage from './pages/DinorunPage';
import VerificationPage         from './pages/VerificationPage';
import VerificationConfirmation from './pages/VerificationConfirmation';

/* import BattleshipPage from './pages/BattleshipPage';
 */import './App.css';

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
          <Route path="/sudoku" element={<SudokuPage />} />
          <Route path="/dinorun" element={<DinorunPage />} />
	  <Route path="/verify"         element={<VerificationPage />} />
	  <Route path="/verify-confirm" element={<VerificationConfirmation />} />
{/*           <Route path="/battleship" element={<BattleshipPage />} />
 */}        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
