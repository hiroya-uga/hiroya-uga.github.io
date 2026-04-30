import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';

import { Toast } from './Toast';

const meta = {
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'コピーしました',
    duration: 3000,
    setMessage: () => {},
  },
  render: ({ duration, message }) => {
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
      setCurrentMessage(message);
    }, [message]);

    return (
      <div className="min-h-24">
        <Toast message={currentMessage} setMessage={setCurrentMessage} duration={duration} />
      </div>
    );
  },
};
