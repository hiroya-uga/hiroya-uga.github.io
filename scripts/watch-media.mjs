import { spawn } from 'child_process';
import { watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const MEDIA_EXTS = new Set(['.webp', '.avif', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.webm', '.mov']);

const targets = [
  { dir: path.join(root, 'articles'), script: 'copy-blog-images.mjs', label: 'blog' },
  { dir: path.join(root, 'notes'), script: 'copy-notes-media.mjs', label: 'notes' },
];

/** @type {Map<string, NodeJS.Timeout>} */
const timers = new Map();

/**
 * 指定された target の copy script を子プロセスで起動する。
 * @param {{ dir: string; script: string; label: string }} target
 */
const runCopy = (target) => {
  console.log(`[watch] Copying ${target.label} media...`);
  const child = spawn('node', [path.join(__dirname, target.script)], { stdio: 'inherit' });
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[watch] ${target.label} copy failed with code`, code);
    }
  });
};

for (const target of targets) {
  try {
    watch(target.dir, { recursive: true }, (_, filename) => {
      if (filename === null || filename === undefined) {
        return;
      }
      const ext = path.extname(filename).toLowerCase();
      if (MEDIA_EXTS.has(ext) === false) {
        return;
      }
      clearTimeout(timers.get(target.label));
      timers.set(
        target.label,
        globalThis.setTimeout(() => runCopy(target), 300),
      );
    });
    console.log(`[watch] Watching ${target.dir}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[watch] Failed to watch ${target.dir}:`, message);
  }
}
