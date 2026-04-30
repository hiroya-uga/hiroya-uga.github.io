import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NoteBox } from './NoteBox';

const meta = {
  component: NoteBox,
  tags: ['autodocs'],
  args: {
    children: 'ここに内容が入ります。重要な情報や補足説明を記載してください。',
  },
} satisfies Meta<typeof NoteBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  args: { type: 'note' },
};

export const Warn: Story = {
  args: { type: 'warn' },
};

export const Error: Story = {
  args: { type: 'error' },
};

export const CustomTitle: Story = {
  args: {
    type: 'note',
    title: 'カスタムタイトル',
  },
};
