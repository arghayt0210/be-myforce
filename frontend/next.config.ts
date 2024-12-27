import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async headers() { 
    return [ 
      { 
        source: '/(.*)', 
        headers: [ 
          { 
            key: 'Cross-Origin-Opener-Policy', 
            value: 'same-origin', 
          }, 
        ], 
      }, 
    ]; 
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/dmwi2ywkd/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/a/**',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default nextConfig