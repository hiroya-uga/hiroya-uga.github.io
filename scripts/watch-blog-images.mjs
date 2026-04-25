import { spawn } from 'child_process';
import { watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.resolve(__dirname, '..', 'articles');

/** @type {NodeJS.Timeout} */
let debounceTimer;

const runCopy = () => {
  console.log('[watch] Copying blog images...');
  const child = spawn('node', [path.join(__dirname, 'copy-blog-images.mjs')], { stdio: 'inherit' });
  child.on('exit', (code) => {
    if (code !== 0) console.error('[watch] Copy failed with code', code);
  });
};

watch(articlesDir, { recursive: true }, (_, filename) => {
  if (!filename) return;
  const ext = path.extname(filename).toLowerCase();
  if (ext !== '.webp' && ext !== '.avif' && ext !== '.jpg') return;

  clearTimeout(debounceTimer);
  debounceTimer = globalThis.setTimeout(runCopy, 300);
});

console.log(`[watch] Watching ${articlesDir} for .webp changes...`);
