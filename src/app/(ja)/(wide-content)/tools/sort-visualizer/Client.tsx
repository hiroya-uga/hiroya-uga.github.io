'use client';

import { SortVisualizer } from '@/app/(ja)/(wide-content)/tools/sort-visualizer/parts/SortVisualizer';
import { sortMethods, sortRecursive } from '@/app/(ja)/(wide-content)/tools/sort-visualizer/sort-recursive';
import { NoteBox } from '@/components/Box';
import { RunButton } from '@/components/Clickable';
import { Toast } from '@/components/Dialog';
import { Checkbox, SelectField, Switch, TextField } from '@/components/Form';
import { Table } from '@/components/Table';
import { arrayShuffle } from '@/utils/array-shuffle';
import { dispatchInputEvent } from '@/utils/dispatch-event';
import { formatStringToNumericString } from '@/utils/formatter';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useId, useRef, useState } from 'react';

const DEFAULT_LENGTH = 16;

type SortDescription = {
  description: string;
  difficulty: string;
  stable: boolean;
  complexity: string;
  space: string;
};

const sortDictionary = {
  '比較ソート（基本・改良含む）': {
    bubble: [
      'バブルソート',
      {
        description:
          '隣り合う要素を比べて入れ替えながら、大きな値を後ろへと送っていく単純なソート方法です。実装は簡単ですが、計算回数が多く効率はよくありません。ほぼ整列済みの場合はO(n)で動作します。',
        difficulty: '低',
        stable: true,
        complexity: 'O(n²) (最悪/平均), O(n) (ベスト)',
        space: 'O(1)',
      },
    ],
    selection: [
      '選択ソート',
      {
        description:
          '未ソートの中から最小（または最大）の値を選び、先頭と入れ替えることで並べていきます。理解しやすいですが、効率はあまり高くなく、等しい要素の順序は保持されません。',
        difficulty: '低',
        stable: false,
        complexity: 'O(n²) (全ケース)',
        space: 'O(1)',
      },
    ],
    insertion: [
      '挿入ソート',
      {
        description:
          '配列から1つずつ値を取り出し、すでに整列済みの部分に正しい位置で挿入していく方法です。小さい配列や、ほぼ整っている配列ではO(n)で非常に速く動きます。',
        difficulty: '低',
        stable: true,
        complexity: 'O(n²) (最悪/平均), O(n) (ベスト)',
        space: 'O(1)',
      },
    ],
    merge: [
      'マージソート',
      {
        description:
          '配列を小さく分けてからそれぞれを整列し、最後に1つの配列として結合する方法です。安定で高速ですが、マージ処理で一時的な配列が必要になります。',
        difficulty: '中',
        stable: true,
        complexity: 'O(n log n) (全ケース)',
        space: 'O(n)',
      },
    ],
    quick: [
      'クイックソート',
      {
        description:
          '基準となる値（ピボット）を使って配列を2つに分け、それぞれを再帰的に並べる方法です。ピボット選択（例: 中央値、ランダム）が効率に影響し、平均的には非常に速いですが、最悪ケースではO(n²)になります。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n log n) (平均), O(n²) (最悪)',
        space: 'O(log n) (平均), O(n) (最悪)',
      },
    ],
    heap: [
      'ヒープソート',
      {
        description:
          'ヒープ構造を構築（O(n)）し、最大（または最小）値を順番に取り出して並べます（O(n log n)）。安定ではありませんが、インプレースで追加メモリがほぼ不要です。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n log n) (全ケース)',
        space: 'O(1)',
      },
    ],
    shell: [
      'シェルソート',
      {
        description:
          '挿入ソートを改良し、離れた位置の要素を比較し、徐々に間隔を狭めて並べます。ギャップシーケンス（例: Hibbard, Sedgewick）により効率が異なり、平均O(n^1.3)からO(n log n)程度。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n log² n) ～ O(n^1.3) (平均, ギャップ依存), O(n²) (最悪)',
        space: 'O(1)',
      },
    ],
    cocktail: [
      'カクテルソート',
      {
        description:
          'バブルソートを改良し、配列を双方向にスキャンしながら要素を交換します。小さい値を前に、大きい値を後ろに移動させることで効率を若干向上。',
        difficulty: '低',
        stable: true,
        complexity: 'O(n²) (最悪/平均), O(n) (ベスト)',
        space: 'O(1)',
      },
    ],
    gnome: [
      'ノームソート',
      {
        description:
          '隣の要素を比べて順番が合っていれば進み、違っていれば戻って交換する、挿入ソートに似た素朴な方法です。',
        difficulty: '低',
        stable: true,
        complexity: 'O(n²) (最悪/平均), O(n) (ベスト)',
        space: 'O(1)',
      },
    ],
    comb: [
      'コムソート',
      {
        description:
          'バブルソートを改良し、離れた要素を比較し、縮小率（例: 1.3）で間隔を狭めます。平均ケースではバブルソートより効率的で、O(n²/2^p)（pはステップ数）。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n²) (最悪), O(n log n) ～ O(n²/2^p) (平均)',
        space: 'O(1)',
      },
    ],
    tim: [
      'Timソート',
      {
        description:
          'マージソートと挿入ソートを組み合わせた高性能なソートです。ほぼ整列済みのデータではO(n)に近く、PythonやJavaの標準ライブラリで採用されています。',
        difficulty: '高',
        stable: true,
        complexity: 'O(n log n) (最悪/平均), O(n) (ベスト)',
        space: 'O(n)',
      },
    ],
  },
  非比較ソート: {
    counting: [
      'カウントソート',
      {
        description:
          '各値の出現回数を数えて並べる方法です。値が整数で範囲（k）が狭い場合に高速ですが、kが大きいと非効率になります。',
        difficulty: '低',
        stable: true,
        complexity: 'O(n + k)',
        space: 'O(k)',
      },
    ],
    radix: [
      '基数ソート',
      {
        description:
          '数や文字列の桁ごとに分けて、低い桁（LSD方式）から順に並べます。整数や固定長文字列の整列に適しています。kは桁数または基数。',
        difficulty: '中',
        stable: true,
        complexity: 'O(nk)',
        space: 'O(n + k)',
      },
    ],
    bucket: [
      'バケットソート',
      {
        description:
          '値の範囲ごとに「バケツ」に分けて、それぞれを個別に整列（例: 挿入ソート）し、まとめて仕上げます。データの分布に依存し、偏りのあるデータに効果的。',
        difficulty: '中',
        stable: true,
        complexity: 'O(n + k) (平均), O(n²) (最悪)',
        space: 'O(n + k)',
      },
    ],
  },
  並列処理向けソート: {
    'odd-even': [
      '奇偶ソート',
      {
        description:
          '奇数番目と偶数番目のペアを交互に比べて入れ替え、並列処理に適したソートです。各ペアの比較が独立しているため並列化が容易。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n²) (逐次), O(n) (並列ステップ)',
        space: 'O(1)',
      },
    ],
    bitonic: [
      'ビトニックソート',
      {
        description:
          '配列をビトニック列に変換し、比較と反転を繰り返して整列します。並列処理やGPU実装に適しており、並列ステップ数はO(log² n)、総比較回数はO(n log² n)。',
        difficulty: '高',
        stable: false,
        complexity: 'O(n log² n) (総比較), O(log² n) (並列ステップ)',
        space: 'O(1) (インプレース) ～ O(n) (補助メモリ)',
      },
    ],
  },
  '独特な操作・構造を持つソート': {
    pancake: [
      'パンケーキソート',
      {
        description:
          '配列の先頭から反転操作だけを使って並べるユニークな方法です。反転回数は最大2n程度で、実用性は低いですが理論的に興味深い。',
        difficulty: '中',
        stable: false,
        complexity: 'O(n²) (最悪/平均)',
        space: 'O(1)',
      },
    ],
    stooge: [
      'ストゥージソート',
      {
        description:
          '配列を3分割して再帰的にソートする非効率なアルゴリズムです。学習用やジョークとして使われ、計算量はO(n^(log 3 / log 1.5)) ≈ O(n^2.7095)。',
        difficulty: '高',
        stable: false,
        complexity: 'O(n^2.7095) (最悪/平均)',
        space: 'O(log n) (再帰スタック)',
      },
    ],
  },
  '非実用・ジョークソート': {
    bogo: [
      'ボゴソート',
      {
        description:
          '配列をランダムに並べ直して整列されるまで繰り返す方法です。平均O((n+1)!)、最悪無限大で、完全に非実用的です。',
        difficulty: '低',
        stable: false,
        complexity: 'O((n+1)!) (平均), O(∞) (最悪)',
        space: 'O(1)',
      },
    ],
    sleep: [
      'スリープソート',
      {
        description:
          '値の大きさに応じた時間だけ待って出力するジョークソートです。タイミング依存で実用性はなく、計算量は最大値（max）に依存。',
        difficulty: '低',
        stable: true,
        complexity: 'O(max(input)) (理論値), システム依存',
        space: 'O(n) (スレッド数)',
      },
    ],
    slow: [
      'スローソート',
      {
        description:
          '再帰的に分割して最悪の方法でソートする非効率なアルゴリズムです。ストゥージソートに似ており、学習用やジョーク向けです。',
        difficulty: '高',
        stable: false,
        complexity: 'O(n^(log n / log 1.5)) ≈ O(n^2.7095) (最悪/平均)',
        space: 'O(log n) (再帰スタック)',
      },
    ],
  },
} as const;

