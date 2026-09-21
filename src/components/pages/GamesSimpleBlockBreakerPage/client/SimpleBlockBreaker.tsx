'use client';

import { RunButton } from '@/components/ui/buttons/RunButton';
import { Toast } from '@/components/ui/dialogs/Toast';
import { Switch } from '@/components/ui/forms';
import { useAchievement } from '@/hooks/use-achievement';
import { dispatchChangeEvent } from '@/utils/dispatch-event';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  broken: boolean;
}

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
const MIN_PADDLE_WIDTH_RATIO = 10;
const MAX_PADDLE_WIDTH_RATIO = 110;
const DEFAULT_PADDLE_HEIGHT = 20;
const DEFAULT_PADDLE_POSITION_Y = 30;
const DEFAULT_BALL_RADIUS = 16;
// 安全上限（getSafeStepLimit の結果）に対する割合(%)で持つ。速度の上限と同じモノサシに揃え、半径・ブロック高さの変更に自動追従させる
const MIN_BALL_SPEED_RATIO = 5;
const MAX_BALL_SPEED_RATIO = 100;
const DEFAULT_BALL_SPEED_RATIO = 25;
// 初速に対する割合(%)で持つ。初速を変えても1ブロックあたりの体感加速ペースが揃うよう固定pxでは持たない
const MIN_BALL_ACCELERATION_RATIO = 0;
const MAX_BALL_ACCELERATION_RATIO = 100;
const DEFAULT_BALL_ACCELERATION_RATIO = 0;
// 安全上限（getSafeStepLimit の結果）に対する割合(%)で持つ。実際の px 値は半径・ブロック高さ次第で変わるため固定値では持てない
const MIN_BALL_MAX_STEP_RATIO = 0;
const MAX_BALL_MAX_STEP_RATIO = 100;
const DEFAULT_BALL_MAX_STEP_RATIO = 100;

/**
 * すり抜けずに動ける1フレームあたりの移動量（60fps基準）を設定値から求める
 * 当たり判定はフレームごとの離散サンプリングなので、判定が成立しうる範囲より大きく動くと素通りする
 */
const getSafeStepLimit = ({ radius, blockHeight }: { radius: number; blockHeight: number }) => {
  const diameter = radius * 2;
  // パドルは触れた判定が成立する位置からゲームオーバー判定までの間しか反応できない
  const paddleWindow = DEFAULT_PADDLE_POSITION_Y + diameter;
  const blockWindow = blockHeight + diameter;
  return Math.min(paddleWindow, blockWindow);
};

