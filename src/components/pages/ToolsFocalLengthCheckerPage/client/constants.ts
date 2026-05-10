export const DEFAULT_FOCAL_LENGTHS = [14, 24, 35, 50, 70, 85, 105, 135, 200];
export const DEFAULT_FOCAL_LENGTHS_STRING = DEFAULT_FOCAL_LENGTHS.join(', ');
export const SW_PATH = './service-worker.js';

export const FOCAL_LENGTH_MIN = 13;
export const FOCAL_LENGTH_MAX = 120;

export const REFERENCE_ASPECT_RATIOS = [
  { id: '3-2', label: '3:2（フルサイズ / APS-C）', w: 3, h: 2 },
  { id: '4-3', label: '4:3（MFT / iPhone）', w: 4, h: 3 },
  { id: '16-9', label: '16:9', w: 16, h: 9 },
  { id: '1-1', label: '1:1', w: 1, h: 1 },
] as const;

export type RefAspectRatioId = (typeof REFERENCE_ASPECT_RATIOS)[number]['id'];

type SensorFormat = {
  id: string;
  label: string;
  cropFactor: number;
};

export const SENSOR_FORMATS = [
  { id: 'medium-format', label: '中判 44×33mm (0.79×)', cropFactor: 0.79 },
  { id: 'full-frame', label: 'フルサイズ', cropFactor: 1 },
  { id: 'aps-c', label: 'APS-C (1.5×)', cropFactor: 1.5 },
  { id: 'aps-c-canon', label: 'APS-C Canon (1.6×)', cropFactor: 1.6 },
  { id: 'mft', label: 'MFT (2×)', cropFactor: 2 },
] as const satisfies readonly SensorFormat[];

export type SensorFormatId = (typeof SENSOR_FORMATS)[number]['id'];
