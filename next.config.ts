import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "localhost"],
    remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/storage/**',
        },
        {
          protocol: 'https',
          hostname: "i.ibb.co.com",
        },
        {
          protocol: 'http',
          hostname: "127.0.0.1",
        },
        {
          protocol: 'https',
          hostname: 'i.pinimg.com',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
    ],
  },
  /* other config options here */
};

export default nextConfig;
