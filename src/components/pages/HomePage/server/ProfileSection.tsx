import { TextLink } from '@/components/ui/buttons/TextLink';
import { AvatarAuthor } from '@/components/ui/embed/AvatarAuthor';
import { Doumei } from '@/components/ui/embed/Doumei';
import { Picture } from '@/components/ui/features/Picture';
import { SNS_LINKS } from '@/constants/sns';

export const ProfileSection = () => {
  return (
    <>
      <div className="w640:grid w640:gap-x-12 w640:pt-20 border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) grid-cols-[1fr_min(30%,360px)] grid-rows-[auto_1fr] border-t border-dashed">
        <h2 className="col-start-1 col-end-2 row-start-1 row-end-2">Profile</h2>

        <div className="w640:leading-inherit w640:pt-resolve-line-height w640:col-start-2 w640:col-end-3 w640:row-start-1 w640:row-end-3 w640:m-0 mx-auto mb-8 pr-4">
          <p className="@container">
            <AvatarAuthor />
          </p>
        </div>

        <div className="col-start-1 col-end-2 row-start-2 row-end-3">
          <div className="w640:text-base mb-paragraph">
            <p>大器晩成型のフロントエンドWeb開発者。Web標準の話が好き。</p>
            <p>「元気に楽しく、自信と情熱を持って、すべてのWebをアクセシブルに」がモットー。</p>
            <p>
              詳しくは<TextLink href="/about">当サイトおよび管理人について</TextLink>をご覧ください。
            </p>
          </div>

          <ul className="w640:-m-2 w640:justify-start w640:gap-2 flex flex-wrap items-center justify-center gap-4 dark:invert">
            {SNS_LINKS.map(({ href, alt, ...props }) => {
              return (
                <li key={href}>
                  <a
                    href={href}
                    className="w640:p-3 block rounded-xl p-2 transition-colors [corner-shape:squircle] hover:bg-gray-200"
                  >
                    <Picture
                      {...props}
                      width={props.width + 4}
                      height={props.height + 4}
                      alt={alt}
                      className="w640:h-7 h-8 w-auto"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="w640:grid w640:gap-x-12 border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) border-t border-dashed">
        <h2 className="col-start-1 col-end-2 row-start-1 row-end-2">Doumei banners</h2>
        <p className="w640:mb-7 mb-3.5">古き良き同盟リンク集。</p>

        <Doumei />
      </div>
    </>
  );
};
