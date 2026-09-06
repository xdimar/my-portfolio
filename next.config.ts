import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow next/image to load avatars from Supabase storage CDN
  images: {
    remotePatterns: [
      // Wildcard for all Supabase projects
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
      // Explicit for this project's CDN (faster pattern match)
      {
        protocol: 'https',
        hostname: 'irduazhrsrvoxbstmuck.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // nodemailer uses Node.js built-ins — keep it server-side only
  serverExternalPackages: ['nodemailer'],
};

export default nextConfig;
