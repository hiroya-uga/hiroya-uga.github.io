/**
 * @file OGP画像のalt textを自動生成するスクリプト
 * @description src/app配下のopengraph-image.*を探し、各画像の横に
 * opengraph-image.alt.txtを生成する。
 */

import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const appDir = path.join(srcDir, 'app');

const ogImagePattern = /opengraph-image\.(jpg|png|webp)$/;
const routeGroupPattern = /^\(.*\)$/;

const moduleCache = new Map();

/**
 * TypeScript/JavaScriptファイルのパスを解決する
 * @param {string} basePath - 基準となるパス
 * @returns {string|null} 解決されたファイルパス、見つからない場合はnull
 */
const resolveTsFileSync = (basePath) => {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.mjs'),
  ];

  for (const candidate of candidates) {
    if (fsSync.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

/**
 * TypeScriptモジュールをロードしてトランスパイルする
 * @param {string} filePath - ロードするファイルのパス
 * @returns {{ getMetadata: Function }} モジュールのexports
 * @throws {Error} ファイルの読み込みまたはトランスパイルに失敗した場合
 */
const loadTsModule = (filePath) => {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  try {
    const code = fsSync.readFileSync(filePath, 'utf8');
    const { outputText } = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
      },
      fileName: filePath,
    });

    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = { exports: {} };
    const dirname = path.dirname(filePath);

    /** @param {string} specifier */
    const localRequire = (specifier) => {
      if (specifier.startsWith('@/')) {
        const resolved = path.join(srcDir, specifier.slice(2));
        const pathResult = resolveTsFileSync(resolved);
        if (!pathResult) {
          throw new Error(`Failed to resolve alias: ${specifier}`);
        }
        return loadTsModule(pathResult);
      }

      if (specifier.startsWith('.')) {
        const resolved = path.resolve(dirname, specifier);
        const pathResult = resolveTsFileSync(resolved);
        if (!pathResult) {
          throw new Error(`Failed to resolve relative import: ${specifier}`);
        }
        return loadTsModule(pathResult);
      }

      return require(specifier);
    };

    const context = vm.createContext({
      module,
      exports: module.exports,
      __filename: filePath,
      __dirname: dirname,
      process,
      require: localRequire,
    });

    const wrapped = `(function (exports, require, module, __filename, __dirname) {\n${outputText}\n})`;
    const script = new vm.Script(wrapped, { filename: filePath });
    const wrapper = script.runInContext(context);
    wrapper(module.exports, context.require, module, filePath, dirname);

    moduleCache.set(filePath, module.exports);

    const exports = /** @type {{ getMetadata: Function }} */ (module.exports);
    return exports;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load module ${filePath}: ${errorMessage}`);
  }
};

/**
 * ディレクトリ内のOGP画像ファイルを再帰的に収集する
 * @param {string} dir - 検索対象のディレクトリパス
 * @returns {Promise<string[]>} 見つかった画像ファイルのパスリスト
 */
const collectOgImages = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectOgImages(entryPath);
      results.push(...nested);
      continue;
    }

    if (ogImagePattern.test(entry.name)) {
      results.push(entryPath);
    }
  }

  return results;
};

/**
 * OGP画像のファイルパスからNext.jsのパス名に変換する
 * ルートグループ（括弧で囲まれたディレクトリ）を除外する
 * @param {string} imagePath - OGP画像の絶対パス
 * @returns {string} パス名（例: '/tools/an-alt-decision-tree'）
 */
const toPathname = (imagePath) => {
  const relativePath = path.relative(appDir, imagePath);
  const dirPath = path.dirname(relativePath);
  const segments = dirPath
    .split(path.sep)
    .filter((segment) => segment && segment !== '.' && !routeGroupPattern.test(segment));

  if (segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
};

/**
 * OGP画像のalt textを生成する
 * @param {object} metadata - メタデータオブジェクト
 * @param {string} [metadata.previous] - タイトルの前に付ける文字列
 * @param {string} metadata.pageTitle - ページタイトル
 * @param {string} metadata.description - ページ説明文
 * @returns {string} 生成されたalt text
 */
const createAltText = ({ previous = '', pageTitle, description }) => {
  const siteName = 'uga.dev';
  const titlePart = pageTitle === siteName ? '' : `${previous}${pageTitle}`;
  const descriptionPart = (() => {
    if (/^[a-zA-Z0-9\-.*/,\s]+$/.test(description)) {
      return description.replaceAll('\n', '').replaceAll('.', '. ').replaceAll('.  ', '. ');
    }

    return description.replaceAll('\n', '');
  })();

  return [siteName, titlePart, descriptionPart].filter(Boolean).join(' ').trim();
};

/**
 * メイン処理
 * 1. src/app/*\/opengraph-image.(jpg|png|webp)を探す
 * 2. 画像のパスから、ルートグループのディレクトリを削除してpathnameを取得
 * 3. getMetadataからtitleとdescriptionを取得
 * 4. opengraph-image.alt.txtに`uga.dev ${title} ${description}`形式で書き込む
 * @returns {Promise<void>}
 */
const main = async () => {
  console.log('OGP画像のalt text生成を開始します...');

  const { getMetadata } = loadTsModule(path.join(srcDir, 'utils', 'get-metadata.ts'));
  const ogImages = await collectOgImages(appDir);

  console.log(`${ogImages.length}個のOGP画像が見つかりました`);

  const results = await Promise.allSettled(
    ogImages.map(async (imagePath) => {
      const pathname = toPathname(imagePath);
      const metadata = getMetadata(pathname);

      if (!metadata || !metadata.pageTitle || !metadata.description) {
        throw new Error(`Invalid metadata for ${pathname}`);
      }

      const altText = createAltText(metadata);
      const altPath = path.join(path.dirname(imagePath), 'opengraph-image.alt.txt');
      await fs.writeFile(altPath, `${altText}\n`, 'utf8');

      return { pathname, altPath };
    }),
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled');
  const failed = results.filter((r) => r.status === 'rejected');

  console.log(`\n成功: ${succeeded.length}件`);
  if (failed.length > 0) {
    console.error(`失敗: ${failed.length}件`);
    failed.forEach((result) => {
      if (result.status === 'rejected') {
        console.error(`  - ${result.reason}`);
      }
    });
    process.exitCode = 1;
  } else {
    console.log('すべてのalt textの生成が完了しました');
  }
};

main().catch((error) => {
  console.error('予期しないエラーが発生しました:', error);
  process.exitCode = 1;
});
