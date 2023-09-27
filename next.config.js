const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
};

module.exports = withMDX(nextConfig);
