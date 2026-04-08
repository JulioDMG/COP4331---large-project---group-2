import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_FOOD = { x: 10, y: 10 };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = { x: number; y: number };

function SnakePage() {
  const navigate = useNavigate();

  const [snake, setSnake] = useState<Cell[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Cell>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);

  const getRandomFood = (currentSnake: Cell[]) => {
    let newFood: Cell;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setIsGameOver(false);
    setIsStarted(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling on WASD
      if (['w', 'a', 's', 'd'].includes(e.key)) e.preventDefault();

      if (!isStarted && ['w', 'a', 's', 'd'].includes(e.key)) setIsStarted(true);

      if (e.key === 'w' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 's' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'a' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'd' && direction !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isStarted]);

  useEffect(() => {
    if (!isStarted || isGameOver) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead = { ...head };

        if (direction === 'UP') newHead.y -= 1;
        if (direction === 'DOWN') newHead.y += 1;
        if (direction === 'LEFT') newHead.x -= 1;
        if (direction === 'RIGHT') newHead.x += 1;

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore((prev) => prev + 1);
          return newSnake;
        }
        newSnake.pop();
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [direction, food, isStarted, isGameOver]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at bottom, #0d1f0d 0%, #050d05 50%, #020202 100%)',
        color: '#f8fafc',
        padding: '20px',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 18px',
          borderRadius: '10px',
          border: '1px solid #39ff14',
          cursor: 'pointer',
          background: '#050d05',
          color: '#39ff14',
          boxShadow: '0 0 12px rgba(57, 255, 20, 0.6)',
          fontWeight: 'bold',
        }}
      >
        ← Back
      </button>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center',
          background: 'rgba(4, 10, 4, 0.85)',
          border: '2px solid #39ff14',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 0 20px rgba(57, 255, 20, 0.4), 0 0 40px rgba(57, 255, 20, 0.1)',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '2.4rem',
            letterSpacing: '4px',
            color: '#f3f0f0',
            textShadow: '0 0 10px #39ff14, 0 0 24px #39ff14',
          }}
        >
          SNAKE
        </h1>

        <p style={{ color: '#a3a3a3', marginBottom: '4px', fontSize: '0.9rem' }}>
          Use <strong style={{ color: '#39ff14' }}>W A S D</strong> to move
        </p>
        <p style={{ color: '#facc15', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>
          Score: {score}
        </p>

        {!isStarted && !isGameOver && (
          <p style={{ color: '#00f7ff', marginBottom: '16px', fontSize: '0.95rem' }}>
            Press W / A / S / D to start
          </p>
        )}
        {isGameOver && (
          <h2 style={{ color: '#ff2e63', textShadow: '0 0 12px #ff2e63', marginBottom: '12px' }}>
            ✗ Game Over
          </h2>
        )}

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 28px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 28px)`,
            gap: '3px',
            justifyContent: 'center',
            background: '#020602',
            padding: '14px',
            borderRadius: '16px',
            border: '2px solid #39ff14',
            boxShadow: 'inset 0 0 20px rgba(57, 255, 20, 0.08), 0 0 18px rgba(57, 255, 20, 0.2)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let backgroundColor = '#0a150a';
            let boxShadow = 'none';
            let borderColor = '#1a2a1a';

            if (isHead) {
              backgroundColor = '#facc15';
              boxShadow = '0 0 10px rgba(250, 204, 21, 0.9)';
              borderColor = '#facc15';
            } else if (isSnake) {
              backgroundColor = '#39ff14';
              boxShadow = '0 0 6px rgba(57, 255, 20, 0.7)';
              borderColor = '#39ff14';
            } else if (isFood) {
              backgroundColor = '#ff2e63';
              boxShadow = '0 0 10px rgba(255, 46, 99, 0.9)';
              borderColor = '#ff2e63';
            }

            return (
              <div
                key={index}
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor,
                  borderRadius: '4px',
                  border: `1px solid ${borderColor}`,
                  boxShadow,
                  transition: '0.05s ease',
                }}
              />
            );
          })}
        </div>

        {/* Restart Button */}
        <button
          type="button"
          onClick={resetGame}
          style={{
            marginTop: '22px',
            padding: '12px 28px',
            borderRadius: '12px',
            border: '1px solid #ff2e63',
            cursor: 'pointer',
            background: '#0a0005',
            color: '#ff2e63',
            fontWeight: 'bold',
            fontSize: '1rem',
            letterSpacing: '1px',
            boxShadow: '0 0 12px rgba(255, 46, 99, 0.5)',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default SnakePage;