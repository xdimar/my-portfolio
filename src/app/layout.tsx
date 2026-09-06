import type { Metadata } from 'next';
import './globals.css';
import AnalyticsTracker from '@/components/ui/AnalyticsTracker';
import JsonLd from '@/components/seo/JsonLd';
import ConsoleBanner from '@/components/ui/ConsoleBanner';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://dimar.dev'),
  title: 'Muhammad Jihan Dimar | Portfolio 3D - Fullstack Web Developer',
  description:
    'Portfolio resmi Muhammad Jihan Dimar (Dimar) — Lulusan SMK NU Sunan Ampel Poncokusumo 2021 jurusan Teknik Komputer dan Jaringan (TKJ). Spesialis pemrograman Frontend & Backend dengan Next.js, Three.js 3D, dan Node.js.',
  keywords: [
    'Muhammad Jihan Dimar',
    'Dimar',
    'Portfolio 3D',
    'Next.js 15',
    'Three.js',
    'Fullstack Developer',
    'Frontend Developer',
    'Backend Developer',
    'SMK NU Sunan Ampel Poncokusumo',
    'Teknik Komputer dan Jaringan',
    'TKJ 2021',
    'Malang Web Developer',
  ],
  authors: [{ name: 'Muhammad Jihan Dimar', url: 'https://dimar.dev' }],
  creator: 'Muhammad Jihan Dimar',
  alternates: {
    canonical: 'https://dimar.dev',
  },
  openGraph: {
    title: 'Muhammad Jihan Dimar | 3D Interactive Portfolio',
    description:
      'Portfolio resmi Muhammad Jihan Dimar (Dimar) - Fullstack Developer & TKJ Alumnus SMK NU Sunan Ampel Poncokusumo 2021.',
    url: 'https://dimar.dev',
    siteName: 'Muhammad Jihan Dimar Portfolio',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Muhammad Jihan Dimar - 3D Interactive Portfolio',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Jihan Dimar | 3D Interactive Portfolio',
    description:
      'Portfolio resmi Muhammad Jihan Dimar - Fullstack Web Developer & TKJ Alumnus SMK NU Sunan Ampel 2021.',
    creator: '@JihanDimar',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="cyan" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#07090e" />
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon" type="image/png" sizes="180x180" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Anti-FOUC script to set theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dimar_theme');if(t&&['cyan','matrix','synthwave','amber'].indexOf(t)!==-1){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
        <JsonLd />
      </head>
      <body>
        <ThemeProvider>
          <div className="scanline-overlay" />
          <AnalyticsTracker />
          <ConsoleBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
