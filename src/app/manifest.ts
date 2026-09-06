import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Muhammad Jihan Dimar | Portfolio 3D',
    short_name: 'Dimar.dev',
    description: 'Portfolio interaktif 3D Fullstack Web Developer Muhammad Jihan Dimar (TKJ 2021).',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090e',
    theme_color: '#00f2fe',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
