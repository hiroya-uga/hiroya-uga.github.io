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
import { textareaClearQuest, textareaStrictClearQuest } from './textarea-clear-quests';
import { textareaCopyAndPasteQuest } from './textarea-copy-and-paste-quest';
import { textareaCopyQuest } from './textarea-copy-quest';
import { textareaCutAndPasteQuest } from './textarea-cut-and-paste-quest';
import { textareaDelQuest } from './textarea-del-quest';
import { textareaRedoQuest } from './textarea-redo-quest';
import { textareaSelectAllQuest } from './textarea-select-all-quest';
import { textareaShiftSelectQuest } from './textarea-shift-select-quest';
import { textareaUndoQuest } from './textarea-undo-quest';
import { treeExpandQuest } from './tree-expand-quest';
import type { QuestSource } from './types';

export * from './types';

const ALL: QuestSource[] = [
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

const DEBUG: QuestSource[] = [];

const FIRST: QuestSource[] = [
  // 1回目の挑戦。キー入力とフォーカス移動という、最も基礎的な操作だけに絞った厳選の10問
  ...keyQuests,
  focusQuest,
  focusAndClickQuest,
  focusReverseQuest,
  focusAndSpaceQuest,
];

const SECOND: QuestSource[] = [
  // 2回目の挑戦。チェックボックスやラジオボタンなど、基本的なフォーム部品を扱う厳選の10問
  switchQuest,
  checkboxQuest,
  radioQuest,
  radioChangeQuest,
  radioAndCheckboxQuest,
  starRatingQuest,
  starRatingClickQuest,
  numberSpinnerQuest,
  datetimeQuest,
  enterSubmitQuest,
];

/**
 * 1・2回目の挑戦は操作を順番に覚えられるよう固定の10問ずつに絞り、3回目からは全問を対象にする。
 * DEBUG が指定されているときは、段階分けせず常に DEBUG をそのまま使う
 */
export const QUESTS = {
  first: DEBUG.length ? DEBUG : FIRST,
  second: DEBUG.length ? DEBUG : SECOND,
  all: DEBUG.length ? DEBUG : ALL,
};
