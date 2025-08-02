'use client';

import { RunButton } from '@/components/Clickable';
import { Toast } from '@/components/Dialog';
import { Switch } from '@/components/Form';
import { dispatchChangeEvent } from '@/utils/dispatch-event';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
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
  rows: 8,
  cols: 4,
  gap: 8,
  blockHeight: 60,
};
const DEFAULT_PADDLE_WIDTH = 360;
const DEFAULT_PADDLE_HEIGHT = 20;
const DEFAULT_PADDLE_POSITION_Y = 30;
const DEFAULT_BALL_RADIUS = 16;
const DEFAULT_BALL_SPEED = 4;
const DEFAULT_BALL_ACCELERATION = 0;

export const SimpleBlockBreaker = ({ width, height }: { width: number; height: number }) => {
  const id = useId();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

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
    defaultSpeed: DEFAULT_BALL_SPEED,
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
    ball.current.speedX = DEFAULT_BALL_SPEED;
    ball.current.speedY = DEFAULT_BALL_SPEED * -1;
    initBlocks();
    setRunning(true);
  }, [height, initBlocks, width]);

  const updateConfigTextValue = useCallback((e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (e.currentTarget.nextElementSibling?.firstElementChild instanceof HTMLInputElement === false) {
      return;
    }
    e.currentTarget.nextElementSibling.firstElementChild.value = value;
  }, []);

  const onChangeInputForRange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const numberValue = Number(value);
    const rangeInput = e.currentTarget.parentElement?.previousElementSibling;

    if (rangeInput instanceof HTMLInputElement === false || value === '' || Number.isNaN(numberValue)) {
      return;
    }

    const min = Number(rangeInput.min);
    const max = Number(rangeInput.max);
    const newValue = Math.max(min, Math.min(max, numberValue));
    dispatchChangeEvent({ target: rangeInput, value: newValue.toString() });
  }, []);

  const onBlurInputForRange = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const rangeInput = e.currentTarget.parentElement?.previousElementSibling;

    if (rangeInput instanceof HTMLInputElement === false) {
      return;
    }

    e.currentTarget.value = rangeInput.value;
  }, []);

  const updateQueryParams = useCallback(({ key, value }: { key: string; value: string }) => {
    const url = new URL(window.location.href);
    if (value === 'false') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

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
        // const hitPos = (ball.current.x - paddle.current.x) / paddle.current.width - 0.5;
        // ball.current.speedX = ball.current.radius * hitPos;
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

    let lastTimestamp = performance.now();
    const update = (timestamp: number) => {
      // 経過時間（秒）を算出
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // 速度（px/秒）
      const SPEED = ball.current.defaultSpeed * 60;

      // ボールの位置更新 ― fps に依存しない
      ball.current.x += ball.current.speedX * SPEED * delta;
      ball.current.y += ball.current.speedY * SPEED * delta;

      collision();

      // GameOver
      if (ball.current.y - ball.current.radius > height) {
        setRunning(false);
        cancelAnimationFrame(requestRef.current!);
        requestAnimationFrame(() => {
          startButton.current?.focus();
        });
        setToastMessage('ゲームオーバーですわ😫');
        setStatusMessage('ゲームオーバーですわ😫');
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
        setStatusMessage('おめでとうございます!!🎉🎉🎉');
        return;
      }
    };

    const loop = (timestamp: number) => {
      draw();

      if (running) {
        update(timestamp);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestRef.current!);
    };
  }, [width, height, initBlocks, reset, running]);

  useEffect(() => {
    [
      [blockSettingRef.current, ''],
      [paddle.current, 'paddle-'],
      [
        {
          radius: ball.current.radius,
          speed: ball.current.defaultSpeed,
          acceleration: ball.current.acceleration,
        },
        'ball-',
      ],
    ].forEach(([config, prefix]) => {
      Object.entries(config).forEach((item) => {
        const [key, defaultValue] = item as [keyof typeof config, number];
        const queryKey = `${prefix}${key}`;
        const queryValue = searchParams?.get(queryKey);

        if (typeof queryValue === 'string') {
          const value = Number(queryValue) || defaultValue;
          const input = document.getElementById(`${id}-${queryKey}`) as HTMLInputElement | null;
          if (input) {
            dispatchChangeEvent({
              target: input,
              value: value.toString(),
            });
          }
        }
      });
    });

    const isPassThrough = searchParams?.get('ball-pass-through') === 'true';
    const passThroughInput = document.getElementById(`${id}-ball-path-through`) as HTMLInputElement | null;
    if (passThroughInput) {
      dispatchChangeEvent({
        target: passThroughInput,
        checked: isPassThrough,
      });
    }

    initBlocks();
    setIsReady(true);
  }, [id, initBlocks, searchParams]);

  return (
    <>
      <div className="pointer-coarse:after:touch-none pointer-coarse:after:h-[10dvh] pointer-coarse:after:block pointer-coarse:after:bg-[#a4a4a4] pointer-coarse:after:max-w-[90%] pointer-coarse:after:mx-auto">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={clsx([
            'starting:opacity-0 mx-auto size-auto max-h-[80dvh] max-w-[90%] border-2 border-[#a4a4a4] transition-opacity',
            isReady ? 'opacity-100' : 'opacity-0',
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
      </div>
      <p
        className={clsx([
          'mt-48PX sticky bottom-2 mb-12 border-b border-solid border-[#a4a4a4] pb-12',
          running && 'pointer-events-none opacity-0',
        ])}
      >
        <button
          type="button"
          ref={startButton}
          tabIndex={running ? -1 : undefined}
          onClick={() => {
            if (running) return;
            setStatusMessage('');
            canvasRef.current?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
            reset();
          }}
          className="mx-auto grid aspect-square w-[5.5rem] place-items-center rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <span className="sr-only">{statusMessage}</span>
          {running ? 'Playing now' : blocks.current.every((b) => b.broken === false) ? 'Start' : 'Restart'}
        </button>
      </p>

      <div className="@container px-2">
        <fieldset className="@w640:pl-0 relative mx-auto max-w-[40rem] pl-4">
          <legend className="mb-3 text-sm font-bold">設定</legend>

          <p className="absolute right-0 top-0"></p>

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
                  <label
                    htmlFor={inputKey}
                    id={`${inputKey}-label`}
                    className="col-start-1 row-start-1 content-center pr-2"
                  >
                    {`${label}`}
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
                      updateQueryParams({
                        key,
                        value: newSize.toString(),
                      });
                      updateConfigTextValue(e, newSize.toString());

                      // 反映処理
                      initBlocks();
                    }}
                  />
                  <span className="col-start-3 row-start-1 content-center">
                    <input
                      inputMode="decimal"
                      aria-labelledby={`${inputKey}-label`}
                      defaultValue={DEFAULT_BLOCK_SETTING[key]}
                      className="w-12 rounded bg-[#404653] px-1 text-base"
                      onChange={onChangeInputForRange}
                      onBlur={onBlurInputForRange}
                    />
                  </span>
                </p>
              );
            })}

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label
                htmlFor={`${id}-paddle-width`}
                id={`${id}-paddle-width-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                バーの幅
              </label>
              <input
                disabled={running}
                id={`${id}-paddle-width`}
                type="range"
                min={1}
                defaultValue={DEFAULT_PADDLE_WIDTH}
                max={1000}
                className="col-start-2 row-start-1 min-h-8"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (paddle.current) {
                    paddle.current.width = newSize;
                  }

                  updateQueryParams({
                    key: 'paddle-width',
                    value: newSize.toString(),
                  });
                  updateConfigTextValue(e, newSize.toString());
                }}
              />
              <span className="col-start-3 row-start-1 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-paddle-width-label`}
                  defaultValue={DEFAULT_PADDLE_WIDTH}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label
                htmlFor={`${id}-ball-radius`}
                id={`${id}-ball-radius-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                ボールのサイズ
              </label>
              <input
                disabled={running}
                id={`${id}-ball-radius`}
                type="range"
                min={1}
                defaultValue={DEFAULT_BALL_RADIUS}
                max={100}
                className="col-start-2 row-start-1 min-h-8"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.radius = newSize;
                  }
                  updateQueryParams({
                    key: 'ball-radius',
                    value: newSize.toString(),
                  });
                  updateConfigTextValue(e, newSize.toString());

                  // 反映処理
                  ball.current.x = width / 2;
                  ball.current.y = height - ball.current.radius - paddle.current.height - DEFAULT_PADDLE_POSITION_Y;
                }}
              />
              <span className="col-start-3 row-start-1 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-radius-label`}
                  defaultValue={DEFAULT_BALL_SPEED}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>
            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label
                htmlFor={`${id}-ball-speed`}
                id={`${id}-ball-speed-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                ボールの速さ
              </label>
              <input
                disabled={running}
                id={`${id}-ball-speed`}
                type="range"
                min={1}
                defaultValue={DEFAULT_BALL_SPEED}
                max={10}
                className="col-start-2 row-start-1 min-h-8"
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.defaultSpeed = newSize;
                  }
                  updateQueryParams({
                    key: 'ball-speed',
                    value: newSize.toString(),
                  });
                  updateConfigTextValue(e, newSize.toString());
                }}
              />
              <span className="col-start-3 row-start-1 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-speed-label`}
                  defaultValue={DEFAULT_BALL_SPEED}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>
            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label
                htmlFor={`${id}-ball-acceleration`}
                id={`${id}-ball-acceleration-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                ブロックを消すごとに増える速度
              </label>
              <input
                disabled={running}
                id={`${id}-ball-acceleration`}
                type="range"
                min={0}
                step={0.01}
                defaultValue={DEFAULT_BALL_ACCELERATION}
                max={0.15}
                className="col-start-2 row-start-1 min-h-8"
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

                  updateQueryParams({
                    key: 'ball-acceleration',
                    value: newSize.toString(),
                  });
                  updateConfigTextValue(e, textContent);
                }}
              />
              <span className="col-start-3 row-start-1 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-acceleration-label`}
                  defaultValue={DEFAULT_BALL_ACCELERATION.toString().padEnd(4, '.00')}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={(e) => {
                    onBlurInputForRange(e);
                    const newValue = e.currentTarget.value;

                    if (newValue === undefined) {
                      return;
                    }

                    if (newValue.length === 1) {
                      e.currentTarget.value = newValue.padEnd(4, '.00');
                    } else if (newValue.length === 3) {
                      e.currentTarget.value = newValue.padEnd(4, '0');
                    } else {
                      e.currentTarget.value = newValue;
                    }
                  }}
                />
              </span>
            </p>

            <p className="col-start-1 col-end-4 grid grid-cols-subgrid">
              <label htmlFor={`${id}-ball-path-through`} className="col-start-1 row-start-1 content-center pr-2">
                ボールが貫通
              </label>
              <span className="col-start-2 col-end-4">
                <Switch
                  disabled={running}
                  id={`${id}-ball-path-through`}
                  onChange={(e) => {
                    console.log(e);

                    updateQueryParams({
                      key: 'ball-pass-through',
                      value: e.target.checked ? 'true' : 'false',
                    });
                    ball.current.mode.passThrough = e.target.checked;
                  }}
                />
              </span>
            </p>
          </div>
        </fieldset>

        <p className={clsx(['transition-fade mb-4 mt-10'])}>
          <RunButton
            disabled={running || searchParams?.size === 0}
            onClick={() => {
              // 雑実装
              const url = new URL(window.location.href);
              window.history.replaceState({}, '', url.pathname);
              window.location.reload();
            }}
          >
            設定をリセット
          </RunButton>
        </p>
        <p className={clsx(['transition-fade mb-6', running || 'invisible opacity-0'])}>
          <RunButton
            onClick={() => {
              reset();
              setRunning(false);
            }}
          >
            強制終了
          </RunButton>
        </p>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};
