import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';

describe('useHiddenUntilFound', () => {
  it('data-hidden-until-foundとhidden属性用のpropsを返す', () => {
    const { result } = renderHook(() => useHiddenUntilFound());

    expect(result.current).toStrictEqual({
      'data-hidden-until-found': '',
      hidden: true,
    });
  });

  it('data-hidden-until-found属性を持つ要素をuntil-foundとしてhiddenにする', () => {
    const node = document.createElement('div');
    node.setAttribute('data-hidden-until-found', '');
    document.body.appendChild(node);

    renderHook(() => useHiddenUntilFound());

    expect(node.getAttribute('hidden')).toBe('until-found');
    expect(node.hasAttribute('data-hidden-until-found')).toBe(false);

    document.body.removeChild(node);
  });
});
