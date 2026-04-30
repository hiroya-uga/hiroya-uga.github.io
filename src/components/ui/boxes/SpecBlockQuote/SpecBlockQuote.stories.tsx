import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SpecBlockQuote } from './SpecBlockQuote';

const meta = {
  component: SpecBlockQuote,
  tags: ['autodocs'],
  args: {
    title: 'Accessible Rich Internet Applications (WAI-ARIA) 1.2',
    cite: 'https://www.w3.org/TR/wai-aria-1.2/',
    children: (
      <p>
        An accessible name is a short string, typically 1 to 3 words, that authors associate with an element to provide
        users of assistive technologies with a label for the element.
      </p>
    ),
  },
} satisfies Meta<typeof SpecBlockQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithJapanese: Story = {
  args: {
    ja: 'https://momdo.github.io/wai-aria-1.2/',
  },
};
