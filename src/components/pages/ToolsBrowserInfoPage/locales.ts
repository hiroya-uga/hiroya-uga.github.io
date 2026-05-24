import { Lang } from '@/types/lang';

export const toolsBrowserInfoLocales = {
  ja: {
    pageDescription1: 'いま使っているブラウザや端末から取得できる情報をまとめて表示します。',
    pageDescription2:
      'OSの設定変更（ダークモード切り替えやモーション軽減など）、ブラウザのズーム、画面回転、タブ切り替え、許諾変更などに追従して値がリアルタイムに更新されます。',
    sections: {
      browser: '1. ブラウザ・OS',
      screen: '2. 画面・ウィンドウ',
      device: '3. デバイス・周辺機器',
      network: '4. ネットワーク',
      storage: '5. ストレージ',
      fonts: '6. 端末フォント',
    },
    labels: {
      // Browser / OS
      userAgent: 'ユーザーエージェント',
      uaClientHints: 'UAクライアントヒント（UA-CH）',
      cookieEnabled: 'Cookie',
      dnt: 'トラッキング拒否（DNT）',
      gpc: 'グローバルプライバシー制御（GPC）',
      webdriver: 'WebDriver制御下',
      permissions: '許可されている権限',
      permissionsDenied: '拒否されている権限',
      effectiveRootFontSize: 'ルート要素の実効font-size',
      zoomFromDefault: 'フォントサイズ倍率（16px基準）',
      colorScheme: '配色の優先設定',
      reducedMotion: 'モーション軽減',
      contrast: 'コントラストの優先設定',
      reducedTransparency: '透明度軽減',
      forcedColors: 'forced-colors',
      invertedColors: '色反転',
      displayMode: '表示モード',
      firstLanguage: '第一言語',
      languagesPriority: '言語の優先順位',
      dateTimeFormat: '日時フォーマットの既定値',
      numberFormat: '数値フォーマットの既定値',
      collator: '文字列照合の既定値',
      timezoneOffset: 'UTCからのオフセット',

      // Screen / Window
      // Physical screen
      physicalScreenSize: '物理画面サイズ',
      availableScreenSize: '利用可能な画面サイズ',
      physicalOrientation: '画面の向き（端末）',

      // Display capability
      colorDepth: '色深度',
      colorGamut: '対応色域',
      dynamicRange: 'ダイナミックレンジ',
      refreshRate: 'FPS（計測）',

      // Viewport
      viewportSize: 'ビューポートサイズ',
      windowOuterSize: 'ウィンドウ全体のサイズ',
      documentVisibleSize: 'ドキュメントの可視サイズ',
      visualViewport: '現在見えている領域',
      pinchZoom: 'ピンチズーム倍率',
      viewportOrientation: '画面の向き（ビューポート）',

      // Pixel density
      devicePixelRatio: 'デバイスピクセル比',
      dpiEstimate: 'DPI推定値',

      // Tab / Window state
      visibilityState: 'タブの可視状態',
      hasFocus: 'ウィンドウのフォーカス',
      windowPosition: 'ウィンドウのスクリーン座標',

      // Device / Peripherals
      cpuCount: '論理CPU数',
      deviceMemory: 'デバイスメモリ（概算）',
      mainHover: '主ポインターのホバー対応',
      anyHover: 'いずれかのポインターのホバー対応',
      mainPointer: '主ポインターの精度',
      anyPointer: 'いずれかのポインターの精度',
      maxTouchPoints: '同時タッチ点数',
      gpuVendor: 'GPUベンダー',
      gpuRenderer: 'GPUレンダラー',
      webgpuAdapter: 'WebGPUアダプター情報',
      mediaDevices: 'メディアデバイス',
      battery: 'バッテリー状態',

      // Network
      online: 'オンライン状態',
      effectiveType: '実効回線タイプ',
      downlink: '推定下り速度',
      rtt: '推定応答時間（RTT）',
      saveData: 'データセーバー',

      // Storage
      storageUsage: 'ストレージ使用量',
      storageQuota: 'ストレージ上限',
      storageUsageDetails: 'ストレージ使用量の内訳',
      storagePersisted: 'ストレージの永続化',
      localStorage: 'Local Storage',
      sessionStorage: 'Session Storage',
      indexedDb: 'IndexedDBデータベース',

      // Fonts
      localFonts: '端末にインストールされたフォント一覧',
    },
    notes: {
      // Screen
      physicalOrientation: 'screen.orientation の値。端末を回転すると変化する。',
      viewportOrientation: 'メディアクエリの値。',
      dpiEstimate: 'devicePixelRatio × 96の概算値。',

      // Device
      deviceMemory: '仕様では最大8GBにクリップされるが、ブラウザによっては超える値を返す場合がある。',

      // Storage
      storageUsage: 'Safariは localStorage / sessionStorage を集計に含めない。',
    },
    status: {
      yes: 'Yes',
      no: 'No',
      on: 'On',
      off: 'Off',
      enabled: '有効',
      disabled: '無効',
      online: 'オンライン',
      offline: 'オフライン',
      notSet: '未設定',
      unsupported: '（未対応）',
      loading: '読み込み中…',
      empty: '-',
      noteMarker: '※',
      refreshSection: 'このセクションを更新',
      getLocalFonts: '端末のフォント一覧を取得',
      gettingLocalFonts: '取得中…',
      localFontsUnsupported: 'このブラウザはLocal Font Access APIをサポートしていません（Chromium系のみ）。',
      localFontsDenied: '権限が拒否されました。',
      localFontsCount: (n: number) => `${n}件取得（クリックで展開）`,
      keysCount: (n: number, bytes: string) => `${n}件（${bytes}）`,
      orientationLabel: (type: string, angle: number) => `${type} (${angle}°)`,
      mediaDevicesEmpty: '(検出なし)',
    },
  },
  en: {
    pageDescription1: 'Shows information available from the browser and device you are currently using.',
    pageDescription2:
      'Values update in real time as you change OS settings (dark mode, reduced motion, etc.), zoom the browser, rotate the screen, switch tabs, or change permissions.',
    sections: {
      browser: '1. Browser / OS',
      screen: '2. Screen / Window',
      device: '3. Device / Peripherals',
      network: '4. Network',
      storage: '5. Storage',
      fonts: '6. Device Fonts',
    },
    labels: {
      // Browser / OS
      userAgent: 'User-Agent',
      uaClientHints: 'User-Agent client hints (UA-CH)',
      cookieEnabled: 'Cookies',
      dnt: 'Do Not Track (DNT)',
      gpc: 'Global Privacy Control (GPC)',
      webdriver: 'Under WebDriver control',
      permissions: 'Granted permissions',
      permissionsDenied: 'Denied permissions',
      effectiveRootFontSize: 'Effective root font-size',
      zoomFromDefault: 'Font size scale (16px baseline)',
      colorScheme: 'Color scheme preference',
      reducedMotion: 'Reduced motion preference',
      contrast: 'Contrast preference',
      reducedTransparency: 'Reduced transparency preference',
      forcedColors: 'forced-colors',
      invertedColors: 'Inverted colors',
      displayMode: 'Display mode',
      firstLanguage: 'Primary language',
      languagesPriority: 'Language priority order',
      dateTimeFormat: 'Default date-time format',
      numberFormat: 'Default number format',
      collator: 'Default string collation',
      timezoneOffset: 'Timezone offset from UTC',

      // Screen / Window
      // Physical screen
      physicalScreenSize: 'Physical screen size',
      availableScreenSize: 'Available screen size',
      physicalOrientation: 'Screen orientation (device)',
      // Display capability
      colorDepth: 'Color depth',
      colorGamut: 'Supported color gamut',
      dynamicRange: 'Dynamic range',
      refreshRate: 'FPS (measured)',
      // Viewport
      viewportSize: 'Viewport size',
      windowOuterSize: 'Window outer size',
      documentVisibleSize: 'Document visible size',
      visualViewport: 'Visual viewport',
      pinchZoom: 'Pinch zoom scale',
      viewportOrientation: 'Screen orientation (viewport)',
      // Pixel density
      devicePixelRatio: 'Device pixel ratio',
      dpiEstimate: 'DPI estimate',
      // Tab / Window state
      visibilityState: 'Tab visibility',
      hasFocus: 'Window focus',
      windowPosition: 'Window screen position',

      // Device / Peripherals
      cpuCount: 'Logical CPU count',
      deviceMemory: 'Device memory (approx.)',
      mainHover: 'Primary pointer can hover',
      anyHover: 'Any pointer can hover',
      mainPointer: 'Primary pointer accuracy',
      anyPointer: 'Any pointer accuracy',
      maxTouchPoints: 'Max simultaneous touch points',
      gpuVendor: 'GPU vendor',
      gpuRenderer: 'GPU renderer',
      webgpuAdapter: 'WebGPU adapter info',
      mediaDevices: 'Media devices',
      battery: 'Battery status',

      // Network
      online: 'Online status',
      effectiveType: 'Effective network type',
      downlink: 'Estimated downlink speed',
      rtt: 'Estimated round-trip time (RTT)',
      saveData: 'Data Saver',

      // Storage
      storageUsage: 'Storage usage',
      storageQuota: 'Storage quota',
      storageUsageDetails: 'Storage usage details',
      storagePersisted: 'Persistent storage',
      localStorage: 'Local Storage',
      sessionStorage: 'Session Storage',
      indexedDb: 'IndexedDB databases',

      // Fonts
      localFonts: 'Locally installed fonts',
    },
    notes: {
      // Screen
      physicalOrientation: 'Value of screen.orientation. Changes when you rotate the device.',
      viewportOrientation: 'Value of the media query.',
      dpiEstimate: 'Approximate value of devicePixelRatio × 96.',

      // Device
      deviceMemory: 'Spec caps this at 8 GB, but some browsers may return higher values.',

      // Storage
      storageUsage: 'Safari does not include localStorage / sessionStorage in the estimate.',
    },
    status: {
      yes: 'Yes',
      no: 'No',
      on: 'On',
      off: 'Off',
      enabled: 'Enabled',
      disabled: 'Disabled',
      online: 'Online',
      offline: 'Offline',
      notSet: 'Not set',
      unsupported: '(unsupported)',
      loading: 'Loading…',
      empty: '-',
      noteMarker: '*',
      refreshSection: 'Refresh this section',
      getLocalFonts: 'Get installed fonts',
      gettingLocalFonts: 'Fetching…',
      localFontsUnsupported: 'This browser does not support the Local Font Access API (Chromium-only).',
      localFontsDenied: 'Permission denied.',
      localFontsCount: (n: number) => `${n} fonts (click to expand)`,
      keysCount: (n: number, bytes: string) => `${n} ${n === 1 ? 'key' : 'keys'} (${bytes})`,
      orientationLabel: (type: string, angle: number) => `${type} (${angle}°)`,
      mediaDevicesEmpty: '(none detected)',
    },
  },
} satisfies Record<Lang, unknown>;
