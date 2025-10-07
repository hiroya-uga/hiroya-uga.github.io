import { TwitterEmbed } from '@/components/Media';

const now = (() => {
  const date = new Date();
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
})();

const Twitter = ({ href }: { href: string }) => {
  return (
    <div className="@w640:max-w-[22.4375rem]">
      <TwitterEmbed href={href} noconversation />
    </div>
  );
};

export const PERSONAL_HISTORY = [
  {
    data: `2022.04 - ${now}`,
    description: [
      'Webアプリケーションの開発・運用',
      'Webアクセシビリティの向上・推進',
      {
        key: 'twitter',
        value: <Twitter href="https://x.com/hiroya_UGA/status/1918139344709407063" />,
      },
    ],
  },
  {
    data: '2022.02 - 2022.03',
    description: ['なにもしないをがんばる'],
  },
  {
    data: '2015.04 - 2022.02',
    description: [
      'Webサイトの構築・運用',
      '社内向けの技術サポート',
      '部署間交流や勉強会の企画・開催',
      '新卒研修の運営',
      '人材育成・人材開発',
      '業務支援ツールの開発',
      '広報SNSアカウントの運用',
      'デジタル・トランスフォーメーション事業の立ち上げメンバー',
      'UiPath / Python を用いたRPA開発',
      {
        key: 'twitter',
        value: <Twitter href="https://twitter.com/hiroya_UGA/status/1209397613272764416" />,
      },
    ],
  },
  {
    data: '2014.04 - 2015.03',
    description: ['UXに関する研究'],
  },
  {
    data: '2006',
    description: ['個人サイトを運営し始める', 'JavaScriptを触り始める'],
  },
  {
    data: '2003',
    description: ['HTMLに触り始める'],
  },
];
