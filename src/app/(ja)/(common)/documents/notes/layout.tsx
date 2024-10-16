import '@/app/(ja)/(common)/documents/notes/common.css';
import 'highlight.js/styles/a11y-dark.css';

export default function uiPracticesLayout({ children }: { children: React.ReactNode }) {
  return <article>{children}</article>;
}
