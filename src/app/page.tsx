import React from 'react';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import TerminalSection from '@/components/sections/TerminalSection';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import { getPortfolioData } from '@/lib/portfolio-service';

export const revalidate = 60; // Instant cached serving with automatic on-demand revalidation on admin updates

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Floating Glass Navbar */}
      <Navbar />

      {/* Hero Section with 3D Three.js Constellation & Hologram Card */}
      <Hero profile={data.profile} />

      {/* About & Education Journey (SMK NU Sunan Ampel Poncokusumo 2021) */}
      <About />

      {/* Interactive Tech Skills Arsenal */}
      <Skills skills={data.skills} />

      {/* Showcase Real-world Projects */}
      <Projects projects={data.projects} />

      {/* Interactive Cyber CLI Terminal */}
      <TerminalSection />

      {/* Direct Contact & Collaboration Form */}
      <Contact profile={data.profile} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
