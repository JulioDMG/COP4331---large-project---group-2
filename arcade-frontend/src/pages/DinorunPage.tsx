import { useEffect, useMemo, useRef, useState, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';

const GAME_WIDTH = 900;
const GROUND_Y = 260;
const DINO_SIZE = 44;
const GRAVITY = 0.7;
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

  // 1. ADD: Score submission logic
  const submitScore = useCallback(async (finalScore: number) => {
    const token = localStorage.getItem('token');
    if (!token || finalScore <= 0) return;

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          game: 'dinorun', 
          value: Math.floor(finalScore) 
        }),
      });
    } catch (err) {
      console.error('Failed to submit Dino Run score:', err);
    }
  }, []);

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

  // 2. UPDATE: endGame now triggers the submission
  const endGame = useCallback(() => {
    setIsRunning(false);
    setIsGameOver(true);
    setBestScore((prev) => Math.max(prev, score));
    submitScore(score); // Trigger API call
  }, [score, submitScore]);

  const jump = () => {
    if (!isRunning) {
      if (!isGameOver) startGame();
      setVelocityY(JUMP_VELOCITY);
      return;
    }
    if (!isJumping && !isGameOver) {
      setVelocityY(JUMP_VELOCITY);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
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
      const baseSpacing = 70;
      const speedFactor = Math.max(1 - speed * 0.02, 0.6);
      const randomFactor = 0.7 + Math.random() * 0.8;
      const spawnThreshold = baseSpacing * speedFactor * randomFactor;

      if (spawnTimerRef.current >= spawnThreshold) {
        spawnTimerRef.current = 0;
        const height = 35 + Math.floor(Math.random() * 40);
        const width = 18 + Math.floor(Math.random() * 18);
        const newObstacle = { id: obstacleIdRef.current++, x: GAME_WIDTH + 20, width, height };

        setObstacles((prev) => {
          if (Math.random() < 0.2) {
            return [...prev, newObstacle, { id: obstacleIdRef.current++, x: GAME_WIDTH + 20 + width + 20, width, height }];
          }
          return [...prev, newObstacle];
        });
      }

      setObstacles((prev) =>
        prev.map((obs) => ({ ...obs, x: obs.x - speed * delta })).filter((obs) => obs.x + obs.width > -20)
      );

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
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
      if (hit) { endGame(); break; }
    }
  }, [obstacles, dinoBottom, isRunning, endGame]); // Added endGame to deps

  const displayScore = useMemo(() => Math.floor(score), [score]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #1a0005 0%, #0d0002 50%, #050001 100%)',
        color: '#f8fafc',
        padding: '24px 16px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Back Button */}
      <div style={{ width: '100%', maxWidth: '980px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            marginBottom: '18px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #dc143c',
            cursor: 'pointer',
            background: '#0d0002',
            color: '#dc143c',
            boxShadow: '0 0 12px rgba(220, 20, 60, 0.6)',
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
          maxWidth: '980px',
          background: 'rgba(10, 0, 2, 0.9)',
          border: '2px solid #dc143c',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 0 20px rgba(220, 20, 60, 0.4), 0 0 50px rgba(220, 20, 60, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2.4rem',
              letterSpacing: '4px',
              color: '#fff0f2',
              textShadow: '0 0 10px #dc143c, 0 0 24px #dc143c',
            }}>
              DINO RUN
            </h1>
            <p style={{ margin: '6px 0 0', color: '#a3a3a3', fontSize: '0.9rem' }}>
              Press <strong style={{ color: '#dc143c' }}>Space</strong>,{' '}
              <strong style={{ color: '#dc143c' }}>W</strong>, or{' '}
              <strong style={{ color: '#dc143c' }}>↑</strong> to jump.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #dc143c',
              background: 'rgba(220, 20, 60, 0.08)',
              fontWeight: 700,
              color: '#dc143c',
              boxShadow: '0 0 8px rgba(220,20,60,0.3)',
            }}>
              Score: {displayScore}
            </div>
            <div style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #fbbf24',
              background: 'rgba(251, 191, 36, 0.06)',
              fontWeight: 700,
              color: '#fbbf24',
              boxShadow: '0 0 8px rgba(251,191,36,0.3)',
            }}>
              Best: {bestScore}
            </div>
            <button
              type="button"
              onClick={startGame}
              style={{
                borderRadius: '12px',
                padding: '10px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                background: '#0d0002',
                color: '#dc143c',
                border: '1px solid #dc143c',
                boxShadow: '0 0 10px rgba(220,20,60,0.5)',
                letterSpacing: '1px',
              }}
            >
              {isGameOver ? 'Restart' : isRunning ? 'New Run' : 'Start Game'}
            </button>
          </div>
        </div>

        {/* Game Area */}
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
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #dc143c',
            background: 'linear-gradient(to bottom, #0d0002 0%, #150005 60%, #1a0008 100%)',
            boxShadow: 'inset 0 0 30px rgba(220, 20, 60, 0.05), 0 0 18px rgba(220,20,60,0.2)',
            cursor: 'pointer',
            outline: 'none',
            userSelect: 'none',
          }}
        >
          {/* Hint label */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: 'rgba(220, 20, 60, 0.08)',
            border: '1px solid rgba(220,20,60,0.35)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#dc143c',
          }}>
            Click or press Space to jump
          </div>

          {/* Decorative stars */}
          {[60, 180, 340, 520, 700, 820].map((x, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${20 + (i % 3) * 18}px`,
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: '#dc143c',
              opacity: 0.35,
              boxShadow: '0 0 4px #dc143c',
            }} />
          ))}

          {/* Ground dashes */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '58px',
            height: '2px',
            background: 'repeating-linear-gradient(to right, #dc143c 0 24px, transparent 24px 38px)',
            opacity: 0.25,
          }} />

          {/* Dino */}
          <div style={{
            position: 'absolute',
            left: `${dinoLeft}px`,
            bottom: `${dinoBottom}px`,
            width: `${DINO_SIZE}px`,
            height: `${DINO_SIZE}px`,
            background: isGameOver ? '#555' : '#dc143c',
            borderRadius: '8px',
            boxShadow: isGameOver ? '0 0 8px rgba(100,100,100,0.5)' : '0 0 14px rgba(220,20,60,0.9)',
            transition: 'background 120ms ease, box-shadow 120ms ease',
          }}>
            {/* Eye */}
            <div style={{
              position: 'absolute',
              right: '6px',
              top: '8px',
              width: '6px',
              height: '6px',
              background: '#0d0002',
              borderRadius: '50%',
            }} />
            {/* Legs */}
            <div style={{ position: 'absolute', left: '6px', bottom: '-6px', width: '8px', height: '14px', background: isGameOver ? '#555' : '#dc143c', borderRadius: '3px', boxShadow: isGameOver ? 'none' : '0 0 6px rgba(220,20,60,0.7)' }} />
            <div style={{ position: 'absolute', left: '20px', bottom: '-6px', width: '8px', height: '14px', background: isGameOver ? '#555' : '#dc143c', borderRadius: '3px', boxShadow: isGameOver ? 'none' : '0 0 6px rgba(220,20,60,0.7)' }} />
            {/* Horn */}
            <div style={{ position: 'absolute', left: '7px', top: '-10px', width: '8px', height: '12px', background: isGameOver ? '#555' : '#dc143c', borderRadius: '4px 4px 0 0' }} />
          </div>

          {/* Obstacles */}
          {obstacles.map((obs) => (
            <div key={obs.id} style={{
              position: 'absolute',
              left: `${obs.x}px`,
              bottom: '58px',
              width: `${obs.width}px`,
              height: `${obs.height}px`,
              background: '#ff6b6b',
              borderRadius: '6px 6px 0 0',
              boxShadow: '0 0 10px rgba(255, 107, 107, 0.6)',
            }}>
              <div style={{ position: 'absolute', top: '10px', left: '-6px', width: '10px', height: '16px', background: '#ff6b6b', borderRadius: '5px', boxShadow: '0 0 6px rgba(255,107,107,0.5)' }} />
              <div style={{ position: 'absolute', top: '18px', right: '-6px', width: '10px', height: '14px', background: '#ff6b6b', borderRadius: '5px', boxShadow: '0 0 6px rgba(255,107,107,0.5)' }} />
            </div>
          ))}

          {/* Ground */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '58px',
            background: 'linear-gradient(to bottom, #1a0008, #0d0004)',
            borderTop: '2px solid #dc143c',
            boxShadow: '0 -4px 16px rgba(220,20,60,0.2)',
          }} />

          {/* Start overlay */}
          {!isRunning && !isGameOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.55)',
            }}>
              <div style={{
                background: 'rgba(10, 0, 2, 0.96)',
                border: '2px solid #dc143c',
                borderRadius: '18px',
                padding: '24px 32px',
                textAlign: 'center',
                boxShadow: '0 0 24px rgba(220,20,60,0.5)',
              }}>
                <h2 style={{ marginTop: 0, color: '#dc143c', textShadow: '0 0 12px #dc143c', letterSpacing: '2px' }}>
                  READY TO RUN?
                </h2>
                <p style={{ color: '#a3a3a3', marginBottom: '18px' }}>
                  Dodge the obstacles and survive as long as you can.
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#0d0002',
                    color: '#dc143c',
                    border: '1px solid #dc143c',
                    boxShadow: '0 0 12px rgba(220,20,60,0.6)',
                    fontSize: '1rem',
                    letterSpacing: '1px',
                  }}
                >
                  START
                </button>
              </div>
            </div>
          )}

          {/* Game Over overlay */}
          {isGameOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.65)',
            }}>
              <div style={{
                background: 'rgba(10, 0, 2, 0.97)',
                border: '2px solid #dc143c',
                borderRadius: '18px',
                padding: '24px 32px',
                textAlign: 'center',
                boxShadow: '0 0 24px rgba(220,20,60,0.6)',
                minWidth: '280px',
              }}>
                <h2 style={{ marginTop: 0, color: '#dc143c', textShadow: '0 0 12px #dc143c', letterSpacing: '2px' }}>
                  ✗ GAME OVER
                </h2>
                <p style={{ margin: '6px 0', fontWeight: 700, color: '#fbbf24' }}>
                  Score: {displayScore}
                </p>
                <p style={{ margin: '6px 0 18px', color: '#a3a3a3', fontSize: '0.9rem' }}>
                  Press Enter or click Restart
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#0d0002',
                    color: '#dc143c',
                    border: '1px solid #dc143c',
                    boxShadow: '0 0 12px rgba(220,20,60,0.6)',
                    fontSize: '1rem',
                    letterSpacing: '1px',
                  }}
                >
                  RESTART
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