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
    for (let row = 0; row < 9; row++)
      for (let col = 0; col < 9; col++)
        if (board[row][col] !== solution[row][col]) return false;
    return true;
  }, [board, solution]);

  const cellHasConflict = (row: number, col: number) => {
    const value = board[row][col];
    if (value === 0) return false;
    return value !== solution[row][col];
  };

  const handleSelectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setMessage(isFixedCell(row, col) ? 'That number is locked.' : 'Choose a number or clear the square.');
  };

  const handlePlaceNumber = (num: number) => {
    if (!selectedCell) { setMessage('Select a square first.'); return; }
    const { row, col } = selectedCell;
    if (isFixedCell(row, col)) { setMessage('That number is locked.'); return; }
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = num;
    setBoard(nextBoard);
    setMessage(num === solution[row][col] ? `Placed ${num}.` : `${num} is not correct for that square.`);
  };

  const handleClearCell = () => {
    if (!selectedCell) { setMessage('Select a square first.'); return; }
    const { row, col } = selectedCell;
    if (isFixedCell(row, col)) { setMessage('That number is locked.'); return; }
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

  const neonBtn: React.CSSProperties = {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #f97316',
    cursor: 'pointer',
    background: '#160800',
    color: '#f97316',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
    transition: '0.15s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #1f0a00 0%, #0f0500 50%, #020100 100%)',
        color: '#f8fafc',
        padding: '24px 16px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Back Button */}
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginBottom: '18px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #fbbf24',
            cursor: 'pointer',
            background: '#0f0500',
            color: '#fbbf24',
            boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)',
            fontWeight: 'bold',
          }}
        >
          ← Back
        </button>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          background: 'rgba(15, 5, 0, 0.88)',
          border: '2px solid #f97316',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 50px rgba(249, 115, 22, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2.4rem',
              letterSpacing: '4px',
              color: '#fff7ed',
              textShadow: '0 0 10px #f97316, 0 0 24px #fb923c',
            }}>
              SUDOKU
            </h1>
            <p style={{ margin: '6px 0 0', color: '#a3a3a3', fontSize: '0.9rem' }}>
              Fill every row, column, and 3×3 box with numbers 1–9.
            </p>
          </div>

          <div style={{
            background: isBoardComplete ? 'rgba(57, 255, 20, 0.1)' : 'rgba(249, 115, 22, 0.1)',
            border: `1px solid ${isBoardComplete ? '#39ff14' : '#f97316'}`,
            borderRadius: '12px',
            padding: '10px 18px',
            fontWeight: 700,
            color: isBoardComplete ? '#39ff14' : '#f97316',
            boxShadow: isBoardComplete ? '0 0 10px rgba(57,255,20,0.4)' : '0 0 10px rgba(249,115,22,0.3)',
            fontSize: '0.95rem',
          }}>
            {isBoardComplete ? '✓ Puzzle Complete!' : '● In Progress'}
          </div>
        </div>

        {/* Grid + Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 500px) minmax(200px, 1fr)', gap: '24px', alignItems: 'start' }}>

          {/* Sudoku Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '0',
              width: '100%',
              aspectRatio: '1 / 1',
              border: '3px solid #f97316',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.5), inset 0 0 20px rgba(249, 115, 22, 0.04)',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((value, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const fixed = isFixedCell(rowIndex, colIndex);
                const conflict = cellHasConflict(rowIndex, colIndex);

                let bg = '#0f0400';
                if (isSelected) bg = '#2d1000';
                else if (fixed) bg = '#1a0a00';

                let color = '#f97316';
                if (fixed) color = '#fed7aa';
                if (conflict) color = '#ff2e63';
                if (isSelected && !fixed) color = '#fbbf24';

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => handleSelectCell(rowIndex, colIndex)}
                    style={{
                      aspectRatio: '1 / 1',
                      border: '1px solid #2a1200',
                      borderTopWidth: rowIndex % 3 === 0 ? '2px' : '1px',
                      borderLeftWidth: colIndex % 3 === 0 ? '2px' : '1px',
                      borderRightWidth: colIndex === 8 ? '2px' : '1px',
                      borderBottomWidth: rowIndex === 8 ? '2px' : '1px',
                      borderColor: (rowIndex % 3 === 0 || colIndex % 3 === 0) ? '#f97316' : '#3a1a00',
                      background: bg,
                      color,
                      fontSize: '1.2rem',
                      fontWeight: fixed ? 800 : 700,
                      cursor: 'pointer',
                      textShadow: conflict
                        ? '0 0 6px #ff2e63'
                        : isSelected
                        ? '0 0 8px #fbbf24'
                        : fixed
                        ? 'none'
                        : '0 0 4px #f97316',
                      transition: '0.1s ease',
                    }}
                  >
                    {value === 0 ? '' : value}
                  </button>
                );
              })
            )}
          </div>

          {/* Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Number Buttons */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.05)',
              border: '1px solid #f97316',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.2)',
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', color: '#f97316', letterSpacing: '2px', textShadow: '0 0 6px #f97316' }}>
                CONTROLS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button key={num} type="button" onClick={() => handlePlaceNumber(num)} style={neonBtn}>
                    {num}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={handleClearCell} style={{ ...neonBtn, borderColor: '#fbbf24', color: '#fbbf24', boxShadow: '0 0 8px rgba(251,191,36,0.4)' }}>
                  Clear
                </button>
                <button type="button" onClick={handleReset} style={{ ...neonBtn, borderColor: '#fbbf24', color: '#fbbf24', boxShadow: '0 0 8px rgba(251,191,36,0.4)' }}>
                  Reset
                </button>
              </div>
              <button type="button" onClick={handleNewPuzzle} style={{ ...neonBtn, marginTop: '10px', width: '100%', borderColor: '#ff2e63', color: '#ff2e63', boxShadow: '0 0 8px rgba(255,46,99,0.4)' }}>
                New Puzzle
              </button>
            </div>

            {/* Status */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.05)',
              border: '1px solid #f97316',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.2)',
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1rem', color: '#f97316', letterSpacing: '2px', textShadow: '0 0 6px #f97316' }}>
                STATUS
              </h2>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>{message}</p>
            </div>

            {/* How to Play */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.05)',
              border: '1px solid #f97316',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.2)',
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1rem', color: '#f97316', letterSpacing: '2px', textShadow: '0 0 6px #f97316' }}>
                HOW TO PLAY
              </h2>
              <p style={{ margin: 0, color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>
                Click a square, then click a number.<br />
                <span style={{ color: '#fed7aa' }}>Cream</span> = locked.{' '}
                <span style={{ color: '#f97316' }}>Orange</span> = your entry.{' '}
                <span style={{ color: '#ff2e63' }}>Red</span> = incorrect.{' '}
                <span style={{ color: '#fbbf24' }}>Amber</span> = selected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SudokuPage;