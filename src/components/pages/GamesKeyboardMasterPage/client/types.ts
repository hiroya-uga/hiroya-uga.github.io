import type { Quest } from './quests';

export type Mode = 'idle' | 'playing' | 'clear';

export interface Pulse {
  id: number;
  result: 'success' | 'fail';
}

export interface QuestResult {
  quest: Quest;
  result: 'success' | 'fail';
}
