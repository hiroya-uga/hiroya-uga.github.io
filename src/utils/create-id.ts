export const createId = (id: string, uniqueString: string) => {
  return `${id}-${
    uniqueString
      .replace(/[^A-Za-z0-9\-_\:.]/g, '') // 無効な文字を空文字に置換
      .replace(/^[^A-Za-z]/, '') // 先頭が数字または無効な文字の場合削除
      .replace(/[:\.]+/g, '-') // コロンやピリオドの連続をハイフンに置換
      .replace(/^-+|-+$/g, '') // 先頭または末尾のハイフンを削除
  }`;
};
