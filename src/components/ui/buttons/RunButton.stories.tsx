import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { RunButton } from './RunButton';

const meta = {
  component: RunButton,
  tags: ['autodocs'],
  args: {
    children: '実行する',
    onClick: fn(),
  },
} satisfies Meta<typeof RunButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBeforeIcon: Story = {
  args: { beforeIcon: 'play' },
};

export const WithAfterIcon: Story = {
  args: { afterIcon: 'arrow-right' },
};

export const WithBothIcons: Story = {
  args: {
    beforeIcon: 'reload',
    afterIcon: 'arrow-right',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
