/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@multiversx/sdk-dapp"],

  experimental: {
    externalDir: true,
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
      config.externals.push("pino-pretty", "lokijs", "encoding");
      return config;
    }

    return config;
  },
};

module.exports = nextConfig;
