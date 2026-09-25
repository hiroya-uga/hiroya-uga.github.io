import clsx from 'clsx';
import { useKeyboardMasterConfig } from '../hooks';
import type { Quest } from '../quests';
import type { Mode, Pulse, QuestResult } from '../types';
import styles from './Game.module.css';
import { IdleScreen } from './IdleScreen';
import { PlayingScreen } from './PlayingScreen';
import { ResultScreen } from './ResultScreen';

interface Props {
  mode: Mode;
  quests: Quest[];
  questIndex: number;
  pulse: Pulse | null;
  results: QuestResult[];
  onStart: () => void;
  onRetry: () => void;
  onClear: () => void;
  onFail: () => void;
}

export const Game = ({
  mode,
  quests,
  questIndex,
  pulse,
  results,
  onStart,
  onRetry,
  onClear,
  onFail,
}: Readonly<Props>) => {
  const { config, updateConfig } = useKeyboardMasterConfig();

  return (
    <>
      {mode === 'idle' && <IdleScreen config={config} onChangeConfig={updateConfig} onStart={onStart} />}
      {mode === 'clear' && (
        <ResultScreen results={results} shouldDisableAnimation={config.shouldDisableAnimation} onRetry={onRetry} />
      )}
      {mode === 'playing' && (
        <PlayingScreen
          quest={quests[questIndex]}
          questIndex={questIndex}
          shouldDisableTimeLimit={config.shouldDisableTimeLimit}
          shouldDisableAnimation={config.shouldDisableAnimation}
          onClear={onClear}
          onFail={onFail}
        />
      )}
      {pulse !== null && (
        <p
          key={pulse.id}
          aria-hidden
          className={clsx([
            config.shouldDisableAnimation === true && styles.pulseInstant,
            config.shouldDisableAnimation === false && styles.pulse,
            'pointer-events-none absolute inset-0 z-10 grid place-items-center text-2xl font-bold',
            pulse.result === 'success' ? 'bg-primary' : 'bg-error',
          ])}
        >
          {pulse.result === 'success' ? 'Success!' : 'Failed!'}
        </p>
      )}
    </>
  );
};
