import { META } from '@/constants/meta';
import '@/pages/global.css';

import { useEffect, useState } from 'react';

import Head from 'next/head';

export default function Page() {
  const [browserName, setBrowserName] = useState('');
  const [historyLength, setHistoryLength] = useState(0);

  useEffect(() => {
    const { userAgent } = navigator;

    if (userAgent.indexOf('Chrome') != -1) {
      if (userAgent.indexOf('Edg') != -1) {
        return setBrowserName('Microsoft Edge');
      }
      return setBrowserName('Google Chrome');
    } else if (userAgent.indexOf('Firefox') != -1) {
      return setBrowserName('Mozilla Firefox');
    } else if (userAgent.indexOf('Safari') != -1) {
      return setBrowserName('Apple Safari');
    } else if (userAgent.indexOf('Edge') != -1) {
      return setBrowserName('Microsoft Edge');
    } else if (userAgent.indexOf('MSIE') != -1 || userAgent.indexOf('Trident') != -1) {
      return setBrowserName('Microsoft Internet Explorer');
    }

    return setBrowserName('Unknown Browser');
  }, []);

  useEffect(() => {
    setHistoryLength(history.length);
  }, []);

  return (
    <>
      <Head>
        <title>HTTP 404 未検出 - {META.siteName}</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>

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
            <a className="Page_link__nDiOM" href="/">
              {META.domain}
            </a>{' '}
            ホーム ページを開いてから、表示する情報へのリンクを探してください。
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
        <p>{browserName}</p>
      </footer>
    </>
  );
}
