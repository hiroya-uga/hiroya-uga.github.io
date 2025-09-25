// Safariでレンダリングがおかしくなるので、beforeの代わりにspan要素を使う
export const LoadingIcon = ({ alt = '読み込み中' }: { alt?: string }) => {
  return (
    <span role="img" aria-label={alt} className="relative block size-9 origin-center cursor-progress">
      <span className="absolute inset-0 size-full animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"></span>
    </span>
  );
};

export const LOADING_ICON_HTML = `<span class="relative block size-9 origin-center cursor-progress" aria-hidden="true">
  <span class="absolute inset-0 size-full animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"></span>
</span>`;
