import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { ClearButton } from './ClearButton';

const meta = {
  component: ClearButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ClearButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: { size: 'medium' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const CustomLabel: Story = {
  args: {
    children: 'リセット',
    size: 'medium',
  },
};
