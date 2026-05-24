import { PERMISSION_NAMES, UNSUPPORTED_LABEL } from './constants';
import { formatBytes } from './formatters';
import type {
  FixedInfo,
  IDBFactoryWithDatabases,
  MediaDeviceGroup,
  NavigatorWithExtras,
  PermissionsSnapshot,
  StorageInfo,
  SyncSnapshot,
  WebGpuAdapterInfo,
  WebGpuAdapterLike,
} from './types';

const DEFAULT_FONT_SIZE_PX = 16;

const getNavigator = (): NavigatorWithExtras => navigator as NavigatorWithExtras;

const matchMediaPick = (queries: { query: string; label: string }[], fallback: string) => {
  for (const { query, label } of queries) {
    if (window.matchMedia(query).matches) {
      return label;
    }
  }
  return fallback;
};

const getWebGLInfo = (): { vendor: string; renderer: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl === null) {
      return { vendor: UNSUPPORTED_LABEL, renderer: UNSUPPORTED_LABEL };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info') as {
      UNMASKED_VENDOR_WEBGL: number;
      UNMASKED_RENDERER_WEBGL: number;
    } | null;
    if (ext === null) {
      return { vendor: UNSUPPORTED_LABEL, renderer: UNSUPPORTED_LABEL };
    }
    return {
      vendor: String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)),
      renderer: String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)),
    };
  } catch {
    return { vendor: UNSUPPORTED_LABEL, renderer: UNSUPPORTED_LABEL };
  }
};

const getWebGpuInfo = async (): Promise<WebGpuAdapterInfo> => {
  const fallback: WebGpuAdapterInfo = {
    vendor: UNSUPPORTED_LABEL,
    architecture: UNSUPPORTED_LABEL,
    device: UNSUPPORTED_LABEL,
    description: UNSUPPORTED_LABEL,
  };
  try {
    const adapter = ((await getNavigator().gpu?.requestAdapter()) ?? null) as WebGpuAdapterLike | null;
    if (adapter === null) {
      return fallback;
    }
    const info = adapter.info ?? (await adapter.requestAdapterInfo?.());
    if (info === undefined) {
      return fallback;
    }
    return {
      vendor: info.vendor || UNSUPPORTED_LABEL,
      architecture: info.architecture || UNSUPPORTED_LABEL,
      device: info.device || UNSUPPORTED_LABEL,
      description: info.description || UNSUPPORTED_LABEL,
    };
  } catch {
    return fallback;
  }
};

interface StorageEstimateInfo {
  storageUsage: number | null;
  storageQuota: number | null;
  storageUsageDetails: string;
}

const getStorageEstimate = async (): Promise<StorageEstimateInfo> => {
  const result: StorageEstimateInfo = {
    storageUsage: null,
    storageQuota: null,
    storageUsageDetails: UNSUPPORTED_LABEL,
  };
  try {
    const est = await navigator.storage?.estimate();
    if (est === undefined) {
      return result;
    }
    result.storageUsage = est.usage ?? null;
    result.storageQuota = est.quota ?? null;
    const details = (est as StorageEstimate & { usageDetails?: Record<string, number> }).usageDetails;
    if (details !== undefined) {
      result.storageUsageDetails = Object.entries(details)
        .map(([key, value]) => `${key}: ${formatBytes(value)}`)
        .join(' / ');
    }
  } catch {
    // ignore
  }
  return result;
};

const getStoragePersisted = async (): Promise<boolean | null> => {
  try {
    const persisted = await navigator.storage?.persisted?.();
    if (typeof persisted === 'boolean') {
      return persisted;
    }
  } catch {
    // ignore
  }
  return null;
};

const measureWebStorage = (storage: Storage): { count: number; bytes: number } => {
  let count = 0;
  let bytes = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key === null) {
      continue;
    }
    count++;
    bytes += key.length + (storage.getItem(key)?.length ?? 0);
  }
  return { count, bytes };
};

const getIndexedDbList = async (emptyLabel: string): Promise<string> => {
  try {
    const dbs = await (indexedDB as IDBFactoryWithDatabases).databases?.();
    if (dbs === undefined) {
      return UNSUPPORTED_LABEL;
    }
    if (dbs.length === 0) {
      return emptyLabel;
    }
    return dbs.map((db) => `${db.name ?? '(unnamed)'} (v${db.version ?? '?'})`).join(', ');
  } catch {
    return UNSUPPORTED_LABEL;
  }
};

/**
 * SSR / 初回ハイドレーション時はブラウザ API を呼べないので、レイアウトを安定させるためのプレースホルダ。
 */
