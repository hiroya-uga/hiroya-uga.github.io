'use client';

import { NoteBox } from '@/components/Box';
import { CodeBlock } from '@/components/CodeBlock';
import { Switch } from '@/components/Form';

import { useEffect, useId, useRef, useState } from 'react';

import clsx from 'clsx';
import 'highlight.js/styles/github.css';

type SwitchItemProps = Pick<
  React.InputHTMLAttributes<HTMLElement>,
  'children' | 'checked' | 'disabled' | 'onChange'
> & {
  emoji?: string | false;
  code?: string;
  label: string;
};

const SwitchItem = ({ emoji, code, label, ...props }: SwitchItemProps) => {
  return (
    <li className="pb-2 mb-2 border-b border-b-gray-300 first:border-t first:border-t-gray-300 first:pt-2">
      <label className="flex wd-fit items-center min-h-[45px]">
        <span className={clsx(props.disabled && 'opacity-50', 'transition-opacity grow')}>
          {emoji && (
            <>
              <span className="text-2xl font-emoji">{emoji}</span>：
            </>
          )}
          {code ? (
            <>
              {' '}
              <code>{code}</code> {label}
            </>
          ) : (
            label
          )}
        </span>
        <Switch {...props} />
      </label>
    </li>
  );
};

type OutputTextfieldProps = Omit<React.InputHTMLAttributes<HTMLElement>, 'className' | 'type'> & {
  isUsingEmoji: boolean;
  isUsingWrapLabel: boolean;
};

const OutputTextfield = ({ isUsingEmoji, isUsingWrapLabel, ...props }: OutputTextfieldProps) => {
  const className = clsx(['block w-full py-3 px-2 mt-2 bg-white border border-gray-400 rounded']);

  if (isUsingWrapLabel) {
    return (
      <label className="p-3 rounded border-2 border-solid border-[#5071a8] block bg-[#5071a822] [&:not(:first-child)]:mt-2">
        <span>{isUsingEmoji ? '🍊' : 'ラベルB'}</span>
        <input {...props} className={className} />
      </label>
    );
  }

  return <input {...props} className={className} />;
};

type OutputProps = Pick<React.HTMLAttributes<HTMLElement>, 'children'> & {
  isUsingWrapLabelAll: boolean;
};
const Output = ({ children, isUsingWrapLabelAll }: OutputProps) => {
  if (isUsingWrapLabelAll) {
    return (
      <p>
        <label className={clsx(['p-3 rounded border-2 border-solid border-[#5071a8] block bg-[#5071a822]'])}>
          {children}
        </label>
      </p>
    );
  }

  return <p>{children}</p>;
};

