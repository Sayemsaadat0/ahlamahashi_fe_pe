import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
        {
          protocol: 'https',
          hostname: 'test2.cricketangon.com',
        },
    ],
  },
  /* other config options here */
};

export default nextConfig;
