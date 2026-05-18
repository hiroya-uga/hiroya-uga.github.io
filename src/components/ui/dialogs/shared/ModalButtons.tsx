import { CSSProperties } from 'react';

type Action = {
  label: string;
  type?: 'submit' | 'button';
  onClick?: () => void;
};

interface Props {
  items: Action[];
}

export const ModalButtons = ({ items }: Readonly<Props>) => {
  if (items.length === 1) {
    const [item] = items;

    return (
      <p>
        <button type={item.type ?? 'button'} className="btn-run max-w-260px px-32PX py-2" onClick={item.onClick}>
          {item.label}
        </button>
      </p>
    );
  }

  const maxLength = Math.max(...items.map((item) => item.label.length));

  return (
    <ul
      style={
        {
          '--x-padding-inline': '8px',
          // padding-inline + border-width * 2
          '--x-basis': `calc(${maxLength}.5em + var(--x-padding-inline) * 2 + 2px)`,
          width: `max(calc(var(--x-basis) * 2 + ${items.length - 1} * 16px),100%)`,
        } as CSSProperties
      }
      className="gap-x-16PX flex max-w-full flex-wrap justify-center gap-y-2"
    >
      {items.map((item) => (
        <li key={item.label} className="w-(--x-basis) grow">
          <button type={item.type ?? 'button'} className="btn-run px-(--x-padding-inline) py-2" onClick={item.onClick}>
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
