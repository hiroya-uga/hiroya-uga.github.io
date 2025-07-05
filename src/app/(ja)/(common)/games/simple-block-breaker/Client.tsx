'use client';

import { RunButton } from '@/components/Clickable';
import { Toast } from '@/components/Dialog';
import { Switch } from '@/components/Form';
import clsx from 'clsx';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

type Block = {
  x: number;
  y: number;
  w: number;
  h: number;
  broken: boolean;
};

const getBlockSetting = ({
  canvasWidth,
  rows,
  cols,
  gap,
  blockHeight,
}: {
  canvasWidth: number;
  rows: number;
  cols: number;
  gap: number;
  blockHeight: number;
}) => {
  const blockWidth = (canvasWidth - gap * (cols + 1)) / cols;
  return {
    rows,
    cols,
    gap,
    blockWidth,
    blockHeight,
  };
};

const DEFAULT_BLOCK_SETTING = {
  rows: 10,
  cols: 10,
  gap: 8,
  blockHeight: 20,
};
const DEFAULT_PADDLE_WIDTH = 160;
const DEFAULT_PADDLE_HEIGHT = 20;
const DEFAULT_PADDLE_POSITION_Y = 30;
const DEFAULT_BALL_RADIUS = 12;
const DEFAULT_BALL_SPEED = 6;
const DEFAULT_BALL_ACCELERATION = 0;

