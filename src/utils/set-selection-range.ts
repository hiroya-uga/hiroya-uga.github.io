export const setSelectionRange = (target: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(target);
  selection?.removeAllRanges();
  selection?.addRange(range);

  return range;
};
