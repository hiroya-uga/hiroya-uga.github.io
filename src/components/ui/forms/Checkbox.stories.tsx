import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Checkbox } from './Checkbox';

const meta = {
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'チェックボックスのラベル',
    onChange: fn(),
  } as Parameters<typeof Checkbox>[0],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { defaultChecked: false } as Parameters<typeof Checkbox>[0],
};

export const Checked: Story = {
  args: { defaultChecked: true } as Parameters<typeof Checkbox>[0],
};

export const Disabled: Story = {
  args: { disabled: true } as Parameters<typeof Checkbox>[0],
};

export const WithAriaLabel: Story = {
  args: {
    'aria-label': 'スクリーンリーダー用ラベル（表示なし）',
  } as unknown as Parameters<typeof Checkbox>[0],
};
