type Sort = (
  _: number[],
  __?: boolean,
) => { shouldLoop: boolean; array: number[]; markers?: Record<string, number> | {} };

export const sortRecursive = {
  bubble: ((): Sort => {
    let a: number[] = [];
    let i = 0;
    let j = 0;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        i = 0;
        j = 0;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (j < a.length - 1 - i) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
        j++;
      } else {
        j = 0;
        i++;
      }

      if (i >= a.length - 1) {
        done = true;
      }

      return {
        shouldLoop: !done,
        array: [...a],
        markers: { current: j, comparing: j + 1 },
      };
    };
  })(),
  selection: ((): Sort => {
    let a: number[] = [];
    let i = 0;
    let j = 0;
    let minIndex = 0;
    let phase: 'scanning' | 'swapping' = 'scanning';
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        i = 0;
        j = i + 1;
        minIndex = i;
        phase = 'scanning';
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (phase === 'scanning') {
        if (j < a.length) {
          if (a[j] < a[minIndex]) {
            minIndex = j;
          }
          j++;
        } else {
          phase = 'swapping';
        }
      }

      if (phase === 'swapping') {
        [a[i], a[minIndex]] = [a[minIndex], a[i]];
        i++;
        if (i >= a.length - 1) {
          done = true;
        } else {
          j = i + 1;
          minIndex = i;
          phase = 'scanning';
        }
      }

      return {
        shouldLoop: !done,
        array: [...a],
        markers: !done ? { current: i, comparing: j } : undefined,
      };
    };
  })(),
  insertion: ((): Sort => {
    let i = 1;
    let j = 0;
    let key = 0;
    let innerLoop = false;
    let done = false;
    let a: number[] = [];

    return (arr: number[], init?: boolean) => {
      if (init) {
        a = [...arr];
        i = 1;
        innerLoop = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (!innerLoop) {
        if (i >= a.length) {
          done = true;
          return {
            shouldLoop: false,
            array: [...a],
            /** 実験中*/
            markers: {},
          };
        }
        key = a[i];
        j = i - 1;
        innerLoop = true;
      }

      if (j >= 0 && a[j] > key) {
        a[j + 1] = a[j]; // シフト
        j--;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: j, comparing: j + 1 },
        };
      } else {
        a[j + 1] = key; // 挿入
        i++;
        innerLoop = false;
        return {
          shouldLoop: i < a.length,
          array: [...a],
          /** 実験中*/
          markers: i < a.length ? { current: j, comparing: j + 1 } : {},
        };
      }
    };
  })(),
  merge: ((): Sort => {
    let queue: number[][] = [];
    let currentLeft: number[] = [];
    let currentRight: number[] = [];
    let merged: number[] = [];
    let i = 0,
      j = 0;
    let inMerge = false;

    return (initArray: number[], init = false) => {
      if (init) {
        queue = initArray.map((n) => [n]); // 1要素ずつに分解
        currentLeft = [];
        currentRight = [];
        merged = [];
        i = j = 0;
        inMerge = false;
      }

      if (queue.length <= 1 && !inMerge) {
        return {
          shouldLoop: false,
          array: queue.flat(),
        };
      }

      // 新しいマージペアを準備
      if (!inMerge) {
        currentLeft = queue.shift() || [];
        currentRight = queue.shift() || [];
        merged = [];
        i = j = 0;
        inMerge = true;
      }

      // 1ステップだけマージ（比較とpush）
      if (i < currentLeft.length && j < currentRight.length) {
        if (currentLeft[i] < currentRight[j]) {
          merged.push(currentLeft[i++]);
        } else {
          merged.push(currentRight[j++]);
        }
      } else if (i < currentLeft.length) {
        merged.push(currentLeft[i++]);
      } else if (j < currentRight.length) {
        merged.push(currentRight[j++]);
      }

      // 終わったらキューに戻す
      if (i >= currentLeft.length && j >= currentRight.length) {
        queue.push(merged);
        inMerge = false;
      }

      const checking = [
        ...queue.flat(),
        ...currentLeft.slice(i), // 処理前の left の残り
        ...currentRight.slice(j), // 処理前の right の残り
      ];

      return {
        shouldLoop: queue.length > 1 || inMerge,
        array: inMerge
          ? [
              ...checking, // 現在の比較中の要素
              ...merged, // マージ済
            ]
          : queue.flat(),
        markers: queue.length > 1 || inMerge ? { current: i, comparing: checking.length } : undefined,
      };
    };
  })(),
  quick: ((): Sort => {
    type Frame = {
      left: number;
      right: number;
      i: number;
      j: number;
      pivotValue: number;
      phase: 'partition' | 'recurse';
    };

    let a: number[] = [];
    let stack: Frame[] = [];
    let current: Frame | null = null;

    return (initArray: number[], init = false) => {
      if (init) {
        a = [...initArray];
        stack = [
          {
            left: 0,
            right: a.length - 1,
            i: 0,
            j: 0,
            pivotValue: 0,
            phase: 'recurse',
          },
        ];
        current = null;
      }

      if (!current && stack.length > 0) {
        current = stack.pop()!;
        if (current.left >= current.right) {
          current = null;
          return {
            shouldLoop: stack.length > 0,
            array: [...a],
            /** 実験中*/
            markers: {},
          };
        }

        if (current.phase === 'recurse') {
          const pivot = a[current.right];
          current = {
            left: current.left,
            right: current.right,
            i: current.left,
            j: current.left,
            pivotValue: pivot,
            phase: 'partition',
          };
        }
      }

      if (!current) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // 1ステップだけ partition
      if (current.phase === 'partition') {
        const { left, right, i, j, pivotValue } = current;

        if (j < right) {
          if (a[j] < pivotValue) {
            [a[i], a[j]] = [a[j], a[i]];
            current.i = i + 1;
          }
          current.j = j + 1;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: j, comparing: j + 1 },
          };
        }

        // pivot を最終位置へ
        [a[current.i], a[right]] = [a[right], a[current.i]];

        // 分割を次回へ残す
        stack.push({
          left: left,
          right: current.i - 1,
          i: 0,
          j: 0,
          pivotValue: 0,
          phase: 'recurse',
        });
        stack.push({
          left: current.i + 1,
          right: right,
          i: 0,
          j: 0,
          pivotValue: 0,
          phase: 'recurse',
        });

        current = null;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: j, comparing: j + 1 },
        };
      }

      // 到達しないはず
      return {
        shouldLoop: false,
        array: [...a],
      };
    };
  })(),
  heap: ((): Sort => {
    let a: number[] = [];
    let heapSize = 0;
    let phase: 'build' | 'sort' = 'build';
    let buildIndex = 0;
    let currentIndex = 0;
    let swapTarget = -1;
    let done = false;

    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        heapSize = a.length;
        buildIndex = Math.floor(a.length / 2) - 1; // 最後の親ノード
        currentIndex = buildIndex;
        phase = 'build';
        done = false;
        swapTarget = -1;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // ========= BUILD PHASE =========
      if (phase === 'build') {
        const i = currentIndex;
        let largest = i;
        const l = left(i);
        const r = right(i);

        if (l < heapSize && a[l] > a[largest]) largest = l;
        if (r < heapSize && a[r] > a[largest]) largest = r;

        if (largest !== i) {
          [a[i], a[largest]] = [a[largest], a[i]];
          currentIndex = largest; // ヒープ再調整が必要
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: currentIndex, comparing: currentIndex + 1 },
          };
        }

        // 次のノードへ（上方向へ）
        buildIndex--;
        if (buildIndex >= 0) {
          currentIndex = buildIndex;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: currentIndex, comparing: currentIndex + 1 },
          };
        } else {
          phase = 'sort';
          heapSize = a.length;
          currentIndex = 0;
        }
      }

      // ========= SORT PHASE =========
      if (phase === 'sort') {
        // スワップしてheapSize縮小
        if (swapTarget === -1 && heapSize > 1) {
          [a[0], a[heapSize - 1]] = [a[heapSize - 1], a[0]];
          heapSize--;
          swapTarget = 0;
          currentIndex = 0;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: 0, comparing: 1 },
          };
        }

        // ヒープ調整1ステップ
        const i = currentIndex;
        let largest = i;
        const l = left(i);
        const r = right(i);

        if (l < heapSize && a[l] > a[largest]) largest = l;
        if (r < heapSize && a[r] > a[largest]) largest = r;

        if (largest !== i) {
          [a[i], a[largest]] = [a[largest], a[i]];
          currentIndex = largest;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: currentIndex, comparing: currentIndex + 1 },
          };
        } else {
          swapTarget = -1; // ヒープ調整完了
          return {
            shouldLoop: heapSize > 1,
            array: [...a],
            /** 実験中*/
            markers: { current: currentIndex, comparing: currentIndex + 1 },
          };
        }
      }

      done = true;
      return {
        shouldLoop: false,
        array: [...a],
      };
    };
  })(),
  shell: ((): Sort => {
    let a: number[] = [];
    let gap = 0;
    let i = 0;
    let j = 0;
    let temp = 0;
    let innerLoop = false;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        gap = Math.floor(a.length / 2);
        i = gap;
        j = i;
        innerLoop = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (!innerLoop) {
        if (i >= a.length) {
          gap = Math.floor(gap / 2);
          if (gap === 0) {
            done = true;
            return {
              shouldLoop: false,
              array: [...a],
              /** 実験中*/
              markers: {},
            };
          }
          i = gap;
          j = i;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: j, comparing: j + 1 },
          };
        }

        temp = a[i];
        j = i;
        innerLoop = true;
      }

      // 内側：gap間隔の挿入ソート
      if (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        j -= gap;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: j, comparing: j + 1 },
        };
      } else {
        a[j] = temp;
        i++;
        innerLoop = false;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: j, comparing: j + 1 },
        };
      }
    };
  })(),
  cocktail: ((): Sort => {
    let a: number[] = [];
    let left = 0;
    let right = 0;
    let i = 0;
    let direction: 'forward' | 'backward' = 'forward';
    let swapped = false;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        left = 0;
        right = a.length - 1;
        i = 0;
        direction = 'forward';
        swapped = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (direction === 'forward') {
        if (i < right) {
          if (a[i] > a[i + 1]) {
            [a[i], a[i + 1]] = [a[i + 1], a[i]];
            swapped = true;
          }
          i++;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: i - 1, comparing: i },
          };
        }
        right--;
        direction = 'backward';
        i = right;
        if (!swapped) {
          done = true;
        }
        swapped = false;
        return {
          shouldLoop: !done,
          array: [...a],
          /** 実験中*/
          markers: !done ? { current: i, comparing: i + 1 } : undefined,
        };
      }

      if (direction === 'backward') {
        if (i > left) {
          if (a[i - 1] > a[i]) {
            [a[i - 1], a[i]] = [a[i], a[i - 1]];
            swapped = true;
          }
          i--;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: i - 1, comparing: i },
          };
        }
        left++;
        direction = 'forward';
        i = left;
        if (!swapped) {
          done = true;
        }
        swapped = false;
        return {
          shouldLoop: !done,
          array: [...a],
          /** 実験中*/
          markers: !done ? { current: i - 1, comparing: i } : undefined,
        };
      }

      return {
        shouldLoop: false,
        array: [...a],
      };
    };
  })(),
  gnome: ((): Sort => {
    let a: number[] = [];
    let i = 1;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        i = 1;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (i >= a.length) {
        done = true;
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (i === 0 || a[i - 1] <= a[i]) {
        i++;
      } else {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        i--;
      }

      return {
        shouldLoop: true,
        array: [...a],
        /** 実験中*/
        markers: { current: i - 1, comparing: i },
      };
    };
  })(),
  comb: ((): Sort => {
    let a: number[] = [];
    let gap = 0;
    let shrink = 1.3;
    let i = 0;
    let sorted = false;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        gap = a.length;
        i = 0;
        sorted = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // gap更新はgapごとの最初のステップでだけやる
      if (gap > 1 && i === 0) {
        gap = Math.floor(gap / shrink);
        if (gap < 1) gap = 1;
      }

      if (i + gap < a.length) {
        if (a[i] > a[i + gap]) {
          [a[i], a[i + gap]] = [a[i + gap], a[i]];
          sorted = false;
        }
        i++;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: i, comparing: i + gap },
        };
      } else {
        if (gap === 1 && sorted) {
          done = true;
          return {
            shouldLoop: false,
            array: [...a],
            /** 実験中*/
            markers: {},
          };
        }
        i = 0;
        sorted = true;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: i, comparing: i + gap },
        };
      }
    };
  })(),
  tim: ((): Sort => {
    let a: number[] = [];
    let runSize = 32;
    let phase: 'insertion' | 'merge' | 'prepareMerge' = 'insertion';
    let runIndex = 0;
    let i = 0,
      j = 0;
    let temp = 0;
    let inserting = false;
    let insertStart = 0;
    let done = false;

    // マージ準備用
    let mergeQueue: number[][] = [];
    let prepareIndex = 0;

    // マージ処理用
    let left: number[] = [];
    let right: number[] = [];
    let merged: number[] = [];
    let li = 0;
    let ri = 0;
    let merging = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        runIndex = 0;
        mergeQueue = [];
        phase = 'insertion';
        i = 1;
        j = 0;
        temp = 0;
        inserting = false;
        insertStart = 0;
        done = false;

        // merge準備初期化
        prepareIndex = 0;
        left = [];
        right = [];
        merged = [];
        li = 0;
        ri = 0;
        merging = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
          markers: {},
        };
      }

      // ---------------- 挿入ソートフェーズ ----------------
      if (phase === 'insertion') {
        const start = runIndex * runSize;
        const end = Math.min(a.length, start + runSize);

        if (start >= a.length) {
          phase = 'prepareMerge';
          return {
            shouldLoop: true,
            array: [...a],
            markers: {},
          };
        }

        if (!inserting && i < end) {
          temp = a[i];
          j = i;
          insertStart = start;
          inserting = true;
          return {
            shouldLoop: true,
            array: [...a],
            markers: { current: j, comparing: j - 1 },
          };
        }

        if (inserting) {
          if (j > insertStart && a[j - 1] > temp) {
            a[j] = a[j - 1];
            j--;
            return {
              shouldLoop: true,
              array: [...a],
              markers: { current: j, comparing: j - 1 },
            };
          } else {
            a[j] = temp;
            i++;
            inserting = false;
            if (i >= end) {
              runIndex++;
              i = runIndex * runSize + 1;
            }
            return {
              shouldLoop: true,
              array: [...a],
              markers: { current: j },
            };
          }
        }

        return {
          shouldLoop: true,
          array: [...a],
          markers: {},
        };
      }

      // ---------------- マージ用run分割フェーズ ----------------
      if (phase === 'prepareMerge') {
        const start = prepareIndex;
        const end = Math.min(start + runSize, a.length);
        if (start < a.length) {
          let segment: number[] = [];
          let k = start;
          while (k < end) {
            segment.push(a[k]);
            k++;
          }
          mergeQueue.push(segment);
          prepareIndex += runSize;
          return {
            shouldLoop: true,
            array: [...a],
            markers: {},
          };
        } else {
          phase = 'merge';
          return {
            shouldLoop: true,
            array: [...a],
            markers: {},
          };
        }
      }

      // ---------------- マージフェーズ ----------------
      if (phase === 'merge') {
        if (!merging) {
          if (mergeQueue.length <= 1) {
            a = mergeQueue[0] || [];
            done = true;
            return {
              shouldLoop: false,
              array: [...a],
              markers: {},
            };
          }

          left = mergeQueue.shift()!;
          right = mergeQueue.shift()!;
          merged = [];
          li = 0;
          ri = 0;
          merging = true;
        }

        if (li < left.length && ri < right.length) {
          if (left[li] < right[ri]) {
            merged.push(left[li]);
            li++;
          } else {
            merged.push(right[ri]);
            ri++;
          }
        } else if (li < left.length) {
          merged.push(left[li]);
          li++;
        } else if (ri < right.length) {
          merged.push(right[ri]);
          ri++;
        }

        if (li >= left.length && ri >= right.length) {
          mergeQueue.push(merged);
          merging = false;
        }

        // 表示用に現時点の mergeQueue を再構成
        let display: number[] = [];
        for (let qi = 0; qi < mergeQueue.length; qi++) {
          display = display.concat(mergeQueue[qi]);
        }
        display = display.concat(merged, left.slice(li), right.slice(ri));

        return {
          shouldLoop: true,
          array: display,
          markers: {},
        };
      }

      return {
        shouldLoop: false,
        array: [...a],
        markers: {},
      };
    };
  })(),
  counting: ((): Sort => {
    let a: number[] = [];
    let min = 0;
    let max = 0;
    let count: number[] = [];
    let output: number[] = [];
    let phase: 'count' | 'write' = 'count';
    let i = 0; // 入力処理用（カウント）
    let j = 0; // 出力用インデックス
    // let writeValue = 0;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        min = Math.min(...a);
        max = Math.max(...a);
        count = new Array(max - min + 1).fill(0);
        output = [];
        i = 0;
        j = 0;
        // writeValue = min;
        phase = 'count';
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // ===== フェーズ①：出現回数をカウント =====
      if (phase === 'count') {
        if (i < a.length) {
          count[a[i] - min]++;
          i++;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: j, comparing: j + 1 },
          };
        } else {
          phase = 'write';
          i = 0; // 出力位置
          // writeValue = min;
          j = 0; // count配列の走査位置
        }
      }

      // ===== フェーズ②：出力を構築 =====
      if (j >= count.length) {
        done = true;
        return {
          shouldLoop: false,
          array: [...output],
        };
      }

      if (count[j] > 0) {
        output[i] = j + min; // writeValue = j + min
        count[j]--;
        i++;
      } else {
        j++;
      }

      return {
        shouldLoop: true,
        array: [...output],
        /** 実験中*/
        // markers: { current: j, comparing: j + 1 },
      };
    };
  })(),
  radix: ((): Sort => {
    let a: number[] = [];
    let maxDigits = 0;
    let digitIndex = 0;
    let buckets: number[][] = [];
    let bucketIndex = 0;
    let itemIndex = 0;
    let collecting = false;
    let done = false;

    function getDigit(num: number, digit: number): number {
      return Math.floor(Math.abs(num) / Math.pow(10, digit)) % 10;
    }

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        maxDigits = Math.max(...a.map((n) => n.toString().length));
        digitIndex = 0;
        buckets = Array.from({ length: 10 }, () => []);
        bucketIndex = 0;
        itemIndex = 0;
        collecting = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // バケツに振り分け（1ステップずつ）
      if (!collecting) {
        if (itemIndex < a.length) {
          const num = a[itemIndex];
          const digit = getDigit(num, digitIndex);
          buckets[digit].push(num);
          itemIndex++;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: itemIndex - 1, comparing: itemIndex },
          };
        } else {
          // 全部バケツに入れ終わった
          collecting = true;
          itemIndex = 0;
          bucketIndex = 0;
          a = [];
        }
      }

      // バケツから回収（1ステップずつ）
      while (bucketIndex < 10 && buckets[bucketIndex].length === 0) {
        bucketIndex++;
      }

      if (bucketIndex < 10) {
        a.push(buckets[bucketIndex].shift()!);
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: itemIndex, comparing: itemIndex + 1 },
        };
      }

      // すべて回収完了 → 次の桁へ
      digitIndex++;
      if (digitIndex >= maxDigits) {
        done = true;
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      // 次の桁の準備
      buckets = Array.from({ length: 10 }, () => []);
      itemIndex = 0;
      collecting = false;

      return {
        shouldLoop: true,
        array: [...a],
        /** 実験中*/
        markers: { current: itemIndex, comparing: itemIndex + 1 },
      };
    };
  })(),
  bucket: ((): Sort => {
    let a: number[] = [];
    let min = 0;
    let max = 0;
    let bucketCount = 10;
    let buckets: number[][] = [];
    let output: number[] = [];
    let phase: 'scatter' | 'gather' = 'scatter';
    let i = 0;
    let bucketIndex = 0;
    // let gatherIndex = 0;
    let done = false;

    function insertSorted(bucket: number[], value: number): number[] {
      const result = [...bucket];
      let inserted = false;
      for (let k = 0; k < result.length; k++) {
        if (value < result[k]) {
          result.splice(k, 0, value);
          inserted = true;
          break;
        }
      }
      if (!inserted) result.push(value);
      return result;
    }

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        min = Math.min(...a);
        max = Math.max(...a);
        buckets = Array.from({ length: bucketCount }, () => []);
        output = [];
        i = 0;
        bucketIndex = 0;
        // gatherIndex = 0;
        phase = 'scatter';
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...output],
        };
      }

      if (phase === 'scatter') {
        if (i < a.length) {
          const value = a[i];
          const index = Math.floor(((value - min) / (max - min + 1)) * bucketCount);
          buckets[index] = insertSorted(buckets[index], value); // 1ステップ：バケツ内でソート挿入
          i++;
          return {
            shouldLoop: true,
            array: [...a],
            /** 実験中*/
            markers: { current: i - 1, comparing: i },
          };
        } else {
          phase = 'gather';
          bucketIndex = 0;
          // gatherIndex = 0;
          output = [];
        }
      }

      // gather phase: バケツから1要素ずつ出す
      while (bucketIndex < bucketCount && buckets[bucketIndex].length === 0) {
        bucketIndex++;
      }

      if (bucketIndex < bucketCount) {
        output.push(buckets[bucketIndex].shift()!);
        return {
          shouldLoop: true,
          array: [...output],
          /** 実験中*/
          markers: { current: i, comparing: i + 1 },
        };
      }

      done = true;
      return {
        shouldLoop: false,
        array: [...output],
      };
    };
  })(),
  'odd-even': ((): Sort => {
    let a: number[] = [];
    let phase: 'even' | 'odd' = 'even';
    let i = 0;
    let swapped = false;
    // let passSwapped = false;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        phase = 'even';
        i = 0;
        swapped = false;
        // passSwapped = false;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (i + 1 < a.length) {
        if (a[i] > a[i + 1]) {
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
          swapped = true;
          // passSwapped = true;
        }
        i += 2;
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: i - 2, comparing: i - 1 },
        };
      }

      // 現在の偶奇フェーズが終わった
      i = phase === 'even' ? 1 : 0;
      phase = phase === 'even' ? 'odd' : 'even';

      if (!swapped && phase === 'even') {
        // 偶・奇ともに1周終わって何も交換してなければ終了
        done = true;
      }

      swapped = false;
      return {
        shouldLoop: !done,
        array: [...a],
        /** 実験中*/
        markers: { current: i, comparing: i + 1 },
      };
    };
  })(),
  bitonic: ((): Sort => {
    let a: number[] = [];
    let n = 0;

    let size = 2; // ビトニック列サイズ
    let half = 1; // 比較間隔
    let i = 0;
    let done = false;

    function isPowerOfTwo(x: number): boolean {
      return (x & (x - 1)) === 0 && x !== 0;
    }

    return (arr: number[], init = false) => {
      if (init) {
        if (!isPowerOfTwo(arr.length)) {
          throw new Error('ビトニックソートは、要素数が2の累乗である必要があります。');
        }
        a = [...arr];
        n = a.length;
        size = 2;
        half = size / 2;
        i = 0;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      const j = i + half;
      const blockStart = Math.floor(i / size) * size;
      const up = Math.floor(blockStart / size) % 2 === 0;

      if (j < n && j - i === half && Math.floor(j / size) === Math.floor(i / size)) {
        if (a[i] > a[j] === up) {
          [a[i], a[j]] = [a[j], a[i]];
        }

        const markers = { current: i, comparing: j };
        i++;
        return {
          shouldLoop: true,
          array: [...a],
          markers,
        };
      } else {
        i++;
      }

      if (i + half >= n) {
        i = 0;
        half = Math.floor(half / 2);

        if (half === 0) {
          size *= 2;
          if (size > n) {
            done = true;
            return {
              shouldLoop: false,
              array: [...a],
            };
          }
          half = size / 2;
        }
      }

      return {
        shouldLoop: true,
        array: [...a],
      };
    };
  })(),
  pancake: ((): Sort => {
    let a: number[] = [];
    let size = 0;
    let maxIndex = 0;
    let phase: 'find' | 'flip1' | 'flip2' | 'skip' = 'find';
    let done = false;

    function flip(arr: number[], k: number): number[] {
      return [...arr.slice(0, k + 1).reverse(), ...arr.slice(k + 1)];
    }

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        size = a.length;
        phase = 'find';
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (phase === 'find') {
        if (size <= 1) {
          done = true;
          return {
            shouldLoop: false,
            array: [...a],
            /** 実験中*/
            markers: {},
          };
        }
        maxIndex = 0;
        for (let i = 1; i < size; i++) {
          if (a[i] > a[maxIndex]) {
            maxIndex = i;
          }
        }
        phase = maxIndex === size - 1 ? 'skip' : 'flip1';
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: maxIndex, comparing: maxIndex + 1 },
        };
      }

      if (phase === 'flip1') {
        if (maxIndex !== 0) {
          a = flip(a, maxIndex);
        }
        phase = 'flip2';
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: maxIndex, comparing: maxIndex + 1 },
        };
      }

      if (phase === 'flip2') {
        a = flip(a, size - 1);
        size--; // ソート済み領域を広げる
        phase = 'find';
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: maxIndex, comparing: maxIndex + 1 },
        };
      }

      if (phase === 'skip') {
        size--;
        phase = 'find';
        return {
          shouldLoop: true,
          array: [...a],
          /** 実験中*/
          markers: { current: maxIndex, comparing: maxIndex + 1 },
        };
      }

      return {
        shouldLoop: false,
        array: [...a],
      };
    };
  })(),
  stooge: ((): Sort => {
    let a: number[] = [];
    type Frame = { i: number; j: number; phase: 0 | 1 | 2 | 3 };
    let stack: Frame[] = [];
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        stack = [{ i: 0, j: a.length - 1, phase: 0 }];
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (stack.length === 0) {
        done = true;
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      const current = stack[stack.length - 1];
      const { i, j, phase } = current;

      if (i >= j) {
        stack.pop();
        return {
          shouldLoop: true,
          array: [...a],
          markers: { current: i, comparing: j },
        };
      }

      if (phase === 0 && a[i] > a[j]) {
        [a[i], a[j]] = [a[j], a[i]];
      }

      const len = j - i + 1;
      if (len > 2) {
        const third = Math.floor(len / 3);
        if (phase === 0) {
          current.phase = 1;
          stack.push({ i: i, j: j - third, phase: 0 });
        } else if (phase === 1) {
          current.phase = 2;
          stack.push({ i: i + third, j: j, phase: 0 });
        } else if (phase === 2) {
          current.phase = 3;
          stack.push({ i: i, j: j - third, phase: 0 });
        } else {
          stack.pop();
        }
      } else {
        stack.pop();
      }

      return {
        shouldLoop: true,
        array: [...a],
        markers: { current: i, comparing: j },
      };
    };
  })(),
  bogo: ((): Sort => {
    let a: number[] = [];
    let done = false;

    function isSorted(arr: number[]): boolean {
      return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
    }

    function shuffle(arr: number[]): number[] {
      const res = [...arr];
      for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
      }
      return res;
    }

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      if (isSorted(a)) {
        done = true;
        return {
          shouldLoop: false,
          array: [...a],
        };
      }

      a = shuffle(a);
      return {
        shouldLoop: true,
        array: [...a],
      };
    };
  })(),
  sleep: ((): Sort => {
    let input: number[] = [];
    let timers: { value: number; remaining: number; done: boolean }[] = [];
    let output: number[] = [];
    let i = 0;
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        input = [...arr];
        output = [];
        timers = input.map((v) => ({
          value: v,
          remaining: v,
          done: false,
        }));
        i = 0;
        done = false;
      }

      if (done) {
        return {
          shouldLoop: false,
          array: [...output],
        };
      }

      if (i >= timers.length) {
        i = 0;
      }

      const t = timers[i];
      if (!t.done) {
        if (t.remaining > 0) {
          t.remaining -= 1;
        }
        if (t.remaining <= 0) {
          output.push(t.value);
          t.done = true;
        }
      }

      i++;

      if (output.length === input.length) {
        done = true;
        return {
          shouldLoop: false,
          array: [...output],
        };
      }

      return {
        shouldLoop: true,
        array: [...output],
        /** 実験中*/
        markers: { current: i - 1, comparing: i },
      };
    };
  })(),
  slow: ((): Sort => {
    let a: number[] = [];
    type Frame = { i: number; j: number; phase: 0 | 1 | 2 | 3 | 4 };
    let stack: Frame[] = [];
    let done = false;

    return (arr: number[], init = false) => {
      if (init) {
        a = [...arr];
        stack = [{ i: 0, j: a.length - 1, phase: 0 }];
        done = false;
      }

      if (done) {
        return { shouldLoop: false, array: [...a] };
      }

      if (stack.length === 0) {
        done = true;
        return { shouldLoop: false, array: [...a] };
      }

      const frame = stack[stack.length - 1];
      const { i, j, phase } = frame;
      const m = Math.floor((i + j) / 2);

      if (i >= j) {
        stack.pop();
        return { shouldLoop: true, array: [...a], markers: { current: i, comparing: j } };
      }

      if (phase === 0) {
        frame.phase = 1;
        stack.push({ i: i, j: m, phase: 0 });
        return { shouldLoop: true, array: [...a], markers: { current: i, comparing: m } };
      }

      if (phase === 1) {
        frame.phase = 2;
        stack.push({ i: m + 1, j: j, phase: 0 });
        return { shouldLoop: true, array: [...a], markers: { current: m + 1, comparing: j } };
      }

      if (phase === 2) {
        if (a[j] < a[m]) {
          [a[j], a[m]] = [a[m], a[j]];
        }
        frame.phase = 3;
        return { shouldLoop: true, array: [...a], markers: { current: m, comparing: j } };
      }

      if (phase === 3) {
        frame.phase = 4;
        stack.push({ i: i, j: j - 1, phase: 0 });
        return { shouldLoop: true, array: [...a], markers: { current: i, comparing: j - 1 } };
      }

      stack.pop();
      return { shouldLoop: true, array: [...a] };
    };
  })(),
};

