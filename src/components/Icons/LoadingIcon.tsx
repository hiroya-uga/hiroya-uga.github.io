export const LoadingIcon = ({ alt = '読み込み中' }: { alt?: string }) => {
  return (
    <span
      role="img"
      aria-label={alt}
      className="relative block size-9 origin-center cursor-progress before:absolute before:inset-0 before:size-full before:animate-spin before:rounded-full before:border-2 before:border-gray-300 before:border-t-gray-800 before:content-['']"
    />
  );
};
