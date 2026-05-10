'use client';

import { nonNullable } from '@/utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface CameraOption {
  id: string;
  label: string;
}

export type CameraStatus = 'loading' | 'error' | 'ready';

export const useCameraStream = (selectedCameraId: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('loading');
  const [activeCameraId, setActiveCameraId] = useState('');
  const [cameraOptions, setCameraOptions] = useState<CameraOption[]>([]);
  const [videoNativeSize, setVideoNativeSize] = useState({ width: 4, height: 3 });

  const stopStream = useCallback(() => {
    if (streamRef.current !== null) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const loadCameraOptions = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const nextCameraOptions = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          id: device.deviceId,
          label: device.label === '' ? `カメラ ${index + 1}` : device.label,
        }));
      setCameraOptions(nextCameraOptions);
    } catch {
      setCameraOptions([]);
    }
  }, []);

  const startCamera = useCallback(
    async (cameraId: string) => {
      stopStream();
      setStatus('loading');
      try {
        let stream: MediaStream;
        if (cameraId === '') {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: cameraId } },
            audio: false,
          });
        }
        const track = stream.getVideoTracks()[0];
        streamRef.current = stream;
        if (videoRef.current !== null) {
          videoRef.current.srcObject = stream;
        }
        if (track !== undefined) {
          setActiveCameraId(track.getSettings().deviceId ?? '');
        }
        await loadCameraOptions();
        setStatus('ready');
      } catch {
        await loadCameraOptions();
        setActiveCameraId('');
        setStatus('error');
      }
    },
    [loadCameraOptions, stopStream],
  );

  useEffect(() => {
    void startCamera(selectedCameraId);
    return () => {
      stopStream();
    };
  }, [selectedCameraId, startCamera, stopStream]);

  useEffect(() => {
    if (nonNullable(navigator.mediaDevices) === false) {
      return;
    }

    const mediaDevices = navigator.mediaDevices;
    const handleDeviceChange = () => {
      void loadCameraOptions();
    };
    mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [loadCameraOptions]);

  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current !== null && videoRef.current.videoWidth > 0) {
      setVideoNativeSize({ width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
    }
  }, []);

  return { videoRef, status, activeCameraId, cameraOptions, videoNativeSize, handleVideoMetadata };
};
