import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Required } from './Required';

const meta = {
  component: Required,
  tags: ['autodocs'],
} satisfies Meta<typeof Required>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
