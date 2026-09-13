import { describe, expect, it } from 'vitest';

import { ALL_TOOLS_LINK_LIST } from '@/constants/link-list';
import { LocalStorageItems } from '@/utils/local-storage';
import { resolveHistoryList } from '../RecentToolsSection';

const cssUnits = ALL_TOOLS_LINK_LIST.find((item) => item.pathname === '/tools/css-units');
const sortVisualizer = ALL_TOOLS_LINK_LIST.find((item) => item.pathname === '/tools/sort-visualizer');

if (cssUnits === undefined || sortVisualizer === undefined) {
  throw new Error('Expected fixture tools to exist in ALL_TOOLS_LINK_LIST');
}

const toEntry = (pathname: string): LocalStorageItems['recent-tools'][number] => ({
  pathname,
  count: 1,
  lastAccessedAt: '2026-01-01T00:00:00.000Z',
});

describe('resolveHistoryList', () => {
  it('homeがnullのとき空配列を返す', () => {
    expect(resolveHistoryList([toEntry('/tools/sort-visualizer'), toEntry('/tools/css-units')], null)).toStrictEqual(
      [],
    );
  });

  it('履歴がnullのとき空配列を返す', () => {
    expect(resolveHistoryList(null, { 'recent-tools-section-is-enabled': true })).toStrictEqual([]);
  });

  it('ALL_TOOLS_LINK_LISTに存在しないpathnameは除外する', () => {
    expect(
      resolveHistoryList([toEntry('/tools/does-not-exist'), toEntry('/tools/css-units')], {
        'recent-tools-section-is-enabled': true,
      }),
    ).toStrictEqual([cssUnits]);
  });

  it("home['recent-tools-section-is-enabled']がfalseまたは未設定のとき履歴があっても空配列を返す", () => {
    expect(
      resolveHistoryList([toEntry('/tools/css-units')], { 'recent-tools-section-is-enabled': false }),
    ).toStrictEqual([]);
    expect(resolveHistoryList([toEntry('/tools/css-units')], {})).toStrictEqual([]);
  });

  it("home['recent-tools-section-is-enabled']がtrueのとき履歴のpathnameに対応するツールを順序通り返す", () => {
    expect(
      resolveHistoryList([toEntry('/tools/sort-visualizer'), toEntry('/tools/css-units')], {
        'recent-tools-section-is-enabled': true,
      }),
    ).toStrictEqual([sortVisualizer, cssUnits]);
  });
});
