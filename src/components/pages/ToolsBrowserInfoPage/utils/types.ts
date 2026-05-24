import { PERMISSION_NAMES } from './constants';

export interface NetworkInformation extends EventTarget {
  readonly effectiveType?: string;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
}

export interface WebGpuAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

export interface WebGpuAdapterLike {
  info?: WebGpuAdapterInfo;
  requestAdapterInfo?: () => Promise<WebGpuAdapterInfo>;
}

export interface BatterySnapshot {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

export type BatteryManager = BatterySnapshot & EventTarget;

export type BatteryState = { kind: 'loading' } | { kind: 'unsupported' } | { kind: 'ready'; snapshot: BatterySnapshot };

export type NavigatorWithExtras = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
  globalPrivacyControl?: boolean;
  getBattery?: () => Promise<BatteryManager>;
  gpu?: { requestAdapter(): Promise<WebGpuAdapterLike | null> };
  userAgentData?: NavigatorUAData;
};

export type IDBFactoryWithDatabases = IDBFactory & {
  databases?: () => Promise<{ name?: string; version?: number }[]>;
};

export interface SyncSnapshot {
  // Browser / OS
  userAgent: string;
  uadBrands: string;
  uadMobile: boolean | null;
  uadPlatform: string;
  cookieEnabled: boolean;
  doNotTrack: string;
  globalPrivacyControl: string;
  webdriver: boolean;
  effectiveRootFontPx: number;
  zoomRatio: number;
  colorScheme: string;
  reducedMotion: boolean;
  contrast: string;
  reducedTransparency: boolean;
  forcedColors: boolean;
  invertedColors: boolean;
  displayMode: string;
  language: string;
  languages: string;
  dtfLocale: string;
  dtfTimeZone: string;
  dtfCalendar: string;
  dtfNumberingSystem: string;
  dtfHourCycle: string;
  nfLocale: string;
  nfNumberingSystem: string;
  colLocale: string;
  colSensitivity: string;
  colCaseFirst: string;
  colCollation: string;
  timezoneOffsetMin: number;

  // Screen / Window
  // Physical screen
  screenW: number;
  screenH: number;
  availW: number;
  availH: number;
  orientationType: string;
  orientationAngle: number;
  // Display capability
  colorDepth: number;
  pixelDepth: number;
  colorGamut: string;
  dynamicRange: string;
  // Viewport
  innerW: number;
  innerH: number;
  outerW: number;
  outerH: number;
  clientW: number;
  clientH: number;
  visualViewport: {
    width: number;
    height: number;
    scale: number;
    offsetLeft: number;
    offsetTop: number;
  };
  scrollX: number;
  scrollY: number;
  orientationMq: string;
  // Pixel density
  devicePixelRatio: number;
  resolutionDpi: number;
  // Tab / Window state
  visibilityState: string;
  hasFocus: boolean;
  screenX: number;
  screenY: number;

  // Device / Peripherals
  hardwareConcurrency: number;
  deviceMemory: number | null;
  hoverMq: boolean;
  anyHover: boolean;
  pointer: string;
  anyPointer: string;
  maxTouchPoints: number;

  // Network
  online: boolean;
  connectionEffectiveType: string | null;
  connectionDownlink: string;
  connectionRtt: string;
  connectionSaveData: boolean | null;
}

export interface FixedInfo {
  gpuRenderer: string;
  gpuVendor: string;
  webgpuVendor: string;
  webgpuArchitecture: string;
  webgpuDevice: string;
  webgpuDescription: string;
}

export interface StorageInfo {
  storageUsage: number | null;
  storageQuota: number | null;
  storageUsageDetails: string;
  storagePersisted: boolean | null;
  localStorageCount: number;
  localStorageBytes: number;
  sessionStorageCount: number;
  sessionStorageBytes: number;
  indexedDbList: string;
}

export type LocalFontsState = 'idle' | 'loading' | 'denied' | 'unsupported';

export interface MediaDeviceGroup {
  kind: string;
  count: number;
  /** label / deviceId は権限が付与された後のみ非空になる */
  devices: { deviceId: string; label: string }[];
}

type PermissionName = (typeof PERMISSION_NAMES)[number];

type PermissionStateValue = PermissionState | 'unsupported';

export type PermissionsSnapshot = Record<PermissionName, PermissionStateValue>;
