/**
 * articles/ ディレクトリ内の画像ファイルを public/articles/ にコピーする。
 * predev / prebuild で実行する。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

const blogDir = path.join(root, 'articles');

for (const dirName of fs.readdirSync(blogDir)) {
  const dirPath = path.join(blogDir, dirName);
  if (!fs.statSync(dirPath).isDirectory()) continue;

  const category = dirName;

  for (const year of fs.readdirSync(dirPath)) {
    const yearPath = path.join(dirPath, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    for (const file of fs.readdirSync(yearPath)) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) continue;

      const src = path.join(yearPath, file);
      const destDir = path.join(root, 'public', 'articles', category, year);
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, path.join(destDir, file));
      console.log(`  copied: ${src} → ${path.join(destDir, file)}`);
    }
  }
}

console.log('✓ Blog images copied.');
