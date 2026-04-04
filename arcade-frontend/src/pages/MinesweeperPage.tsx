import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

function createEmptyBoard(): Cell[][] {
  const board: Cell[][] = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow: Cell[] = [];

    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }

    board.push(currentRow);
  }

  return board;
}

function placeMines(board: Cell[][], safeRow: number, safeCol: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < MINES_COUNT) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);

    const isSafeZone = Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;

    if (!newBoard[row][col].isMine && !isSafeZone) {
      newBoard[row][col].isMine = true;
      placed++;
    }
  }

  return newBoard;
}

function countNeighborMines(board: Cell[][], row: number, col: number): number {
  let count = 0;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        if (!(r === row && c === col) && board[r][c].isMine) {
          count++;
        }
      }
    }
  }

  return count;
}

function buildBoard(safeRow: number, safeCol: number): Cell[][] {
  let board = createEmptyBoard();
  board = placeMines(board, safeRow, safeCol);

  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      neighborMines: countNeighborMines(board, cell.row, cell.col),
    }))
  );
}

function revealConnectedCells(board: Cell[][], startRow: number, startCol: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[startRow, startCol]];

  while (stack.length > 0) {
    const [row, col] = stack.pop() as [number, number];
    const cell = newBoard[row][col];

    if (cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.neighborMines === 0 && !cell.isMine) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            if (!(r === row && c === col)) {
              const neighbor = newBoard[r][c];
              if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
                stack.push([r, c]);
              }
            }
          }
        }
      }
    }
  }

  return newBoard;
}

function checkWin(board: Cell[][]): boolean {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = board[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }

  return true;
}

function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  );
}

function getCellColor(cell: Cell): string {
  if (!cell.isRevealed) {
    return cell.isFlagged ? '#ff00aa' : '#1a103d';
  }

  if (cell.isMine) return '#ff2e63';
  return '#0f172a';
}

function getNumberColor(count: number): string {
  switch (count) {
    case 1:
      return '#00f7ff';
    case 2:
      return '#39ff14';
    case 3:
      return '#ff4fd8';
    case 4:
      return '#9d4edd';
    case 5:
      return '#ff9f1c';
    case 6:
      return '#00ffd5';
    case 7:
      return '#ffffff';
    case 8:
      return '#94a3b8';
    default:
      return '#ffffff';
  }
}

function MinesweeperPage() {
  const navigate = useNavigate();

  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES_COUNT);
  const [gameStarted, setGameStarted] = useState(false);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setWon(false);
    setFlagsLeft(MINES_COUNT);
    setGameStarted(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || won) return;

    let currentBoard = board.map((r) => r.map((cell) => ({ ...cell })));
    let cell = currentBoard[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    if (!gameStarted) {
      currentBoard = buildBoard(row, col);
      setGameStarted(true);
      cell = currentBoard[row][col];
    }

    if (cell.isMine) {
      const revealedBoard = revealAllMines(currentBoard);
      setBoard(revealedBoard);
      setGameOver(true);
      return;
    }

    if (cell.neighborMines === 0) {
      currentBoard = revealConnectedCells(currentBoard, row, col);
    } else {
      currentBoard[row][col].isRevealed = true;
    }

    setBoard(currentBoard);

    if (checkWin(currentBoard)) {
      setWon(true);
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: number,
    col: number
  ) => {
    e.preventDefault();

    if (gameOver || won) return;

    const currentBoard = board.map((r) => r.map((cell) => ({ ...cell })));
    const cell = currentBoard[row][col];

    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsLeft((prev) => prev + 1);
    } else {
      if (flagsLeft === 0) return;
      cell.isFlagged = true;
      setFlagsLeft((prev) => prev - 1);
    }

    setBoard(currentBoard);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, #24124d 0%, #12051f 45%, #05030d 100%)',
        color: '#f8fafc',
        padding: '20px',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 18px',
          borderRadius: '10px',
          border: '1px solid #00f7ff',
          cursor: 'pointer',
          background: '#12051f',
          color: '#00f7ff',
          boxShadow: '0 0 12px rgba(0, 247, 255, 0.6)',
          fontWeight: 'bold',
        }}
      >
        ← Back
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          textAlign: 'center',
          background: 'rgba(9, 6, 20, 0.78)',
          border: '2px solid #ff00aa',
          borderRadius: '20px',
          padding: '28px',
          boxShadow:
            '0 0 18px rgba(255, 0, 170, 0.45), 0 0 28px rgba(0, 247, 255, 0.2)',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '2.4rem',
            letterSpacing: '2px',
            color: '#f3f0f0',
            textShadow: '0 0 10px #00f7ff, 0 0 18px #ff00aa',
          }}
        >
          MINESWEEPER
        </h1>

        <p style={{ color: '#cbd5e1', marginBottom: '6px' }}>
          Left click to reveal • Right click to flag
        </p>
        <p style={{ color: '#39ff14', fontWeight: 'bold', marginBottom: '10px' }}>
          Flags left: {flagsLeft}
        </p>

        {!gameStarted && !gameOver && !won && (
          <p style={{ color: '#facc15', marginBottom: '16px' }}>
            Click any square to start
          </p>
        )}
        {gameOver && (
          <h2 style={{ color: '#ff2e63', textShadow: '0 0 10px #ff2e63' }}>
            Game Over
          </h2>
        )}
        {won && (
          <h2 style={{ color: '#39ff14', textShadow: '0 0 10px #39ff14' }}>
            You Win!
          </h2>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 40px)`,
            gridTemplateRows: `repeat(${ROWS}, 40px)`,
            gap: '4px',
            justifyContent: 'center',
            background: '#090612',
            padding: '14px',
            borderRadius: '16px',
            border: '2px solid #ff00aa',
            boxShadow: 'inset 0 0 20px rgba(0, 247, 255, 0.12), 0 0 18px rgba(0, 247, 255, 0.22)',
          }}
        >
          {board.flat().map((cell) => {
            let display = '';

            if (cell.isRevealed) {
              if (cell.isMine) {
                display = '💣';
              } else if (cell.neighborMines > 0) {
                display = String(cell.neighborMines);
              }
            } else if (cell.isFlagged) {
              display = '🚩';
            }

            return (
              <button
                key={`${cell.row}-${cell.col}`}
                type="button"
                onClick={() => handleCellClick(cell.row, cell.col)}
                onContextMenu={(e) => handleRightClick(e, cell.row, cell.col)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: cell.isRevealed
                    ? '1px solid #334155'
                    : '1px solid #ff00aa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: getCellColor(cell),
                  color:
                    cell.isRevealed && !cell.isMine
                      ? getNumberColor(cell.neighborMines)
                      : '#ffffff',
                  boxShadow: cell.isRevealed
                    ? 'inset 0 0 8px rgba(255,255,255,0.05)'
                    : '0 0 10px rgba(255, 0, 170, 0.28)',
                  transition: '0.15s ease',
                }}
              >
                {display}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={resetGame}
          style={{
            marginTop: '22px',
            padding: '12px 22px',
            borderRadius: '12px',
            border: '1px solid #39ff14',
            cursor: 'pointer',
            background: '#0b1220',
            color: '#39ff14',
            fontWeight: 'bold',
            boxShadow: '0 0 12px rgba(57, 255, 20, 0.45)',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default MinesweeperPage;