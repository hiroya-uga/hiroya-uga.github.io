import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

type Props = {
  className?: string;
  code: string;
};

export const CodeBlock = ({ code, className }: Props) => {
  if (!code) {
    return <></>;
  }

  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('javascript', javascript);

  const language = (className ?? '').replace('language-', '') || 'html';
  const __html = language ? hljs.highlight(code, { language }).value : code;

  return (
    <code
      className={`whitespace-pre ${className}`}
      dangerouslySetInnerHTML={{
        __html,
      }}
    />
  );
};
