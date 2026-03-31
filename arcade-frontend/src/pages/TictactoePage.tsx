import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SquareValue = 'X' | 'O' | null;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: SquareValue[]): SquareValue | 'Draw' {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((square) => square !== null)) {
    return 'Draw';
  }

  return null;
}

function getAvailableMoves(board: SquareValue[]): number[] {
  return board
    .map((value, index) => (value === null ? index : -1))
    .filter((index) => index !== -1);
}

function findWinningMove(board: SquareValue[], player: 'X' | 'O'): number | null {
  for (const move of getAvailableMoves(board)) {
    const testBoard = [...board];
    testBoard[move] = player;

    if (calculateWinner(testBoard) === player) {
      return move;
    }
  }

  return null;
}

function getCpuMove(board: SquareValue[]): number {
  const winningMove = findWinningMove(board, 'O');
  if (winningMove !== null) return winningMove;

  const blockingMove = findWinningMove(board, 'X');
  if (blockingMove !== null) return blockingMove;

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter((index) => board[index] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function TicTacToePage() {
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

    if (result === 'X') {
      setStatus('You win!');
      setGameOver(true);
      return;
    }

    if (result === 'Draw') {
      setStatus('It’s a draw!');
      setGameOver(true);
      return;
    }

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        color: 'white',
        padding: '20px',
        position: 'relative',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <h1>Tic-Tac-Toe</h1>
      <p>You are X • CPU is O</p>
      <p>{status}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gridTemplateRows: 'repeat(3, 100px)',
          gap: '8px',
          backgroundColor: '#333',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        {board.map((square, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSquareClick(index)}
            style={{
              width: '100px',
              height: '100px',
              fontSize: '2rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: square || gameOver || !isPlayerTurn ? 'default' : 'pointer',
              backgroundColor: '#1f1f1f',
              color: square === 'X' ? '#22c55e' : '#ef4444',
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
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default TicTacToePage;