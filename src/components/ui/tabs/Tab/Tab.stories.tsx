import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Tab } from './Tab';

const panels = [
  <Tab.Panel key="1" tabKey="タブ 1">
    <p>タブ 1 のコンテンツです。</p>
  </Tab.Panel>,
  <Tab.Panel key="2" tabKey="タブ 2">
    <p>タブ 2 のコンテンツです。</p>
  </Tab.Panel>,
  <Tab.Panel key="3" tabKey="タブ 3">
    <p>タブ 3 のコンテンツです。</p>
  </Tab.Panel>,
];

const meta = {
  tags: ['autodocs'],
  render: (args) => <Tab.Wrapper {...args}>{panels}</Tab.Wrapper>,
  args: {
    children: panels,
  },
} satisfies Meta<typeof Tab.Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOnChange: Story = {
  args: {
    onChange: fn(),
  },
};
