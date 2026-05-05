import path from 'node:path';

/** ./images/foo.png → /wiki/{slugDir}/images/foo.png */
export const resolveWikiImagePath = ({ imagePath, filePath }: { imagePath: string; filePath: string }): string => {
  if (imagePath.startsWith('./') === false) {
    return imagePath;
  }

  const wikiMatch = /\/wiki\/(.+)\.md$/.exec(filePath);
  if (wikiMatch === null) {
    return imagePath;
  }

  const wikiRelPath = wikiMatch[1];
  const dir = path.dirname(wikiRelPath);
  const dirPrefix = dir === '.' ? '' : `/${dir}`;
  return imagePath.replace('./', `/wiki${dirPrefix}/`);
};
