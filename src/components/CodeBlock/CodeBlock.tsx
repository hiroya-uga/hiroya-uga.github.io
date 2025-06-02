import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

type Props = {
  className?: string;
  code: string;
  language?: string;
};

export const CodeBlock = ({ code, className, language }: Props) => {
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
    <code
      className={`hljs whitespace-pre-wrap rounded ${className ?? ''}`}
      dangerouslySetInnerHTML={{
        __html,
      }}
    />
  );
};
