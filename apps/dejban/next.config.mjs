import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
const isStaticExport = false;

// ----------------------------------------------------------------------

const nextConfig = {
  trailingSlash: true,
  // ignoreBuildErrors: true,
  output: isStaticExport ? 'export' : undefined,
  basePath: '/dejban',
  experimental: { externalDir: true },
  env: {
    BUILD_STATIC_EXPORT: JSON.stringify(isStaticExport),
  },
  allowedDevOrigins: ['192.168.1.19', '192.168.10.71'],
  transpilePackages: ['@repo/ui', '@repo/auth', '@repo/api-client', '@repo/config'],

  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
