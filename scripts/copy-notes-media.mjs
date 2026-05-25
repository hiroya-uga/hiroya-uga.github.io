/**
 * notes/ 内のメディアファイル（画像・動画など）を public/notes/ にコピーする。
 * 画像は images/ フォルダ内、動画等は md ファイルの隣に置く運用を想定。
 * dev / build の前段で実行する。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const MEDIA_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.mp4', '.webm', '.mov']);

const notesDir = path.join(root, 'notes');

const walk = (dir, relPath) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      walk(entryPath, entryRelPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!MEDIA_EXTS.has(ext)) continue;

      const destDir = path.join(root, 'public', 'notes', path.dirname(entryRelPath));
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(entryPath, path.join(destDir, entry.name));
      console.log(`  copied: ${entryPath} → ${path.join(destDir, entry.name)}`);
    }
  }
};

if (fs.existsSync(notesDir)) {
  walk(notesDir, '');
}

console.log('✓ Notes media copied.');
