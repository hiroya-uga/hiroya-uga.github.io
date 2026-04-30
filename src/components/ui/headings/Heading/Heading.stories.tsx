import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Heading } from './Heading';

const meta = {
  component: Heading,
  tags: ['autodocs'],
  args: {
    children: '見出しテキスト',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H2: Story = {
  args: { level: 2 },
};

export const H3: Story = {
  args: { level: 3 },
};

export const H4: Story = {
  args: { level: 4 },
};

export const H5: Story = {
  args: { level: 5 },
};

export const H6: Story = {
  args: { level: 6 },
};

export const WithMarginTop: Story = {
  args: {
    level: 2,
    keepUseMarginTop: true,
  },
};
