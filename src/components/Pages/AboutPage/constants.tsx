import type { ReactNode } from 'react';

import { TwitterEmbed } from '@/components/Media';

export type HistoryItem =
  | string
  | {
      date: string;
      description: string;
      embed?: ReactNode;
    }
  | {
      key: string;
      date?: string;
      description: ReactNode;
      embed?: ReactNode;
    };

type HistoryEntry = {
  data: string;
  descriptions: HistoryItem[];
};

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

export const PERSONAL_HISTORY: HistoryEntry[] = [
  {
    data: `2022.04 - ${now}`,
    descriptions: [
      'Webアプリケーションの開発・運用',
      'Webアクセシビリティの向上・推進',
      {
        key: 'a11y-chiba-2026',
        date: '2026.09',
        description: (
          <>
            <a href="https://a11y-chiba.com/2026/">アクセシビリティカンファレンスCHIBA2026</a> ボランティアスタッフ
          </>
        ),
      },
      {
        key: 'a11y-chiba-2025',
        date: '2025.09',
        description: (
          <>
            <a href="https://a11y-chiba.com/2025/">アクセシビリティカンファレンスCHIBA2025</a> ボランティアスタッフ
          </>
        ),
      },
      {
        date: '2026.06',
        description:
          'Software Design 2025年6月号\n第1特集「これからのエンジニアの必須科目 ITアクセシビリティ入門」の第4章を執筆',
        embed: <Twitter href="https://x.com/hiroya_UGA/status/1918139344709407063" />,
      },
    ],
  },
  {
    data: '2022.02 - 2022.03',
    descriptions: ['なにもしないをがんばる'],
  },
  {
    data: '2015.04 - 2022.02',
    descriptions: [
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
        date: '2019.12',
        description: '「Form Design Patterns」日本語版 技術レビュアー（謝辞掲載）',
        embed: <Twitter href="https://twitter.com/hiroya_UGA/status/1209397613272764416" />,
      },
    ],
  },
  {
    data: '2014.04 - 2015.03',
    descriptions: ['UXに関する研究'],
  },
  {
    data: '2006',
    descriptions: ['個人サイトを運営し始める', 'JavaScriptを触り始める'],
  },
  {
    data: '2003',
    descriptions: ['HTMLに触り始める'],
  },
];

type ProfileQAItem = {
  title: string;
  answer: ReactNode;
};

