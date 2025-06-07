import styles from '@/app/(ja)/(common)/documents/notes/layout.module.css';

export default function uiPracticesLayout({ children }: { children: React.ReactNode }) {
  return <article id={styles.article}>{children}</article>;
}
