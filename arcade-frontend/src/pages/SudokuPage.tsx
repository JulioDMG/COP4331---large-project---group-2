import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CellPosition = {
  row: number;
  col: number;
};

type Puzzle = {
  puzzle: number[][];
  solution: number[][];
};

const PUZZLES: Puzzle[] = [
  {
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  {
    puzzle: [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0],
    ],
    solution: [
      [1, 2, 3, 6, 7, 8, 9, 4, 5],
      [5, 8, 4, 2, 3, 9, 7, 6, 1],
      [9, 6, 7, 1, 4, 5, 3, 2, 8],
      [3, 7, 2, 4, 6, 1, 5, 8, 9],
      [6, 9, 1, 5, 8, 3, 2, 7, 4],
      [4, 5, 8, 7, 9, 2, 6, 1, 3],
      [8, 3, 6, 9, 2, 4, 1, 5, 7],
      [2, 1, 9, 8, 5, 7, 4, 3, 6],
      [7, 4, 5, 3, 1, 6, 8, 9, 2],
    ],
  },
];

function cloneBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}

function SudokuPage() {
  const navigate = useNavigate();

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = useMemo(() => PUZZLES[puzzleIndex], [puzzleIndex]);

  const [board, setBoard] = useState<number[][]>(cloneBoard(currentPuzzle.puzzle));
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [message, setMessage] = useState('Select a square and enter a number.');

  const initialPuzzle = currentPuzzle.puzzle;
  const solution = currentPuzzle.solution;

  const isFixedCell = (row: number, col: number) => initialPuzzle[row][col] !== 0;

  const isBoardComplete = useMemo(() => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }, [board, solution]);

  const cellHasConflict = (row: number, col: number) => {
    const value = board[row][col];
    if (value === 0) return false;
    return value !== solution[row][col];
  };

  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });

    if (isFixedCell(row, col)) {
      setMessage('That number is locked.');
    } else {
      setMessage('Choose a number or clear the square.');
    }
  };

  const handlePlaceNumber = (num: number) => {
    if (!selectedCell) {
      setMessage('Select a square first.');
      return;
    }

    const { row, col } = selectedCell;

    if (isFixedCell(row, col)) {
      setMessage('That number is locked.');
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = num;
    setBoard(nextBoard);

    if (num === solution[row][col]) {
      setMessage(`Placed ${num}.`);
    } else {
      setMessage(`${num} is not correct for that square.`);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) {
      setMessage('Select a square first.');
      return;
    }

    const { row, col } = selectedCell;

    if (isFixedCell(row, col)) {
      setMessage('That number is locked.');
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = 0;
    setBoard(nextBoard);
    setMessage('Square cleared.');
  };

  const handleReset = () => {
    setBoard(cloneBoard(initialPuzzle));
    setSelectedCell(null);
    setMessage('Puzzle reset.');
  };

  const handleNewPuzzle = () => {
    const nextIndex = (puzzleIndex + 1) % PUZZLES.length;
    setPuzzleIndex(nextIndex);
    setBoard(cloneBoard(PUZZLES[nextIndex].puzzle));
    setSelectedCell(null);
    setMessage('New puzzle loaded.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f4f8ff 0%, #ffffff 100%)',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          type="button"
          className="buttons"
          onClick={() => navigate('/')}
          style={{ marginBottom: '18px' }}
        >
          Back
        </button>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d9e1ee',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            <div>
              <h1 style={{ margin: 0 }}>Sudoku</h1>
              <p style={{ margin: '8px 0 0', color: '#555' }}>
                Fill every row, column, and 3x3 box with numbers 1 through 9.
              </p>
            </div>

            <div
              style={{
                background: isBoardComplete ? '#dff7e8' : '#f5f7fb',
                border: `1px solid ${isBoardComplete ? '#7bc596' : '#d9e1ee'}`,
                borderRadius: '12px',
                padding: '12px 16px',
                fontWeight: 700,
              }}
            >
              {isBoardComplete ? 'Puzzle Complete!' : 'In Progress'}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 540px) minmax(220px, 1fr)',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 1fr)',
                gap: '0',
                width: '100%',
                maxWidth: '540px',
                aspectRatio: '1 / 1',
                border: '3px solid #1f2937',
                background: '#1f2937',
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const isSelected =
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                  const fixed = isFixedCell(rowIndex, colIndex);
                  const conflict = cellHasConflict(rowIndex, colIndex);

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleSelectCell(rowIndex, colIndex)}
                      style={{
                        aspectRatio: '1 / 1',
                        border: '1px solid #b9c4d6',
                        borderTopWidth: rowIndex % 3 === 0 ? '3px' : '1px',
                        borderLeftWidth: colIndex % 3 === 0 ? '3px' : '1px',
                        borderRightWidth: colIndex === 8 ? '3px' : '1px',
                        borderBottomWidth: rowIndex === 8 ? '3px' : '1px',
                        borderColor: '#1f2937',
                        background: isSelected
                          ? '#dbeafe'
                          : fixed
                          ? '#eef2f7'
                          : '#ffffff',
                        color: conflict ? '#c62828' : fixed ? '#111827' : '#2563eb',
                        fontSize: '1.35rem',
                        fontWeight: fixed ? 800 : 700,
                        cursor: 'pointer',
                      }}
                    >
                      {value === 0 ? '' : value}
                    </button>
                  );
                })
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #d9e1ee',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1rem' }}>
                  Controls
                </h2>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className="buttons"
                      onClick={() => handlePlaceNumber(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: '12px',
                  }}
                >
                  <button
                    type="button"
                    className="buttons"
                    onClick={handleClearCell}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    className="buttons"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  className="buttons"
                  onClick={handleNewPuzzle}
                  style={{ marginTop: '12px', width: '100%' }}
                >
                  New Puzzle
                </button>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #d9e1ee',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1rem' }}>
                  Status
                </h2>
                <p style={{ margin: 0, color: '#444', lineHeight: 1.5 }}>
                  {message}
                </p>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #d9e1ee',
                  borderRadius: '14px',
                  padding: '16px',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1rem' }}>
                  How to Play
                </h2>
                <p style={{ margin: 0, color: '#444', lineHeight: 1.6 }}>
                  Click a square, then click a number. Gray squares are locked.
                  Blue numbers are your entries. Red numbers are incorrect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SudokuPage;