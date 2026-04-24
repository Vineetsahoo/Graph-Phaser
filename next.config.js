/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/bfhl',
        destination: '/api/bfhl'
      }
    ];
  }
};

module.exports = nextConfig;
