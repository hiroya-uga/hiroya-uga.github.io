import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExampleBox } from './ExampleBox';

const meta = {
  component: ExampleBox,
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p>サンプルのコンテンツがここに表示されます。</p>,
  },
};

export const WithMultipleChildren: Story = {
  args: {
    children: (
      <>
        <p>1 行目のサンプルテキストです。</p>
        <p>2 行目のサンプルテキストです。</p>
      </>
    ),
  },
};
