/**
 * wiki/ ディレクトリ内の images/ フォルダにある画像ファイルを public/wiki/ にコピーする。
 * predev / prebuild で実行する。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

const wikiDir = path.join(root, 'wiki');

const walk = (dir, relPath) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      walk(entryPath, entryRelPath);
    } else if (entry.name === path.basename(entryPath) && path.basename(dir) === 'images') {
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) continue;

      const destDir = path.join(root, 'public', 'wiki', path.dirname(entryRelPath));
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(entryPath, path.join(destDir, entry.name));
      console.log(`  copied: ${entryPath} → ${path.join(destDir, entry.name)}`);
    }
  }
};

if (fs.existsSync(wikiDir)) {
  walk(wikiDir, '');
}

console.log('✓ Wiki images copied.');
