import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { SelectField } from './SelectField';

const options = (
  <>
    <option value="">-- 選択してください --</option>
    <option value="tokyo">東京都</option>
    <option value="osaka">大阪府</option>
    <option value="aichi">愛知県</option>
  </>
);

const meta = {
  component: SelectField,
  tags: ['autodocs'],
  args: {
    label: '都道府県',
    onChange: fn(),
    children: options,
  },
  render: (args) => <SelectField {...args}>{options}</SelectField>,
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: options },
};

export const Required: Story = {
  args: { required: true, children: options },
};

export const WithDescription: Story = {
  args: {
    description: '居住地の都道府県を選択してください',
    children: options,
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: options },
};
