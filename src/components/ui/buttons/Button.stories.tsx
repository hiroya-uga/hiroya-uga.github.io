import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

const meta = {
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/about',
    children: '詳細を見る',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    children: '外部サイトを見る',
  },
};
