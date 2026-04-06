import { Button } from '@/components/Clickable';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';

export const ExternalMediaSection = () => {
  return (
    <>
      <h2 className="@w640:text-2xl mb-2 text-xl font-bold tracking-wide">External Media</h2>

      <p className="mb-4">{getMetadata('/documents/media').description}</p>

      <table className="@w640:mb-2 mb-4">
        <thead className="sr-only">
          <tr>
            <th scope="col">日付</th>
            <th scope="col">記事</th>
          </tr>
        </thead>
        <tbody>
          {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
            return (
              <tr key={href} className="leading-6">
                <td className="@w640:pr-4 @w640:text-sm leading-inherit pr-2 font-mono text-xs">
                  <span className="inline-block">{date}</span>
                </td>
                <td className={clsx([index !== 2 && '@w640:pb-4 pb-3', '@w640:text-base leading-inherit text-sm'])}>
                  <a href={href} className="break-all">
                    {title}
                  </a>

                  <p className="text-secondary break-all text-xs">{new URL(href).hostname}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="@w640:mb-28 @w640:place-items-end mb-12 grid place-items-center">
        <Button href="/documents/media/">外部メディアリンク一覧を見る</Button>
      </p>
    </>
  );
};
