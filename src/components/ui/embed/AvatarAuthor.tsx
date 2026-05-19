import { Picture } from '@/components/ui/features/Picture';

export const AvatarAuthor = () => {
  return (
    <span className="max-w-360px @w360:grid-cols-2 @w360:gap-x-6 @w360:pr-4 mx-auto grid place-items-center items-center gap-4">
      <span className="@w360:col-start-2 w-40">
        <Picture
          width={160}
          height={160}
          src="/common/images/profile.png"
          alt="似顔絵アイコン"
          className="w-full"
          priority
        />
      </span>

      <span className="@w360:col-start-1 @w360:row-start-1 grow whitespace-nowrap text-center text-xl">
        <span className="block leading-6 tracking-[0.2rem]" translate="no">
          宇賀景哉
        </span>
        <span className="palt block text-xs tracking-[0.125rem]">Hiroya UGA</span>
      </span>
    </span>
  );
};
