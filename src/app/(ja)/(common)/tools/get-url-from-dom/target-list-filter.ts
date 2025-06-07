type FilterType = 'all' | 'a' | 'img' | 'href' | 'src' | 'style' | 'no-style';

export type GetUrlFromDomFilterType = FilterType;

export const targetListFilter = ({ targetList, filterType }: { targetList: HTMLElement[]; filterType: FilterType }) =>
  targetList
    .filter((element) => {
      switch (filterType) {
        case 'a':
          return element instanceof HTMLAnchorElement;

        case 'img':
          return element instanceof HTMLImageElement;

        case 'href':
          return element.getAttribute('href') !== null;

        case 'src':
          return element.getAttribute('src') !== null;

        case 'no-style':
          return (
            element instanceof HTMLAnchorElement ||
            element instanceof HTMLImageElement ||
            element.getAttribute('href') !== null ||
            element.getAttribute('src') !== null
          );

        case 'style':
          const style = element.style.backgroundImage || element.style.background;

          return /url\(['"]?(.*?)['"]?\)/.test(style);

        default:
          return true;
      }
    })
    .map((element) => {
      const style = element.style.backgroundImage || element.style.background;
      const pathList: string[] = [];

      switch (filterType) {
        case 'a':
        case 'href':
          if (element instanceof HTMLAnchorElement && element.href) {
            pathList.push(element.href);
          }

          break;

        case 'img':
        case 'src':
          if (element instanceof HTMLImageElement && element.src) {
            pathList.push(element.src);
          }

          break;

        case 'no-style':
          if (element instanceof HTMLAnchorElement && element.href) {
            pathList.push(element.href);
          }

          if (element instanceof HTMLImageElement && element.src) {
            pathList.push(element.src);
          }

          break;

        case 'style':
          style.replace(/url\(['"]?(.*?)['"]?\)/g, (_, p1) => {
            pathList.push(p1);
            return ''; // replaceの使い方間違ってる
          });

          break;

        default:
          if (element instanceof HTMLAnchorElement && element.href) {
            pathList.push(element.href);
          }
          if (element instanceof HTMLImageElement && element.src) {
            pathList.push(element.src);
          }
          style.replace(/url\(['"]?(.*?)['"]?\)/g, (_, p1) => {
            pathList.push(p1);
            return ''; // replaceの使い方間違ってる
          });

          break;
      }

      return pathList;
    })
    .flatMap((e) => e);
