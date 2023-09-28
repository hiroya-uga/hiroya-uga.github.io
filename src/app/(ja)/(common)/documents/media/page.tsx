import { externalMediaList } from '@/data/externalMediaList';

export default function Page() {
  return (
    <>
      <h1>外部メディア</h1>

      <table className="mb-2">
        <tbody>
          {externalMediaList.map(({ date, category, title, href }) => {
            return (
              <tr key={href} className="leading-6 sm:leading-7">
                <td className="pr-2 font-mono text-xs leading-[inherit] sm:text-sm sm:pr-8">
                  <span className="inline-block">{date}</span>
                </td>
                <td className="pr-2 font-mono text-center uppercase text-xs leading-[inherit] sm:pr-8">
                  <span className="inline-block">{category}</span>
                </td>
                <td className="pb-6 text-sm leading-[inherit] sm:text-base sm:pb-8">
                  <a href={href} className="break-all">
                    {title}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
