import { arrowListQuest } from './arrow-list-quest';
import { checkboxQuest } from './checkbox-quest';
import { escapeQuest } from './escape-quest';
import { keyQuests } from './key-quests';
import { numberSpinnerQuest } from './number-spinner-quest';
import { radioQuest } from './radio-quest';
import { radioTripleQuest } from './radio-triple-quest';
import { selectAllQuest } from './select-all-quest';
import { selectQuest } from './select-quest';
import { spaceToggleQuest } from './space-toggle-quest';
import { tabNavigationQuest } from './tab-navigation-quest';
import { textareaQuest } from './textarea-quest';
import { Quest } from './types';

export * from './types';

export const QUESTS: Quest[] = [
  ...keyQuests,
  selectQuest,
  radioQuest,
  radioTripleQuest,
  checkboxQuest,
  textareaQuest,
  selectAllQuest,
  tabNavigationQuest,
  escapeQuest,
  arrowListQuest,
  spaceToggleQuest,
  numberSpinnerQuest,
];
