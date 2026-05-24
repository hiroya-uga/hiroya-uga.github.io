'use client';

import { useEffect, useState } from 'react';

import { Fps } from '@/components/ui/features/Fps';
import { Lang } from '@/types/lang';

import clsx from 'clsx';
import { toolsBrowserInfoLocales } from '../locales';
import {
  BatterySnapshot,
  BatteryState,
  captureFixed,
  captureMediaDevices,
  captureStorage,
  captureSync,
  createEmptyPermissions,
  createEmptySync,
  FixedInfo,
  formatBytes,
  formatFixed,
  formatNetworkType,
  formatNumber,
  formatTimezoneOffset,
  LocalFontsState,
  MediaDeviceGroup,
  MQ_LIST,
  PERMISSION_NAMES,
  PermissionsSnapshot,
  StorageInfo,
  subscribeBattery,
  subscribeConnectionChange,
  subscribeMediaDevicesChange,
  subscribePermissions,
  subscribeStorageChange,
  subscribeWindowPosition,
  SyncSnapshot,
  UNSUPPORTED_LABEL,
} from '../utils';
import { Row } from './Row';
import { Section } from './Section';
import { UnsupportedLabelProvider, useUnsupportedLabel } from './UnsupportedLabelContext';

type InlineKV = readonly [string, React.ReactNode];

