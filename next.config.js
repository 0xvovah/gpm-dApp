/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.coinmarketcap.com",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
      {
        protocol: "https",
        hostname: "bronze-added-centipede-486.mypinata.cloud",
      },
      {
        protocol: "https",
        hostname: "token-logos1.s3.solarcom.ch",
      },
    ],
  },
};

module.exports = nextConfig;