export const sortMethods = {
  bubble: (arr: number[]) => {
    const result = [...arr];
    const n = result.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  },

  selection: (arr: number[]) => {
    const result = [...arr];
    const n = result.length;
    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        if (result[j] < result[min]) min = j;
      }
      [result[i], result[min]] = [result[min], result[i]];
    }
    return result;
  },

  insertion: (arr: number[]) => {
    const result = [...arr];
    for (let i = 1; i < result.length; i++) {
      const key = result[i];
      let j = i - 1;
      while (j >= 0 && result[j] > key) {
        result[j + 1] = result[j];
        j--;
      }
      result[j + 1] = key;
    }
    return result;
  },

  merge: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sortMethods.merge(arr.slice(0, mid));
    const right = sortMethods.merge(arr.slice(mid));
    const result: number[] = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      result.push(left[i] < right[j] ? left[i++] : right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  },

  quick: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.slice(0, -1).filter((x) => x < pivot);
    const right = arr.slice(0, -1).filter((x) => x >= pivot);
    return [...sortMethods.quick(left), pivot, ...sortMethods.quick(right)];
  },

  heap: (arr: number[]) => {
    const result = [...arr];
    const n = result.length;

    const heapify = (i: number, n: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && result[left] > result[largest]) largest = left;
      if (right < n && result[right] > result[largest]) largest = right;
      if (largest !== i) {
        [result[i], result[largest]] = [result[largest], result[i]];
        heapify(largest, n);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(i, n);
    for (let i = n - 1; i > 0; i--) {
      [result[0], result[i]] = [result[i], result[0]];
      heapify(0, i);
    }

    return result;
  },

  shell: (arr: number[]) => {
    const result = [...arr];
    const n = result.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = result[i];
        let j = i;
        while (j >= gap && result[j - gap] > temp) {
          result[j] = result[j - gap];
          j -= gap;
        }
        result[j] = temp;
      }
    }
    return result;
  },

  cocktail: (arr: number[]) => {
    const result = [...arr];
    let swapped = true;
    let start = 0,
      end = result.length - 1;
    while (swapped) {
      swapped = false;
      for (let i = start; i < end; i++) {
        if (result[i] > result[i + 1]) {
          [result[i], result[i + 1]] = [result[i + 1], result[i]];
          swapped = true;
        }
      }
      if (!swapped) break;
      swapped = false;
      end--;
      for (let i = end - 1; i >= start; i--) {
        if (result[i] > result[i + 1]) {
          [result[i], result[i + 1]] = [result[i + 1], result[i]];
          swapped = true;
        }
      }
      start++;
    }
    return result;
  },

  gnome: (arr: number[]) => {
    const result = [...arr];
    let i = 1;
    while (i < result.length) {
      if (i === 0 || result[i] >= result[i - 1]) {
        i++;
      } else {
        [result[i], result[i - 1]] = [result[i - 1], result[i]];
        i--;
      }
    }
    return result;
  },

  comb: (arr: number[]) => {
    const result = [...arr];
    const shrink = 1.3;
    let gap = result.length;
    let sorted = false;
    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      for (let i = 0; i + gap < result.length; i++) {
        if (result[i] > result[i + gap]) {
          [result[i], result[i + gap]] = [result[i + gap], result[i]];
          sorted = false;
        }
      }
    }
    return result;
  },

  tim: (arr: number[]): number[] => {
    const result = [...arr];
    const MIN_RUN = 32;

    const insertionSort = (arr: number[], left: number, right: number) => {
      for (let i = left + 1; i <= right; i++) {
        const temp = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > temp) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = temp;
      }
    };

    const merge = (arr: number[], l: number, m: number, r: number) => {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;
      while (i < left.length && j < right.length) {
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
    };

    const n = result.length;

    // Step 1: insertion sort on small blocks
    for (let i = 0; i < n; i += MIN_RUN) {
      insertionSort(result, i, Math.min(i + MIN_RUN - 1, n - 1));
    }

    // Step 2: merge runs
    let size = MIN_RUN;
    while (size < n) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid < right) {
          merge(result, left, mid, right);
        }
      }
      size *= 2;
    }

    return result;
  },

  counting: (arr: number[]) => {
    if (arr.some((x) => x < 0)) throw new Error('Counting sort requires non-negative integers.');
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    for (const num of arr) count[num]++;
    const result: number[] = [];
    for (let i = 0; i <= max; i++) {
      while (count[i]--) result.push(i);
    }
    return result;
  },

  radix: (arr: number[]) => {
    if (arr.some((x) => x < 0)) throw new Error('Radix sort requires non-negative integers.');
    const max = Math.max(...arr);
    let exp = 1;
    let result = [...arr];
    while (Math.floor(max / exp) > 0) {
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (const num of result) {
        const digit = Math.floor(num / exp) % 10;
        buckets[digit].push(num);
      }
      result = ([] as number[]).concat(...buckets);
      exp *= 10;
    }
    return result;
  },

  bucket: (arr: number[]) => {
    if (arr.length === 0) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bucketCount = Math.floor(Math.sqrt(arr.length)) || 1;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
    const range = (max - min + 1) / bucketCount;
    for (const num of arr) {
      const index = Math.floor((num - min) / range);
      buckets[Math.min(index, bucketCount - 1)].push(num);
    }
    return buckets.flatMap((bucket) => sortMethods.insertion(bucket));
  },

  'odd-even': (arr: number[]) => {
    const result = [...arr];
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 1; i < result.length - 1; i += 2) {
        if (result[i] > result[i + 1]) {
          [result[i], result[i + 1]] = [result[i + 1], result[i]];
          sorted = false;
        }
      }
      for (let i = 0; i < result.length - 1; i += 2) {
        if (result[i] > result[i + 1]) {
          [result[i], result[i + 1]] = [result[i + 1], result[i]];
          sorted = false;
        }
      }
    }
    return result;
  },

  bitonic: (arr: number[]) => {
    // Bitonic Sort は本来並列ソート用。ここでは簡略化されたシーケンシャル版
    const up = true;
    const bitonicSort = (arr: number[], up: boolean): number[] => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const first = bitonicSort(arr.slice(0, mid), true);
      const second = bitonicSort(arr.slice(mid), false);
      return bitonicMerge([...first, ...second], up);
    };
    const bitonicMerge = (arr: number[], up: boolean): number[] => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      for (let i = 0; i < mid; i++) {
        if (arr[i] > arr[i + mid] === up) {
          [arr[i], arr[i + mid]] = [arr[i + mid], arr[i]];
        }
      }
      return bitonicMerge(arr.slice(0, mid), up).concat(bitonicMerge(arr.slice(mid), up));
    };
    return bitonicSort([...arr], up);
  },

  pancake: (arr: number[]) => {
    const result = [...arr];
    const flip = (end: number) => {
      for (let i = 0, j = end; i < j; i++, j--) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    };
    for (let curr = result.length; curr > 1; curr--) {
      const maxIdx = result.slice(0, curr).reduce((iMax, val, i) => (val > result[iMax] ? i : iMax), 0);
      if (maxIdx !== curr - 1) {
        if (maxIdx > 0) flip(maxIdx);
        flip(curr - 1);
      }
    }
    return result;
  },

  stooge: (arr: number[]): number[] => {
    const result = [...arr];
    const stoogeSort = (l: number, h: number) => {
      if (result[l] > result[h]) [result[l], result[h]] = [result[h], result[l]];
      if (h - l + 1 > 2) {
        const t = Math.floor((h - l + 1) / 3);
        stoogeSort(l, h - t);
        stoogeSort(l + t, h);
        stoogeSort(l, h - t);
      }
    };
    stoogeSort(0, result.length - 1);
    return result;
  },

  bogo: async (arr: number[]) => {
    const result = [...arr];
    const isSorted = (arr: number[]) => arr.every((val, i, a) => i === 0 || a[i - 1] <= val);
    const shuffle = (arr: number[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    };
    return new Promise<number[]>(async (resolve) => {
      const id = window.setTimeout(() => {
        resolve(result);
      }, 5000);
      while (!isSorted(result)) {
        shuffle(result);
        await new Promise((r) => setTimeout(r, 0));
      }
      clearTimeout(id);
      resolve(result);
    });
  },

  sleep: async (arr: number[]) => {
    const result: number[] = [];
    const promises = arr.map(
      (num) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            result.push(num);
            resolve();
          }, num * 10); // 10ms * 値 により「擬似的に順序付け」
        }),
    );
    await Promise.all(promises);
    return result;
  },

  slow: async (arr: number[]) => {
    let result = [...arr];
    const isSorted = (a: number[]) => a.every((v, i, r) => i === 0 || r[i - 1] <= v);
    const generate = (a: number[]) => {
      const b = [...a];
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    };
    while (!isSorted(result)) {
      result = generate(result);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return result;
  },
};
