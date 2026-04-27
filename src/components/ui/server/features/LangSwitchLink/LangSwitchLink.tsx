import Link from 'next/link';

import { Lang } from '@/types/lang';

interface Props {
  lang: Lang;
}

export const LangSwitchLink = ({ lang }: Props) => {
  if (lang === 'ja') {
    return (
      <Link href="./en" lang="en" hrefLang="en">
        * View in English
      </Link>
    );
  }

  return (
    <Link href="../" lang="ja" hrefLang="ja">
      ※ 日本語はこちら
    </Link>
  );
};
