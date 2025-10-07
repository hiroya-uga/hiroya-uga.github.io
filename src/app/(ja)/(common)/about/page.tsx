import { Fragment } from 'react';

import { Picture } from '@/components/Image';

import { PERSONAL_HISTORY } from '@/app/(ja)/(common)/about/constants';
import { TextLink } from '@/components/Clickable';
import { Heading } from '@/components/Heading';
import { DiscList } from '@/components/List';
import { Doumei } from '@/components/specific/Doumei';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';
import Link from 'next/link';

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

      <div className="@w640:grid @w640:grid-cols-[33%_1fr] @w640:items-start @w640:gap-6">
        <div className="@w640:sticky @w640:top-0">
          <Heading level={2} keepUseMarginTop>
            管理人について
          </Heading>

          <div className="@container mb-4">
            <p className="max-w-360px @w360:grid-cols-2 @w360:gap-x-6 @w360:pr-4 mx-auto grid place-items-center items-center gap-4">
              <span className="@w360:col-start-2 w-40">
                <Picture width={160} height={160} src="/profile.png" alt="似顔絵アイコン" className="w-full" priority />
              </span>

              <span className="@w360:col-start-1 @w360:row-start-1 grow whitespace-nowrap text-center text-xl">
                <span className="block leading-6 tracking-widest" translate="no">
                  宇賀景哉
                </span>
                <span className="palt block text-xs [letter-spacing:0.1375rem]">Hiroya UGA</span>
              </span>
            </p>
          </div>

          <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
          <p className="@w640:palt inline-block">
            「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
          </p>
          <p>アイコンは昔の上司がスマホで描いて送ってくれた管理人の似顔絵。</p>
          <p className="mt-6 text-xs">※ そういえばもう管理人って言い方もしないよね。</p>
        </div>
        <div className="@w640:mt-(--margin-heading-top) @w640:text-2xl @w640:font-bold mt-8 text-xl leading-snug">
          <dl className="leading-base text-sm font-normal">
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
                answer: 'b要素、fieldset要素とlegend要素。',
              },
              {
                // オリジナル質問
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
                  </ul>
                ),
              },
            ]
              .filter(({ answer }) => Boolean(answer))
              .map(({ title, answer }) => (
                <Fragment key={title}>
                  <dt className="bg-tertiary text-high-contrast mb-1 px-1.5">{title}</dt>
                  <dd className="not-last:mb-6 pl-1.5">{answer}</dd>
                </Fragment>
              ))}
          </dl>
        </div>
      </div>

      <Heading level={3}>これまでのあらすじ</Heading>

      <div className="@w640:pl-0.5 pl-2">
        <p className="mb-paragraph text-sm">
          <Link href="/documents/media/">外部メディアリンク一覧はこちら</Link>をご覧ください。
        </p>

        <div className="@w640:after:w-1px @w640:after:border-primary @w640:after:absolute @w640:after:left-4 @w640:after:top-0 @w640:after:h-full @w640:after:border-l relative">
          <table className="@w640:text-base block-table text-sm">
            <tbody className="@w640:grid @w640:grid-cols-[auto_1fr]">
              {PERSONAL_HISTORY.map(({ data, description }) => {
                return (
                  <tr key={data} className="@w640:grid @w640:grid-cols-subgrid @w640:col-span-2 group">
                    <th
                      className={clsx([
                        'text-secondary bg-primary @w640:font-normal @w640:pb-8 @w640:group-last:pb-0 @w640:text-sm @w640:pt-0.5 @w640:static pb-2 pt-4 text-left align-top font-bold',
                        'after:h-1px after:border-secondary @w640:after:hidden sticky top-0 after:absolute after:bottom-2 after:left-0 after:top-4 after:my-auto after:w-full after:border-t',
                        '@w640:col-start-1',
                      ])}
                    >
                      <span className="bg-primary @w640:sticky @w640:top-2 relative z-10 block w-fit pr-2">{data}</span>
                    </th>
                    <td className="@w640:pt-7 @w640:col-start-2 pb-8 pt-0.5 align-top group-last:pb-0">
                      <ul className="@w640:pl-2.5 space-y-1 pl-1.5">
                        {description.map((item) => {
                          const key = typeof item === 'string' ? item : item.key;
                          const value = typeof item === 'string' ? item : item.value;

                          return (
                            <li
                              key={key}
                              className={clsx([
                                typeof item === 'string'
                                  ? "before:size-5px flex gap-x-2 before:mt-3 before:inline-block before:shrink-0 before:rounded-full before:bg-[var(--color-primary)] before:content-['']"
                                  : 'not-first:mt-4 -ml-0.5',
                              ])}
                            >
                              <div
                                className={clsx(
                                  typeof item === 'string' ? 'grow' : '@w640:ml-auto @w640:max-w-full @w640:w-2/3',
                                )}
                              >
                                {value}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Heading level={2}>同盟・主張バナー</Heading>

      <Doumei />
    </>
  );
}
