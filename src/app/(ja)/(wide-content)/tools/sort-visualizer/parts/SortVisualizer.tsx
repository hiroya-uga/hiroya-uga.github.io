import { useEffect, useRef } from 'react';

interface SortVisualizerProps {
  values: number[];
  length: number;
  markers?: Record<string, number>;
  highlight?: boolean;
  done?: boolean;
}

export const SortVisualizer = ({ values, markers, highlight, done, ...props }: SortVisualizerProps) => {
  const length = props.length || values.length || 100;
  const width = 400 < length ? 10 : Math.max(1, Math.floor(1000 / length));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = length * width;
  const canvasHeight = canvasWidth * (3 / 4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 値の最大を取得して正規化
    const max = Math.max(...values);

    values.forEach((val, i) => {
      const barHeight = (val / max) * canvasHeight;
      const x = i * width;
      const y = canvasHeight - barHeight;

      // マーカーの描画
      if (done || highlight === false) {
        ctx.fillStyle = '#4c6ef5';
      } else {
        if (markers?.current === i) {
          ctx.fillStyle = '#ff6b6b'; // マーカーの色
        } else if (markers?.comparing === i) {
          ctx.fillStyle = '#ffd43b'; // 比較中の色
        } else {
          ctx.fillStyle = '#4c6ef5';
        }
      }
      ctx.fillRect(x, y, width - 2, barHeight);
    });
  }, [values, width, canvasWidth, canvasHeight, markers, done, highlight]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="h-auto w-full" />;
};