export const createEmptySync = (): SyncSnapshot => ({
  // Browser / OS
  userAgent: '',
  uadBrands: UNSUPPORTED_LABEL,
  uadMobile: null,
  uadPlatform: UNSUPPORTED_LABEL,
  cookieEnabled: false,
  doNotTrack: UNSUPPORTED_LABEL,
  globalPrivacyControl: UNSUPPORTED_LABEL,
  webdriver: false,
  effectiveRootFontPx: 16,
  zoomRatio: 1,
  colorScheme: 'no-preference',
  reducedMotion: false,
  contrast: 'no-preference',
  reducedTransparency: false,
  forcedColors: false,
  invertedColors: false,
  displayMode: UNSUPPORTED_LABEL,
  language: '',
  languages: '',
  dtfLocale: '',
  dtfTimeZone: '',
  dtfCalendar: '',
  dtfNumberingSystem: '',
  dtfHourCycle: UNSUPPORTED_LABEL,
  nfLocale: '',
  nfNumberingSystem: '',
  colLocale: '',
  colSensitivity: '',
  colCaseFirst: '',
  colCollation: '',
  timezoneOffsetMin: 0,

  // Screen / Window
  // Physical screen
  screenW: 0,
  screenH: 0,
  availW: 0,
  availH: 0,
  orientationType: UNSUPPORTED_LABEL,
  orientationAngle: 0,
  // Display capability
  colorDepth: 0,
  pixelDepth: 0,
  colorGamut: 'unknown',
  dynamicRange: 'standard',
  // Viewport
  innerW: 0,
  innerH: 0,
  outerW: 0,
  outerH: 0,
  clientW: 0,
  clientH: 0,
  visualViewport: {
    width: 0,
    height: 0,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
  },
  scrollX: 0,
  scrollY: 0,
  orientationMq: UNSUPPORTED_LABEL,
  // Pixel density
  devicePixelRatio: 0,
  resolutionDpi: 0,
  // Tab / Window state
  visibilityState: 'visible',
  hasFocus: false,
  screenX: 0,
  screenY: 0,

  // Device / Peripherals
  hardwareConcurrency: 0,
  deviceMemory: null,
  hoverMq: false,
  anyHover: false,
  pointer: UNSUPPORTED_LABEL,
  anyPointer: UNSUPPORTED_LABEL,
  maxTouchPoints: 0,

  // Network
  online: false,
  connectionEffectiveType: null,
  connectionDownlink: UNSUPPORTED_LABEL,
  connectionRtt: UNSUPPORTED_LABEL,
  connectionSaveData: null,
});

export const createEmptyPermissions = (): PermissionsSnapshot =>
  Object.fromEntries(PERMISSION_NAMES.map((name) => [name, 'unsupported'])) as PermissionsSnapshot;

