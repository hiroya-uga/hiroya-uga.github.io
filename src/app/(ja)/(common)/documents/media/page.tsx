import { externalMediaLinkList } from '@/data/externalMediaLinkList';

export default function Page() {
  return (
    <>
      <h1>外部メディア</h1>

      <p className="mb-8">🚧 WIP</p>

      <table className="mb-2 block sm:table">
        <tbody className="block sm:table-row-group">
          {externalMediaLinkList.map(({ date, category, title, href, tags }) => {
            return (
              <tr key={href} className="leading-6 sm:leading-7 grid grid-cols-[auto_1fr] sm:table-row">
                <td className="pr-2 font-mono text-xs leading-[inherit] sm:text-sm sm:pr-8 block col-start-1 col-end-2 sm:table-cell">
                  <span className="inline-block">{date}</span>
                </td>
                <td className="pr-2 font-mono sm:text-center uppercase text-xs leading-[inherit] sm:pr-8 col-start-2 col-end-3 block sm:table-cell">
                  <span className="inline-block">{category}</span>
                </td>
                <td className="pb-6 text-sm leading-[inherit] sm:text-base sm:pb-8 col-start-1 col-end-3 block sm:table-cell">
                  <p>
                    <a href={href} className="break-all">
                      {title}
                    </a>
                  </p>

                  <p className="text-xs text-gray-600 text-ellipsis overflow-hidden">{href}</p>

                  {tags && tags.length && (
                    <ul className="text-xs mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        return (
                          <li key={tag}>
                            <span className="p-1 bg-slate-200">{tag}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