const InlineKVList = ({ entries }: { entries: readonly InlineKV[] }) => {
  const unsupportedLabel = useUnsupportedLabel();

  return (
    <dl className="w640:block grid grid-cols-[auto_1fr]">
      {entries.map(([key, value], index) => {
        const displayValue = value === UNSUPPORTED_LABEL ? unsupportedLabel : value;
        return (
          <div key={key} className={clsx(['col-span-2 grid grid-cols-subgrid', 'w640:inline-block'])}>
            <dt className="w640:pr-0 w640:inline pr-[1em]">{key}</dt>
            <dd className="w640:inline">
              <span className="w640:mr-0 mr-[0.5em]" aria-hidden="true">
                =
              </span>
              {displayValue}
              {index !== entries.length - 1 && (
                <span className="w640:not-sr-only whitespace-pre! sr-only" aria-hidden="true">
                  ,{' '}
                </span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

const InlineList = ({ items }: { items: readonly React.ReactNode[] }) => (
  <>
    {items.map((item, index) => (
      <span key={index} className="inline-block">
        {item}
        {index !== items.length - 1 && ', '}
      </span>
    ))}
  </>
);

interface BatteryValueProps {
  snapshot: BatterySnapshot;
  yesLabel: string;
  noLabel: string;
}

const BatteryValue = ({ snapshot, yesLabel, noLabel }: Readonly<BatteryValueProps>) => {
  const { level, charging, chargingTime, dischargingTime } = snapshot;
  const entries: InlineKV[] = [
    ['level', `${Math.round(level * 100)}%`],
    ['charging', charging ? yesLabel : noLabel],
  ];
  // 充電中は dischargingTime、満充電/非充電時は chargingTime が Infinity になる
  if (Number.isFinite(chargingTime)) {
    entries.push(['chargingTime', `${chargingTime}s`]);
  }
  if (Number.isFinite(dischargingTime)) {
    entries.push(['dischargingTime', `${dischargingTime}s`]);
  }
  return <InlineKVList entries={entries} />;
};

type Locale = (typeof toolsBrowserInfoLocales)[Lang];

const createFormatters = (t: Locale) => ({
  yesNo: (value: boolean): string => (value ? t.status.yes : t.status.no),
  onOff: (raw: boolean | string | null | undefined): string => {
    if (raw === true || raw === '1' || raw === 'true') {
      return t.status.on;
    }
    if (raw === false || raw === '0' || raw === 'false') {
      return t.status.off;
    }
    // DNT は GPC と違い "unspecified"（未設定）を返す経路があり、ブラウザが API 自体に未対応の場合と区別したい
    if (raw === 'unspecified') {
      return t.status.notSet;
    }
    return UNSUPPORTED_LABEL;
  },
  enabledDisabled: (value: boolean | null): string => {
    if (value === null) {
      return UNSUPPORTED_LABEL;
    }
    return value ? t.status.enabled : t.status.disabled;
  },
});

interface Props {
  lang?: Lang;
}

export const ToolsBrowserInfoClient = ({ lang = 'ja' }: Readonly<Props>) => {
  const t = toolsBrowserInfoLocales[lang];
  const { yesNo, onOff, enabledDisabled } = createFormatters(t);

  const [sync, setSync] = useState<SyncSnapshot>(createEmptySync);
  const [fixed, setFixed] = useState<FixedInfo | null>(null);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [battery, setBattery] = useState<BatteryState>({ kind: 'loading' });
  const [localFonts, setLocalFonts] = useState<FontData[] | null>(null);
  const [localFontsState, setLocalFontsState] = useState<LocalFontsState>('idle');
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceGroup[] | null>(null);
  const [permissions, setPermissions] = useState<PermissionsSnapshot>(createEmptyPermissions);

  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;
    const update = () => setSync(captureSync());
    update();

    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener('resize', update, { signal });
    window.addEventListener('online', update, { signal });
    window.addEventListener('offline', update, { signal });
    window.addEventListener('focus', update, { signal });
    window.addEventListener('blur', update, { signal });
    // visualViewport.pageLeft/pageTop はページスクロールでも変化するので scrollend を購読（scroll は発火頻度が高すぎる）
    window.addEventListener('scrollend', update, { signal });
    window.visualViewport?.addEventListener('resize', update, { signal });
    window.visualViewport?.addEventListener('scroll', update, { signal });
    screen.orientation?.addEventListener('change', update, { signal });

    MQ_LIST.forEach((query) => window.matchMedia(query).addEventListener('change', update, { signal }));

    subscribeConnectionChange(update, signal);

    document.addEventListener('visibilitychange', update, { signal });
    subscribeWindowPosition(update, signal);

    return () => {
      ac.abort();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    captureFixed().then(setFixed);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    const refresh = () => captureStorage(t.status.empty).then(setStorage);
    refresh();
    subscribeStorageChange(refresh, ac.signal);
    return () => ac.abort();
  }, [t.status.empty]);

  useEffect(() => {
    const ac = new AbortController();
    subscribeBattery(setBattery, ac.signal);
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    const refresh = () => captureMediaDevices().then(setMediaDevices);
    refresh();
    subscribeMediaDevicesChange(refresh, ac.signal);
    return () => ac.abort();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    subscribePermissions(setPermissions, ac.signal);
    return () => ac.abort();
  }, []);

  const handleQueryLocalFonts = async () => {
    if (window.queryLocalFonts === undefined) {
      setLocalFontsState('unsupported');
      return;
    }
    setLocalFontsState('loading');
    try {
      const fonts = await window.queryLocalFonts();
      setLocalFonts(fonts);
      setLocalFontsState('idle');
    } catch {
      setLocalFontsState('denied');
    }
  };

  const handleRefreshStorage = () => {
    setStorage(null);
    captureStorage(t.status.empty).then(setStorage);
  };

  const handleRefreshMediaDevices = () => {
    setMediaDevices(null);
    captureMediaDevices().then(setMediaDevices);
  };

  const grantedPermissions = PERMISSION_NAMES.filter((name) => permissions[name] === 'granted');
  const deniedPermissions = PERMISSION_NAMES.filter((name) => permissions[name] === 'denied');

  const webgpuEntries: InlineKV[] =
    fixed === null
      ? []
      : (
          [
            ['vendor', fixed.webgpuVendor],
            ['architecture', fixed.webgpuArchitecture],
            ['device', fixed.webgpuDevice],
            ['description', fixed.webgpuDescription],
          ] as const
        ).filter(([, value]) => value && value !== UNSUPPORTED_LABEL);

  return (
    <UnsupportedLabelProvider value={t.status.unsupported}>
      <Section title={t.sections.browser}>
        <Row label={t.labels.userAgent} value={sync.userAgent} />
        <Row
          label={t.labels.uaClientHints}
          value={
            sync.uadBrands === UNSUPPORTED_LABEL ? (
              UNSUPPORTED_LABEL
            ) : (
              <InlineKVList
                entries={[
                  ['brands', sync.uadBrands],
                  ['mobile', sync.uadMobile === null ? UNSUPPORTED_LABEL : yesNo(sync.uadMobile)],
                  ['platform', sync.uadPlatform],
                ]}
              />
            )
          }
        />
        <Row label={t.labels.cookieEnabled} value={sync.cookieEnabled ? t.status.enabled : t.status.disabled} />
        <Row label={t.labels.dnt} value={onOff(sync.doNotTrack)} />
        <Row label={t.labels.gpc} value={onOff(sync.globalPrivacyControl)} />
        <Row label={t.labels.webdriver} value={yesNo(sync.webdriver)} />
        <Row
          label={t.labels.permissions}
          value={grantedPermissions.length === 0 ? t.status.empty : grantedPermissions.join(', ')}
        />
        <Row
          label={t.labels.permissionsDenied}
          value={deniedPermissions.length === 0 ? t.status.empty : deniedPermissions.join(', ')}
        />
        <Row label={t.labels.effectiveRootFontSize} value={`${formatNumber(sync.effectiveRootFontPx)}px`} />
        <Row label={t.labels.zoomFromDefault} value={`${formatFixed(sync.zoomRatio * 100)}%`} />
        <Row
          label={t.labels.colorScheme}
          value={sync.colorScheme === 'no-preference' ? t.status.notSet : sync.colorScheme}
        />
        <Row label={t.labels.reducedMotion} value={enabledDisabled(sync.reducedMotion)} />
        <Row label={t.labels.contrast} value={sync.contrast === 'no-preference' ? t.status.notSet : sync.contrast} />
        <Row label={t.labels.reducedTransparency} value={enabledDisabled(sync.reducedTransparency)} />
        <Row label={t.labels.forcedColors} value={enabledDisabled(sync.forcedColors)} />
        <Row label={t.labels.invertedColors} value={enabledDisabled(sync.invertedColors)} />
        <Row label={t.labels.displayMode} value={sync.displayMode} />
        <Row label={t.labels.firstLanguage} value={sync.language} />
        <Row label={t.labels.languagesPriority} value={sync.languages} />
        <Row
          label={t.labels.dateTimeFormat}
          value={
            <InlineKVList
              entries={[
                ['locale', sync.dtfLocale],
                ['timeZone', sync.dtfTimeZone],
                ['calendar', sync.dtfCalendar],
                ['numberingSystem', sync.dtfNumberingSystem],
                ['hourCycle', sync.dtfHourCycle],
              ]}
            />
          }
        />
        <Row
          label={t.labels.numberFormat}
          value={
            <InlineKVList
              entries={[
                ['locale', sync.nfLocale],
                ['numberingSystem', sync.nfNumberingSystem],
              ]}
            />
          }
        />
        <Row
          label={t.labels.collator}
          value={
            <InlineKVList
              entries={[
                ['locale', sync.colLocale],
                ['sensitivity', sync.colSensitivity],
                // 文字列の "false" と boolean false の混同を避けるためクオートを付ける
                ['caseFirst', sync.colCaseFirst === 'false' ? '"false"' : sync.colCaseFirst],
                ['collation', sync.colCollation],
              ]}
            />
          }
        />
        <Row label={t.labels.timezoneOffset} value={formatTimezoneOffset(sync.timezoneOffsetMin, sync.dtfTimeZone)} />
      </Section>

      <Section title={t.sections.screen}>
        {/* Physical screen */}
        <Row label={t.labels.physicalScreenSize} value={`${sync.screenW} × ${sync.screenH} px`} />
        <Row label={t.labels.availableScreenSize} value={`${sync.availW} × ${sync.availH} px`} />
        <Row
          label={t.labels.physicalOrientation}
          value={t.status.orientationLabel(sync.orientationType, sync.orientationAngle)}
          note={{ marker: t.status.noteMarker, text: t.notes.physicalOrientation }}
        />
        {/* Display capability */}
        <Row
          label={t.labels.colorDepth}
          value={
            sync.colorDepth === sync.pixelDepth ? (
              `${sync.colorDepth} bit`
            ) : (
              <InlineKVList
                entries={[
                  ['colorDepth', `${sync.colorDepth} bit`],
                  ['pixelDepth', `${sync.pixelDepth} bit`],
                ]}
              />
            )
          }
        />
        <Row label={t.labels.colorGamut} value={sync.colorGamut} />
        <Row label={t.labels.dynamicRange} value={sync.dynamicRange} />
        <Row
          label={t.labels.refreshRate}
          value={
            <>
              <Fps /> fps
            </>
          }
        />
        {/* Viewport */}
        <Row label={t.labels.viewportSize} value={`${sync.innerW} × ${sync.innerH} px`} />
        <Row label={t.labels.windowOuterSize} value={`${sync.outerW} × ${sync.outerH} px`} />
        <Row label={t.labels.documentVisibleSize} value={`${sync.clientW} × ${sync.clientH} px`} />
        <Row
          label={t.labels.visualViewport}
          value={
            <InlineKVList
              entries={[
                ['width', `${formatFixed(sync.visualViewport.width)}px`],
                ['height', `${formatFixed(sync.visualViewport.height)}px`],
                ['scale', `${formatFixed(sync.visualViewport.scale * 100)}%`],
                ['offsetX', `${formatFixed(sync.visualViewport.offsetLeft)}px`],
                ['offsetY', `${formatFixed(sync.visualViewport.offsetTop)}px`],
                ['scrollX', `${formatFixed(sync.scrollX)}px`],
                ['scrollY', `${formatFixed(sync.scrollY)}px`],
              ]}
            />
          }
        />
        <Row label={t.labels.pinchZoom} value={`x${formatFixed(sync.visualViewport.scale)}`} />
        <Row
          label={t.labels.viewportOrientation}
          value={sync.orientationMq}
          note={{ marker: t.status.noteMarker, text: t.notes.viewportOrientation }}
        />
        {/* Pixel density */}
        <Row label={t.labels.devicePixelRatio} value={`x${formatFixed(sync.devicePixelRatio)}`} />
        <Row
          label={t.labels.dpiEstimate}
          value={`${formatNumber(sync.resolutionDpi, 0)} dpi`}
          note={{ marker: t.status.noteMarker, text: t.notes.dpiEstimate }}
        />
        {/* Tab / Window state */}
        <Row label={t.labels.visibilityState} value={sync.visibilityState} />
        <Row label={t.labels.hasFocus} value={yesNo(sync.hasFocus)} />
        <Row label={t.labels.windowPosition} value={`X: ${sync.screenX}px, Y: ${sync.screenY}px`} />
      </Section>

      <Section
        title={t.sections.device}
        refresh={{ label: t.status.refreshSection, onClick: handleRefreshMediaDevices }}
      >
        <Row label={t.labels.cpuCount} value={sync.hardwareConcurrency} />
        <Row
          label={t.labels.deviceMemory}
          value={sync.deviceMemory !== null ? `${sync.deviceMemory} GB` : UNSUPPORTED_LABEL}
          note={{ marker: t.status.noteMarker, text: t.notes.deviceMemory }}
        />
        <Row label={t.labels.mainHover} value={yesNo(sync.hoverMq)} />
        <Row label={t.labels.anyHover} value={yesNo(sync.anyHover)} />
        <Row label={t.labels.mainPointer} value={sync.pointer} />
        <Row label={t.labels.anyPointer} value={sync.anyPointer} />
        <Row label={t.labels.maxTouchPoints} value={sync.maxTouchPoints} />
        <Row label={t.labels.gpuVendor} value={fixed?.gpuVendor ?? t.status.loading} />
        <Row label={t.labels.gpuRenderer} value={fixed?.gpuRenderer ?? t.status.loading} />
        <Row
          label={t.labels.webgpuAdapter}
          value={
            fixed === null ? (
              t.status.loading
            ) : webgpuEntries.length === 0 ? (
              UNSUPPORTED_LABEL
            ) : (
              <InlineKVList entries={webgpuEntries} />
            )
          }
        />
        <Row
          label={t.labels.mediaDevices}
          value={
            mediaDevices === null ? (
              t.status.loading
            ) : mediaDevices.length === 0 ? (
              t.status.mediaDevicesEmpty
            ) : (
              <InlineKVList entries={mediaDevices.map((group) => [group.kind, group.count])} />
            )
          }
        />
        <Row
          label={t.labels.battery}
          value={
            battery.kind === 'loading' ? (
              t.status.loading
            ) : battery.kind === 'unsupported' ? (
              UNSUPPORTED_LABEL
            ) : (
              <BatteryValue snapshot={battery.snapshot} yesLabel={t.status.yes} noLabel={t.status.no} />
            )
          }
        />
      </Section>

      <Section title={t.sections.network}>
        <Row label={t.labels.online} value={sync.online ? t.status.online : t.status.offline} />
        <Row label={t.labels.effectiveType} value={formatNetworkType(sync.connectionEffectiveType)} />
        <Row label={t.labels.downlink} value={sync.connectionDownlink} />
        <Row label={t.labels.rtt} value={sync.connectionRtt} />
        <Row label={t.labels.saveData} value={onOff(sync.connectionSaveData)} />
      </Section>

      <Section title={t.sections.storage} refresh={{ label: t.status.refreshSection, onClick: handleRefreshStorage }}>
        <Row
          label={t.labels.storageUsage}
          value={formatBytes(storage?.storageUsage)}
          note={{ marker: t.status.noteMarker, text: t.notes.storageUsage }}
        />
        <Row label={t.labels.storageQuota} value={formatBytes(storage?.storageQuota)} />
        <Row label={t.labels.storageUsageDetails} value={storage?.storageUsageDetails ?? t.status.loading} />
        <Row
          label={t.labels.storagePersisted}
          value={storage === null ? t.status.loading : enabledDisabled(storage.storagePersisted)}
        />
        <Row
          label={t.labels.localStorage}
          value={
            storage === null
              ? t.status.loading
              : t.status.keysCount(storage.localStorageCount, formatBytes(storage.localStorageBytes))
          }
        />
        <Row
          label={t.labels.sessionStorage}
          value={
            storage === null
              ? t.status.loading
              : t.status.keysCount(storage.sessionStorageCount, formatBytes(storage.sessionStorageBytes))
          }
        />
        <Row label={t.labels.indexedDb} value={storage?.indexedDbList ?? t.status.loading} />
      </Section>

      <Section title={t.sections.fonts}>
        <Row
          label={t.labels.localFonts}
          value={
            <>
              <p className="not-last:mb-2">
                <button
                  type="button"
                  onClick={handleQueryLocalFonts}
                  className="border-secondary px-12PX rounded border py-1 text-sm"
                  disabled={localFontsState === 'loading'}
                >
                  {localFontsState === 'loading' ? t.status.gettingLocalFonts : t.status.getLocalFonts}
                </button>
              </p>

              {localFontsState === 'unsupported' && (
                <p className="text-secondary text-xs">{t.status.localFontsUnsupported}</p>
              )}
              {localFontsState === 'denied' && <p className="text-secondary text-xs">{t.status.localFontsDenied}</p>}
              {localFonts !== null && (
                <details className="px-1px bg-panel-primary hover:bg-panel-primary-hover">
                  <summary className="cursor-pointer text-sm">{t.status.localFontsCount(localFonts.length)}</summary>
                  <ul className="scroll-hint-y mt-2 grid max-h-96 gap-1 overflow-auto text-xs">
                    {localFonts.map((font) => (
                      <li key={font.postscriptName}>
                        <InlineList items={[font.family, font.fullName, font.postscriptName, font.style]} />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          }
        />
      </Section>
    </UnsupportedLabelProvider>
  );
};
