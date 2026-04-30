import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NoteList } from './NoteList';

const meta = {
  component: NoteList,
  tags: ['autodocs'],
} satisfies Meta<typeof NoteList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    list: ['これは単一の注意事項です'],
  },
};

export const Multiple: Story = {
  args: {
    list: ['注意事項 1', '注意事項 2', '注意事項 3'],
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

export const CustomSymbol: Story = {
  args: {
    list: ['注意事項 1', '注意事項 2'],
    symbol: '●',
  },
};

export const Empty: Story = {
  args: {
    list: [],
  },
};
