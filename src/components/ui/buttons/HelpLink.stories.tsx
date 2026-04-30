import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HelpLink } from './HelpLink';

const meta = {
  component: HelpLink,
  tags: ['autodocs'],
} satisfies Meta<typeof HelpLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://validator.w3.org/nu/about.html',
    children: 'The Nu Html Checker について',
  },
};
