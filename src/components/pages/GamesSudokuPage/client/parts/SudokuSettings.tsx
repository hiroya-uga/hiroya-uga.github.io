'use client';

import { Switch } from '@/components/ui/forms';

import type { SudokuSettings as Settings } from '@/components/pages/GamesSudokuPage/client/hooks';

const ITEMS: { key: keyof Settings; label: string }[] = [
  { key: 'shouldHighLight', label: 'ハイライト表示' },
  { key: 'shouldShowHints', label: '重複ヒント表示' },
  { key: 'shouldShowCorrectRatio', label: '進捗率を表示' },
];

interface Props {
  settings: Settings;
  onChangeSettings: (patch: Partial<Settings>) => void;
}

export const SudokuSettings = ({ settings, onChangeSettings }: Props) => {
  return (
    <div className="mt-5 space-y-4 border-t border-dashed border-t-gray-600 pt-5">
      {ITEMS.map(({ key, label }) => (
        <p key={key}>
          <label className="border-secondary flex flex-wrap items-center justify-between gap-2 rounded-xl border px-2 py-3 [corner-shape:squircle]">
            <span className="grow text-sm">{label}</span>
            <span>
              <Switch
                checked={settings[key]}
                onChange={(e) => {
                  onChangeSettings({ [key]: e.currentTarget.checked });
                }}
              />
            </span>
          </label>
        </p>
      ))}
    </div>
  );
};
