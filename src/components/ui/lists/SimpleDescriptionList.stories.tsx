import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SimpleDescriptionList } from './SimpleDescriptionList';

const meta = {
  component: SimpleDescriptionList,
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleDescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    list: [
      { title: '名前', description: '山田太郎' },
      { title: '職業', description: 'フロントエンドエンジニア' },
      { title: '趣味', description: 'プログラミング、読書' },
    ],
  },
};

export const WithNodeTitle: Story = {
  args: {
    list: [
      { title: <strong>強調タイトル</strong>, description: '説明文テキスト', key: 'item-1' },
      { title: '通常タイトル', description: '説明文テキスト' },
    ],
  },
};

export const WithNodeDescription: Story = {
  args: {
    list: [
      {
        title: '対応ブラウザ',
        description: (
          <ul>
            <li>Chrome</li>
            <li>Firefox</li>
            <li>Safari</li>
          </ul>
        ),
      },
    ],
  },
};
