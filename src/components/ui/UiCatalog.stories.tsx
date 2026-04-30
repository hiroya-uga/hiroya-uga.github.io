import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Details } from './boxes/Details';
import { ExampleBox } from './boxes/ExampleBox';
import { NoteBox } from './boxes/NoteBox';
import { SpecBlockQuote } from './boxes/SpecBlockQuote/SpecBlockQuote';
import { Button } from './buttons/Button';
import { ClearButton } from './buttons/ClearButton';
import { HelpLink } from './buttons/HelpLink';
import { RunButton } from './buttons/RunButton';
import { TextLink } from './buttons/TextLink';
import { Toast } from './dialogs/Toast';
import { Checkbox } from './forms/Checkbox';
import { Radio } from './forms/Radio';
import { SelectField } from './forms/SelectField';
import { Switch } from './forms/Switch';
import { TextField } from './forms/TextField';
import { Heading } from './headings/Heading/Heading';
import { DiscList } from './lists/DiscList';
import { NoteList } from './lists/NoteList';
import { SimpleDescriptionList } from './lists/SimpleDescriptionList';
import { LoadingIcon } from './media/LoadingIcon';
import { Required } from './media/Required';
import { Tab } from './tabs/Tab/Tab';

type CatalogItem = {
  description?: string;
  name: string;
  render: () => ReactNode;
  wide?: boolean;
};

type CatalogSection = {
  items: CatalogItem[];
  title: string;
};

const noop = () => undefined;

const selectOptions = (
  <>
    <option value="">-- 選択してください --</option>
    <option value="tokyo">東京都</option>
    <option value="osaka">大阪府</option>
    <option value="aichi">愛知県</option>
  </>
);

const tabPanels = [
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

const ToastPreview = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('コピーしました');
  }, []);

  return (
    <div className="min-h-24">
      <Toast duration={3000} message={message} setMessage={setMessage} />
    </div>
  );
};

