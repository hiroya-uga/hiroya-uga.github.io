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

  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['lodash', 'react-ga4'],
  },

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
    // 画像最適化の追加設定
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年間のキャッシュ
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpackの最適化
  webpack: (config, { isServer }) => {
    // 本番環境でのバンドルサイズ削減
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true, // Tree shaking
        sideEffects: false,
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(withMDX(nextConfig));
