const withMDX = require('@next/mdx')();

const branchName = ''; // process.env.BRANCH_NAME !== 'main' ? "/" + process.env.BRANCH_NAME : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: branchName,
  basePath: branchName,

  trailingSlash: true,

  pageExtensions: ['tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },

  // TODO: 環境載せ替え終わったら調整
  output: 'export',
  images: { unoptimized: true },
};

module.exports = withMDX(nextConfig);
