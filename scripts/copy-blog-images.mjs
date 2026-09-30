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

/**
 * `MM-DD-slug/xx.webp` のように、記事ごとのslugディレクトリ配下の画像をコピーする。
 * @param {string} slugDir
 * @param {string} destDir
 */
function copySlugImages(slugDir, destDir) {
  for (const entry of fs.readdirSync(slugDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    fs.mkdirSync(destDir, { recursive: true });
    const srcPath = path.join(slugDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    fs.copyFileSync(srcPath, destPath);
    console.log(`  copied: ${srcPath} → ${destPath}`);
  }
}

for (const dirName of fs.readdirSync(blogDir)) {
  const dirPath = path.join(blogDir, dirName);
  if (!fs.statSync(dirPath).isDirectory()) continue;

  const category = dirName;

  for (const year of fs.readdirSync(dirPath)) {
    const yearPath = path.join(dirPath, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    for (const slug of fs.readdirSync(yearPath)) {
      const slugPath = path.join(yearPath, slug);
      if (!fs.statSync(slugPath).isDirectory()) continue;

      copySlugImages(slugPath, path.join(root, 'public', 'articles', category, year, slug));
    }
  }
}

console.log('✓ Blog images copied.');
