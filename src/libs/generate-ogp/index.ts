import { resolveArticleImagePath } from '@/utils/articles';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
// import sharp from 'sharp';

registerFont(path.join(process.cwd(), 'src', 'libs', 'generate-ogp', 'LINESeedJP_OTF_Bd.otf'), {
  family: 'LINE Seed JP',
});

const drawRoundedRect = (
  ctx: ReturnType<ReturnType<typeof createCanvas>['getContext']>,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

const timestamp = new Date().getTime();
const screen = loadImage(path.join(process.cwd(), 'src', 'libs', 'generate-ogp', 'opengraph-image-screen.png'));
const background = loadImage(path.join(process.cwd(), 'src', 'libs', 'generate-ogp', 'opengraph-image-template.jpg'));

export async function generateOgpImage(
  slug: string[],
  title: string,
  categoryName?: string,
  baseImage?: string,
): Promise<string> {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (baseImage) {
    // const isSvg = filepath.endsWith('.svg');
    // const pngPath = filepath.replace('.svg', '.png');

    // if (isSvg) {
    //   await sharp(filepath).png().toFile(pngPath);
    // }

    // const src = isSvg ? pngPath : filepath;
    const filePath = resolveArticleImagePath({
      imagePath: baseImage,
      category: slug[1],
      year: slug[2],
    });
    const src = path.join(process.cwd(), 'public', filePath);

    ctx.drawImage(await loadImage(src), 0, 0, width, height);
    ctx.drawImage(await screen, 0, 0, width, height);

    // if (isSvg) {
    //   fs.rmSync(pngPath, { force: true });
    // }
  } else {
    ctx.drawImage(await background, 0, 0, width, height);
  }

  const x = 54;
  const lines = (() => {
    // タイトルに明示的な改行があれば、それだけを信じて分割する
    if (title.includes('\n')) {
      return title
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }

    // 改行がない場合は実ピクセル幅で自動改行（uga.dev 透かしを避ける）
    ctx.font = 'bold 60px "LINE Seed JP"';
    const MAX_PIXEL_WIDTH = 800;
    const chars = [...title.trim()];
    const result: string[] = [];
    let current = '';

    for (let idx = 0; idx < chars.length; idx++) {
      const char = chars[idx];
      const candidate = current + char;
      const exceedsWidth = ctx.measureText(candidate).width > MAX_PIXEL_WIDTH;
      const nextChar = chars[idx + 1];
      // 次行頭に来るとカッコ悪い記号は折り返しを 1 文字遅らせる
      const nextIsBadStart = ['。', '、', 'ー', ' '].includes(nextChar);
      // タグの値を閉じる記号の前では改行しない
      const isInClosingTag = char + nextChar === '">' || nextChar + chars[idx + 2] === '">';

      if (exceedsWidth && current.length > 0 && !nextIsBadStart && !isInClosingTag) {
        result.push(current);
        current = char;
      } else {
        current = candidate;
      }
    }
    if (current) result.push(current);
    return result;
  })();

  if (categoryName) {
    let y = (() => {
      if (lines.length === 1) {
        return 200;
      }
      if (lines.length === 2) {
        return 160;
      }

      // max 3row
      return 100;
    })();

    // 座布団用パディング
    const paddingX = 16;
    const paddingY = 30;

    // category name
    ctx.font = 'bold 30px "LINE Seed JP"';
    ctx.fillStyle = '#666';
    const subtext = categoryName;
    const subtextMetrics = ctx.measureText(subtext);
    const subtextWidth = subtextMetrics.width;
    const subtextHeight = 30; // フォントサイズと仮定

    ctx.fillStyle = 'white';
    drawRoundedRect(
      ctx,
      x - paddingX,
      y - (subtextHeight * 1.875 + subtextHeight) / 2 + 2,
      subtextWidth + paddingX * 2,
      subtextHeight + paddingY,
      12,
    );
    ctx.font = 'bold 30px "LINE Seed JP"';
    ctx.fillStyle = '#666';
    ctx.fillText(categoryName, x, y);

    // article title
    ctx.font = 'bold 60px "LINE Seed JP"';
    ctx.fillStyle = '#333';
    y += 1.875 * 60;

    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += 1.875 * 60;
    }
  } else {
    // TODO
    let y = (() => {
      if (lines.length === 1) {
        return 280;
      }
      if (lines.length === 2) {
        return 240;
      }
      if (lines.length === 3) {
        return 200;
      }

      return 160;
    })();

    ctx.font = 'bold 60px "LINE Seed JP"';
    ctx.fillStyle = '#333';
    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += 1.875 * 60;
    }
  }

  // 書き出し
  const buffer = canvas.toBuffer('image/png');
  const pathname = slug.slice(0, -1);
  const outPath = path.join(process.cwd(), 'public', 'generated-ogp', ...pathname, `${slug[slug.length - 1]}.png`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);

  return path.join('generated-ogp', ...pathname, `${slug[slug.length - 1]}.png`) + `?t=${timestamp}`;
}
