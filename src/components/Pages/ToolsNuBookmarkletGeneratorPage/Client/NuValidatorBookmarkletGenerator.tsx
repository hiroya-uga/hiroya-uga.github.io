'use client';

import { NoteBox } from '@/components/Box';
import { Checkbox, TextField } from '@/components/Form';
import { NoteList } from '@/components/List';
import { Tab } from '@/components/Tab';
import { objectKeys } from '@/utils/object-keys';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Output } from './Output';

type Lang = 'ja' | 'en';

interface Options {
  showsource: boolean;
  showoutline: boolean;
  showimagereport: boolean;
  level: boolean;
}

const i18n = {
  ja: {
    optionsLegend: '表示オプション',
    optionsLabels: {
      showsource: 'HTMLソース',
      showoutline: 'アウトライン',
      showimagereport: '画像レポート',
      level: 'エラーと警告以外を表示しない',
    },
    urlLabel: 'HTMLの送信先（バリデータのURL）',
    tabCsr: 'CSR用',
    tabSsr: 'SSR用',
    csrTitle: '現在レンダリングされている見たままのHTMLが送信されます。',
    csrNotes: [
      '元々のHTMLに含まれていない文字列を含みます。',
      'ブラウザの拡張機能が検査結果に影響を及ぼすことがあります（シークレットブラウザ推奨）。',
      '秘密情報や個人情報を含む文字列が外部に送信される可能性があるため、送信先のドメインが信頼できるものであることを確認してください。',
    ],
    ssrTitle: 'サーバが返すHTMLが送信されます。',
    ssrNotes: [
      '秘密情報や個人情報を含む文字列が外部に送信される可能性があるため、送信先のドメインが信頼できるものであることを確認してください。',
    ],
    invalidUrl: 'URLが不正です。',
    copyLabel: 'ブックマークレットをコピー',
  },
  en: {
    optionsLegend: 'Show',
    optionsLabels: {
      showsource: 'Source',
      showoutline: 'Outline',
      showimagereport: 'Image report',
      level: 'Errors and warnings only',
    },
    urlLabel: 'Validator URL (where to send the HTML)',
    tabCsr: 'CSR',
    tabSsr: 'SSR',
    csrTitle: 'Sends the HTML as you see it in the browser.',
    csrNotes: [
      'Includes content not present in the original HTML (e.g., added by JavaScript or extensions).',
      'Browser extensions can affect the result — incognito/private mode is recommended.',
      'Sensitive or personal information may be sent. Make sure you trust the destination domain.',
    ],

    ssrTitle: 'Sends the raw HTML returned by the server.',
    ssrNotes: ['Sensitive or personal information may be sent. Make sure you trust the destination domain.'],

    invalidUrl: 'Invalid URL.',
    copyLabel: 'Copy bookmarklet',
  },
} satisfies Record<Lang, unknown>;

const optionsValueMap: Record<keyof Options, string> = {
  showsource: 'yes',
  showoutline: 'yes',
  showimagereport: 'yes',
  level: 'warning',
};

