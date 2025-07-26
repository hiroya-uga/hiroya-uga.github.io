import clsx from 'clsx';
import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

type Props = {
  className?: string;
  code: string;
  language?: string;
  wrap?: 'wrap' | 'nowrap';
};

export const CodeBlock = ({ code, className, language, wrap = 'wrap' }: Props) => {
  if (!code) {
    return <></>;
  }

  hljs.registerLanguage('jsx', javascript);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('javascript', javascript);

  const languageValue = language ?? ((className ?? '').replace('language-', '') || 'html');
  const __html = hljs.highlight(code, { language: languageValue }).value;

  return (
    // FIXME: Return with a pre element
    <code
      className={clsx(['hljs rounded', className, wrap === 'wrap' ? 'whitespace-pre-wrap' : 'whitespace-pre'])}
      dangerouslySetInnerHTML={{
        __html,
      }}
    />
  );
};
