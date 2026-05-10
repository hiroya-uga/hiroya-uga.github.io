'use client';

import { useCallback, useId } from 'react';

import { RunButton } from '@/components/ui/buttons/RunButton';
import { Confirm } from '@/components/ui/dialogs/Confirm/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';

import { FOCAL_LENGTH_MAX, FOCAL_LENGTH_MIN, REFERENCE_ASPECT_RATIOS, SENSOR_FORMATS } from './constants';
import { CameraOption, CameraStatus } from './hooks';

interface Props {
  status: CameraStatus;
  deviceFocalLength: number;
  setDeviceFocalLength: React.Dispatch<React.SetStateAction<number>>;
  selectedRefAspectRatioId: string;
  onRefAspectRatioChange: React.ChangeEventHandler<HTMLSelectElement>;
  selectedFormatId: string;
  onFormatChange: React.ChangeEventHandler<HTMLSelectElement>;
  currentCameraSelectValue: string;
  onCameraChange: React.ChangeEventHandler<HTMLSelectElement>;
  cameraOptions: CameraOption[];
  focalLengthsInput: string;
  setFocalLengthsInput: (value: string) => void;
  handleReset: () => void;
}

export const FocalLengthControls = ({
  status,
  deviceFocalLength,
  setDeviceFocalLength,
  selectedRefAspectRatioId,
  onRefAspectRatioChange,
  selectedFormatId,
  onFormatChange,
  currentCameraSelectValue,
  onCameraChange,
  cameraOptions,
  focalLengthsInput,
  setFocalLengthsInput,
  handleReset,
}: Props) => {
  const id = useId();
  const { confirmData, setConfirmData } = useConfirm();

  let cameraSelectPlaceholder = 'レンズを選択';
  if (status === 'error') {
    cameraSelectPlaceholder = 'カメラが利用できません';
  } else if (cameraOptions.length === 0) {
    cameraSelectPlaceholder = 'レンズ情報を取得中...';
  }
  const selectedFormat = SENSOR_FORMATS.find((f) => f.id === selectedFormatId) ?? SENSOR_FORMATS[0];
  const isFullFrame = selectedFormat.cropFactor === 1;
  const selectedFormatLabel = selectedFormat.label.split(' (')[0];
  const equiv35mm = Math.round(deviceFocalLength / selectedFormat.cropFactor);

  const onFocalLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDeviceFocalLength(Number(e.target.value));
    },
    [setDeviceFocalLength],
  );

  const handleFocalLengthStep = useCallback(
    (delta: number) => {
      setDeviceFocalLength((prev) => Math.min(FOCAL_LENGTH_MAX, Math.max(FOCAL_LENGTH_MIN, prev + delta)));
    },
    [setDeviceFocalLength],
  );

  const handleOpenResetConfirm = useCallback(() => {
    setConfirmData({
      message: '設定を初期化しますか？',
      yes: handleReset,
      no: () => {},
    });
  }, [setConfirmData, handleReset]);

  return (
    <>
      <div className="px-content-inline pwa:min-h-50vh mt-8">
        <div className="max-w-w640 mx-auto space-y-6">
          <div className="bg-secondary px-12PX rounded-md pb-5 pt-3">
            <fieldset>
              <legend className="mb-1 text-sm">デバイス情報</legend>
              <div className="pl-8PX space-y-3">
                <p>
                  <label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">レンズ</span>
                    <select
                      value={currentCameraSelectValue}
                      onChange={onCameraChange}
                      className="ml-2 mt-1 block w-[calc(100%-0.5rem)] rounded border border-gray-300 bg-white px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">{cameraSelectPlaceholder}</option>
                      {cameraOptions.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                          {camera.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </p>

                <p>
                  <span className="block select-none text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor={id}>焦点距離（35mm換算）: </label>
                    <span className="font-mono font-bold">{deviceFocalLength}mm</span>
                    {isFullFrame === false && (
                      <span className="inline-block">
                        {'　→　'}
                        {selectedFormatLabel}実焦点距離: <span className="font-mono font-bold">{equiv35mm}mm</span>
                      </span>
                    )}
                  </span>

                  <span className="ml-2 mt-1 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFocalLengthStep(-1)}
                      disabled={deviceFocalLength <= FOCAL_LENGTH_MIN}
                      className="size-8 rounded-full border border-gray-300 disabled:opacity-40 dark:border-gray-600"
                    >
                      -
                    </button>
                    <span>
                      <input
                        type="range"
                        min={FOCAL_LENGTH_MIN}
                        max={FOCAL_LENGTH_MAX}
                        id={id}
                        value={deviceFocalLength}
                        onChange={onFocalLengthChange}
                        className="w-full"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFocalLengthStep(1)}
                      disabled={deviceFocalLength >= FOCAL_LENGTH_MAX}
                      className="size-8 rounded-full border border-gray-300 disabled:opacity-40 dark:border-gray-600"
                    >
                      +
                    </button>
                  </span>
                </p>
              </div>
            </fieldset>
          </div>

          <div className="bg-secondary px-12PX rounded-md pb-5 pt-3">
            <fieldset>
              <legend className="mb-1 text-sm">カメラ情報</legend>
              <div className="pl-8PX space-y-3">
                <p>
                  <label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">アスペクト比</span>
                    <select
                      value={selectedRefAspectRatioId}
                      onChange={onRefAspectRatioChange}
                      className="ml-2 mt-1 block w-[calc(100%-0.5rem)] rounded border border-gray-300 bg-white px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      {REFERENCE_ASPECT_RATIOS.map((ar) => (
                        <option key={ar.id} value={ar.id}>
                          {ar.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </p>

                <p>
                  <label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">センサーサイズ</span>
                    <select
                      value={selectedFormatId}
                      onChange={onFormatChange}
                      className="ml-2 mt-1 block w-[calc(100%-0.5rem)] rounded border border-gray-300 bg-white px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      {SENSOR_FORMATS.map((format) => (
                        <option key={format.id} value={format.id}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </p>

                <p>
                  <label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      比較する焦点距離（実焦点距離・カンマ区切り）
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={focalLengthsInput}
                      onChange={(e) => setFocalLengthsInput(e.target.value)}
                      className="ml-2 mt-1 block w-[calc(100%-0.5rem)] rounded border border-gray-300 bg-white px-3 py-2 font-mono text-base dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </label>
                </p>
              </div>
            </fieldset>
          </div>

          <p className="ml-auto mt-4 w-fit">
            <RunButton type="button" onClick={handleOpenResetConfirm}>
              設定を初期化
            </RunButton>
          </p>
        </div>
      </div>
      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
    </>
  );
};
