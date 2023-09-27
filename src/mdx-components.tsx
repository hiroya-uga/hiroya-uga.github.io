import { CodeBlock } from '@/components/CodeBlock';

import React, { HTMLAttributes, ReactNode } from 'react';

import type { MDXComponents } from 'mdx/types';

type TagName = keyof JSX.IntrinsicElements;
type Props = Pick<HTMLAttributes<HTMLHeadingElement>, 'children'>;

interface DynamicTagProps {
  tagName: TagName;
  children?: ReactNode;
  [key: string]: any;
}

const DynamicTagComponent: React.FC<DynamicTagProps> = ({ tagName, children, ...props }) => {
  // タグ名とプロパティを使ってReact要素を生成
  const Element = React.createElement(tagName, props, children);

  // 生成したReact要素を返す
  return Element;
};

const headingLevel = (tagName: TagName) => {
  const Heading = ({ children }: Props) => {
    const id = (children?.toString() ?? '').replace(/[^A-Za-z0-9_\-]/g, '');

    return (
      <DynamicTagComponent tagName={tagName} id={id}>
        <strong>{children}</strong>
        <a href={`#${id}`} className="anchor">
          <span>Anchor Link</span>
        </a>
      </DynamicTagComponent>
    );
  };

  return Heading;
};

export const DocumentHeadingLevel2 = headingLevel('h2');

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: DocumentHeadingLevel2,
    h3: headingLevel('h3'),
    h4: headingLevel('h4'),
    h5: headingLevel('h5'),
    h6: headingLevel('h6'),
    code: ({ children, className }) => {
      return <CodeBlock code={String(children)} className={className} />;
    },
    ...components,
  };
}
