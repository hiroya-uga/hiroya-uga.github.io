import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useState } from 'react';

// 実績解除：ネタバレ
// ACHIEVEMENTSのソースを閲覧した
export const ACHIEVEMENTS: Record<
  string,
  {
    symbol: string;
    title: string;
    description: string;
    hidden?: {
      symbol?: true;
      title?: true;
      description?: true;
    };
  }
> = {
  'ran-out-of-business-cards': {
    symbol: '📇',
    title: '名刺を切らしておりまして',
    description: 'デジタル名刺を見つけた。',
  },
  'thank-you-for-sharing': {
    symbol: '👏',
    title: 'ありがとうございます！',
    description: 'シェアボタンを押した。',
  },
  // ツール
  'everything-in-moderation': {
    symbol: '🫩',
    title: '不摂生はほどほどに',
    description: 'スリープモードを防止するツールを利用した。',
    hidden: {
      symbol: true,
      description: true,
    },
  },
  'mirror-mirror': {
    symbol: '🪞',
    title: '鏡よ鏡',
    description: 'Browser Info ツールを開いた。',
    hidden: { description: true },
  },

  // ブロック崩し
  'defrag-complete': {
    symbol: '🧹',
    title: 'デフラグ完了？',
    description: 'ブロック崩しをクリアした。',
  },
  'walls-never-existed': {
    symbol: '🏓',
    title: '壁などなかった',
    description: 'ブロック崩しでボールが貫通する状態をONにしてプレイした。',
  },
};

export type AchievementKey = keyof typeof ACHIEVEMENTS;

export const useAchievement = () => {
  const [toastMessage, setToastMessage] = useState('');

  const unlock = (key: AchievementKey, delay = 300) => {
    const achievement = getLocalStorage('achievement');

    if (achievement?.[key] !== undefined) {
      return;
    }

    setLocalStorage('achievement', {
      ...achievement,
      [key]: new Date().toLocaleDateString(),
    });

    setTimeout(() => {
      setToastMessage(`🏆 実績解除：${ACHIEVEMENTS[key].title}`);
      window.dispatchEvent(new StorageEvent('storage'));
    }, delay);
  };

  return {
    toastProps: {
      message: toastMessage,
      setMessage: setToastMessage,
      assertive: true,
    },
    unlock,
  };
};