const createBookmarklet = (argUrl: string, type: 'ssr' | 'csr', options: Options, invalidUrlMessage: string) => {
  try {
    const url = new URL(argUrl);

    objectKeys(options).forEach((optionName) => {
      if (options[optionName]) {
        url.searchParams.set(optionName, optionsValueMap[optionName]);
      } else {
        url.searchParams.delete(optionName);
      }
    });

    const href = url.toString();
    const optionsString = objectKeys(options)
      .map((optionName) => {
        if (options[optionName]) {
          return `f('${optionName}','${optionsValueMap[optionName]}');`;
        }
      })
      .join('');

    if (type === 'ssr') {
      return `javascript:(async()=>{let a=document,b=await fetch(location.href).then(r=>r.text()),c=a.createElement('form'),f=(d,e)=>{let b=a.createElement('textarea');b.name=d;b.value=e;c.append(b)};c.method='POST';c.action='${href}';c.enctype='multipart/form-data';c.target='_blank';${optionsString}f('content',b);a.body.append(c);c.submit();c.remove()})()`;
    }
    return `javascript:(()=>{let a=document,b=c=>{let d='';for(c=c.firstChild;c;c=c.nextSibling)switch(c.nodeType){case 1:d+=c.outerHTML;break;case 3:d+=c.nodeValue;break;case 4:d+='<![CDATA['+c.nodeValue+']]>';break;case 8:d+='<!--'+c.nodeValue+'-->';break;case 10:d+='<!DOCTYPE '+c.name+'>\\n'}return d},c=a.createElement('form'),f=(d,e)=>{let b=a.createElement('textarea');b.name=d;b.value=e;c.append(b)};c.method='POST';c.action='${href}';c.enctype='multipart/form-data';c.target='_blank';${optionsString}f('content',b(a));a.body.append(c);c.submit();c.remove()})()`;
  } catch {
    return invalidUrlMessage;
  }
};

export const NuValidatorBookmarkletGenerator = ({ lang = 'ja' }: { lang?: Lang }) => {
  const t = i18n[lang];
  const [type, setType] = useState(t.tabCsr);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState('https://validator.w3.org/nu/#textarea');
  const [options, setOptions] = useState<Options>({
    showsource: true,
    showoutline: false,
    showimagereport: false,
    level: true,
  });

  useEffect(() => {
    const url = searchParams.get('url');

    if (url) {
      setUrl(url);
    }
  }, [searchParams]);

  return (
    <div className="bg-secondary mx-auto max-w-5xl rounded-2xl px-4 pb-10 pt-2.5 shadow-md sm:pb-14">
      <p className="sm:mb-34px mb-2 text-right text-xs">
        {lang === 'ja' ? <Link href="./en">* View in English</Link> : <Link href="../">※ 日本語はこちら</Link>}
      </p>

      <div className="mx-auto max-w-2xl">
        <fieldset className="mb-10">
          <legend className="mb-2 text-sm font-bold leading-snug">{t.optionsLegend}</legend>
          <ul className="ml-2 flex flex-wrap gap-x-4 gap-y-2">
            {objectKeys(options).map((optionName, index) => {
              return (
                <li key={index}>
                  <Checkbox
                    label={t.optionsLabels[optionName]}
                    checked={options[optionName]}
                    onChange={(e) => {
                      setOptions({ ...options, [optionName]: e.currentTarget.checked });
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="mb-12">
          <TextField
            label={t.urlLabel}
            placeholder="https://validator.w3.org/nu/#textarea"
            value={url}
            onInput={(e) => {
              setUrl(e.currentTarget.value);
              router.replace(`?url=${encodeURIComponent(e.currentTarget.value)}`, {
                scroll: false,
              });
            }}
            autoComplete="off"
          />
        </div>

        <Tab.Wrapper defaultCurrentKey={type} onChange={(key) => setType(key)}>
          <Tab.Panel tabKey={t.tabCsr}>
            <div className="mb-paragraph">
              <NoteBox headingLevel={2} title={t.csrTitle}>
                <NoteList list={t.csrNotes} symbol={lang === 'ja' ? '※' : '*'} />
              </NoteBox>
            </div>
            <Output value={createBookmarklet(url, 'csr', options, t.invalidUrl)} copyLabel={t.copyLabel} />
          </Tab.Panel>
          <Tab.Panel tabKey={t.tabSsr}>
            <div className="mb-paragraph">
              <NoteBox headingLevel={2} title={t.ssrTitle}>
                <NoteList list={t.ssrNotes} symbol={lang === 'ja' ? '※' : '*'} />
              </NoteBox>
            </div>
            <Output value={createBookmarklet(url, 'ssr', options, t.invalidUrl)} copyLabel={t.copyLabel} />
          </Tab.Panel>
        </Tab.Wrapper>
      </div>
    </div>
  );
};
