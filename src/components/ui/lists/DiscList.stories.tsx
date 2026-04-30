import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DiscList } from './DiscList';

const meta = {
  component: DiscList,
  tags: ['autodocs'],
} satisfies Meta<typeof DiscList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    list: ['項目 1', '項目 2', '項目 3'],
  },
};

export const WithObjects: Story = {
  args: {
    list: [
      { key: 'a', value: <strong>強調テキスト</strong> },
      { key: 'b', value: '通常テキスト' },
    ],
  },
};

export const Empty: Story = {
  args: {
    list: [],
  },
};
