import { useEffect, useState } from 'react';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_FOOD = { x: 10, y: 10 };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = { x: number; y: number };

function SnakePage() {
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
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );

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
      if (!isStarted) setIsStarted(true);

      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
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
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
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
        backgroundColor: '#111',
        color: 'white',
        padding: '20px',
      }}
    >
      <h1>Snake</h1>
      <p>Score: {score}</p>
      <p>Use arrow keys to move</p>

      {!isStarted && !isGameOver && <p>Press an arrow key to start</p>}
      {isGameOver && <p>Game Over</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 25px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 25px)`,
          gap: '2px',
          backgroundColor: '#333',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isFood = food.x === x && food.y === y;

          let backgroundColor = '#1f1f1f';
          if (isSnake) backgroundColor = '#22c55e';
          if (isFood) backgroundColor = '#ef4444';

          return (
            <div
              key={index}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor,
                borderRadius: '4px',
              }}
            />
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

export default SnakePage;