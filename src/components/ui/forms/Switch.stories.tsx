import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Switch } from './Switch';

const meta = {
  component: Switch,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { defaultChecked: false },
};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: {
    defaultChecked: false,
    disabled: true,
  },
};
