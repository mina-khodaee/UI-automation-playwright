const outputType = undefined;

const subAppDomains = {
  accessControl: process.env.NEXT_PUBLIC_ACCESS_CONTROL_DOMAIN || 'http://localhost:3033',
  dejban: process.env.NEXT_PUBLIC_DEJBAN_DOMAIN || 'http://localhost:3032',
};

const rewrites =
  outputType?.toLowerCase() === 'export'
    ? undefined
    : async function () {
        return [
          {
            source: '/access-control',
            destination: `${subAppDomains.accessControl}/access-control/`,
          },
          {
            source: '/access-control/:path+',
            destination: `${subAppDomains.accessControl}/access-control/:path+`,
          },
          {
            source: '/dejban',
            destination: `${subAppDomains.dejban}/dejban/`,
          },
          {
            source: '/dejban/:path+',
            destination: `${subAppDomains.dejban}/dejban/:path+`,
          },
        ];
      };

const nextConfig = {
  rewrites,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false, // use true for 308
      },
    ];
  },
  trailingSlash: true,
  output: outputType,
  transpilePackages: ['@repo/ui', '@repo/auth', '@repo/api-client', '@repo/config'],
  experimental: { externalDir: true },
};

export default nextConfig;