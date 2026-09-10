import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Node組み込みのグローバルlocalStorage/sessionStorageがjsdomのものより優先されてしまうため、jsdomの実体に差し替える
const dom = (globalThis as { jsdom?: { window: Window } }).jsdom;

if (dom) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => dom.window.localStorage,
  });
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get: () => dom.window.sessionStorage,
  });
}

afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