const sections: CatalogSection[] = [
  {
    title: 'Buttons',
    items: [
      {
        name: 'Button',
        render: () => <Button href="/about">詳細を見る</Button>,
      },
      {
        name: 'ClearButton',
        render: () => <ClearButton onClick={noop}>クリア</ClearButton>,
      },
      {
        name: 'HelpLink',
        render: () => <HelpLink href="https://validator.w3.org/nu/about.html">The Nu Html Checker について</HelpLink>,
      },
      {
        name: 'RunButton',
        render: () => <RunButton onClick={noop}>実行する</RunButton>,
      },
      {
        name: 'TextLink',
        render: () => <TextLink href="/contact">お問い合わせ</TextLink>,
      },
    ],
  },
  {
    title: 'Forms',
    items: [
      {
        name: 'Checkbox',
        render: () => <Checkbox defaultChecked={false} label="チェックボックスのラベル" onChange={noop} />,
      },
      {
        name: 'Radio',
        render: () => <Radio checked={false} label="選択肢" name="ui-catalog-radio-group" onChange={noop} />,
      },
      {
        name: 'SelectField',
        render: () => (
          <SelectField label="都道府県" onChange={noop}>
            {selectOptions}
          </SelectField>
        ),
        wide: true,
      },
      {
        name: 'Switch',
        render: () => <Switch defaultChecked={false} onChange={noop} />,
      },
      {
        name: 'TextField',
        render: () => <TextField label="名前" />,
        wide: true,
      },
    ],
  },
  {
    title: 'Boxes',
    items: [
      {
        name: 'Details',
        render: () => (
          <Details defaultOpen={false} id="ui-catalog-details" summary="詳細を見る">
            <p className="px-4 py-2">詳細コンテンツがここに表示されます。</p>
          </Details>
        ),
        wide: true,
      },
      {
        name: 'ExampleBox',
        render: () => (
          <ExampleBox>
            <p>サンプルのコンテンツがここに表示されます。</p>
          </ExampleBox>
        ),
        wide: true,
      },
      {
        name: 'NoteBox',
        render: () => <NoteBox>ここに内容が入ります。重要な情報や補足説明を記載してください。</NoteBox>,
        wide: true,
      },
      {
        name: 'SpecBlockQuote',
        render: () => (
          <SpecBlockQuote
            cite="https://www.w3.org/TR/wai-aria-1.2/"
            title="Accessible Rich Internet Applications (WAI-ARIA) 1.2"
          >
            <p>
              An accessible name is a short string, typically 1 to 3 words, that authors associate with an element to
              provide users of assistive technologies with a label for the element.
            </p>
          </SpecBlockQuote>
        ),
        wide: true,
      },
    ],
  },
  {
    title: 'Lists',
    items: [
      {
        name: 'DiscList',
        render: () => <DiscList list={['項目 1', '項目 2', '項目 3']} />,
        wide: true,
      },
      {
        name: 'NoteList',
        render: () => <NoteList list={['注意事項 1', '注意事項 2', '注意事項 3']} />,
        wide: true,
      },
      {
        name: 'SimpleDescriptionList',
        render: () => (
          <SimpleDescriptionList
            list={[
              { title: '名前', description: '山田太郎' },
              { title: '職業', description: 'フロントエンドエンジニア' },
              { title: '趣味', description: 'プログラミング、読書' },
            ]}
          />
        ),
        wide: true,
      },
    ],
  },
  {
    title: 'Media',
    items: [
      {
        name: 'LoadingIcon',
        render: () => <LoadingIcon />,
      },
      {
        name: 'Required',
        render: () => <Required />,
      },
    ],
  },
  {
    title: 'Headings',
    items: [
      {
        name: 'Heading',
        render: () => <Heading level={2}>見出しテキスト</Heading>,
      },
    ],
  },
  {
    title: 'Tabs',
    items: [
      {
        name: 'Tab',
        render: () => <Tab.Wrapper>{tabPanels}</Tab.Wrapper>,
        wide: true,
      },
    ],
  },
  {
    title: 'Dialogs',
    items: [
      {
        description: '初期表示の確認用にメッセージを流しています。',
        name: 'Toast',
        render: () => <ToastPreview />,
        wide: true,
      },
    ],
  },
];

const CatalogCard = ({
  description,
  name,
  render,
  wide = false,
}: Readonly<{
  description?: string;
  name: string;
  render: () => ReactNode;
  wide?: boolean;
}>) => {
  return (
    <article
      className={[
        'bg-background rounded-2xl border border-black/10 p-4 shadow-[0_8px_30px_rgb(0_0_0_/_0.05)]',
        wide ? 'md:col-span-2' : '',
      ].join(' ')}
    >
      <header className="mb-4">
        <h3 className="font-mono text-sm font-bold uppercase tracking-[0.08em]">{name}</h3>
        {description ? <p className="text-secondary mt-1 text-sm">{description}</p> : null}
      </header>
      <div className="overflow-hidden rounded-xl border border-black/5 bg-white p-4">{render()}</div>
    </article>
  );
};

const CatalogSection = ({ items, title }: Readonly<CatalogSection>) => {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-lg font-bold uppercase tracking-[0.08em]">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map(({ description, name, render, wide }) => {
          return <CatalogCard key={name} description={description} name={name} render={render} wide={wide} />;
        })}
      </div>
    </section>
  );
};

const UiCatalogPage = () => {
  return (
    <div className="bg-linear-to-br min-h-screen from-stone-50 via-slate-50 to-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Catalog / UI</p>
          <h1 className="text-3xl font-bold text-slate-900">src/components/ui</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Storybook 上の既存 UI を 1 ページに集約したカタログです。カテゴリごとに並べているので、個別 story
            を開かなくても全体像をざっと確認できます。
          </p>
        </header>

        {sections.map(({ items, title }) => {
          return <CatalogSection key={title} items={items} title={title} />;
        })}
      </div>
    </div>
  );
};

const meta = {
  title: 'Catalog/UI',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        segments: [],
      },
      router: {
        asPath: '/',
        pathname: '/',
        query: {},
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <UiCatalogPage />,
};