const profileQAItems: ProfileQAItem[] = [
  { title: 'HN', answer: 'Hiroya UGA' },
  { title: 'HNの由来', answer: '本名。' },
  { title: '性別', answer: '' },
  { title: '誕生日', answer: '早生まれって割とうれしいことのほうが多い気がしてますけれど、気のせい？👀' },
  { title: '星座', answer: '' },
  { title: '血液型', answer: '' },
  { title: '前世', answer: '' },
  { title: '住んでいるところ', answer: '' },
  { title: '生まれたところ', answer: '' },
  { title: '職業', answer: 'フロントエンドエンジニア' },
  { title: '学年', answer: '' },
  { title: '絡むーちょ', answer: 'アクセシビリティとかWeb標準が好きな人、いんたーねっとでもイベントでもお気軽に🫶' },
  { title: '似ている芸能人', answer: '' },
  { title: '身長', answer: 'Math.ceil(身長) したら170😂' },
  { title: '体重', answer: '' },
  { title: '足のサイズ', answer: '' },
  { title: '手の長さ', answer: '' },
  { title: '趣味', answer: 'カメラとか動画鑑賞とかスポーツシューティングとか' },
  { title: '特技', answer: '' },
  { title: '握力', answer: 'よわい✊' },
  { title: '髪型', answer: 'アイコンとは違う感じ' },
  { title: '口癖', answer: '' },
  { title: '性格', answer: '' },
  { title: '嗜好品', answer: '' },
  { title: '自慢なこと', answer: 'ちょっとお高級なカトラリーとか食器を集めているぞ！' },
  { title: '持っている資格', answer: '' },
  { title: '使っている携帯電話', answer: '' },
  { title: '好きな男性のタイプ', answer: '' },
  { title: '好きな女性のタイプ', answer: '' },
  {
    title: '好きな言葉',
    answer: (
      <>
        <figure className="mb-1 w-fit">
          <blockquote cite="https://naruto-official.com/comics/01_92">
            <p className='before:content-["「"] after:content-["」"]'>
              自分を信じない奴なんかに<span className="inline-block">努力する価値はない!!!</span>
            </p>
          </blockquote>
          <figcaption className="text-xs">
            <cite className='pl-2 not-italic before:content-["—_"]'>
              <a href="https://naruto-official.com/comics/01_92">NARUTO 10巻 84話「努力の天才…!!」</a>
            </cite>
            より
          </figcaption>
        </figure>

        <figure className="w-fit">
          <blockquote cite="https://www.tcc.gr.jp/copira/id/87413/">
            <p className='before:content-["「"] after:content-["」"]'>
              風はすべて追い風。<span className="inline-block">わたしがどこを向くかだ。</span>
            </p>
          </blockquote>
          <figcaption className="text-xs">
            <cite className='pl-2 not-italic before:content-["—_"]'>
              <a href="https://www.tcc.gr.jp/copira/id/87413/">東京コピーライターズクラブ</a>
            </cite>
            より
          </figcaption>
        </figure>
      </>
    ),
  },
  { title: '好きな芸能人', answer: '' },
  {
    title: '好きな食べ物',
    answer: 'お寿司、サラダ、きゅうり、キャベツ、ネギ、納豆、なめ茸、にんにく、ラーメン、馬刺し、タピオカ🧋とかとか',
  },
  { title: '嫌いな食べ物', answer: '' },
  { title: '好きな飲み物', answer: '紅茶、緑茶、コーラ、お酒に弱いけど日本酒🍶' },
  { title: '嫌いな飲み物', answer: '' },
  { title: '好きな教科', answer: '技術、情報、美術、音楽、総合' },
  { title: '嫌いな教科', answer: '' },
  { title: '好きなテレビ番組', answer: '' },
  { title: '好きな映画', answer: '' },
  { title: '好きな本', answer: '' },
  { title: '好きなスポーツ', answer: '' },
  {
    title: '好きな音楽',
    answer: (
      <>
        <p>吹奏楽とアニソンばっかり聴いていた学生時代🥁</p>
        <p>
          Fear, and Loathing in Las
          Vegasさんを初めて聴いてからピコリーモが好きになったりもしました。ベガスはいいぞ。そんでもって今はYouTubeで流行った曲が耳に入るくらい…
        </p>
      </>
    ),
  },
  { title: '好きなブランド', answer: 'Nikon、Panasonicを信じている民' },
  { title: '愛用の香水', answer: '' },
  { title: '好きな花', answer: 'ひたちなかのネモフィラはすごい！' },
  {
    title: '好きなゲーム',
    answer:
      [
        'スプラ',
        'DEATH STRANDING',
        'NieR:Automata/Replicant',
        '龍が如く',
        'METAL GEAR SOLID',
        'UNDERTALE',
        'Devil May Cry',
        'ロックマンエグゼ２〜３',
        'ロックマンX6',
        'テイルズウィーバー',
        'MixMaster',
        'サドンアタック',
        'ポケモン金・銀',
      ].join('、') + 'などなど',
  },
  { title: '好きな要素', answer: 'b要素、fieldset要素とlegend要素。' },
  {
    title: '嫌いなWeb広告',
    answer:
      '画面を埋め尽くしてきたり、閉じるボタンのクリック範囲が狭すぎたり、pointerdownとかpointerupイベントでクリックしたことにされるやつ🤬',
  },
  { title: '愛車', answer: '' },
  {
    title: '将来の夢',
    answer:
      '小学校の卒業アルバムには「HPデザイナー」になりたいって書いていたようですが、最終的にフロントエンドエンジニアになりました。',
  },
  { title: '好きな動物', answer: '' },
  { title: '休日の過ごし方', answer: '' },
  { title: '尊敬する人', answer: '松岡修造さん' },
  { title: '今一番欲しいもの', answer: '' },
  { title: '今一番行きたいところ', answer: '' },
  { title: '今一番やりたいこと', answer: '１ヶ月くらいなにもしないをしたい' },
  { title: 'よく使う路線', answer: '' },
  { title: 'よく遊ぶところ', answer: 'いんたーねっと' },
  { title: 'カラオケでよく歌う曲', answer: '' },
  {
    title: '初めて買ったＣＤ',
    answer: (
      <>
        CHEMISTRYさんの<a href="https://ja.wikipedia.org/wiki/ALL_THE_BEST">ALL THE BEST</a>。
      </>
    ),
  },
  { title: 'マイブーム', answer: '朝方にシフトすること' },
  { title: '最近ひそかに興味があること', answer: '' },
  { title: '生まれ変わったら', answer: '' },
  {
    title: '世界平和に必要なのは',
    answer: 'あれこれ考えてしまって軽率にこういう質問が答えられなくなってしまった自分が悲しい🕸️',
  },
  {
    title: '兎に角主張したい事',
    answer: 'Webコンテンツを発信するならアクセシビリティちゃんと大事にしようよ！！！！！！',
  },
  { title: '疑問に思っている事', answer: '' },
  { title: 'ここだけの話', answer: 'パロディーしておいてなんですが、前略プロフ、通ってないんです。' },
  {
    title: 'Myﾘﾝｸ',
    answer: (
      <ul>
        <li>
          🦆 <a href="https://x.com/hiroya_UGA">ﾂｲｯﾀｰ</a>
        </li>
        <li>
          📷 <a href="https://www.instagram.com/hiroya.uga">ｲﾝｽﾀｸﾞﾗﾑ</a>
        </li>
        <li>
          🌅 <a href="https://www.flickr.com/photos/hiroya-uga">ﾌﾘｯｶｰ</a>
        </li>
        <li>
          ✒️ <a href="https://codepen.io/hiroya_uga">ｺｰﾄﾞﾍﾟﾝ</a>
        </li>
        <li>
          🐙 <a href="https://github.com/hiroya-uga">ｷﾞｯﾄﾊﾌﾞ</a>（
          <a href="https://github.com/search?q=+author%3Ahiroya-uga+-user%3Ahiroya-uga+is%3Amerged&type=pullrequests&s=created&o=desc">
            OSS活動はこちら
          </a>
          ）
        </li>
      </ul>
    ),
  },
];

export const ZENRYAKU = profileQAItems.filter(({ answer }) => answer !== '');
