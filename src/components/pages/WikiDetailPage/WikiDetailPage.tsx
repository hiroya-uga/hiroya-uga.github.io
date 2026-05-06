import { WikiGitHubEditLink } from '@/components/layouts/WikiLayout/client/WikiGitHubEditLink';
import { WikiFrontmatter } from '@/libs/wiki';
import styles from './WikiDetailPage.module.css';

interface Props {
  frontmatter?: WikiFrontmatter;
  content?: string;
  toc?: string;
}

export const WikiDetailPage = ({ frontmatter, content, toc }: Props) => {
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
          <WikiGitHubEditLink />
        </div>
      </div>
    </main>
  );
};
