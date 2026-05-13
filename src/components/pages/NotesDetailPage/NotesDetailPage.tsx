import { NotesGitHubEditLink } from '@/components/layouts/NotesLayout/client/NotesGitHubEditLink';
import { NotesFrontmatter } from '@/libs/notes';
import styles from './NotesDetailPage.module.css';

interface Props {
  frontmatter?: NotesFrontmatter;
  content?: string;
  toc?: string;
}

export const NotesDetailPage = ({ frontmatter, content, toc }: Props) => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>
        <span className={styles.text}>{frontmatter?.title}</span>
      </h1>

      {toc !== undefined && toc !== '' && (
        <nav aria-label="目次" className={styles.toc}>
          <div className={styles.inner}>
            <h2>目次</h2>
            <div className={styles.list} dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        </nav>
      )}
      <div className={styles.body}>
        {content !== undefined && content !== '' && (
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
        )}

        <div className={styles.edit}>
          <NotesGitHubEditLink />
        </div>
      </div>
    </main>
  );
};
