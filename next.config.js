/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed swcMinify as it's no longer needed in Next.js 15
  // Disable source maps in production to reduce build size
  productionBrowserSourceMaps: false,
  // Increase the timeout for webpack to avoid issues with complex builds
  webpack: (config, { isServer }) => {
    // Increase timeout for webpack
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000,
      aggregateTimeout: 300,
    };
    
    // Fix for paths with special characters
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
  // Disable image optimization to avoid issues with paths
  images: {
    unoptimized: true,
  },
  // Add experimental features to handle non-ASCII paths
  experimental: {
    // Enable better handling of non-ASCII paths
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**',
      ],
    },
  },
};

module.exports = nextConfig;