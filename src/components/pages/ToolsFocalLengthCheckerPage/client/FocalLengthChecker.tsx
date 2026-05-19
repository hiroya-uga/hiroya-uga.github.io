'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';

import clsx from 'clsx';
import {
  DEFAULT_FOCAL_LENGTHS_STRING,
  RefAspectRatioId,
  REFERENCE_ASPECT_RATIOS,
  SENSOR_FORMATS,
  SensorFormatId,
  SW_PATH,
} from './constants';
import { FocalLengthControls } from './FocalLengthControls';
import { useCameraStream } from './hooks';

export const FocalLengthChecker = () => {
  const [deviceFocalLength, setDeviceFocalLength] = useState(26);
  const [selectedFormatId, setSelectedFormatId] = useState<SensorFormatId>('full-frame');
  const [selectedRefAspectRatioId, setSelectedRefAspectRatioId] = useState<RefAspectRatioId>('3-2');
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [focalLengthsInput, setFocalLengthsInput] = useState(DEFAULT_FOCAL_LENGTHS_STRING);
  const [isSaveDataLoaded, setIsSaveDataLoaded] = useState(false);

  const focalLengthByCameraRef = useRef<Record<string, number>>({});
  const prevCameraRef = useRef('');

  const { videoRef, status, activeCameraId, cameraOptions, videoNativeSize, handleVideoMetadata } =
    useCameraStream(selectedCameraId);

  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const mq = globalThis.matchMedia('(orientation: portrait)');
    setIsPortrait(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const focalLengths = useMemo(() => {
    return focalLengthsInput
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((n) => Number.isNaN(n) === false && n > 0)
      .sort((a, b) => a - b);
  }, [focalLengthsInput]);

  const selectedRefAR =
    REFERENCE_ASPECT_RATIOS.find((ar) => ar.id === selectedRefAspectRatioId) ?? REFERENCE_ASPECT_RATIOS[0];

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(SW_PATH);
    }
  }, []);

  useEffect(() => {
    const saved = getLocalStorage('savedata-focal-length-checker');

    if (typeof saved?.deviceFocalLength === 'number') {
      setDeviceFocalLength(saved.deviceFocalLength);
    }
    if (typeof saved?.selectedFormatId === 'string') {
      setSelectedFormatId(saved.selectedFormatId as SensorFormatId);
    }
    if (typeof saved?.selectedRefAspectRatioId === 'string') {
      setSelectedRefAspectRatioId(saved.selectedRefAspectRatioId as RefAspectRatioId);
    }
    if (typeof saved?.focalLengthsInput === 'string') {
      setFocalLengthsInput(saved.focalLengthsInput);
    }
    if (saved?.focalLengthByCamera !== undefined) {
      focalLengthByCameraRef.current = saved.focalLengthByCamera;
    }
    setIsSaveDataLoaded(true);
  }, []);

  const currentCameraSelectValue = selectedCameraId === '' ? activeCameraId : selectedCameraId;

  useEffect(() => {
    if (!isSaveDataLoaded || !currentCameraSelectValue) {
      return;
    }

    if (prevCameraRef.current !== currentCameraSelectValue) {
      prevCameraRef.current = currentCameraSelectValue;
      const savedFl = focalLengthByCameraRef.current[currentCameraSelectValue] ?? 26;
      setDeviceFocalLength(savedFl);
      return;
    }

    focalLengthByCameraRef.current = {
      ...focalLengthByCameraRef.current,
      [currentCameraSelectValue]: deviceFocalLength,
    };
  }, [isSaveDataLoaded, deviceFocalLength, currentCameraSelectValue]);

  useEffect(() => {
    if (isSaveDataLoaded === false) {
      return;
    }

    setLocalStorage('savedata-focal-length-checker', {
      deviceFocalLength,
      selectedFormatId,
      selectedRefAspectRatioId,
      focalLengthsInput,
      focalLengthByCamera: focalLengthByCameraRef.current,
    });
  }, [isSaveDataLoaded, deviceFocalLength, selectedFormatId, selectedRefAspectRatioId, focalLengthsInput]);

  const onFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormatId(e.target.value as SensorFormatId);
  };

  const onRefAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRefAspectRatioId(e.target.value as RefAspectRatioId);
  };

  const onCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCameraId(e.target.value);
  };

  const handleReset = () => {
    setDeviceFocalLength(26);
    setSelectedFormatId('full-frame');
    setSelectedRefAspectRatioId('3-2');
    setFocalLengthsInput(DEFAULT_FOCAL_LENGTHS_STRING);
  };

  const aspectRatio = isPortrait
    ? `${selectedRefAR.h} / ${selectedRefAR.w}`
    : `${selectedRefAR.w} / ${selectedRefAR.h}`;

  const frames = useMemo(() => {
    const cropFactor = SENSOR_FORMATS.find((f) => f.id === selectedFormatId)?.cropFactor ?? 1;
    return focalLengths.map((fl) => {
      const pct = deviceFocalLength / (fl * cropFactor);

      if (pct > 1) {
        return null;
      }

      const widthPct = pct * 100;
      return (
        <div
          key={fl}
          className="text-2xs aspect-(--x-aspect-ratio) absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip border border-white/70 font-mono leading-none text-white mix-blend-difference"
          style={{ width: `${widthPct}%` }}
        >
          <span className="absolute bottom-[-0.85em] left-[-3.9em] w-[5em] origin-top-right rotate-90 text-right">
            <span className="block [text-shadow:0_0_4px_black,0_0_4px_black]">{`${fl}mm`}</span>
          </span>

          <span className="absolute right-0.5 top-0.5 [text-shadow:0_0_4px_black,0_0_4px_black]">{`${fl}mm`}</span>
        </div>
      );
    });
  }, [focalLengths, deviceFocalLength, selectedFormatId]);

  return (
    <>
      <div
        className="w640:rounded-lg w640:shadow-lg relative mx-auto grid max-h-dvh max-w-full place-items-center overflow-hidden bg-black transition-[aspect-ratio,width]"
        style={{
          aspectRatio,
          width: videoNativeSize.width === 4 ? 'var(--max-width-content)' : videoNativeSize.width,
        }}
      >
        <div className={clsx(['size-fit', status !== 'loading' && 'animate-fade-out'])}>
          <LoadingIcon />
        </div>

        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          playsInline
          muted
          onLoadedMetadata={handleVideoMetadata}
        />

        {status === 'error' && (
          <div className="px-content-inline w1280:px-16PX animate-fade-in absolute inset-0 flex items-center justify-center bg-black py-8 text-center text-white">
            <div className="text-sm">
              <p>カメラへのアクセスが許可されていません。</p>
              <p>ブラウザの設定を確認し、カメラへのアクセスを許可してください。</p>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div
            className="animate-fade-in pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={
              {
                '--x-aspect-ratio': aspectRatio,
              } as React.CSSProperties
            }
          >
            {frames}
          </div>
        )}
      </div>

      <FocalLengthControls
        status={status}
        deviceFocalLength={deviceFocalLength}
        setDeviceFocalLength={setDeviceFocalLength}
        selectedRefAspectRatioId={selectedRefAspectRatioId}
        onRefAspectRatioChange={onRefAspectRatioChange}
        selectedFormatId={selectedFormatId}
        onFormatChange={onFormatChange}
        currentCameraSelectValue={currentCameraSelectValue}
        onCameraChange={onCameraChange}
        cameraOptions={cameraOptions}
        focalLengthsInput={focalLengthsInput}
        setFocalLengthsInput={setFocalLengthsInput}
        handleReset={handleReset}
      />
    </>
  );
};
