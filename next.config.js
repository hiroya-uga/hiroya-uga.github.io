const withMDX = require('@next/mdx')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const branchName = ''; // process.env.BRANCH_NAME !== 'main' ? "/" + process.env.BRANCH_NAME : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: branchName,
  basePath: branchName,

  trailingSlash: true,

  pageExtensions: ['tsx', 'mdx'],

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uga.dev',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withBundleAnalyzer(withMDX(nextConfig));
