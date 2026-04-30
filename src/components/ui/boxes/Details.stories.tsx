import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Details } from './Details';

const meta = {
  component: Details,
  tags: ['autodocs'],
  args: {
    id: 'details-story',
    summary: '詳細を見る',
    children: <p className="px-4 py-2">詳細コンテンツがここに表示されます。</p>,
  },
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { defaultOpen: false },
};

export const Open: Story = {
  args: { defaultOpen: true },
};