export const SimpleBlockBreaker = ({ width, height }: { width: number; height: number }) => {
  const id = useId();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const { toastProps: achievementToastProps, unlock } = useAchievement();
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
  const [allBlocksUnbroken, setAllBlocksUnbroken] = useState(true);

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
    speedX:
      (getSafeStepLimit({ radius: DEFAULT_BALL_RADIUS, blockHeight: DEFAULT_BLOCK_SETTING.blockHeight }) *
        DEFAULT_BALL_SPEED_RATIO) /
      100,
    speedY:
      ((getSafeStepLimit({ radius: DEFAULT_BALL_RADIUS, blockHeight: DEFAULT_BLOCK_SETTING.blockHeight }) *
        DEFAULT_BALL_SPEED_RATIO) /
        100) *
      -1,
    speedRatio: DEFAULT_BALL_SPEED_RATIO,
    accelerationRatio: DEFAULT_BALL_ACCELERATION_RATIO,
    maxStepRatio: DEFAULT_BALL_MAX_STEP_RATIO,
    mode: {
      passThrough: false,
    },
  });
  const blocks = useRef<Block[]>([]);

  const createBlocksArray = useCallback(() => {
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
    return arr;
  }, []);

  const initBlocks = useCallback(() => {
    blocks.current = createBlocksArray();
    setAllBlocksUnbroken(true);
  }, [createBlocksArray]);

  const reset = useCallback(() => {
    paddle.current.x = width / 2 - paddle.current.width / 2;
    ball.current.x = width / 2;
    ball.current.y = height - ball.current.radius - paddle.current.height - DEFAULT_PADDLE_POSITION_Y;
    const speed =
      (getSafeStepLimit({ radius: ball.current.radius, blockHeight: blockSettingRef.current.blockHeight }) *
        ball.current.speedRatio) /
      100;
    ball.current.speedX = speed;
    ball.current.speedY = speed * -1;
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
    const url = new URL(globalThis.window.location.href);
    if (value === 'false') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    globalThis.window.history.replaceState({}, '', url.toString());
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
    globalThis.window.addEventListener('mousemove', onmousemove);
    return () => globalThis.window.removeEventListener('mousemove', onmousemove);
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
    globalThis.window.addEventListener('touchmove', ontouchmove);
    return () => globalThis.window.removeEventListener('touchmove', ontouchmove);
  }, []);

  // キーボード操作
  useEffect(() => {
    let direction: 'none' | 'left' | 'right' = 'none';
    let moveAnimationFrameId = -1;
    let lastTimestamp = -1;
    // 60fps で 16px / 8px ずつ動かしていたときの体感を px/秒 に換算した値
    const baseSpeed = 960;
    const slowedSpeed = 480;

    const move = (dir: 'left' | 'right', timestamp: number) => {
      const canvas = canvasRef.current;
      if (canvas instanceof HTMLCanvasElement === false) {
        return;
      }

      // 生の delta をそのまま使うと、裏タブから復帰したときに停止中の秒数がまとめて加算されて端までワープする
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const speed = (keysPressed.has('Shift') ? slowedSpeed : baseSpeed) * delta;

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
        moveAnimationFrameId = requestAnimationFrame((nextTimestamp) => move(dir, nextTimestamp));
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
          lastTimestamp = performance.now();
          moveAnimationFrameId = requestAnimationFrame((timestamp) => move('left', timestamp));
        }
      } else if (rightKeys.includes(e.key)) {
        if (direction !== 'right') {
          direction = 'right';
          cancelAnimationFrame(moveAnimationFrameId);
          lastTimestamp = performance.now();
          moveAnimationFrameId = requestAnimationFrame((timestamp) => move('right', timestamp));
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

    globalThis.window.addEventListener('keydown', onkeydown);
    globalThis.window.addEventListener('keyup', onkeyup);

    return () => {
      direction = 'none';
      keysPressed.clear();
      cancelAnimationFrame(moveAnimationFrameId);
      globalThis.window.removeEventListener('keydown', onkeydown);
      globalThis.window.removeEventListener('keyup', onkeyup);
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
      // 段数・列数は上限が大きく、キャンバス外に生成されたブロックも大量に fillRect すると描画コストが無駄にかかる
      ctx.fillStyle = '#38bdf8';
      blocks.current.forEach(({ x, y, w, h, broken }) => {
        const isOffCanvas = x + w < 0 || x > width || y + h < 0 || y > height;
        if (broken === false && isOffCanvas === false) {
          ctx.fillRect(x, y, w, h);
        }
      });
    };

    const collision = () => {
      // 割合(%)で持つため、安全上限に対する掛け算だけで済み px 上限を別途クランプし直す必要がない
      const safeStepLimit = getSafeStepLimit({
        radius: ball.current.radius,
        blockHeight: blockSettingRef.current.blockHeight,
      });
      const step = (safeStepLimit * ball.current.maxStepRatio) / 100;
      const defaultSpeed = (safeStepLimit * ball.current.speedRatio) / 100;
      // 上限が初速を下回る設定でも、プレイヤーが指定した速さより遅くするのは意図と違うので初速は下回らせない
      const maxSpeedY = Math.max(defaultSpeed, step);
      // 初速に対する割合で持つため、初速を上げ下げしても1ブロックごとの体感加速ペースが変わらない
      const acceleration = (defaultSpeed * ball.current.accelerationRatio) / 100;

      // Wall
      // めり込んだ位置を境界まで戻してから速度の向きを強制する。単純な符号反転だけだと、
      // めり込みが解消しきらないフレームで反転を繰り返し、左右/上下に高速でぶれ続ける
      if (ball.current.x + ball.current.radius > width) {
        ball.current.x = width - ball.current.radius;
        ball.current.speedX = Math.abs(ball.current.speedX) * -1;
      } else if (ball.current.x - ball.current.radius < 0) {
        ball.current.x = ball.current.radius;
        ball.current.speedX = Math.abs(ball.current.speedX);
      }
      if (ball.current.y - ball.current.radius < 0) {
        ball.current.y = ball.current.radius;
        ball.current.speedY = Math.abs(ball.current.speedY);
      }

      // Paddle
      if (
        ball.current.y + ball.current.radius >= paddle.current.y &&
        ball.current.x >= paddle.current.x &&
        ball.current.x <= paddle.current.x + paddle.current.width
      ) {
        ball.current.y = paddle.current.y - ball.current.radius;
        ball.current.speedY = Math.abs(ball.current.speedY) * -1;
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
          } else {
            unlock('walls-never-existed');
          }
          block.broken = true;
          setAllBlocksUnbroken(false);
          if (ball.current.speedY < 0) {
            ball.current.speedY = Math.max(maxSpeedY * -1, ball.current.speedY - acceleration);
          } else {
            ball.current.speedY = Math.min(maxSpeedY, ball.current.speedY + acceleration);
          }
        }
      });
    };

    let lastTimestamp = performance.now();
    const update = (timestamp: number) => {
      // 経過時間（秒）を算出
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // speedX / speedY は px/フレーム なので、60fps 基準で px/秒 に換算してから経過時間を掛ける
      const FRAMES_PER_SECOND = 60;

      // ボールの位置更新 ― fps に依存しない
      ball.current.x += ball.current.speedX * FRAMES_PER_SECOND * delta;
      ball.current.y += ball.current.speedY * FRAMES_PER_SECOND * delta;

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
        if (blockSettingRef.current.rows >= 10 && blockSettingRef.current.cols >= 20) {
          unlock('defrag-complete');
        }
        // collision() 内の maxSpeedY と同じ式。クリア直前の collision() 呼び出しから
        // 設定は変わっていないため、同じフレーム内なら同じ値になる
        const safeStepLimit = getSafeStepLimit({
          radius: ball.current.radius,
          blockHeight: blockSettingRef.current.blockHeight,
        });
        const step = (safeStepLimit * ball.current.maxStepRatio) / 100;
        const defaultSpeed = (safeStepLimit * ball.current.speedRatio) / 100;
        const maxSpeedY = Math.max(defaultSpeed, step);
        // 上限スライダーを100%にしていないと初速だけで上限到達＝トリビアルに解除できてしまうため対象外にする。
        // ただし加速度0%でも、初速自体を100%にして最初から上限速度でプレイし切った場合は正当な達成として認める
        const reachedMaxSpeedByOwnEffort = ball.current.accelerationRatio !== 0 || ball.current.speedRatio === 100;
        if (
          ball.current.maxStepRatio === 100 &&
          reachedMaxSpeedByOwnEffort &&
          maxSpeedY <= Math.abs(ball.current.speedY)
        ) {
          unlock('speed-star');
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, initBlocks, reset, running]);

  useEffect(() => {
    [
      [blockSettingRef.current, ''],
      // paddle.current.width は px 管理だが、range 入力側は割合(%)で扱うため復元前に変換する
      [{ ...paddle.current, width: Math.round((paddle.current.width / width) * 100) }, 'paddle-'],
      [
        {
          radius: ball.current.radius,
          speed: ball.current.speedRatio,
          acceleration: ball.current.accelerationRatio,
          'max-step': ball.current.maxStepRatio,
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

    blocks.current = createBlocksArray();
    // Defer state updates to avoid cascading renders warning
    queueMicrotask(() => {
      setIsReady(true);
      setAllBlocksUnbroken(true);
    });
  }, [id, createBlocksArray, searchParams]);

  return (
    <>
      <div className="pointer-coarse:after:touch-none pointer-coarse:after:h-[10vh] pointer-coarse:after:block pointer-coarse:after:bg-[#a4a4a4] pointer-coarse:after:max-w-[90%] pointer-coarse:after:mx-auto after:select-none after:[-webkit-touch-callout:none]">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={clsx([
            'starting:opacity-0 mx-auto size-auto max-h-[80vh] max-w-[90%] border-2 border-[#a4a4a4] transition-opacity',
            isReady ? 'opacity-100' : 'opacity-0',
            cursorHidden && 'cursor-none',
          ])}
          onMouseMove={() => {
            setCursorHidden(false);
            clearTimeout(cursorHiddenSetTimeoutId.current);
            cursorHiddenSetTimeoutId.current = globalThis.window.setTimeout(() => {
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
          {(() => {
            if (running) return 'Playing now';
            return allBlocksUnbroken ? 'Start' : 'Restart';
          })()}
        </button>
      </p>

      <div className="px-2">
        <fieldset className="w640:pl-0 max-w-w640 @container relative mx-auto pl-4">
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
                <p
                  key={key}
                  className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2"
                >
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
                    className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                    onChange={(e) => {
                      const newSize = Number.parseInt(e.target.value, 10);
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
                  <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
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

            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
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
                className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                onChange={(e) => {
                  const newSize = Number.parseInt(e.target.value, 10);
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
              <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-radius-label`}
                  defaultValue={DEFAULT_BALL_RADIUS}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>

            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
              <label
                htmlFor={`${id}-paddle-width`}
                id={`${id}-paddle-width-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                バーの幅（%）
              </label>
              <input
                disabled={running}
                id={`${id}-paddle-width`}
                type="range"
                min={MIN_PADDLE_WIDTH_RATIO}
                defaultValue={Math.round((DEFAULT_PADDLE_WIDTH / width) * 100)}
                max={MAX_PADDLE_WIDTH_RATIO}
                className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                onChange={(e) => {
                  const newRatio = Number.parseInt(e.target.value, 10);
                  const newSize = Math.round((width * newRatio) / 100);
                  if (paddle.current) {
                    paddle.current.width = newSize;
                  }

                  updateQueryParams({
                    key: 'paddle-width',
                    value: newRatio.toString(),
                  });
                  updateConfigTextValue(e, newRatio.toString());
                }}
              />
              <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-paddle-width-label`}
                  defaultValue={Math.round((DEFAULT_PADDLE_WIDTH / width) * 100)}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>

            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
              <label
                htmlFor={`${id}-ball-speed`}
                id={`${id}-ball-speed-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                ボールの速さ（%）
              </label>
              <input
                disabled={running}
                id={`${id}-ball-speed`}
                type="range"
                min={MIN_BALL_SPEED_RATIO}
                defaultValue={DEFAULT_BALL_SPEED_RATIO}
                max={MAX_BALL_SPEED_RATIO}
                className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                onChange={(e) => {
                  const newRatio = Number.parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.speedRatio = newRatio;
                  }
                  updateQueryParams({
                    key: 'ball-speed',
                    value: newRatio.toString(),
                  });
                  updateConfigTextValue(e, newRatio.toString());
                }}
              />
              <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-speed-label`}
                  defaultValue={DEFAULT_BALL_SPEED_RATIO}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>
            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
              <label
                htmlFor={`${id}-ball-acceleration`}
                id={`${id}-ball-acceleration-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                ブロックを消すごとに増える速度（%）
              </label>
              <input
                disabled={running}
                id={`${id}-ball-acceleration`}
                type="range"
                min={MIN_BALL_ACCELERATION_RATIO}
                defaultValue={DEFAULT_BALL_ACCELERATION_RATIO}
                max={MAX_BALL_ACCELERATION_RATIO}
                className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                onChange={(e) => {
                  const newRatio = Number.parseInt(e.target.value, 10);
                  if (ball.current) {
                    ball.current.accelerationRatio = newRatio;
                  }
                  updateQueryParams({
                    key: 'ball-acceleration',
                    value: newRatio.toString(),
                  });
                  updateConfigTextValue(e, newRatio.toString());
                }}
              />
              <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-acceleration-label`}
                  defaultValue={DEFAULT_BALL_ACCELERATION_RATIO}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>

            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
              <label
                htmlFor={`${id}-ball-max-step`}
                id={`${id}-ball-max-step-label`}
                className="col-start-1 row-start-1 content-center pr-2"
              >
                速度の上限（%）
              </label>
              <input
                disabled={running}
                id={`${id}-ball-max-step`}
                type="range"
                min={MIN_BALL_MAX_STEP_RATIO}
                defaultValue={DEFAULT_BALL_MAX_STEP_RATIO}
                max={MAX_BALL_MAX_STEP_RATIO}
                className="@w400:col-start-2 @w400:row-start-1 col-start-1 row-start-2 min-h-8"
                onChange={(e) => {
                  const newRatio = Number.parseInt(e.target.value, 10);
                  ball.current.maxStepRatio = newRatio;
                  updateQueryParams({
                    key: 'ball-max-step',
                    value: newRatio.toString(),
                  });
                  updateConfigTextValue(e, newRatio.toString());
                }}
              />
              <span className="@w400:col-start-3 @w400:row-start-1 row-start-2 row-end-3 content-center">
                <input
                  inputMode="decimal"
                  aria-labelledby={`${id}-ball-max-step-label`}
                  defaultValue={DEFAULT_BALL_MAX_STEP_RATIO}
                  className="w-12 rounded bg-[#404653] px-1 text-base"
                  onChange={onChangeInputForRange}
                  onBlur={onBlurInputForRange}
                />
              </span>
            </p>

            <p className="@w400:grid-cols-subgrid col-start-1 col-end-4 grid grid-cols-[1fr_auto] gap-x-2">
              <label htmlFor={`${id}-ball-path-through`} className="col-start-1 row-start-1 content-center pr-2">
                ボールが貫通
              </label>
              <span className="@w400:col-end-4 col-start-2 row-start-1 content-center">
                <Switch
                  disabled={running}
                  id={`${id}-ball-path-through`}
                  onChange={(e) => {
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
              const url = new URL(globalThis.window.location.href);
              globalThis.window.history.replaceState({}, '', url.pathname);
              globalThis.window.location.reload();
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
      <Toast {...achievementToastProps} />
    </>
  );
};
