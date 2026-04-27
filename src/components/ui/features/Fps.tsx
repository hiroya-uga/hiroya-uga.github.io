'use client';

import { useEffect, useState } from 'react';

export const Fps = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    const updateFps = () => {
      const currentTime = performance.now();
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(updateFps);
    };
    requestAnimationFrame(updateFps);
    return () => {
      // Cleanup function to stop the animation frame
      setFps(0);
    };
  }, []);

  return <>{fps}</>;
};