type SortDictionary = typeof sortDictionary;

type SortName = {
  [K in keyof SortDictionary]: keyof SortDictionary[K];
}[keyof SortDictionary];

const flatSortDictionary = Object.entries(sortDictionary).flatMap(([_, group]) => Object.entries(group)) as [
  SortName,
  [string, SortDescription],
][];

const getRandomArray = (length = DEFAULT_LENGTH, options: { shouldBeRandom?: boolean } = {}) => {
  if (options.shouldBeRandom) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  }
  return arrayShuffle(Array.from({ length }, (_, i) => i + 1));
};

export const SortVisualizerContent = () => {
  const id = useId();
  const [mode, setMode] = useState<'visualizer' | 'benchmark'>('visualizer');

  const [shouldShowDescription, setShouldShowDescription] = useState(false);
  const [shouldShowGraph, setShouldShowGraph] = useState(true);
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const [shouldBeRandom, setShouldBeRandom] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [benchmarkTable, setBenchmarkTable] = useState<{ [_ in SortName]?: { times: number; time: number } }>({});

  const [activeSorts, setActiveSorts] = useState<SortName[]>([]);
  const [elementCount, setElementCount] = useState(DEFAULT_LENGTH);
  const [times, setTimes] = useState(0);
  const [running, setRunning] = useState(false);

  const fpsRef = useRef(60);
  const abortRef = useRef(false);

  const sortResultsRef = useRef<{
    [_ in SortName]?: {
      array: number[];
      state: 'waiting' | 'sorting' | 'done' | 'not supported';
      times: 0;
      markers?: Record<string, number>;
    };
  }>({});
  const randomArrayRef = useRef<number[]>(getRandomArray(DEFAULT_LENGTH, { shouldBeRandom }));

  const sort = useCallback(() => {
    sortResultsRef.current = Object.fromEntries(
      activeSorts.map((sortName) => {
        return [
          sortName,
          {
            array: [...randomArrayRef.current],
            state: 'waiting...',
            times: 0,
            markers: {},
          },
        ];
      }),
    );
    const loop = () => {
      if (
        abortRef.current ||
        Object.values(sortResultsRef.current).every(
          (result) => result.state === 'done' || result.state === 'not supported',
        )
      ) {
        if (abortRef.current === false) {
          setToastMessage('ソートが完了しました！');
        } else {
          // setToastMessage('ソートを中止しました');
        }
        abortRef.current = false;
        setRunning(false);
        return;
      }

      setTimes((prev) => prev + 1);

      for (const sortName of activeSorts) {
        const status = sortResultsRef.current[sortName];
        const sortFunction = sortName in sortRecursive ? sortRecursive[sortName as keyof typeof sortRecursive] : null;

        if (!status || status.state === 'done') continue;

        if (typeof sortFunction !== 'function') {
          status.state = 'not supported';
          continue;
        }

        const result = sortFunction(status.array, status.times === 0);
        status.array = [...result.array];
        status.state = result.shouldLoop === false ? 'done' : 'sorting';
        status.times += 1;
        status.markers = result.markers;
      }

      setTimeout(() => {
        loop();
      }, 1000 / fpsRef.current);
    };

    // console.log([...randomArrayRef.current]);

    randomArrayRef.current = getRandomArray(elementCount, {
      shouldBeRandom,
    });

    if (randomArrayRef.current.length === 0) {
      return;
    }

    setRunning(true);
    loop();
  }, [activeSorts, elementCount, shouldBeRandom]);

  const benchmark = useCallback(() => {
    randomArrayRef.current = getRandomArray(elementCount, {
      shouldBeRandom,
    });

    if (randomArrayRef.current.length === 0) {
      return;
    }

    setRunning(true);
    setBenchmarkTable({});

    let index = 0;
    const duration = 5000;
    const check = async (testCode: () => Promise<number[]>) => {
      let count = 0;
      let abort = false;

      setTimeout(() => {
        abort = true;
      }, duration);

      while (abort === false) {
        await testCode();
        count++;

        if (count % 1000 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      return count;
    };
    const loop = async () => {
      if (abortRef.current) {
        abortRef.current = false;
        setRunning(false);
        return;
      }

      if (activeSorts.length <= index) {
        setToastMessage('結果を表に出力しました');
        setRunning(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      const sortName = activeSorts[index];
      const start = performance.now();
      setBenchmarkTable((prev) => ({
        ...prev,
        [sortName]: {
          time: '計測中...',
          times: '計測待ち',
        },
      }));
      for (let i = 0; i < 10000; i++) {
        await sortMethods[sortName]([...randomArrayRef.current]);

        if (i % 2000 === 0) {
          setBenchmarkTable((prev) => ({
            ...prev,
            [sortName]: {
              time: `${(i / 10000) * 100}%`,
              times: '計測待ち',
            },
          }));
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
      const end = performance.now();

      const time = end - start;
      setBenchmarkTable((prev) => ({
        ...prev,
        [sortName]: {
          time,
          times: '計測中...',
        },
      }));

      const times = await check(async () => await sortMethods[sortName]([...randomArrayRef.current]));
      setBenchmarkTable((prev) => ({
        ...prev,
        [sortName]: {
          time,
          times,
        },
      }));

      index++;
      loop();
    };

    for (const sortName of activeSorts) {
      setBenchmarkTable((prev) => ({
        ...prev,
        [sortName]: {
          time: '計測待ち',
          times: '計測待ち',
        },
      }));
    }

    loop();
  }, [activeSorts, elementCount, shouldBeRandom]);

  useEffect(() => {
    // sortNames.forEach((sort) => {
    //   sortResultsRef.current[sort] = {
    //     array: [...randomArrayRef.current],
    //     state: sort in sortRecursive ? 'waiting' : 'not supported',
    //     times: 0,
    //   };
    // });
    // setActiveSorts(sortNames);
    sortResultsRef.current.bubble = {
      array: [...randomArrayRef.current],
      state: 'waiting',
      times: 0,
      markers: {},
    };
    setActiveSorts(['bubble']);

    return () => {
      abortRef.current = true;
    };
  }, []);

  const isVisualizerMode = mode === 'visualizer';

  return (
    <>
      <div className="@w640:flex flex-row-reverse items-start gap-4">
        <div
          className={clsx([
            '@w640:top-4 @w640:w-fit @w350:sticky ml-auto',
            isVisualizerMode ? '@w350:-top-[19.125rem]' : '@w350:-top-[11.5rem]',
          ])}
        >
          <div className="@w640:contain-inline-size mb-4">
            <SelectField
              label="実行種別"
              onChange={(e) => setMode(e.currentTarget.value as 'visualizer' | 'benchmark')}
              disabled={running}
              defaultValue={mode}
            >
              <option value="visualizer">可視化</option>
              <option value="benchmark">ベンチマーク</option>
            </SelectField>
          </div>
          <div className="@w640:contain-inline-size mb-4">
            <TextField
              label="要素数（2〜1000）"
              inputMode="numeric"
              align="right"
              defaultValue={String(DEFAULT_LENGTH)}
              disabled={running}
              onInput={(e) => {
                if (e.currentTarget.value === '') {
                  return;
                }

                e.currentTarget.value = formatStringToNumericString(e.currentTarget.value);

                const number = Number(e.currentTarget.value);
                const value = e.currentTarget.value ? number : 0;

                if (Number.isNaN(value) || value < 0) {
                  e.currentTarget.value = String(DEFAULT_LENGTH);
                } else if (1000 < value) {
                  e.currentTarget.value = '1000';
                }

                randomArrayRef.current = getRandomArray(number, {
                  shouldBeRandom,
                });
                setElementCount(randomArrayRef.current.length);
              }}
              onBlur={(e) => {
                const value = e.currentTarget.value ? Number(e.currentTarget.value) : 0;

                if (isNaN(value) || value < 2) {
                  dispatchInputEvent({ target: e.currentTarget, value: '2' });
                  return;
                }
              }}
            />
          </div>

          {isVisualizerMode && (
            <div className="@w640:contain-inline-size mb-4">
              <TextField
                label="処理速度（1〜1000）"
                inputMode="numeric"
                align="right"
                defaultValue={String(fpsRef.current)}
                disabled={running}
                onInput={(e) => {
                  if (e.currentTarget.value === '') {
                    return;
                  }

                  e.currentTarget.value = formatStringToNumericString(e.currentTarget.value);

                  const number = Number(e.currentTarget.value);
                  const value = e.currentTarget.value ? number : 0;

                  if (Number.isNaN(value)) {
                    e.currentTarget.value = String(60);
                  } else if (1000 < value) {
                    e.currentTarget.value = '1000';
                  }

                  if (Number.isNaN(value)) {
                    e.currentTarget.value = String(60);
                  }

                  fpsRef.current = Number(e.currentTarget.value);
                }}
                onBlur={(e) => {
                  const value = e.currentTarget.value ? Number(e.currentTarget.value) : 0;

                  if (isNaN(value) || value < 1) {
                    dispatchInputEvent({ target: e.currentTarget, value: '60' });
                    return;
                  }
                }}
              />
            </div>
          )}

          <div className="@w350:grid-cols-2 @w640:grid-cols-1 mt-4 grid gap-4">
            {isVisualizerMode && (
              <>
                <p className="grow">
                  <label className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                    <span className="@w400:text-base text-sm">ハイライト</span>
                    <span>
                      <Switch checked={shouldHighlight} dispatch={setShouldHighlight} disabled={running} />
                    </span>
                  </label>
                </p>
                <p className="grow">
                  <label className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                    <span className="@w400:text-base text-sm">ランダムな数値</span>
                    <span>
                      <Switch
                        checked={shouldBeRandom}
                        dispatch={setShouldBeRandom}
                        disabled={running}
                        onChange={(e) => {
                          randomArrayRef.current = getRandomArray(DEFAULT_LENGTH, {
                            shouldBeRandom: e.currentTarget.checked,
                          });
                        }}
                      />
                    </span>
                  </label>
                </p>
              </>
            )}
          </div>

          <div
            className={clsx([
              // ビルドで生成されないので important をつけてみる
              '@w640:[border:none]!',
              '@w350:grid-cols-2 @w640:grid-cols-1 grid gap-4 py-4 [border-image:linear-gradient(color-mix(in_oklab,var(--background-color-primary)_90%,transparent))_fill_0//0_100lvi]',
            ])}
          >
            <p className="grow">
              <label className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                <span className="@w400:text-base text-sm">説明文を表示</span>
                <span>
                  <Switch checked={shouldShowDescription} dispatch={setShouldShowDescription} />
                </span>
              </label>
            </p>
            {isVisualizerMode ? (
              <p className="grow">
                <label className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                  <span className="@w400:text-base text-sm">グラフを表示</span>
                  <span>
                    <Switch checked={shouldShowGraph} dispatch={setShouldShowGraph} />
                  </span>
                </label>
              </p>
            ) : (
              <p className="grow">
                <label className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                  <span className="@w400:text-base text-sm">ランダムな数値</span>
                  <span>
                    <Switch
                      checked={shouldBeRandom}
                      dispatch={setShouldBeRandom}
                      disabled={running}
                      onChange={(e) => {
                        randomArrayRef.current = getRandomArray(DEFAULT_LENGTH, {
                          shouldBeRandom: e.currentTarget.checked,
                        });
                      }}
                    />
                  </span>
                </label>
              </p>
            )}
          </div>
        </div>
        <div className="@container bg-secondary border-primary grow rounded-md border p-4">
          {Object.keys(sortDictionary).map((key) => {
            const category = key as keyof SortDictionary;
            const sortsInCategory = Object.keys(sortDictionary[category]) as SortName[];

            return (
              <div
                key={category}
                role="group"
                aria-labelledby={`${id}-${key}`}
                className="not-last:mb-4 not-last:pb-5 not-last:border-b-primary not-last:border-b last:mb-2"
              >
                <div className="mb-4 grid grid-cols-[auto_1fr] items-center gap-4">
                  <p className="@w400:gap-2 @w640:justify-between @w350:justify-end flex items-center justify-between gap-1.5">
                    <input
                      type="checkbox"
                      id={`${id}-${key}-all`}
                      aria-label={`すべての${category}を選択`}
                      disabled={running}
                      checked={sortsInCategory.every((sort) => activeSorts.includes(sort))}
                      className="size-4 rounded-md border border-gray-300 p-2"
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setActiveSorts((prev) => [...new Set([...prev, ...sortsInCategory])]);
                          sortsInCategory.forEach((sort) => {
                            sortResultsRef.current[sort] = {
                              array: [...randomArrayRef.current],
                              state: sort in sortRecursive ? 'waiting' : 'not supported',
                              times: 0,
                              markers: {},
                            };
                          });
                        } else {
                          setActiveSorts((prev) => prev.filter((sort) => !sortsInCategory.includes(sort)));
                        }
                      }}
                    />
                    <label id={`${id}-${key}`} htmlFor={`${id}-${key}-all`} className="text-lg font-bold">
                      {category}
                    </label>
                  </p>
                </div>
                <ul
                  className={clsx([
                    'grid gap-x-8 gap-y-4 pl-4',
                    shouldShowDescription === true && '@w1024:grid-cols-3 @w768:grid-cols-2',
                    shouldShowDescription === false &&
                      '@w500:grid-cols-3 @w640:grid-cols-4 @w768:grid-cols-5 @w1024:grid-cols-6 @w350:grid-cols-2',
                  ])}
                >
                  {sortsInCategory.map((sort) => {
                    const label = sortDictionary[category]?.[
                      sort as keyof (typeof sortDictionary)[typeof category]
                    ]?.[0] as string;
                    const descriptions = sortDictionary[category]?.[
                      sort as keyof (typeof sortDictionary)[typeof category]
                    ]?.[1] as SortDescription;

                    return (
                      <li key={sort}>
                        <Checkbox
                          label={label}
                          disabled={running}
                          checked={activeSorts.includes(sort)}
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              sortResultsRef.current[sort] = {
                                array: [...randomArrayRef.current],
                                state: sort in sortRecursive ? 'waiting' : 'not supported',
                                times: 0,
                                markers: {},
                              };
                              setActiveSorts((prev) => [...prev, sort]);
                            } else {
                              setActiveSorts((prev) => prev.filter((s) => s !== sort));
                            }
                          }}
                          aria-describedby={`${id}-${sort}-description`}
                        />
                        {shouldShowDescription && (
                          <span className="text-secondary mt-1 block text-sm" id={`${id}-${sort}-description`}>
                            <span>{descriptions.description}</span>

                            <span className="text-2xs mt-1 grid">
                              <span>難易度: {descriptions.difficulty}</span>
                              <span>順序: {descriptions.stable ? '保持する' : '保持されない'}</span>
                              <span>時間計算量: {descriptions.complexity}</span>
                              <span>空間計算量: {descriptions.space}</span>
                            </span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {isVisualizerMode === false && (
        <div className="mt-4">
          <NoteBox type="warn" headingLevel={2}>
            <p className="font-bold">擬似的なベンチマークであり、正確な値は得られない可能性が高いです。</p>
            <p className="font-bold">要素数を1000に設定したりすると高負荷になる可能性があります。</p>
            <p className="font-bold">ポゴソートは計測が終了しない可能性があります。</p>
          </NoteBox>
        </div>
      )}

      <div className="bg-primary/90 border-b-primary @w640:items-center @w640:grid @w640:grid-cols-[1fr_auto_1fr] @w640:py-2 @w350:sticky top-0 mb-8 border-b pb-[1lh]">
        <p role="alert" className="text-alert @w640:text-left min-h-lh text-center">
          {errorMessage}
        </p>

        <p className="@w640:py-4">
          <RunButton
            type="button"
            onClick={(e) => {
              e.currentTarget.textContent = '処理中...';

              if (running) {
                abortRef.current = true;
                return;
              }

              abortRef.current = false;

              try {
                setTimes(0);

                if (isVisualizerMode) {
                  sort();
                } else {
                  benchmark();
                }
                setErrorMessage('');
              } catch (error) {
                abortRef.current = true;
                setRunning(false);
                setTimes(0);

                if (error instanceof Error) {
                  setErrorMessage(error.message);
                } else {
                  setErrorMessage('エラーが発生しました。');
                }
              }
            }}
            disabled={running === false && (activeSorts.length === 0 || randomArrayRef.current.length < 2)}
          >
            {running ? '処理を強制終了する' : '実行する'}
          </RunButton>
        </p>
      </div>

      <div>
        <div className="mb-8 font-mono text-sm">
          {isVisualizerMode && <p>Total steps: {times}</p>}
          <p>
            Elements: ({elementCount})[
            {
              <>
                {randomArrayRef.current.map((number, index, self) => {
                  return (
                    <Fragment key={index}>
                      <span className="text-[#8900b7] dark:text-[#e494ff]" suppressHydrationWarning>
                        {number}
                      </span>
                      {index < self.length - 1 ? ', ' : ''}
                    </Fragment>
                  );
                })}
              </>
            }
            ]
          </p>
        </div>

        {isVisualizerMode ? (
          <div
            className={clsx([
              'grid gap-8',
              2 < activeSorts.length
                ? '@w400:grid-cols-2 @w768:grid-cols-3 @w1024:grid-cols-4 @w640:gap-4'
                : '@w768:grid-cols-2',
            ])}
          >
            {flatSortDictionary.map(([sort, [label]]) => {
              if (activeSorts.includes(sort) === false) {
                return null;
              }

              return (
                <div key={sort}>
                  <h2 className="mb-2 font-bold">{`${label} - ${sort}`}</h2>
                  {shouldShowGraph ? (
                    <div className="border-primary bg-secondary border">
                      <SortVisualizer
                        values={sortResultsRef.current[sort]?.array || randomArrayRef.current}
                        length={randomArrayRef.current.length}
                        markers={sortResultsRef.current[sort]?.markers}
                        highlight={shouldHighlight}
                        done={sortResultsRef.current[sort]?.state === 'done'}
                      />
                    </div>
                  ) : (
                    <div className="font-mono">
                      {sortResultsRef.current[sort]?.array.map((number, index, self) => {
                        const done = sortResultsRef.current[sort]?.state === 'done';
                        const markers = sortResultsRef.current[sort]?.markers;
                        const className = clsx([
                          done === false &&
                            shouldHighlight === true && [
                              markers?.current === index && 'font-bold text-[#ff9595]',
                              markers?.comparing === index && 'font-bold text-[#ffd43b]',
                            ],
                        ]);

                        if (index < self.length - 1) {
                          return (
                            <Fragment key={index}>
                              <span className={className}>{number}</span>
                              {', '}
                            </Fragment>
                          );
                        }
                        return (
                          <span key={index} className={className}>
                            {number}
                          </span>
                        );
                      }) || randomArrayRef.current.join(', ')}
                    </div>
                  )}
                  <div className="mt-2 text-sm">
                    {shouldShowDescription && (
                      <p className="text-secondary">
                        {flatSortDictionary.find(([key]) => key === sort)?.[1][1].description || ''}
                      </p>
                    )}
                    <p>Steps: {sortResultsRef.current[sort]?.times}</p>
                    <p className={clsx([sortResultsRef.current[sort]?.state === 'not supported' && 'text-alert'])}>
                      State:{' '}
                      {running ||
                      sortResultsRef.current[sort]?.state === 'not supported' ||
                      sortResultsRef.current[sort]?.state === 'done'
                        ? sortResultsRef.current[sort]?.state
                        : 'Waiting...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th scope="col" className="@w640:text-left text-center align-middle">
                    ソート名
                  </th>
                  <th scope="col" className="@w640:text-left text-center align-middle">
                    10000回呼び出しに<span className="@w640:inline block">かかった時間</span>
                  </th>
                  <th scope="col" className="@w640:text-left text-center align-middle">
                    5秒あたりの<span className="@w640:inline block">呼び出し回数</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {flatSortDictionary
                  .filter(([sortName]) => sortName in benchmarkTable)
                  .map(([sortName, [label]]) => {
                    if (benchmarkTable[sortName] === undefined) {
                      return null;
                    }

                    const { time, times } = benchmarkTable[sortName];
                    return (
                      <tr key={sortName}>
                        <th>{label}</th>
                        <td>{typeof time === 'number' ? `${Math.round(time * 10000) / 10000}ms` : time}</td>
                        <td>{times}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </>
        )}
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};
