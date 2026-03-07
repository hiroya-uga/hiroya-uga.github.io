import { SvgIcon } from '@/components/Icons';
import { useCopyButton } from '@/hooks/use-copy-button';

const CopyButton = () => {
  const { handleClickCopyButton } = useCopyButton();

  return (
    <p className="bg-secondary sticky bottom-0">
      <button
        type="button"
        className="hover:bg-tertiary-hover bg-tertiary grid w-full grid-cols-[1rem_auto] items-center justify-center gap-1 rounded-b-lg p-4 transition-colors"
        onClick={(e) => {
          const label = e.currentTarget.lastElementChild;
          const value = e.currentTarget.parentElement?.previousElementSibling?.textContent?.trim() ?? '';

          if (label instanceof HTMLElement === false) {
            return;
          }

          handleClickCopyButton(value, label);
        }}
      >
        <span className="relative block size-4">
          <SvgIcon name="copy" alt="" />
        </span>
        <span className="font-bold leading-4" aria-live="assertive" title="ブックマークレットをコピー">
          Copy
        </span>
      </button>
    </p>
  );
};

export const Output = ({ value }: { value: string }) => {
  return (
    <div className="rounded-lg bg-gray-800">
      <output
        aria-label="ブックマークレット"
        className="transparent block w-full break-all rounded-t-lg p-4 font-mono text-xs text-[#e5c788]"
      >
        {value}
      </output>
      <CopyButton />
    </div>
  );
};
