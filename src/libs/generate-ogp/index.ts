import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

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

export async function generateOgpImage(slug: string[], title: string, categoryName?: string): Promise<string> {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const background = await loadImage(
    path.join(process.cwd(), 'src', 'libs', 'generate-ogp', 'opengraph-image-template.jpg'),
  );
  ctx.drawImage(background, 0, 0, width, height);

  const x = 54;
  const lines = (() => {
    let i = 0;

    return [...title.trim()]
      .map((char) => {
        if (i === 12) {
          i = 0;
          return `${char}\n`;
        }
        if (/[0-9a-zA-Z]/.test(char)) {
          i += 0.5;
          return char;
        }

        i += 1;
        return char;
      })
      .join('')
      .split(/\n/)
      .filter(Boolean);
  })();

  if (categoryName) {
    let y = lines.length === 1 ? 200 : 160;

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
    let y = lines.length === 1 ? 280 : 240;

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
