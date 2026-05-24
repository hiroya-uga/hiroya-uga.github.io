declare module '*.css' {
  const styles: { [x: string]: string };
  export default styles;
}
declare module '*.css?raw' {
  const content: string;
  export default content;
}
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}

/**
 * Local Font Access API (Chromium-only, experimental — lib.dom 未登録)
 * @see https://wicg.github.io/local-font-access/
 */
interface FontData {
  readonly family: string;
  readonly fullName: string;
  readonly postscriptName: string;
  readonly style: string;
  blob(): Promise<Blob>;
}

interface Window {
  queryLocalFonts?: (options?: { postscriptNames?: string[] }) => Promise<FontData[]>;
}

/**
 * User-Agent Client Hints (Chromium 一部のみ、lib.dom 未登録)
 * @see https://wicg.github.io/ua-client-hints/
 */
interface NavigatorUABrandVersion {
  readonly brand: string;
  readonly version: string;
}

interface UADataValues {
  architecture?: string;
  bitness?: string;
  brands?: NavigatorUABrandVersion[];
  fullVersionList?: NavigatorUABrandVersion[];
  mobile?: boolean;
  model?: string;
  platform?: string;
  platformVersion?: string;
  uaFullVersion?: string;
  wow64?: boolean;
}

interface NavigatorUAData {
  readonly brands: ReadonlyArray<NavigatorUABrandVersion>;
  readonly mobile: boolean;
  readonly platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
  toJSON(): UADataValues;
}
