import { SITE_AUTHOR, SITE_AUTHOR_JA } from '@/constants/meta';
import { AvatarAuthorPicture } from './parts';

export const AvatarAuthor = () => {
  return (
    <span className="max-w-360px @w360:grid-cols-2 @w360:gap-x-6 @w360:pr-4 gap-16PX mx-auto grid place-items-center items-center">
      <span className="@w360:col-start-2 max-w-160PX">
        <AvatarAuthorPicture />
      </span>

      <span className="@w360:col-start-1 @w360:row-start-1 grow text-center text-xl">
        <span className="block leading-6 tracking-[0.2rem]" translate="no">
          {SITE_AUTHOR_JA}
        </span>
        <span className="palt block text-xs tracking-[0.125rem]">{SITE_AUTHOR}</span>
      </span>
    </span>
  );
};
