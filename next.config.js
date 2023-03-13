/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.ZITADEL_ISSUER.slice(8),
        pathname: '/assets/v1/**',
      },
    ],
  },
};