export const captureSync = (): SyncSnapshot => {
  const html = getComputedStyle(document.documentElement);
  const effectiveRootFontPx = parseFloat(html.fontSize);
  const nav = getNavigator();
  const conn = nav.connection;
  const uad = nav.userAgentData;

  const dtf = new Intl.DateTimeFormat().resolvedOptions();
  const nf = new Intl.NumberFormat().resolvedOptions();
  const col = new Intl.Collator().resolvedOptions();

  return {
    // Browser / OS
    userAgent: nav.userAgent,
    uadBrands:
      uad === undefined ? UNSUPPORTED_LABEL : uad.brands.map((brand) => `${brand.brand} ${brand.version}`).join(', '),
    uadMobile: uad?.mobile ?? null,
    uadPlatform: uad?.platform ?? UNSUPPORTED_LABEL,
    cookieEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack ?? UNSUPPORTED_LABEL,
    globalPrivacyControl:
      typeof nav.globalPrivacyControl === 'boolean' ? String(nav.globalPrivacyControl) : UNSUPPORTED_LABEL,
    webdriver: nav.webdriver,
    effectiveRootFontPx,
    zoomRatio: effectiveRootFontPx / DEFAULT_FONT_SIZE_PX,
    colorScheme: matchMediaPick(
      [
        { query: '(prefers-color-scheme: dark)', label: 'dark' },
        { query: '(prefers-color-scheme: light)', label: 'light' },
      ],
      'no-preference',
    ),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    contrast: matchMediaPick(
      [
        { query: '(prefers-contrast: more)', label: 'more' },
        { query: '(prefers-contrast: less)', label: 'less' },
        { query: '(prefers-contrast: custom)', label: 'custom' },
      ],
      'no-preference',
    ),
    reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
    forcedColors: window.matchMedia('(forced-colors: active)').matches,
    invertedColors: window.matchMedia('(inverted-colors: inverted)').matches,
    // `(display-mode: browser)` は通常タブで常にマッチするためフォールバックに任せる
    displayMode: matchMediaPick(
      [
        { query: '(display-mode: standalone)', label: 'standalone' },
        { query: '(display-mode: minimal-ui)', label: 'minimal-ui' },
        { query: '(display-mode: fullscreen)', label: 'fullscreen' },
        { query: '(display-mode: window-controls-overlay)', label: 'window-controls-overlay' },
      ],
      'browser',
    ),
    language: nav.language,
    languages: nav.languages.join(', '),
    dtfLocale: dtf.locale,
    dtfTimeZone: dtf.timeZone,
    dtfCalendar: dtf.calendar,
    dtfNumberingSystem: dtf.numberingSystem,
    dtfHourCycle: dtf.hourCycle ?? UNSUPPORTED_LABEL,
    nfLocale: nf.locale,
    nfNumberingSystem: nf.numberingSystem,
    colLocale: col.locale,
    colSensitivity: col.sensitivity,
    colCaseFirst: col.caseFirst,
    colCollation: col.collation,
    timezoneOffsetMin: new Date().getTimezoneOffset(),

    // Screen / Window
    // Physical screen
    screenW: screen.width,
    screenH: screen.height,
    availW: screen.availWidth,
    availH: screen.availHeight,
    orientationType: screen.orientation?.type ?? UNSUPPORTED_LABEL,
    orientationAngle: screen.orientation?.angle ?? 0,
    // Display capability
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    colorGamut: matchMediaPick(
      [
        { query: '(color-gamut: rec2020)', label: 'rec2020' },
        { query: '(color-gamut: p3)', label: 'p3' },
        { query: '(color-gamut: srgb)', label: 'srgb' },
      ],
      'unknown',
    ),
    dynamicRange: matchMediaPick([{ query: '(dynamic-range: high)', label: 'high' }], 'standard'),
    // Viewport
    innerW: window.innerWidth,
    innerH: window.innerHeight,
    outerW: window.outerWidth,
    outerH: window.outerHeight,
    clientW: document.documentElement.clientWidth,
    clientH: document.documentElement.clientHeight,
    visualViewport: {
      width: window.visualViewport?.width ?? 0,
      height: window.visualViewport?.height ?? 0,
      scale: window.visualViewport?.scale ?? 1,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      offsetTop: window.visualViewport?.offsetTop ?? 0,
    },
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    orientationMq: matchMediaPick(
      [
        { query: '(orientation: portrait)', label: 'portrait' },
        { query: '(orientation: landscape)', label: 'landscape' },
      ],
      UNSUPPORTED_LABEL,
    ),
    // Pixel density
    devicePixelRatio: window.devicePixelRatio,
    resolutionDpi: window.devicePixelRatio * 96,
    // Tab / Window state
    visibilityState: document.visibilityState,
    hasFocus: document.hasFocus(),
    screenX: window.screenX,
    screenY: window.screenY,

    // Device / Peripherals
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    hoverMq: window.matchMedia('(hover: hover)').matches,
    anyHover: window.matchMedia('(any-hover: hover)').matches,
    pointer: matchMediaPick(
      [
        { query: '(pointer: fine)', label: 'fine' },
        { query: '(pointer: coarse)', label: 'coarse' },
        { query: '(pointer: none)', label: 'none' },
      ],
      UNSUPPORTED_LABEL,
    ),
    anyPointer: matchMediaPick(
      [
        { query: '(any-pointer: fine)', label: 'fine' },
        { query: '(any-pointer: coarse)', label: 'coarse' },
        { query: '(any-pointer: none)', label: 'none' },
      ],
      UNSUPPORTED_LABEL,
    ),
    maxTouchPoints: nav.maxTouchPoints,

    // Network
    online: nav.onLine,
    connectionEffectiveType: conn?.effectiveType ?? null,
    connectionDownlink: conn?.downlink !== undefined ? `${conn.downlink} Mbps` : UNSUPPORTED_LABEL,
    connectionRtt: conn?.rtt !== undefined ? `${conn.rtt} ms` : UNSUPPORTED_LABEL,
    connectionSaveData: conn?.saveData ?? null,
  };
};

export const captureFixed = async (): Promise<FixedInfo> => {
  const gpu = getWebGLInfo();
  const webgpu = await getWebGpuInfo();

  return {
    gpuRenderer: gpu.renderer,
    gpuVendor: gpu.vendor,
    webgpuVendor: webgpu.vendor,
    webgpuArchitecture: webgpu.architecture,
    webgpuDevice: webgpu.device,
    webgpuDescription: webgpu.description,
  };
};

export const captureStorage = async (emptyLabel: string): Promise<StorageInfo> => {
  const storage = await getStorageEstimate();
  const storagePersisted = await getStoragePersisted();
  const localStorageStats = measureWebStorage(localStorage);
  const sessionStorageStats = measureWebStorage(sessionStorage);
  const indexedDbList = await getIndexedDbList(emptyLabel);

  return {
    storageUsage: storage.storageUsage,
    storageQuota: storage.storageQuota,
    storageUsageDetails: storage.storageUsageDetails,
    storagePersisted,
    localStorageCount: localStorageStats.count,
    localStorageBytes: localStorageStats.bytes,
    sessionStorageCount: sessionStorageStats.count,
    sessionStorageBytes: sessionStorageStats.bytes,
    indexedDbList,
  };
};

export const captureMediaDevices = async (): Promise<MediaDeviceGroup[] | null> => {
  if (navigator.mediaDevices?.enumerateDevices === undefined) {
    return null;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const byKind = new Map<string, { deviceId: string; label: string }[]>();
    devices.forEach((device) => {
      const list = byKind.get(device.kind) ?? [];
      list.push({ deviceId: device.deviceId, label: device.label });
      byKind.set(device.kind, list);
    });
    return Array.from(byKind.entries()).map(([kind, list]) => ({ kind, count: list.length, devices: list }));
  } catch {
    return null;
  }
};
