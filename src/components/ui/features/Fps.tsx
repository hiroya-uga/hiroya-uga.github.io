'use client';

import { useEffect, useState } from 'react';

export const Fps = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let rafId = 0;
    const updateFps = () => {
      const currentTime = performance.now();
      frameCount++;
      if (1000 <= currentTime - lastTime) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      rafId = requestAnimationFrame(updateFps);
    };
    rafId = requestAnimationFrame(updateFps);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{fps}</>;
};
