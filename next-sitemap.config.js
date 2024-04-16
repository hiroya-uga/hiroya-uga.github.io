/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://uga.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['*/opengraph-image-*', '*/opengraph-image.jpg'],
  outDir: './out',
};
