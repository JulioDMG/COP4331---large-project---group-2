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
    return cell.isFlagged ? '#777' : '#555';
  }

  if (cell.isMine) return '#dc2626';
  return '#d1d5db';
}

function getNumberColor(count: number): string {
  switch (count) {
    case 1:
      return '#2563eb';
    case 2:
      return '#16a34a';
    case 3:
      return '#dc2626';
    case 4:
      return '#7c3aed';
    case 5:
      return '#b45309';
    case 6:
      return '#0891b2';
    case 7:
      return '#111827';
    case 8:
      return '#6b7280';
    default:
      return '#111827';
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

      <h1>Minesweeper</h1>
      <p>Left click to reveal • Right click to flag</p>
      <p>Flags left: {flagsLeft}</p>

      {!gameStarted && !gameOver && !won && <p>Click any square to start</p>}
      {gameOver && <h2 style={{ color: '#ef4444' }}>Game Over</h2>}
      {won && <h2 style={{ color: '#22c55e' }}>You Win!</h2>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 40px)`,
          gridTemplateRows: `repeat(${ROWS}, 40px)`,
          gap: '3px',
          backgroundColor: '#333',
          padding: '10px',
          borderRadius: '8px',
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
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: getCellColor(cell),
                color: cell.isRevealed && !cell.isMine
                  ? getNumberColor(cell.neighborMines)
                  : '#111827',
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

export default MinesweeperPage;