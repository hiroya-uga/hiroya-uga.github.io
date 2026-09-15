import { Button } from '@/components/ui/buttons/Button';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';

export const ExternalMediaSection = () => {
  return (
    <>
      <h2>External Media</h2>

      <p className="w640:mb-7.5 mb-4">{getMetadata('/documents/media').description}</p>

      <div className="@container">
        <table className="@w280:table block">
          <thead className="sr-only">
            <tr>
              <th scope="col">日付</th>
              <th scope="col">記事</th>
            </tr>
          </thead>
          <tbody className="@w280:table-row-group block">
            {externalMediaLinkList.slice(0, 3).map(({ date, title, href }, index) => {
              return (
                <tr key={href} className="@w280:table-row block leading-6">
                  <td className="@w280:table-cell w640:pr-4 w640:text-sm leading-inherit block pr-2 font-mono text-xs">
                    <span className="inline-block">{date}</span>
                  </td>
                  <td
                    className={clsx([
                      index !== 2 && 'w640:pb-4 pb-3',
                      '@w280:table-cell w640:text-base leading-inherit block text-sm',
                    ])}
                  >
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

        <p className="w640:mt-6.5 w640:place-items-end mt-8 grid place-items-center">
          <Button href="/documents/media/">外部メディアリンク一覧を見る</Button>
        </p>
      </div>
    </>
  );
};
