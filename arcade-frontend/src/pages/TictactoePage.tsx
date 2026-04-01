import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SquareValue = 'X' | 'O' | null;

const winningCombinations = [
  [0, 1, 2],[3, 4, 5],[6, 7, 8],
  [0, 3, 6],[1, 4, 7],[2, 5, 8],
  [0, 4, 8],[2, 4, 6],
];

function calculateWinner(board: SquareValue[]): SquareValue | 'Draw' {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every((square) => square !== null)) return 'Draw';
  return null;
}
function getAvailableMoves(board: SquareValue[]) {
  return board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
}
function findWinningMove(board: SquareValue[], player: 'X' | 'O') {
  for (const move of getAvailableMoves(board)) {
    const testBoard = [...board];
    testBoard[move] = player;
    if (calculateWinner(testBoard) === player) return move;
  }
  return null;
}
function getCpuMove(board: SquareValue[]) {
  const winningMove = findWinningMove(board, 'O');
  if (winningMove !== null) return winningMove;
  const blockingMove = findWinningMove(board, 'X');
  if (blockingMove !== null) return blockingMove;
  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

function TictactoePage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState('Your turn');
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setStatus('Your turn');
    setGameOver(false);
  };

  const handleSquareClick = (index: number) => {
    if (!isPlayerTurn || board[index] !== null || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    const result = calculateWinner(newBoard);
    setBoard(newBoard);

    if (result === 'X') return setStatus('You win!'), setGameOver(true);
    if (result === 'Draw') return setStatus('It’s a draw!'), setGameOver(true);

    setIsPlayerTurn(false);
    setStatus('CPU is thinking...');
  };

  useEffect(() => {
    if (isPlayerTurn || gameOver) return;
    const timeout = setTimeout(() => {
      setBoard((currentBoard) => {
        const move = getCpuMove(currentBoard);
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        const result = calculateWinner(newBoard);

        if (result === 'O') {
          setStatus('CPU wins!');
          setGameOver(true);
        } else if (result === 'Draw') {
          setStatus('It’s a draw!');
          setGameOver(true);
        } else {
          setStatus('Your turn');
          setIsPlayerTurn(true);
        }
        return newBoard;
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [isPlayerTurn, gameOver]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #1a1a2e 0%, #0f172a 45%, #000 100%)',
      color: 'white',
      padding: '20px',
      position: 'relative',
      fontFamily: 'monospace',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 18px',
          borderRadius: '10px',
          border: '1px solid #00ffff',
          cursor: 'pointer',
          background: '#020617',
          color: '#00ffff',
          boxShadow: '0 0 10px rgba(0,255,255,0.5)',
        }}
      >
        ← Back
      </button>

      <div style={{
        background: 'rgba(2, 6, 23, 0.85)',
        border: '2px solid #00ffff',
        boxShadow: '0 0 25px rgba(0,255,255,0.45)',
        borderRadius: '18px',
        padding: '28px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          margin: '0 0 10px 0',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
        }}>
          ARCADE TIC-TAC-TOE
        </h1>

        <p style={{ color: '#facc15', marginBottom: '8px' }}>You are X • CPU is O</p>
        <p style={{ color: '#e879f9', marginBottom: '18px' }}>{status}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gridTemplateRows: 'repeat(3, 100px)',
          gap: '10px',
          backgroundColor: '#0f172a',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid #00ffff',
          boxShadow: '0 0 20px rgba(0,255,255,0.4)',
        }}>
          {board.map((square, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSquareClick(index)}
              style={{
                width: '100px',
                height: '100px',
                fontSize: '2.2rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                cursor: square || gameOver || !isPlayerTurn ? 'default' : 'pointer',
                backgroundColor: '#020617',
                border: '2px solid #00ffff',
                boxShadow: '0 0 10px rgba(0,255,255,0.35)',
                color: square === 'X' ? '#22c55e' : square === 'O' ? '#ff0055' : '#ffffff',
              }}
            >
              {square}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={resetGame}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: '#00ffff',
            color: '#000',
            fontWeight: 'bold',
            boxShadow: '0 0 12px rgba(0,255,255,0.7)',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default TictactoePage;
