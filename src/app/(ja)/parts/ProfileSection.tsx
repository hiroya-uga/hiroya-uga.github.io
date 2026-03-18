import { TextLink } from '@/components/Clickable';
import { Picture } from '@/components/Image';
import { Doumei } from '@/components/specific/Doumei';
import { SNS_LINKS } from '@/constants/sns';

export const ProfileSection = () => {
  return (
    <>
      <div className="@w640:mb-0 @w640:mt-20 @w640:grid @w640:gap-x-12 @w640:pt-20 border-t-secondary mb-8 mt-12 grid-cols-[1fr_auto] grid-rows-[auto_1fr] border-t border-dashed pt-12">
        <h2 className="@w640:text-2xl col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold">
          Profile
        </h2>

        <p className="aspect-8/5 max-w-360px @w640:leading-inherit @w640:col-start-2 @w640:col-end-3 @w640:row-start-1 @w640:row-end-3 @w640:m-0 @w640:aspect-auto @w640:gap-x-6 @w640:flex-nowrap mx-auto mb-8 flex flex-wrap items-center gap-4 pr-4 leading-none">
          <span className="grow whitespace-nowrap text-center text-xl leading-tight">
            <span className="block leading-6 tracking-widest" translate="no">
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
          <span className="w-40">
            <Picture
              width={160}
              height={160}
              src="/profile.png"
              alt="似顔絵アイコン"
              className="w-full"
              priority={false}
            />
          </span>
        </p>

        <div className="@w640:mb-paragraph col-start-1 col-end-2 row-start-2 row-end-3">
          <div className="@w640:max-w-xl @w640:pr-4">
            <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
            <p className="@w640:palt inline-block">
              「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。
            </p>
            <p>
              詳しくは<TextLink href="/about">当サイトおよび管理人について</TextLink>をご覧ください。
            </p>
          </div>
        </div>
      </div>

      <ul className="@w640:-m-2 @w640:justify-start @w640:gap-2 flex flex-wrap items-center justify-center gap-4 dark:invert">
        {SNS_LINKS.map(({ href, alt, ...props }) => {
          return (
            <li key={href}>
              <a
                href={href}
                className="@w640:p-3 block rounded-xl p-2 transition-colors [corner-shape:squircle] hover:bg-gray-200"
              >
                <Picture
                  {...props}
                  width={props.width + 4}
                  height={props.height + 4}
                  alt={alt}
                  className="@w640:h-7 h-8 w-auto"
                />
              </a>
            </li>
          );
        })}
      </ul>

      <div className="@w640:mb-0 @w640:mt-20 @w640:grid @w640:gap-x-12 @w640:pt-20 border-t-secondary mb-10 mt-12 border-t border-dashed pt-12">
        <h2 className="@w640:text-2xl col-start-1 col-end-2 row-start-1 row-end-2 mb-4 mt-0 text-xl font-bold">
          Doumei banners
        </h2>

        <Doumei />
      </div>
    </>
  );
};
