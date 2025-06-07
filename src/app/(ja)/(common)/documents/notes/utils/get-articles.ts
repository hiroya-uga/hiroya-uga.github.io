import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export async function getArticles() {
  const articlesDir = path.join(process.cwd(), 'src', 'app', '(ja)', '(common)', 'documents', 'notes', 'contents');
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: filename.replace(/\.mdx$/, ''),
        title: '',
        publishedAt: '',
        keywords: [],
        dependencies: [],
        ...data,
      };
    })
    .sort((a, b) => {
      if (a.publishedAt < b.publishedAt) {
        return 1;
      }
      if (a.publishedAt > b.publishedAt) {
        return -1;
      }

      return 0;
    });

  return articles;
}