export const SimpleBlockBreaker = ({ width, height }: { width: number; height: number }) => {
  const id = useId();
  const [toastMessage, setToastMessage] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const requestRef = useRef(-1);
  const blockSettingRef = useRef(
    getBlockSetting({
      canvasWidth: width,
      ...DEFAULT_BLOCK_SETTING,
    }),
  );
  const [running, setRunning] = useState(false);
  const cursorHiddenSetTimeoutId = useRef<number>(-1);
  const [cursorHidden, setCursorHidden] = useState(false);

  // Game state refs
  const paddle = useRef({
    x: width / 2 - DEFAULT_PADDLE_WIDTH / 2,
    y: height - DEFAULT_PADDLE_POSITION_Y,
    width: DEFAULT_PADDLE_WIDTH,
    height: DEFAULT_PADDLE_HEIGHT,
  });
  const ball = useRef({
    x: width / 2,
    y: height - DEFAULT_BALL_RADIUS - DEFAULT_PADDLE_HEIGHT - DEFAULT_PADDLE_POSITION_Y,
    radius: DEFAULT_BALL_RADIUS,
    speedX: DEFAULT_BALL_SPEED,
    speedY: DEFAULT_BALL_SPEED * -1,
    defaultSpeedX: DEFAULT_BALL_SPEED,
    defaultSpeedY: DEFAULT_BALL_SPEED * -1,
    acceleration: DEFAULT_BALL_ACCELERATION,
    mode: {
      passThrough: false,
    },
  });
  const blocks = useRef<Block[]>([]);

  const initBlocks = useCallback(() => {
    const { rows, cols, gap, blockWidth, blockHeight } = blockSettingRef.current;
    const arr: Block[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        arr.push({
          x: gap + col * (blockWidth + gap),
          y: gap + row * (blockHeight + gap),
          w: blockWidth,
          h: blockHeight,
          broken: false,
        });
      }
    }
    blocks.current = arr;
  }, []);

  const reset = useCallback(() => {
    paddle.current.x = width / 2 - paddle.current.width / 2;
    ball.current.x = width / 2;
    ball.current.y = height - ball.current.radius - paddle.current.height - DEFAULT_PADDLE_POSITION_Y;
    ball.current.speedX = ball.current.defaultSpeedX;
    ball.current.speedY = ball.current.defaultSpeedY;
    initBlocks();
    setRunning(true);
  }, [height, initBlocks, width]);

  // マウス操作
  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas instanceof HTMLCanvasElement === false) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      paddle.current.x = x - paddle.current.width / 2;
    };
    window.addEventListener('mousemove', onmousemove);
    return () => window.removeEventListener('mousemove', onmousemove);
  }, []);

  // タッチ操作
  useEffect(() => {
    const ontouchmove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (canvas instanceof HTMLCanvasElement === false) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const x = (e.touches[0].clientX - rect.left) * scaleX;
      paddle.current.x = x - paddle.current.width / 2;
    };
    window.addEventListener('touchmove', ontouchmove);
    return () => window.removeEventListener('touchmove', ontouchmove);
  }, []);

  // キーボード操作
  useEffect(() => {
    let direction: 'none' | 'left' | 'right' = 'none';
    let moveAnimationFrameId = -1;
    const baseSpeed = 8;
    const boostedSpeed = 16;

    const move = (dir: 'left' | 'right') => {
      const canvas = canvasRef.current;
      if (canvas instanceof HTMLCanvasElement === false) {
        return;
      }

      const speed = keysPressed.has('Shift') ? boostedSpeed : baseSpeed;

      if (dir === 'left') {
        paddle.current.x -= speed;
        if (paddle.current.x < 0) {
          paddle.current.x = 0;
        }
      } else if (dir === 'right') {
        paddle.current.x += speed;
        if (paddle.current.x + paddle.current.width > width) {
          paddle.current.x = width - paddle.current.width;
        }
      }

      if (direction === dir) {
        moveAnimationFrameId = requestAnimationFrame(() => move(dir));
      }
    };

    const keysPressed = new Set<string>();

    const onkeydown = (e: KeyboardEvent) => {
      keysPressed.add(e.key);

      const leftKeys = ['ArrowLeft', 'a', 'A'];
      const rightKeys = ['ArrowRight', 'd', 'D'];

      if (leftKeys.includes(e.key)) {
        if (direction !== 'left') {
          direction = 'left';
          cancelAnimationFrame(moveAnimationFrameId);
          move('left');
        }
      } else if (rightKeys.includes(e.key)) {
        if (direction !== 'right') {
          direction = 'right';
          cancelAnimationFrame(moveAnimationFrameId);
          move('right');
        }
      }
    };

    const onkeyup = (e: KeyboardEvent) => {
      keysPressed.delete(e.key);

      const isLeftKey = ['ArrowLeft', 'a', 'A'].includes(e.key);
      const isRightKey = ['ArrowRight', 'd', 'D'].includes(e.key);

      if ((direction === 'left' && isLeftKey) || (direction === 'right' && isRightKey)) {
        direction = 'none';
        cancelAnimationFrame(moveAnimationFrameId);
      }
    };

    window.addEventListener('keydown', onkeydown);
    window.addEventListener('keyup', onkeyup);

    return () => {
      direction = 'none';
      keysPressed.clear();
      cancelAnimationFrame(moveAnimationFrameId);
      window.removeEventListener('keydown', onkeydown);
      window.removeEventListener('keyup', onkeyup);
    };
  }, [width]);

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw paddle
      ctx.fillStyle = '#fff';
      ctx.fillRect(paddle.current.x, paddle.current.y, paddle.current.width, paddle.current.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.current.mode.passThrough ? 'orange' : '#facc15';
      ctx.fill();
      ctx.closePath();

      // Draw blocks
      ctx.fillStyle = '#38bdf8';
      blocks.current.forEach(({ x, y, w, h, broken }) => {
        if (broken === false) {
          ctx.fillRect(x, y, w, h);
        }
      });
    };

    const collision = () => {
      // Wall
      if (ball.current.x + ball.current.radius > width || ball.current.x - ball.current.radius < 0) {
        ball.current.speedX *= -1;
      }
      if (ball.current.y - ball.current.radius < 0) {
        ball.current.speedY *= -1;
      }

      // Paddle
      if (
        ball.current.y + ball.current.radius >= paddle.current.y &&
        ball.current.x >= paddle.current.x &&
        ball.current.x <= paddle.current.x + paddle.current.width
      ) {
        ball.current.speedY *= -1;
        // tweak angle based on where hit
        const hitPos = (ball.current.x - paddle.current.x) / paddle.current.width - 0.5;
        ball.current.speedX = ball.current.radius * hitPos;
      }

      // Blocks
      blocks.current.forEach((block) => {
        if (block.broken) {
          return;
        }
        // if (
        //   ball.current.x > block.x &&
        //   ball.current.x < block.x + block.w &&
        //   ball.current.y - ball.current.radius < block.y + block.h &&
        //   ball.current.y + ball.current.radius > block.y
        // ) {
        // if (
        //   ball.current.x + ball.current.radius > block.x &&
        //   ball.current.x - ball.current.radius < block.x + block.w &&
        //   ball.current.y + ball.current.radius > block.y &&
        //   ball.current.y - ball.current.radius < block.y + block.h
        // ) {

        const closestX = Math.max(block.x, Math.min(ball.current.x, block.x + block.w));
        const closestY = Math.max(block.y, Math.min(ball.current.y, block.y + block.h));

        const dx = ball.current.x - closestX;
        const dy = ball.current.y - closestY;

        if (dx * dx + dy * dy < ball.current.radius * ball.current.radius) {
          if (ball.current.mode.passThrough === false) {
            ball.current.speedY *= -1;
          }
          block.broken = true;
          if (ball.current.speedY < 0) {
            ball.current.speedY -= ball.current.acceleration;
          } else {
            ball.current.speedY += ball.current.acceleration;
          }
        }
      });
    };

    const update = () => {
      ball.current.x += ball.current.speedX;
      ball.current.y += ball.current.speedY;

      collision();

      // GameOver
      if (ball.current.y - ball.current.radius > height) {
        setRunning(false);
        cancelAnimationFrame(requestRef.current!);
        requestAnimationFrame(() => {
          startButton.current?.focus();
        });
        setToastMessage('ゲームオーバーですわ😫');
        return;
      }

      // Success
      if (blocks.current.every((b) => b.broken)) {
        setRunning(false);
        cancelAnimationFrame(requestRef.current!);
        requestAnimationFrame(() => {
          startButton.current?.focus();
        });
        setToastMessage('おめでとうございます!!🎉🎉🎉');
        return;
      }
    };

    const loop = () => {
      draw();

      if (running) {
        update();
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestRef.current!);
    };
  }, [width, height, initBlocks, reset, running]);

  useEffect(() => {
    initBlocks();
  }, [initBlocks]);

  return (
    <>
      <div className="touch-pan-y">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={clsx([
            'pointer-coarse:border-b-[4rem] mx-auto size-auto max-h-[80dvh] max-w-[90%] border-2 border-[#a4a4a4]',
            cursorHidden && 'cursor-none',
          ])}
          onMouseMove={() => {
            setCursorHidden(false);
            clearTimeout(cursorHiddenSetTimeoutId.current);
            cursorHiddenSetTimeoutId.current = window.setTimeout(() => {
              setCursorHidden(true);
            }, 800);
          }}
        />
        <p className="mt-48PX sticky bottom-2 mb-12 border-b border-solid border-[#a4a4a4] pb-12">
          <button
            type="button"
            ref={startButton}
            onClick={() => {
              if (running) return;
              canvasRef.current?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
              reset();
            }}
            className={clsx([
              'mx-auto grid aspect-square w-[5.5rem] place-items-center rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700',
              running && 'invisible',
            ])}
          >
            {blocks.current.every((b) => b.broken === false) ? 'Start' : 'Restart'}
          </button>
        </p>
      </div>

      <div className="@container">
        <fieldset className="max-w-article @w640:pl-0 mx-auto pl-4">
          <legend className="mb-3 text-sm font-bold">設定</legend>
          <div
            className={clsx([
              'grid grid-cols-[auto_1fr_auto] grid-rows-1 gap-2 px-2 pr-3 font-mono text-sm transition-opacity',
              running && 'opacity-50',
            ])}
          >
            {(
              [
                { key: 'rows', label: '段数', min: 1, max: 600 },
                { key: 'cols', label: '列数', min: 1, max: 100 },
                { key: 'gap', label: 'ブロック同士の余白', min: 1, max: 100 },
                { key: 'blockHeight', label: 'ブロックの高さ', min: 1, max: 100 },
              ] as const
            ).map(({ key, label, min, max }) => {
              const inputKey = `${id}-${key}`;
              return (
                <p key={key} className="col-start-1 col-end-4 grid grid-cols-subgrid">
                  <label htmlFor={inputKey} className="col-start-1 row-start-1">
                    {`${label}:`}
                  </label>
                  <input
                    disabled={running}
                    id={inputKey}
                    type="range"
                    min={min}
                    defaultValue={DEFAULT_BLOCK_SETTING[key]}
                    max={max}
                    className="col-start-2 row-start-1 min-h-8"
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value, 10);
                      if (paddle.current) {
                        blockSettingRef.current = getBlockSetting({
                          ...blockSettingRef.current,
                          canvasWidth: width,
                          [key]: newSize,
                        });
                      }
                      e.currentTarget.nextElementSibling!.textContent = newSize.toString();

                      // 反映処理
                      initBlocks();
                    }}
                  />
                  <span className="col-start-3 row-start-1 content-center">{DEFAULT_BLOCK_SETTING[key]}</span>
                </p>
              );
            })}

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label className="col-start-1 row-start-1" htmlFor={`${id}-paddle-width`}>
                バーの幅：
              </label>
              <input
                disabled={running}
                id={`${id}-paddle-width`}
                type="range"
                min={1}
                defaultValue={DEFAULT_PADDLE_WIDTH}
                max={1000}
                className="col-start-2 row-start-1"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (paddle.current) {
                    paddle.current.width = newSize;
                  }
                  e.currentTarget.nextElementSibling!.textContent = newSize.toString();
                }}
              />
              <span className="col-start-3 row-start-1 content-center">{DEFAULT_PADDLE_WIDTH}</span>
            </p>

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label className="col-start-1 row-start-1" htmlFor={`${id}-ball-radius`}>
                ボールのサイズ：
              </label>
              <input
                disabled={running}
                id={`${id}-ball-radius`}
                type="range"
                min={1}
                defaultValue={DEFAULT_BALL_RADIUS}
                max={100}
                className="col-start-2 row-start-1"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.radius = newSize;
                  }
                  e.currentTarget.nextElementSibling!.textContent = newSize.toString();

                  // 反映処理
                  ball.current.x = width / 2;
                  ball.current.y = height - ball.current.radius - paddle.current.height - DEFAULT_PADDLE_POSITION_Y;
                }}
              />
              <span className="col-start-3 row-start-1 content-center">{DEFAULT_BALL_SPEED}</span>
            </p>
            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label className="col-start-1 row-start-1" htmlFor={`${id}-ball-speed`}>
                ボールの速さ：
              </label>
              <input
                disabled={running}
                id={`${id}-ball-speed`}
                type="range"
                min={1}
                defaultValue={DEFAULT_BALL_SPEED}
                max={10}
                className="col-start-2 row-start-1"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.defaultSpeedX = newSize;
                    ball.current.defaultSpeedX = newSize * -1;
                  }
                  e.currentTarget.nextElementSibling!.textContent = newSize.toString();
                }}
              />
              <span className="col-start-3 row-start-1">{DEFAULT_BALL_SPEED}</span>
            </p>
            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label className="col-start-1 row-start-1" htmlFor={`${id}-ball-acceleration`}>
                ブロックを消すごとに増える速度：
              </label>
              <input
                disabled={running}
                id={`${id}-ball-acceleration`}
                type="range"
                min={0}
                step={0.01}
                defaultValue={DEFAULT_BALL_ACCELERATION}
                max={1}
                className="col-start-2 row-start-1"
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  if (ball.current) {
                    ball.current.acceleration = newSize;
                  }

                  const textContent = (() => {
                    const value = newSize.toString();
                    if (value.length === 1) {
                      return value.padEnd(4, '.00');
                    }

                    if (value.length === 3) {
                      return value.padEnd(4, '0');
                    }

                    return value;
                  })();

                  e.currentTarget.nextElementSibling!.textContent = textContent;
                }}
              />
              <span className="col-start-3 row-start-1">{DEFAULT_BALL_ACCELERATION.toString().padEnd(4, '.00')}</span>
            </p>

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label className="col-start-1 row-start-1" htmlFor={`${id}-ball-path-through`}>
                ボールが貫通：
              </label>
              <span className="col-start-2 col-end-4">
                <Switch
                  disabled={running}
                  id={`${id}-ball-path-through`}
                  onChange={(e) => {
                    ball.current.mode.passThrough = e.target.checked;
                  }}
                />
              </span>
            </p>
          </div>
        </fieldset>

        <p className={clsx(['transition-fade mb-6 mt-20', running || 'invisible opacity-0'])}>
          <RunButton
            onClick={() => {
              reset();
              setRunning(false);
            }}
          >
            Reset
          </RunButton>
        </p>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};
