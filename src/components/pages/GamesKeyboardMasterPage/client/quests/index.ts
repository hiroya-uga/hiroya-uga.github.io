import { checkboxQuest } from './checkbox-quest';
import { datetimeQuest } from './datetime-quest';
import { dialogCloseQuest } from './dialog-close-quest';
import { enterSubmitQuest } from './enter-submit-quest';
import { focusAndClickQuest } from './focus-and-click-quest';
import { focusAndSpaceQuest } from './focus-and-space-quest';
import { focusQuest } from './focus-quest';
import { focusReverseQuest } from './focus-reverse-quest';
import { keyQuests } from './key-quests';
import { listReorderAltArrowQuest } from './list-reorder-alt-arrow-quest';
import { listReorderGrabQuest } from './list-reorder-grab-quest';
import { listReorderQuest } from './list-reorder-quest';
import { listboxSelectQuest } from './listbox-select-quest';
import { menuButtonQuest } from './menu-button-quest';
import { numberSpinnerQuest } from './number-spinner-quest';
import { radioAndCheckboxQuest } from './radio-and-checkbox-quest';
import { radioChangeQuest } from './radio-change-quest';
import { radioQuest } from './radio-quest';
import { selectQuest } from './select-quest';
import { sliderMaxQuest } from './slider-max-quest';
import { sliderStrictQuest } from './slider-strict-quest';
import { splitterQuest } from './splitter-quest';
import { starRatingClickQuest } from './star-rating-click-quest';
import { starRatingQuest } from './star-rating-quest';
import { switchQuest } from './switch-quest';
import { tabsSwitchQuest } from './tabs-switch-quest';
import { textareaClearQuest } from './textarea-clear-quest';
import { textareaCopyAndPasteQuest } from './textarea-copy-and-paste-quest';
import { textareaCopyQuest } from './textarea-copy-quest';
import { textareaCutAndPasteQuest } from './textarea-cut-and-paste-quest';
import { textareaDelQuest } from './textarea-del-quest';
import { textareaRedoQuest } from './textarea-redo-quest';
import { textareaSelectAllQuest } from './textarea-select-all-quest';
import { textareaShiftSelectQuest } from './textarea-shift-select-quest';
import { textareaStrictClearQuest } from './textarea-strict-clear-quest';
import { textareaUndoQuest } from './textarea-undo-quest';
import { treeExpandQuest } from './tree-expand-quest';
import { Quest } from './types';

export * from './types';

const ALL = [
  // タブキーの位置を覚える
  ...keyQuests,
  // タブキーの位置を覚える
  focusQuest,
  focusAndClickQuest,
  // タブキーの逆順を覚える
  focusReverseQuest,
  // スペースキーの場合があることを覚える
  focusAndSpaceQuest,
  switchQuest,
  checkboxQuest,
  radioQuest,
  // 方向キーの活用を覚える
  radioChangeQuest,
  radioAndCheckboxQuest,
  starRatingQuest,
  starRatingClickQuest,
  numberSpinnerQuest,
  datetimeQuest,
  enterSubmitQuest,
  selectQuest,
  sliderMaxQuest,
  sliderStrictQuest,
  // ショートカットキー
  textareaDelQuest,
  textareaClearQuest,
  textareaSelectAllQuest,
  textareaShiftSelectQuest,
  textareaStrictClearQuest,
  textareaUndoQuest,
  textareaRedoQuest,
  textareaCopyQuest,
  textareaCopyAndPasteQuest,
  textareaCutAndPasteQuest,
  // 特殊なUIの操作
  dialogCloseQuest,
  listboxSelectQuest,
  menuButtonQuest,
  tabsSwitchQuest,
  treeExpandQuest,
  splitterQuest,
  listReorderQuest,
  listReorderGrabQuest,
  listReorderAltArrowQuest,
];

const DEBUG: Quest[] = [];

export const QUESTS: Quest[] = DEBUG.length ? DEBUG : ALL;
