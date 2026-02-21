'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { DOMAIN_NAME } from '@/constants/meta';

import styles from '@/app/not-found.module.css';

const getBrowserName = () => {
  if (typeof navigator !== 'undefined') {
    const { userAgent } = navigator;

    if (userAgent.includes('Chrome')) {
      if (userAgent.includes('Edg')) {
        return 'Microsoft Edge';
      }
      return 'Google Chrome';
    }
    if (userAgent.includes('Firefox')) {
      return 'Mozilla Firefox';
    }
    if (userAgent.includes('Safari')) {
      return 'Apple Safari';
    }
    if (userAgent.includes('Edge')) {
      return 'Microsoft Edge';
    }
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      return 'Microsoft Internet Explorer';
    }
  }

  return 'Unknown Browser';
};

export function NotFoundClient() {
  const browserName = useSyncExternalStore(
    () => () => {},
    () => getBrowserName(),
    () => '',
  );
  const historyLength = useSyncExternalStore(
    () => () => {},
    () => history.length,
    () => 0,
  );

  return (
    <div className={styles.notfound}>
      <main>
        <h1>
          <span>ページが見つかりません</span>
        </h1>
        <p>検索中のページは、削除された、名前が変更された、または現在利用できない可能性があります。</p>

        <p>次のことを試してください</p>

        <ul>
          <li>
            アドレス バーにページ アドレスを入力した場合は、ページ アドレスが正しく入力したかどうかを確認してください。
          </li>
          <li>
            <Link href="/">{DOMAIN_NAME}</Link> ホームページを開いてから、表示する情報へのリンクを探してください。
          </li>
          {historyLength !== 1 && (
            <li>
              別のリンクを表示するには、
              <button type="button" onClick={() => window.history.back()}>
                [戻る]
              </button>{' '}
              ボタンをクリックしてください。
            </li>
          )}
          <li>
            <span>[検索]</span> ボタンはないので、アドレスバーなどからインターネット上の情報を検索してください。
          </li>
        </ul>
      </main>

      <footer>
        <p>HTTP 404 - ファイル未検出</p>
        <p style={{ opacity: browserName ? 1 : 0, transition: 'opacity 0.3s' }}>{browserName}</p>
      </footer>
    </div>
  );
}
