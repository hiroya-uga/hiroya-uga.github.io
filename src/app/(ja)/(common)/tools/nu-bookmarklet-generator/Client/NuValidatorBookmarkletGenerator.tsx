'use client';

import { NoteBox } from '@/components/Box';
import { Checkbox, TextField } from '@/components/Form';
import { Tab } from '@/components/Tab';
import { objectKeys } from '@/utils/object-keys';
import { useState } from 'react';
import { Output } from './Output';

interface Options {
  showsource: boolean;
  showoutline: boolean;
  showimagereport: boolean;
  level: boolean;
}

const optionsLabelMap: Record<keyof Options, string> = {
  showsource: 'ソースを表示する',
  showoutline: 'アウトラインを表示する',
  showimagereport: '画像レポートを表示する',
  level: 'エラーと警告のみ表示する',
};

const optionsValueMap: Record<keyof Options, string> = {
  showsource: 'yes',
  showoutline: 'yes',
  showimagereport: 'yes',
  level: 'warning',
};

const createBookmarklet = (url: string, type: 'ssr' | 'csr', options: Options) => {
  const optionsString = objectKeys(options)
    .map((optionName) => {
      if (options[optionName]) {
        return `f('${optionName}','${optionsValueMap[optionName]}');`;
      }
    })
    .join('');

  if (type === 'ssr') {
    return `javascript:(async()=>{let a=document,b=await fetch(location.href).then(r=>r.text()),c=a.createElement('form'),f=(d,e)=>{let b=a.createElement('textarea');b.name=d;b.value=e;c.append(b)};c.method='POST';c.action='${url}';c.enctype='multipart/form-data';c.target='_blank';${optionsString}f('content',b);a.body.append(c);c.submit();c.remove()})()`;
  }
  return `javascript:(()=>{let a=document,b=c=>{let d='';for(c=c.firstChild;c;c=c.nextSibling)switch(c.nodeType){case 1:d+=c.outerHTML;break;case 3:d+=c.nodeValue;break;case 4:d+='<![CDATA['+c.nodeValue+']]>';break;case 8:d+='<!--'+c.nodeValue+'-->';break;case 10:d+='<!DOCTYPE '+c.name+'>\\n'}return d},c=a.createElement('form'),f=(d,e)=>{let b=a.createElement('textarea');b.name=d;b.value=e;c.append(b)};c.method='POST';c.action='${url}';c.enctype='multipart/form-data';c.target='_blank';${optionsString}f('content',b(a));a.body.append(c);c.submit();c.remove()})()`;
};

export const NuValidatorBookmarkletGenerator = () => {
  const [type, setType] = useState('CSR用');
  const [url, setUrl] = useState('https://validator.w3.org/nu/#textarea');
  const [options, setOptions] = useState<Options>({
    showsource: true,
    showoutline: false,
    showimagereport: false,
    level: true,
  });

  return (
    <div className="bg-secondary mx-auto max-w-5xl rounded-2xl p-4 py-10 shadow-md sm:px-12 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <fieldset className="mb-10">
          <legend className="mb-2 text-sm font-bold leading-snug">Show</legend>
          <ul className="ml-2 flex flex-wrap gap-x-4 gap-y-2">
            {objectKeys(options).map((optionName, index) => {
              return (
                <li key={index}>
                  <Checkbox
                    label={optionsLabelMap[optionName]}
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
            label="HTMLの送信先（バリデータのURL）"
            placeholder="https://validator.w3.org/nu/#textarea"
            value={url}
            onInput={(e) => setUrl(e.currentTarget.value)}
            autoComplete="off"
          />
        </div>

        <Tab.Wrapper defaultCurrentKey={type} onChange={(key) => setType(key)}>
          <Tab.Panel tabKey="CSR用">
            <div className="mb-paragraph">
              <NoteBox title="現在レンダリングされている見たままのHTMLが送信されます。">
                <p>
                  <strong>元々のHTMLに含まれていない文字列を含みます。</strong>
                </p>
                <p>
                  秘密情報や個人情報を含む文字列が外部に送信される可能性があるため、送信先のドメインが信頼できるものであることを確認してください。
                </p>
              </NoteBox>
            </div>
            <Output value={createBookmarklet(url, 'csr', options)} />
          </Tab.Panel>
          <Tab.Panel tabKey="SSR用">
            <div className="mb-paragraph">
              <NoteBox title="サーバが返すHTMLが送信されます。">
                <p>
                  秘密情報や個人情報を含む文字列が外部に送信される可能性があるため、送信先のドメインが信頼できるものであることを確認してください。
                </p>
              </NoteBox>
            </div>
            <Output value={createBookmarklet(url, 'ssr', options)} />
          </Tab.Panel>
        </Tab.Wrapper>
      </div>
    </div>
  );
};
