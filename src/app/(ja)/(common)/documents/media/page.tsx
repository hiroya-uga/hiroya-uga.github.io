import { externalMediaList } from '@/data/externalMediaList';

export default function Page() {
  return (
    <>
      <h1>外部メディア</h1>

      <table className="mb-2">
        <tbody>
          {externalMediaList.map(({ date, category, title, href }) => {
            return (
              <tr key={href} className="leading-6">
                <td className="pr-4 font-mono align-top">
                  <span className="inline-block">{date}</span>
                </td>
                <td className="pr-4 font-mono text-center uppercase text-xs align-top leading-[inherit]">
                  <span className="inline-block">{category}</span>
                </td>
                <td className="pb-3">
                  <a href={href}>{title}</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