export const AccessibleNameAndDescriptionComputation = ({
  textboxDescId,
  anchorLinkId,
}: {
  textboxDescId: string;
  anchorLinkId: string;
}) => {
  const labelAId = 'label-text-a';
  const labelBId = 'label-text-b';
  const inputId = 'input';
  const describedByAId = 'description-text-a';
  const describedByBId = 'description-text-b';

  const [isUsingAriaLabelledbyA, setUsingAriaLabelledbyA] = useState(false);
  const [isUsingAriaLabelledbyB, setUsingAriaLabelledbyB] = useState(false);
  const [isUsingAriaLabel, setUsingAriaLabel] = useState(false);
  const [isUsingLabel, setUsingLabel] = useState(true);
  const [isUsingWrapLabel, setUsingWrapLabel] = useState(false);
  const [isUsingWrapLabelAll, setUsingWrapLabelAll] = useState(false);
  const [isUsingTitle, setUsingTitle] = useState(false);
  const [isUsingAriaDescribedbyA, setUsingAriaDescribedbyA] = useState(true);
  const [isUsingAriaDescribedbyB, setUsingAriaDescribedbyB] = useState(false);
  const [isUsingAriaDescription, setUsingAriaDescription] = useState(false);
  const [shouldDisplayPlaceholder, setShouldDisplayPlaceholder] = useState(true);
  const [descriptionPositionIsBottom, setDescriptionPositionIsBottom] = useState(false);
  const [isUsingEmoji, setIsUsingEmoji] = useState(false);

  const [value, setValue] = useState('');
  const [markup, setMarkup] = useState(``);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = outputRef.current?.cloneNode(true) ?? null;
    const content = target instanceof HTMLElement ? target : null;
    const placeholder = document.createTextNode('___INPUT___');
    const input = content?.querySelector('input');

    content?.querySelectorAll('.___row___').forEach((row) => {
      const fragment = document.createDocumentFragment();

      [...row.childNodes].forEach((span) => {
        fragment.append(span);
      });

      row.replaceWith(fragment);
    });
    input?.replaceWith(placeholder);
    input?.removeAttribute('class');

    let indent = 0;
    let html = content?.innerHTML ?? '';

    // 雑整形
    html = html.replace(/ (class)="(.*?)"/g, ``);
    html = html
      .replace(/></g, `>\n<`)
      .replace(/>___INPUT___</g, `>___INPUT___\n<`)
      .split(`\n`)
      .map((row, idx, self) => {
        if (row.startsWith(`</`)) {
          indent -= 2;
        } else {
          indent += 2;
        }

        if (self[idx - 1]?.indexOf(`</`) !== -1) {
          indent -= 2;
        }

        return `${``.padStart(indent, ` `)}${row}`;
      })
      .join(`\n`);

    const inputHTML = `\n<input\n${[...(input?.attributes ?? [])]
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name < b.name) {
          return 1;
        }

        return 0;
      })
      .map((attr) => {
        return `  ${attr.name}="${attr.value.replaceAll('"', '\\"')}"\n`;
      })
      .join('')}/>`
      .split('\n')
      .join(
        // 先に作ったインデントに沿って input 要素をインデントさせる
        (() => {
          if (html.includes('\n    <')) {
            return '\n    ';
          }

          return '\n  ';
        })(),
      );

    html = html
      .replace('___INPUT___', `${inputHTML}\n`)
      .replace('\n</label>', '\n  </label>')
      .replace('<label>\n  <input', '<label>\n\n  <input')
      .replace('n>\n  <label>', 'n>\n\n  <label>')
      .replace('n>\n    <input', 'n>\n\n    <input')
      .replace('n>\n  <input', 'n>\n\n  <input')
      .replace('l>\n  <input', 'l>\n\n  <input')
      .replace('>\n\n  </label>', '>\n  </label>')
      .replace('  </label>\n<span ', '  </label>\n  <span')
      .replace('span>\n<span', 'span>\n  <span')
      .replace('/>\n\n</p>', '/>\n</p>');

    setMarkup([html].join(`\n`));
  }, [
    value,
    outputRef,
    isUsingAriaLabelledbyA,
    isUsingAriaLabelledbyB,
    isUsingAriaLabel,
    isUsingLabel,
    isUsingWrapLabel,
    isUsingWrapLabelAll,
    isUsingTitle,
    isUsingAriaDescribedbyA,
    isUsingAriaDescribedbyB,
    isUsingAriaDescription,
    shouldDisplayPlaceholder,
    descriptionPositionIsBottom,
    isUsingEmoji,
  ]);

  const className = [
    'inline-block w-fit py-[2px] px-[4px] rounded font-emoji',
    isUsingEmoji && 'min-w-[2.5rem] text-center',
  ];
  const labelsClassName = [...className, 'border-2 border-[#5071a8] bg-[#5071a822]'];
  const descriptionsClassName = [...className, 'border-2 border-[#606060] bg-[#60606022]'];

  const getErrorMessage = () => {
    /**
     * error - 仕様に反している、無視されている情報があるケース
     * warn - 特定のユーザにとって不利益が発生しているケース
     * info - 情報が取得できないわけではないが、綺麗な状態とも言えないケース
     */
    const errors: ['error' | 'warn' | 'info', string][] = [];

    if (
      !isUsingAriaLabelledbyA &&
      !isUsingAriaLabelledbyB &&
      !isUsingLabel &&
      !isUsingWrapLabel &&
      !isUsingWrapLabelAll
    ) {
      if (!isUsingAriaLabel && !isUsingTitle && !shouldDisplayPlaceholder) {
        errors.push(['error', 'アクセシブルネームがありません']);
      } else {
        if (!isUsingAriaLabel && !isUsingTitle && shouldDisplayPlaceholder) {
          if (value) {
            errors.push([
              'warn',
              '本来の目的に反し、placeholder属性がアクセシブルネームとして名前計算されていますが、値が入力されているため視覚的に表示されていません。特に、目で情報を得ているユーザはフォームコントロールの目的を理解するのが困難な可能性があります。',
            ]);
          } else {
            errors.push([
              'warn',
              '本来の目的に反し、placeholder属性がアクセシブルネームとして名前計算されています。値を入力すると視覚的に表示されなくなるため、特に目で情報を得ているユーザはフォームコントロールの目的を理解するのが困難になる可能性があります。',
            ]);
          }
        } else if (isUsingAriaLabel || isUsingTitle) {
          errors.push([
            'warn',
            'アクセシブルネームが設定されていますが、目に見えるラベルがありません。目で情報を得ているユーザはフォームコントロールの目的が理解できないかもしれません。',
          ]);
        }
      }
    }

    if (isUsingLabel && isUsingWrapLabel) {
      errors.push([
        'info',
        '複数のlabel要素と関連付けされているため、アクセシブルネームはそれぞれのlabel要素のコンテンツを結合したものになっています。',
      ]);
    }

    // aria-でアクセシブルネームが設定されてるとき
    if (isUsingAriaLabelledbyA || isUsingAriaLabelledbyB || isUsingAriaLabel) {
      // labelledby
      if (isUsingAriaLabelledbyA || isUsingAriaLabelledbyB) {
        if (isUsingAriaLabel) {
          errors.push(['error', 'aria-labelledby属性が優先されるため、aria-label属性は名前計算から無視されています。']);
        }
      }

      // label要素
      if (isUsingLabel || isUsingWrapLabel || isUsingWrapLabelAll) {
        if (!isUsingAriaLabel) {
          errors.push(['error', 'aria-labelledby属性が優先されるため、label要素は名前計算から無視されています。']);
        } else {
          errors.push(['error', 'aria-label属性が優先されるため、label要素は名前計算から無視されています。']);
        }
      }
    }

    /** shouldDisplayPlaceholder は title属性より優先度が低いので含めない */
    const hasName =
      isUsingAriaLabelledbyA ||
      isUsingAriaLabelledbyB ||
      isUsingAriaLabel ||
      isUsingLabel ||
      isUsingWrapLabel ||
      isUsingWrapLabelAll;

    if (isUsingAriaDescribedbyA || isUsingAriaDescribedbyB || isUsingAriaDescription) {
      if (isUsingTitle) {
        if (hasName) {
          errors.push([
            'warn',
            'title属性以外の手段でアクセシブルネームおよび説明文が提供されているため、title属性は名前計算・説明計算から無視されます。ツールチップとしてのみ機能していますが、キーボードユーザやスクリーンリーダ利用者は知覚できない可能性があります。',
          ]);
        } else {
          errors.push([
            'info',
            'title属性以外の手段で説明文が提供されており、他にアクセシビリティネームが提供されていないため、title属性はアクセシブルネームとして機能しています。',
          ]);
        }
      }
    } else {
      if (hasName) {
        if (isUsingTitle) {
          errors.push([
            'info',
            'title属性以外の手段でアクセシブルネームが提供されているため、title属性は名前計算からは無視され説明として機能しています。',
          ]);
        }
      }
    }

    // aria-で説明が設定されてるとき
    if (isUsingAriaDescribedbyA || isUsingAriaDescribedbyB) {
      if (isUsingAriaDescription) {
        errors.push([
          'error',
          'aria-describedby属性が優先されるため、aria-description属性は説明計算から無視されています。',
        ]);
      }

      if (isUsingWrapLabelAll) {
        errors.push([
          'warn',
          'label要素でアクセシブルネームが提供されていますが、説明文を含んでいるためアクセシブルネームと説明文で内容が重複しています。',
        ]);
      }
    } else if (isUsingAriaDescription) {
      errors.push([
        'warn',
        '説明文が設定されていますが、目に見える説明がありません。目で情報を得ているユーザはフォームコントロールの注意点や入力ルールが理解できないかもしれません。',
      ]);
    }

    if (descriptionPositionIsBottom) {
      errors.push([
        'info',
        '説明文は対象のフォームコントロールよりも前に表示したほうが、特に拡大鏡利用者にとって説明が見つけやすくなります。',
      ]);
    }

    return errors.map(([level, message]) => {
      const getBackgroundColor = (level: (typeof errors)[0][0]) => {
        switch (level) {
          case 'error':
            return 'bg-[#fcc]';

          case 'warn':
            return 'bg-[#ffc]';

          default:
            return 'bg-[#cfc]';
        }
      };

      return (
        <li key={message} className="text-sm bg-white rounded-md p-2 my-2">
          <span
            className={clsx([
              'text-sm px-2 min-w-[4rem] inline-block mr-2 text-center uppercase font-bold',
              getBackgroundColor(level),
            ])}
          >
            {level}
          </span>
          {message}
        </li>
      );
    });
  };

  const Description = () => {
    return (
      <span className="___row___ block mt-2 empty:mt-0">
        {isUsingAriaDescribedbyA && (
          <span id={describedByAId} className={clsx([...descriptionsClassName, 'border-dotted'])}>
            {isUsingEmoji ? '🍅' : '説明文A'}
          </span>
        )}
        {isUsingAriaDescribedbyB && (
          <span
            id={describedByBId}
            className={clsx([...descriptionsClassName, 'border-dotted', '[&:not(:first-child)]:ml-2'])}
          >
            {isUsingEmoji ? '🥬' : '説明文B'}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="md:grid grid-cols-2">
      <div className="mb-12 md:pr-14 md:mb-0">
        <h2>フラグ</h2>

        <div className="mb-12">
          <ul>
            <SwitchItem
              checked={isUsingAriaLabelledbyA}
              onChange={() => {
                setUsingAriaLabelledbyA(!isUsingAriaLabelledbyA);
              }}
              emoji={isUsingEmoji && '🍎'}
              code="aria-labelledby"
              label="属性 A"
            />
            <SwitchItem
              checked={isUsingAriaLabelledbyB}
              onChange={() => {
                setUsingAriaLabelledbyB(!isUsingAriaLabelledbyB);
              }}
              emoji={isUsingEmoji && '🍏'}
              code="aria-labelledby"
              label="属性 B"
            />
            <SwitchItem
              checked={isUsingAriaLabel}
              onChange={() => {
                setUsingAriaLabel(!isUsingAriaLabel);
              }}
              emoji={isUsingEmoji && '🍐'}
              code="aria-label"
              label="属性"
            />
            <SwitchItem
              checked={isUsingLabel}
              disabled={isUsingWrapLabelAll}
              onChange={() => {
                setUsingLabel(!isUsingLabel);
              }}
              emoji={isUsingEmoji && '🍋'}
              code="label"
              label="要素（for属性）"
            />
            <SwitchItem
              checked={isUsingWrapLabel}
              disabled={isUsingWrapLabelAll}
              onChange={() => {
                setUsingWrapLabel(!isUsingWrapLabel);
              }}
              emoji={isUsingEmoji && '🍊'}
              code="label"
              label="要素（一部をくくる）"
            />
            <SwitchItem
              checked={isUsingWrapLabelAll}
              disabled={isUsingLabel || isUsingWrapLabel}
              onChange={() => {
                setUsingWrapLabelAll(!isUsingWrapLabelAll);
              }}
              emoji={isUsingEmoji && '🍊'}
              code="label"
              label="要素（全体をくくる）"
            />
            <SwitchItem
              checked={isUsingTitle}
              onChange={() => {
                setUsingTitle(!isUsingTitle);
              }}
              emoji={isUsingEmoji && '🍓'}
              code="title"
              label="属性"
            />
            <SwitchItem
              checked={isUsingAriaDescription}
              onChange={() => {
                setUsingAriaDescription(!isUsingAriaDescription);
              }}
              emoji={isUsingEmoji && '🥗'}
              code="aria-description"
              label="属性"
            />
            <SwitchItem
              checked={isUsingAriaDescribedbyA}
              onChange={() => {
                setUsingAriaDescribedbyA(!isUsingAriaDescribedbyA);
              }}
              emoji={isUsingEmoji && '🍅'}
              code="aria-describedby"
              label="属性 A"
            />
            <SwitchItem
              checked={isUsingAriaDescribedbyB}
              onChange={() => {
                setUsingAriaDescribedbyB(!isUsingAriaDescribedbyB);
              }}
              emoji={isUsingEmoji && '🥬'}
              code="aria-describedby"
              label="属性 B"
            />
            <SwitchItem
              checked={shouldDisplayPlaceholder}
              onChange={() => {
                setShouldDisplayPlaceholder(!shouldDisplayPlaceholder);
              }}
              label="placeholderを表示する"
            />
            <SwitchItem
              checked={descriptionPositionIsBottom}
              onChange={() => {
                setDescriptionPositionIsBottom(!descriptionPositionIsBottom);
              }}
              label="説明文をテキストフィールドの下に配置"
            />
            <SwitchItem
              checked={isUsingEmoji}
              onChange={() => {
                setIsUsingEmoji(!isUsingEmoji);
              }}
              label="サンプルに絵文字を使う"
            />
          </ul>
        </div>

        <NoteBox>
          <p className="mb-2">
            アクセシブルな名前の計算方法は、
            <a href="https://www.w3.org/TR/accname-1.2/">Accessible Name and Description Computation</a>（
            <a href="https://momdo.github.io/accname-1.1/">日本語訳</a>）にて定義されています。
          </p>
          <p>
            <code>aria-description</code>
            属性は
            <a href="https://w3c.github.io/aria/#aria-description">WAI-ARIA</a>{' '}
            1.3に含まれる仕様ですが、2024年1月現在このドキュメントはEditor's Draftです。
          </p>
        </NoteBox>
      </div>

      <div>
        <h2>
          結果のレンダリングとHTML
          <sup>
            <a href={`#${anchorLinkId}`}>※</a>
          </sup>
        </h2>

        <div className="[&:has(li)]:mb-6" role="alert" aria-atomic="false">
          <ul aria-label="見つかった問題">{getErrorMessage()}</ul>
        </div>

        <div className="p-5 border border-gray-300 rounded-md mb-6">
          <div ref={outputRef}>
            <Output isUsingWrapLabelAll={isUsingWrapLabelAll}>
              <span className="___row___ block">
                {isUsingLabel && (
                  <label htmlFor={inputId} className={clsx([...labelsClassName, 'border-solid', 'mr-2'])}>
                    {isUsingEmoji ? '🍋' : 'ラベルA'}
                  </label>
                )}
                {isUsingWrapLabelAll && (
                  <span className={clsx([...className, 'mr-2'])}>{isUsingEmoji ? '🍊' : 'ラベルC'}</span>
                )}
                {isUsingAriaLabelledbyA && (
                  <span id={labelAId} className={clsx([...labelsClassName, 'border-dashed mr-2'])}>
                    {isUsingEmoji ? '🍎' : '擬似ラベルA'}
                  </span>
                )}
                {isUsingAriaLabelledbyB && (
                  <span id={labelBId} className={clsx([...labelsClassName, 'border-dashed'])}>
                    {isUsingEmoji ? '🍏' : '擬似ラベルB'}
                  </span>
                )}
              </span>

              {descriptionPositionIsBottom ? <></> : <Description />}

              <OutputTextfield
                isUsingWrapLabel={isUsingWrapLabel}
                isUsingEmoji={isUsingEmoji}
                aria-labelledby={
                  [isUsingAriaLabelledbyA ? labelAId : '', isUsingAriaLabelledbyB ? labelBId : ''].join(` `).trim() ||
                  undefined
                }
                aria-label={isUsingAriaLabel ? (isUsingEmoji ? `🍐` : '画面に表示されないラベル') : undefined}
                id={isUsingLabel ? inputId : undefined}
                title={isUsingTitle ? (isUsingEmoji ? `🍓` : 'ツールチップ文字列') : undefined}
                aria-describedby={
                  [isUsingAriaDescribedbyA ? describedByAId : '', isUsingAriaDescribedbyB ? describedByBId : '']
                    .join(` `)
                    .trim() || undefined
                }
                aria-description={
                  isUsingAriaDescription ? (isUsingEmoji ? `🥗` : '画面に表示されない説明文') : undefined
                }
                placeholder={shouldDisplayPlaceholder ? (isUsingEmoji ? 'placeholder' : '入力例）山田太郎') : undefined}
                defaultValue={value}
                onInput={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setValue(e.target.value);
                  }
                }}
              />

              {descriptionPositionIsBottom && <Description />}
            </Output>
          </div>
        </div>

        <div className="rounded-md border border-gray-300 mb-2 bg-white">
          <p
            id={textboxDescId}
            className="text-[0.625rem] px-4 pt-2 pb-1 mb-2 text-black border-b border-b-gray-400 border-dashed"
          >
            Hint：全選択ショートカットキーまたはマウスクリックでHTML断片を全選択できます。
          </p>

          <div
            role="textbox"
            aria-label="HTML"
            aria-readonly="true"
            aria-multiline="true"
            aria-describedby={textboxDescId}
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
            onClick={(e) => {
              window.getSelection()?.selectAllChildren(e.currentTarget);
            }}
            className="font-[Consolas,_Monaco,_monospace] text-sm overflow-auto"
          >
            <pre className="p-4 pt-0 w-fit min-w-full">
              <CodeBlock language="html" code={markup} />
            </pre>
          </div>
        </div>

        <ul id={anchorLinkId} className="text-xs">
          <li className="flex">
            <span>※</span>
            <small className="ml-1">
              出力されるHTMLコードに、実際には不要な<code>span</code>タグが含まれる場合があります
            </small>
          </li>

          <li className="flex">
            <span>※</span>
            <small className="ml-1">
              問題が検出された際にログが出力されますが、INFO含め指摘ログがない状態がベストです。なお、表示されるログのレベルは作者の主観によって定義されています。
            </small>
          </li>
        </ul>
      </div>
    </div>
  );
};
