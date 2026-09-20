import { render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DIALOG_PORTAL_ID } from '@/constants/id';
import { usePortal } from '@/hooks/use-portal';

let portalContainer: HTMLDivElement;

beforeEach(() => {
  portalContainer = document.createElement('div');
  portalContainer.id = DIALOG_PORTAL_ID;
  document.body.appendChild(portalContainer);
});

afterEach(() => {
  portalContainer.remove();
});

describe('usePortal', () => {
  it('DIALOG_PORTAL_IDの要素が存在するときisPortalReadyはtrueになる', () => {
    const { result } = renderHook(() => usePortal());

    expect(result.current.isPortalReady).toBe(true);
  });

  it('DIALOG_PORTAL_IDの要素が存在しないときisPortalReadyはfalseになる', () => {
    portalContainer.remove();

    const { result } = renderHook(() => usePortal());

    expect(result.current.isPortalReady).toBe(false);
  });

  it('renderDialogはportal要素の配下に渡した要素を描画する', () => {
    const { result } = renderHook(() => usePortal());

    render(result.current.renderDialog(<p>portalの中身</p>));

    const content = screen.getByText('portalの中身');
    expect(portalContainer).toContainElement(content);
  });

  it('portal要素が存在しないときrenderDialogはnullを返す', () => {
    portalContainer.remove();

    const { result } = renderHook(() => usePortal());

    expect(result.current.renderDialog(<p>portalの中身</p>)).toBeNull();
  });
});
