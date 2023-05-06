/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  }
};

module.exports = nextConfig;
