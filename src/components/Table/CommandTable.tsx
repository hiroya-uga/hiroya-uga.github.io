import { Lang } from '@/types/lang';

const labels: Record<Lang, { cmd: string; desc: string }> = {
  ja: { cmd: 'コマンド', desc: '機能説明' },
  en: { cmd: 'Command', desc: 'Description' },
};

interface Item {
  cmd: string;
  desc: string;
}

interface Props {
  items: Item[];
  lang: Lang;
}

export const CommandTable = ({ items, lang }: Props) => {
  const { cmd: cmdLabel, desc: descLabel } = labels[lang];

  return (
    <table className="bg-secondary @w640:table @w640:border-separate @w640:border-spacing-0 border-primary block w-full overflow-hidden rounded border">
      <thead className="sr-only">
        <tr>
          <th scope="col">{cmdLabel}</th>
          <th scope="col">{descLabel}</th>
        </tr>
      </thead>
      <tbody className="@w640:table-row-group @w640:[&>tr:not(:first-child)>*]:border-t @w640:[&>tr:not(:first-child)>*]:border-primary divide-primary block divide-y dark:divide-slate-600">
        {items.map(({ cmd, desc }) => (
          <tr key={cmd} className="@w640:table-row block">
            <th
              scope="row"
              className="@w640:table-cell @w640:py-2 block overflow-auto whitespace-nowrap px-3 pt-2 text-left align-middle font-normal"
            >
              <code>{cmd}</code>
            </th>
            <td className="@w640:table-cell @w640:py-2 block px-3 pb-2 align-middle text-sm leading-relaxed">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
