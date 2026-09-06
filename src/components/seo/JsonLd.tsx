import React from 'react';

export default function JsonLd() {
  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Jihan Dimar',
    alternateName: ['Dimar', 'Jihan Dimar'],
    jobTitle: 'Fullstack Web Developer',
    description:
      'Fullstack Web Developer & Alumnus SMK NU Sunan Ampel Poncokusumo 2021 (TKJ). Spesialis Frontend Next.js, Three.js 3D WebGL, dan Backend Node.js.',
    url: 'https://dimar.dev',
    image: 'https://dimar.dev/images/dimar.jpg',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'SMK NU Sunan Ampel Poncokusumo',
      sameAs: 'https://smknusunanampel.sch.id',
    },
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'Three.js',
      'Node.js',
      'RESTful APIs',
      'PostgreSQL',
      'Computer Networking',
      'Linux Server Administration',
      'Mikrotik',
      'Fullstack Web Development',
    ],
    sameAs: [
      'https://github.com/JihanDimar',
      'https://linkedin.com',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Poncokusumo, Malang',
      addressRegion: 'Jawa Timur',
      addressCountry: 'ID',
    },
  };

  const schemaWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Muhammad Jihan Dimar | Portfolio 3D',
    url: 'https://dimar.dev',
    description:
      'Portfolio resmi interaktif 3D WebGL Muhammad Jihan Dimar, Fullstack Web Developer & TKJ Alumnus 2021.',
    author: {
      '@type': 'Person',
      name: 'Muhammad Jihan Dimar',
    },
    inLanguage: 'id-ID',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebsite) }}
      />
    </>
  );
}
