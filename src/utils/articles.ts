import {
  ARTICLE_CATEGORY_DESCRIPTION_MAPPING,
  ARTICLE_CATEGORY_LABEL_MAPPING,
  ArticleCategoryLabel,
} from '@/constants/articles';

/** ./filename.ext → /articles/{category}/{year}/filename.ext */
export const resolveArticleImagePath = ({
  imagePath,
  category,
  year,
}: {
  imagePath: string;
  category: string;
  year: string;
}) => {
  if (imagePath.startsWith('./')) {
    return imagePath.replace('./', `/articles/${category}/${year}/`);
  }

  return imagePath;
};

export const resolveCategoryName = (value: string): ArticleCategoryLabel => {
  if (value.startsWith('https://')) {
    return 'EXTERNAL';
  }
  const keyword = value.includes('/') ? value.split('/')[2] : value;
  if (keyword in ARTICLE_CATEGORY_LABEL_MAPPING) {
    return ARTICLE_CATEGORY_LABEL_MAPPING[keyword as keyof typeof ARTICLE_CATEGORY_LABEL_MAPPING];
  }

  return 'UNKNOWN';
};

export const resolveCategoryDescription = (value: string) => {
  if (value.startsWith('https://')) {
    return '外部サイトに移動します。';
  }
  const keyword = value.includes('/') ? value.split('/')[2] : value;
  if (keyword in ARTICLE_CATEGORY_DESCRIPTION_MAPPING) {
    return ARTICLE_CATEGORY_DESCRIPTION_MAPPING[keyword as keyof typeof ARTICLE_CATEGORY_DESCRIPTION_MAPPING];
  }

  return 'NO DESCRIPTION';
};
