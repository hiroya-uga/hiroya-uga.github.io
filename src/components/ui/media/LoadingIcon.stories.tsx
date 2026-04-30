import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LoadingIcon } from './LoadingIcon';

const meta = {
  component: LoadingIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomAlt: Story = {
  args: { alt: 'データを取得しています' },
};

export const NoAlt: Story = {
  args: { alt: '' },
};
