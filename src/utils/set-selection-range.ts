export const setSelectionRange = (targetNode: Node) => {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(targetNode);
  selection?.removeAllRanges();
  selection?.addRange(range);

  return range;
};
