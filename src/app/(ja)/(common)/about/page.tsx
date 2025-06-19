import { Fragment } from 'react';

import Image from 'next/image';

import { TextLink } from '@/components/Clickable';
import { Heading } from '@/components/Heading';
import { DiscList } from '@/components/List';
import { Doumei } from '@/components/specific/Doumei';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/about');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>当サイトは、Webコンテンツを作るのが好きなエンジニアのおもちゃ箱です。</p>
        <p>メモ書きや、ちょっとしたツールなどが置いてあります。</p>
      </PageTitle>

      <Heading level={2}>ご利用にあたって</Heading>

      <p>ご利用いただく際の留意事項や当サイトの方針を以下にまとめております。</p>
      <p className="mb-paragraph">
        不明な点がございましたら
        <TextLink href="/contact">お問い合わせ</TextLink>よりご連絡ください。
      </p>

      <DiscList
        list={[
          {
            key: 'プライバシーポリシー',
            value: <TextLink href="/privacy-policy">プライバシーポリシー</TextLink>,
          },
          {
            key: '免責事項',
            value: <TextLink href="/disclaimer">免責事項</TextLink>,
          },
        ]}
      />

      <div className="mt-14 sm:mt-16 sm:grid sm:grid-cols-[33%,_1fr] sm:items-start sm:gap-6">
        <div className="sm:sticky sm:top-6">
          <Heading level={2}>管理人について</Heading>

          <p className="mx-auto mb-4 flex max-w-360px flex-row-reverse items-center gap-4 leading-none sm:grid sm:place-items-center sm:gap-x-6">
            <span className="w-40">
              <Image width={160} height={160} src="/profile.png" alt="似顔絵アイコン" className="w-full" />
            </span>

            <span className="grow whitespace-nowrap text-center text-xl leading-tight">
              <span className="tracking-widest" translate="no">
                宇賀景哉
              </span>
              <span
                className="palt block text-xs"
                style={{
                  letterSpacing: '0.1375rem',
                }}
              >
                Hiroya UGA
              </span>
            </span>
          </p>

          <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
          <p className="sm:palt inline-block">
            「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
          </p>
          <p>アイコンは昔の上司がスマホで描いて送ってくれた管理人の似顔絵。</p>
          <p className="mt-6 text-xs">※ そういえばもう管理人って言い方もしないよね。</p>
        </div>
        <div className="mt-8 sm:mt-3px">
          <dl className="text-sm">
            {[
              {
                title: 'HN',
                answer: 'Hiroya UGA',
              },
              {
                title: 'HNの由来',
                answer: '本名。',
              },
              { title: '性別', answer: '' },
              { title: '誕生日', answer: '早生まれって割とうれしいことのほうが多い気がしてますけれど、気のせい？👀' },
              { title: '星座', answer: '' },
              { title: '血液型', answer: '' },
              { title: '前世', answer: '' },
              { title: '住んでいるところ', answer: '' },
              { title: '生まれたところ', answer: '' },
              {
                title: '職業',
                answer: 'フロントエンドエンジニア',
              },
              { title: '学年', answer: '' },
              {
                title: '絡むーちょ',
                answer: 'アクセシビリティとかWeb標準が好きな人、いんたーねっとでもイベントでもお気軽に🫶',
              },
              { title: '似ている芸能人', answer: '' },
              { title: '身長', answer: 'Math.ceil(身長) したら170😂' },
              { title: '体重', answer: '' },
              { title: '足のサイズ', answer: '' },
              { title: '手の長さ', answer: '' },
              {
                title: '趣味',
                answer: 'カメラとか動画鑑賞とかスポーツシューティングとか',
              },
              { title: '特技', answer: '' },
              { title: '握力', answer: 'よわい✊' },
              { title: '髪型', answer: 'アイコンとは違う感じ' },
              { title: '口癖', answer: '' },
              { title: '性格', answer: '' },
              { title: '嗜好品', answer: '' },
              { title: '自慢なこと', answer: 'ちょっとお高級なカラトリーとか食器を集めているぞ！' },
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
                        <p className=' before:content-["「"] after:content-["」"] '>
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
                        <p className=' before:content-["「"] after:content-["」"] '>
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
                answer:
                  'お寿司、サラダ、きゅうり、キャベツ、ネギ、納豆、なめ茸、にんにく、ラーメン、馬刺し、タピオカ🧋とかとか',
              },
              { title: '嫌いな食べ物', answer: '' },
              {
                title: '好きな飲み物',
                answer: '紅茶、緑茶、コーラ、お酒に弱いけど日本酒🍶',
              },
              { title: '嫌いな飲み物', answer: '' },
              {
                title: '好きな教科',
                answer: '技術、情報、美術、音楽、総合',
              },
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
              {
                // オリジナル質問
                title: '好きな要素',
                answer: 'b要素。',
              },
              {
                // オリジナル質問
                title: '嫌いなWeb広告',
                answer:
                  '画面を埋め尽くしてきたり、閉じるボタンのクリック範囲が狭すぎたり、touchendとかpointerupイベントでクリックしたことにされるやつ🤬',
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
                  </ul>
                ),
              },
            ]
              .filter(({ answer }) => Boolean(answer))
              .map(({ title, answer }) => (
                <Fragment key={title}>
                  <dt className="mb-1 bg-slate-500 px-1.5 text-white">{title}</dt>
                  <dd className="mb-6">{answer}</dd>
                </Fragment>
              ))}
          </dl>
        </div>
      </div>

      <Heading level={2}>同盟・主張バナー</Heading>

      <Doumei />
    </>
  );
}
