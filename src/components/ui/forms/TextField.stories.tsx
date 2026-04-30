import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextField } from './TextField';

const meta = {
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: '名前',
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: '山田太郎' },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: '山田太郎',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'フルネームを入力してください\n例：山田太郎',
  },
};

export const Multiline: Story = {
  args: {
    label: 'メッセージ',
    multiline: true,
    placeholder: 'お問い合わせ内容を入力してください',
  },
};

export const MultilineAutoResize: Story = {
  args: {
    label: 'メッセージ',
    multiline: true,
    autoResize: true,
    placeholder: '入力に応じて高さが変わります',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '編集不可のテキスト',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: '読み取り専用のテキスト',
  },
};
