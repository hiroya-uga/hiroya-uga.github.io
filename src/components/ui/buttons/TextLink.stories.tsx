import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextLink } from './TextLink';

const meta = {
  component: TextLink,
  tags: ['autodocs'],
} satisfies Meta<typeof TextLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/contact',
    children: 'お問い合わせ',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    children: '外部リンク',
  },
};
