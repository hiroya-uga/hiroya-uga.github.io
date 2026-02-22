'use client';

import { NoteBox } from '@/components/Box';
import { RunButton } from '@/components/Clickable';
import { CodeBlock } from '@/components/CodeBlock';
import { Radio } from '@/components/Form';
import { Heading } from '@/components/Heading';
import { useMemo, useState } from 'react';

const Example = ({ shouldUseTemplateLiteral }: { shouldUseTemplateLiteral: boolean }) => {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <p className="bg-secondary mb-paragraph rounded-lg p-4 font-mono" aria-live="assertive">
        {shouldUseTemplateLiteral ? `Clicked ${count} times` : <>Clicked {count} times</>}
      </p>
      <RunButton onClick={handleClick}>Click me!</RunButton>
    </>
  );
};

export const RenderTextInReactPlaygroundContent = () => {
  const [shouldUseTemplateLiteral, setShouldUseTemplateLiteral] = useState(false);
  const code = useMemo(() => {
    return `export const Example = () => {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <p aria-live="assertive">${shouldUseTemplateLiteral ? '{`Clicked ${count} times`}' : 'Clicked {count} times'}</p>
      <button onClick={handleClick}>Click me!</button>
    </>
  );
};`;
  }, [shouldUseTemplateLiteral]);

  return (
    <>
      <Heading level={2}>出力方法</Heading>
      <ul className="mb-paragraph space-y-2 px-2">
        <li>
          <Radio
            label="テンプレートリテラルを使わない"
            name="mode"
            checked={shouldUseTemplateLiteral === false}
            onChange={() => setShouldUseTemplateLiteral(false)}
          />
        </li>
        <li>
          <Radio
            label="テンプレートリテラルを使う"
            name="mode"
            checked={shouldUseTemplateLiteral}
            onChange={() => setShouldUseTemplateLiteral(true)}
          />
        </li>
      </ul>

      <NoteBox>
        <p>
          JSX（TSX）でテキストをレンダリングする際、1つの<code>string</code>
          に結合せずにレンダリングした場合、テキストノードは分断された状態でレンダリングされます。
        </p>

        <div className="@w640:grid-cols-2 mt-paragraph grid gap-4">
          <div>
            <p className="mb-2 font-bold">テンプレートリテラルを使わない場合：</p>
            <pre className="border-primary grid overflow-auto rounded-lg border">
              <CodeBlock
                code={`<p aria-live="assertive">
  Clicked
  <!-- -->
  0
  <!-- -->
  times
</p>`}
              />
            </pre>
          </div>
          <div className="grid grid-rows-[auto_1fr]">
            <p className="mb-2 font-bold">テンプレートリテラルを使う場合：</p>
            <pre className="border-primary grid overflow-auto rounded-lg border">
              <CodeBlock
                code={`<p aria-live="assertive">
  Clicked 0 times
</p>`}
              />
            </pre>
          </div>
        </div>
      </NoteBox>

      <Heading
        level={2}
      >{`${shouldUseTemplateLiteral ? 'テンプレートリテラルを使った' : 'テンプレートリテラルを使わない'}動作サンプル`}</Heading>

      <Example shouldUseTemplateLiteral={shouldUseTemplateLiteral} />

      <Heading level={2}>コードイメージ</Heading>
      <pre className="border-primary mb-paragraph grid overflow-auto rounded-lg border">
        <CodeBlock code={code} language="javascript" wrap="nowrap" />
      </pre>
    </>
  );
};
