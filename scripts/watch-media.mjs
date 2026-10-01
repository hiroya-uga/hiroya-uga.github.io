import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const MEDIA_EXTS = new Set(['.webp', '.avif', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.mp4', '.webm', '.mov']);

const targets = [
  { dir: path.join(root, 'articles'), script: 'copy-blog-images.mjs', label: 'blog' },
  { dir: path.join(root, 'notes'), script: 'copy-notes-media.mjs', label: 'notes' },
];

// ポート番号を変える場合は src/components/ui/features/DevReload/DevReload.tsx も合わせて変更する
const RELOAD_PORT = 4201;

/** @type {Set<import('http').ServerResponse>} */
const reloadClients = new Set();

const notifyReload = () => {
  for (const res of reloadClients) {
    res.write('data: reload\n\n');
  }
};

const reloadServer = createServer((req, res) => {
  if (req.url !== '/events') {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write('\n');
  reloadClients.add(res);
  req.on('close', () => reloadClients.delete(res));
});

reloadServer.listen(RELOAD_PORT, '127.0.0.1', () => {
  console.log(`[watch] Reload server listening on http://localhost:${RELOAD_PORT}/events`);
});

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
      return;
    }
    notifyReload();
  });
};

for (const target of targets) {
  try {
    watch(target.dir, { recursive: true }, (_, filename) => {
      if (filename === null || filename === undefined) {
        return;
      }
      const ext = path.extname(filename).toLowerCase();

      if (ext === '.md') {
        clearTimeout(timers.get(`${target.label}-md`));
        timers.set(
          `${target.label}-md`,
          globalThis.setTimeout(() => notifyReload(), 300),
        );
        return;
      }

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
