import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GAME_WIDTH = 900;
const GROUND_Y = 260;
const DINO_SIZE = 44;
const GRAVITY = 0.9;
const JUMP_VELOCITY = -14;
const INITIAL_SPEED = 6;

type Obstacle = {
  id: number;
  x: number;
  width: number;
  height: number;
};

function DinorunPage() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef(0);
  const obstacleIdRef = useRef(1);

  const isJumping = dinoY > 0;

  const dinoLeft = 90;
  const dinoBottom = 58 + dinoY;

  const startGame = () => {
    setIsRunning(true);
    setIsGameOver(false);
    setScore(0);
    setDinoY(0);
    setVelocityY(0);
    setObstacles([]);
    setSpeed(INITIAL_SPEED);
    spawnTimerRef.current = 0;
  };

  const endGame = () => {
    setIsRunning(false);
    setIsGameOver(true);
    setBestScore((prev) => Math.max(prev, score));
  };

  const jump = () => {
    if (!isRunning) {
      startGame();
      setVelocityY(JUMP_VELOCITY);
      return;
    }

    if (!isJumping && !isGameOver) {
      setVelocityY(JUMP_VELOCITY);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'KeyW'
      ) {
        e.preventDefault();
        jump();
      }

      if (e.code === 'Enter' && isGameOver) {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isRunning, isJumping]);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      setScore((prev) => prev + delta);
      setSpeed((prev) => Math.min(prev + 0.0025 * delta, 16));

      setDinoY((prevY) => {
        const nextVelocity = velocityY + GRAVITY * delta;
        let nextY = prevY - nextVelocity * delta;

        if (nextY < 0) nextY = 0;

        setVelocityY(nextY === 0 && nextVelocity > 0 ? 0 : nextVelocity);
        return nextY;
      });

        spawnTimerRef.current += delta;

        // bigger base spacing
        const baseSpacing = 70;

        // slow scaling (not too aggressive)
        const speedFactor = Math.max(1 - speed * 0.02, 0.6);

        // randomness so it doesn’t feel robotic
        const randomFactor = 0.7 + Math.random() * 0.8;

        // final threshold
        const spawnThreshold = baseSpacing * speedFactor * randomFactor;

        if (spawnTimerRef.current >= spawnThreshold) {
          spawnTimerRef.current = 0;

          const height = 35 + Math.floor(Math.random() * 40);
          const width = 18 + Math.floor(Math.random() * 18);

          const newObstacle = {
            id: obstacleIdRef.current++,
            x: GAME_WIDTH + 20,
            width,
            height,
          };

        setObstacles((prev) => {
          // 20% chance to spawn a second close obstacle (challenge moment)
          if (Math.random() < 0.2) {
          return [
          ...prev,
          newObstacle,
          {
            id: obstacleIdRef.current++,
            x: GAME_WIDTH + 20 + width + 20, // small gap
            width,
            height,
          },
        ];
      }

      return [...prev, newObstacle];
    });
  }


      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - speed * delta }))
          .filter((obs) => obs.x + obs.width > -20)
      );

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, speed, velocityY]);

  useEffect(() => {
    if (!isRunning) return;

    const dinoBox = {
      left: dinoLeft,
      right: dinoLeft + DINO_SIZE,
      top: GROUND_Y - dinoBottom - DINO_SIZE,
      bottom: GROUND_Y - dinoBottom,
    };

    for (const obs of obstacles) {
      const obstacleGround = 58;

      const obstacleBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: GROUND_Y - obstacleGround - obs.height,
        bottom: GROUND_Y - obstacleGround,
      };
      const hit =
        dinoBox.right > obstacleBox.left &&
        dinoBox.left < obstacleBox.right &&
        dinoBox.bottom > obstacleBox.top &&
        dinoBox.top < obstacleBox.bottom;

      if (hit) {
        endGame();
        break;
      }
    }
  }, [obstacles, dinoBottom, isRunning, score]);

  const displayScore = useMemo(() => Math.floor(score), [score]);

  return (
  <div
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(...)',
      padding: '32px 20px',
      boxSizing: 'border-box',
    }}
  >
    <button
      onClick={() => navigate('/')}
      className="buttons"
    >
      Back
    </button>

      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Dino Run</h1>
            <p style={{ margin: '8px 0 0', color: '#444' }}>
              Press Space, W, or Up Arrow to jump.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #ddd',
                fontWeight: 700,
              }}
            >
              Score: {displayScore}
            </div>

            <div
              style={{
                background: '#fff',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #ddd',
                fontWeight: 700,
              }}
            >
              Best: {bestScore}
            </div>

            <button
              type="button"
              onClick={startGame}
              style={{
                border: 'none',
                borderRadius: '12px',
                padding: '12px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                background: '#111',
                color: '#fff',
              }}
            >
              {isGameOver ? 'Restart' : isRunning ? 'New Run' : 'Start Game'}
            </button>
          </div>
        </div>

        <div
          onClick={jump}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
              e.preventDefault();
              jump();
            }
          }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: `${GAME_WIDTH}px`,
            height: '320px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid #1d1d1d',
            background:
              'linear-gradient(to bottom, #c8efff 0%, #dff6ff 60%, #fefefe 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            outline: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              background: 'rgba(255,255,255,0.9)',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            Click game area or press Space to jump
          </div>

          {[120, 300, 520].map((x, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${40 + i * 10}px`,
                width: '70px',
                height: '24px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.9)',
                filter: 'blur(0.3px)',
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '58px',
              height: '2px',
              background:
                'repeating-linear-gradient(to right, #444 0 24px, transparent 24px 38px)',
              opacity: 0.45,
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: `${dinoLeft}px`,
              bottom: `${dinoBottom}px`,
              width: `${DINO_SIZE}px`,
              height: `${DINO_SIZE}px`,
              background: isGameOver ? '#c0392b' : '#222',
              borderRadius: '8px',
              transition: 'background 120ms ease',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '6px',
                top: '8px',
                width: '6px',
                height: '6px',
                background: '#fff',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '6px',
                bottom: '-6px',
                width: '8px',
                height: '14px',
                background: '#222',
                borderRadius: '3px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '20px',
                bottom: '-6px',
                width: '8px',
                height: '14px',
                background: '#222',
                borderRadius: '3px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '-10px',
                width: '8px',
                height: '12px',
                background: '#222',
                borderRadius: '4px 4px 0 0',
              }}
            />
          </div>

          {obstacles.map((obs) => (
            <div
              key={obs.id}
              style={{
                position: 'absolute',
                left: `${obs.x}px`,
                bottom: '58px',
                width: `${obs.width}px`,
                height: `${obs.height}px`,
                background: '#2d7a35',
                borderRadius: '6px 6px 0 0',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '-6px',
                  width: '10px',
                  height: '16px',
                  background: '#2d7a35',
                  borderRadius: '5px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '-6px',
                  width: '10px',
                  height: '14px',
                  background: '#2d7a35',
                  borderRadius: '5px',
                }}
              />
            </div>
          ))}

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '58px',
              background: '#e8d3a9',
              borderTop: '2px solid #222',
            }}
          />

          {!isRunning && !isGameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(255,255,255,0.18)',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  padding: '20px 24px',
                  borderRadius: '18px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  maxWidth: '420px',
                }}
              >
                <h2 style={{ marginTop: 0 }}>Ready to run?</h2>
                <p style={{ marginBottom: '14px', color: '#444' }}>
                  Dodge the cacti and survive as long as you can.
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#111',
                    color: '#fff',
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {isGameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(0,0,0,0.18)',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  padding: '24px 28px',
                  borderRadius: '18px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  minWidth: '280px',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '10px' }}>Game Over</h2>
                <p style={{ margin: '6px 0', fontWeight: 700 }}>
                  Score: {displayScore}
                </p>
                <p style={{ margin: '6px 0 18px', color: '#444' }}>
                  Press Enter or click Restart
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#111',
                    color: '#fff',
                  }}
                >
                  Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DinorunPage;