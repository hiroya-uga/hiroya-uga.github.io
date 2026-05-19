'use client';

import { unicodePlaygroundLocales } from '@/components/pages/ToolsUnicodePlaygroundPage/locales';
import { Lang } from '@/types/lang';

interface Props {
  utf16Length: number;
  utf8Bytes: number;
  codepointCount: number;
  graphemeCount: number;
  lang: Lang;
}

export const StringStatus = ({ lang, utf16Length, utf8Bytes, codepointCount, graphemeCount }: Readonly<Props>) => {
  const t = unicodePlaygroundLocales[lang].stringStatus;
  const items = [
    { ...t.utf16Length, value: utf16Length },
    { ...t.utf8Bytes, value: utf8Bytes },
    { ...t.codepointCount, value: codepointCount },
    { ...t.graphemeCount, value: graphemeCount },
  ];

  return (
    <dl className="gap-x-8PX grid grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] gap-y-3">
      {items.map(({ label, sub, value }) => (
        <div key={label} className="px-12PX border-primary rounded-lg border pb-3 pt-2">
          <dt className="text-2xs text-secondary mb-1 font-bold uppercase tracking-wide">{label}</dt>
          <dd className="flex flex-col">
            <span className="pl-3px text-2xl font-bold">{value}</span>
            <span className="text-2xs text-secondary mt-1">{sub}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
};
