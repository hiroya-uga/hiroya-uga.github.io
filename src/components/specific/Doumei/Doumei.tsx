import { Picture } from '@/components/Image';

export const Doumei = () => {
  return (
    <>
      <p className="mb-2">古き良き同盟リンク集。</p>

      <ul className="flex flex-wrap items-end gap-x-3 gap-y-4 sm:gap-y-3">
        {[
          {
            href: 'https://sites.google.com/view/happy-busy/',
            alt: '時間ねぇー',
            src: '/about/images/jikan-ne.png',
            width: 88,
            height: 31,
            title: '時間のないサイト運営者リング',
          },
          {
            href: 'http://osoiyo.ma-jide.com/',
            alt: 'かくのおそい',
            src: '/about/images/chihitsu-doumei.gif',
            title: '遅筆同盟',
            width: 32,
            height: 32,
          },
          {
            href: 'http://link.9no1.gozaru.jp/',
            src: '/about/images/koushin-osoidesu-doumei.gif',
            alt: '遅',
            width: 32,
            height: 32,
            title: '更新遅いです同盟',
          },
          {
            href: 'https://flanet.web.fc2.com/union/site_enjoy/',
            alt: '令和 個人サイト楽しみ隊！',
            src: '/about/images/reiwa-mo-kojin-site-wo-tanoshimitai-hito-no-doumei.gif',
            width: 80,
            height: 31,
            title: '令和も個人サイトを楽しみたい人の同盟',
          },
          {
            href: 'https://holydragoon.jp/site_love_union',
            alt: 'サイト好き同士の会',
            src: '/about/images/sitesuki-doushi-no-kai.png',
            width: 40,
            height: 40,
          },
          {
            href: 'https://onigiru.wixsite.com/onigiri',
            alt: 'おにぎり',
            src: '/about/images/onigiri-doumei.gif',
            width: 32,
            height: 32,
            title: 'おにぎり同盟',
          },
          {
            href: 'https://asteroid19.netlify.app/emoji/',
            alt: '絵文字',
            src: '/about/images/emoji-doumei.png',
            width: 88,
            height: 31,
            title: '絵文字同盟',
          },
          {
            href: 'http://haruka.saiin.net/~pyry/scrolling/',
            alt: 'スクロールし隊！',
            src: '/about/images/scroll-shitai.gif',
            width: 32,
            height: 32,
            title: 'スクロールし隊！',
          },
          {
            href: 'http://www.nextftp.com/12345',
            alt: 'タグうち',
            src: '/about/images/tag-uchi.gif',
            width: 34,
            height: 32,
            title: 'このHPはタグ打ちっ',
          },
          {
            href: 'http://pureless.fc2web.com/u/ossan/',
            alt: '記号BA-90同盟',
            src: '/about/images/kigou-ba-90-doumei.gif',
            width: 32,
            height: 32,
            title: '記号BA-90同盟',
          },
        ]
          .sort((a, b) => {
            if (a.height < b.height) return 1;
            if (b.height < a.height) return -1;
            return 0;
          })
          .map(({ href, alt, ...imageProps }) => (
            <li key={href}>
              <a href={href} className="block">
                <Picture {...imageProps} alt={alt} className="h-[revert-layer] [image-rendering:pixelated]" />
              </a>
            </li>
          ))}
      </ul>
    </>
  );
};
