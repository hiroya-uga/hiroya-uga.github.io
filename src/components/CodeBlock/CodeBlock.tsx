import clsx from 'clsx';
import hljs from 'highlight.js/lib/core';
import shell from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

type Props = {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'jsx' | 'sh';
  className?: string;
  nowrap?: boolean;
};

export const CodeBlock = ({ code, className, language = 'html', nowrap }: Props) => {
  if (code === '') {
    return null;
  }

  hljs.registerLanguage('jsx', javascript);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('sh', shell);

  const __html = hljs.highlight(code, { language }).value;

  return (
    <pre className={className}>
      <code
        className={clsx(['hljs rounded text-sm', nowrap === true ? 'whitespace-pre' : 'whitespace-pre-wrap'])}
        dangerouslySetInnerHTML={{
          __html,
        }}
      />
    </pre>
  );
};
