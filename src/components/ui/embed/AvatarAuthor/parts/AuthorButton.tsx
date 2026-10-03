import { Picture } from '@/components/ui/features/Picture';

export const AVATAR_SRC = '/common/images/profile.png';

interface Props {
  onClick?: () => void;
}

export const AuthorButton = ({ onClick }: Readonly<Props>) => {
  return (
    <button
      type="button"
      className="block aspect-square rounded-full"
      aria-haspopup="dialog"
      aria-disabled={onClick === undefined ? 'true' : undefined}
      onClick={onClick}
    >
      <Picture width={160} height={160} src={AVATAR_SRC} alt="似顔絵アイコン" className="w-full" priority />
    </button>
  );
};
