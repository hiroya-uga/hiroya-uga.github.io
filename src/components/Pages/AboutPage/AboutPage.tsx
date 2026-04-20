import { TextLink } from '@/components/Clickable';
import { Heading } from '@/components/Heading';
import { Picture } from '@/components/Image';
import { DiscList } from '@/components/List';
import { Doumei } from '@/components/specific/Doumei';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

import { PersonalHistory, Zenryaku } from './server';

const metadata = getMetadata('/about');

export const AboutPage = () => {
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

          <div className="@container mb-paragraph">
            <p className="max-w-360px @w360:grid-cols-2 @w360:gap-x-6 @w360:pr-4 mx-auto grid place-items-center items-center gap-4">
              <span className="@w360:col-start-2 w-40">
                <Picture
                  width={160}
                  height={160}
                  src="/common/images/profile.png"
                  alt="似顔絵アイコン"
                  className="w-full"
                  priority
                />
              </span>

              <span className="@w360:col-start-1 @w360:row-start-1 grow whitespace-nowrap text-center text-xl">
                <span className="block leading-6 tracking-[0.2rem]" translate="no">
                  宇賀景哉
                </span>
                <span className="palt block text-xs tracking-[0.125rem]">Hiroya UGA</span>
              </span>
            </p>
          </div>

          <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
          <p className="inline-block">「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。</p>
          <p>アイコンは昔の上司がスマホで描いて送ってくれた管理人の似顔絵。</p>
          <p className="mt-6 text-xs">※ そういえばもう管理人って言い方もしないよね。</p>
        </div>
        <div className="@w640:mt-heading-top @w640:text-2xl @w640:font-bold mt-8 text-xl leading-snug">
          <Zenryaku />
        </div>
      </div>

      <PersonalHistory />

      <Heading level={2}>同盟・主張バナー</Heading>

      <p className="mb-paragraph">古き良き同盟リンク集。</p>

      <Doumei />
    </>
  );
};
