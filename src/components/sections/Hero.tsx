'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Sparkles, Network, FileDown } from 'lucide-react';
import styles from './Hero.module.css';
import Hero3DCanvas from '@/components/canvas/Hero3DCanvas';
import LiquidMetalGrid from '@/components/canvas/LiquidMetalGrid';
import HoloCard from '@/components/ui/HoloCard';
import EffectToggle, { type EffectType } from '@/components/ui/EffectToggle';
import { soundFx } from '@/utils/audio';
import { ProfileData } from '@/types/portfolio';
import { defaultProfile } from '@/data/defaultData';
import TelemetryWidget from '@/components/ui/TelemetryWidget';


interface HeroProps {
  profile?: ProfileData;
}

const fallbackRoles = [
  'Fullstack Developer',
  'Frontend Specialist',
  'Backend Architect',
  'TKJ & Network Alumnus',
];

export default function Hero({ profile }: HeroProps) {
  const currentProfile = profile || defaultProfile;
  const activeRoles = currentProfile.roles?.length ? currentProfile.roles : fallbackRoles;

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Background Effect State (persisted to localStorage) ────────────
  const [bgEffect, setBgEffect] = useState<EffectType>('cyber');

  useEffect(() => {
    const saved = localStorage.getItem('hero_bg_effect') as EffectType | null;
    if (saved === 'liquid' || saved === 'cyber') setBgEffect(saved);
  }, []);

  const handleEffectChange = (effect: EffectType) => {
    setBgEffect(effect);
    localStorage.setItem('hero_bg_effect', effect);
  };

  useEffect(() => {
    const currentFullText = activeRoles[roleIndex % activeRoles.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText !== currentFullText) {
      // Typing
      timer = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      }, 90);
    } else if (!isDeleting && displayedText === currentFullText) {
      // Pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayedText !== '') {
      // Deleting
      timer = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
      }, 45);
    } else if (isDeleting && displayedText === '') {
      // Switch to next role with natural pause
      timer = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % activeRoles.length);
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, activeRoles]);

  return (
    <section id="hero" className={styles.heroSection}>
      {/* 3D WebGL Background – switchable between Cyber Core and Liquid Metal Grid */}
      {bgEffect === 'cyber' ? <Hero3DCanvas /> : <LiquidMetalGrid />}

      <div className={`container ${styles.heroContentGrid}`}>
        {/* Left Column: Bio, Roles, CTA */}
        <div className={styles.leftCol}>
          <div className={styles.badgeRow}>
            <div className="cyber-badge">
              <span className="status-dot" />
              {currentProfile.school ? `${currentProfile.school.toUpperCase()} '${currentProfile.grad_year.slice(-2)}` : "SMK NU SUNAN AMPEL PONCOKUSUMO '21"}
            </div>
            <div className="cyber-badge cyber-badge-purple">
              <Network size={13} />
              TKJ &bull; FRONTEND / BACKEND
            </div>
            <TelemetryWidget />
            <EffectToggle current={bgEffect} onChange={handleEffectChange} />
          </div>

          <h1 className={styles.mainHeading}>
            Halo, Saya <br />
            <span className="gradient-text">{currentProfile.name}</span>
          </h1>

          <div className={styles.roleWrapper}>
            <span>Fokus:</span>
            <span className={styles.roleHighlight}>
              {displayedText}
            </span>
            <span className={styles.cursorBlink} />
          </div>

          <p className={styles.heroDescription}>
            {currentProfile.bio_description}
          </p>

          <div className={styles.heroCtas}>
            <Link
              href="#projects"
              className="btn-neon"
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <span>Jelajahi Proyek</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href={currentProfile.cv_url || '/cv/CV_Muhammad_Jihan_Dimar.pdf'}
              download="CV_Muhammad_Jihan_Dimar.pdf"
              className="btn-outline"
              style={{
                borderColor: 'rgba(52, 211, 153, 0.45)',
                background: 'rgba(16, 185, 129, 0.08)',
                color: '#34d399',
              }}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
              data-analytics="cv_download"
              data-analytics-source="hero"
              title="Unduh Curriculum Vitae Resmi (PDF)"
            >
              <FileDown size={17} style={{ color: '#34d399' }} />
              <span>Unduh CV (PDF)</span>
            </a>

            <Link
              href="#terminal"
              className="btn-outline"
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <Terminal size={17} style={{ color: 'var(--neon-cyan)' }} />
              <span>Buka Terminal CLI</span>
            </Link>

            <Link
              href="#contact"
              className="btn-outline"
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <Sparkles size={16} />
              <span>Hubungi Dimar</span>
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>2021</span>
              <span className={styles.statLabel}>Alumni SMK NU Sunan Ampel</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>Fullstack</span>
              <span className={styles.statLabel}>Frontend &amp; Backend</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>TKJ</span>
              <span className={styles.statLabel}>Network &amp; Sysadmin Base</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Holographic Interactive Identity Card */}
        <div className={styles.rightCol}>
          <HoloCard
            imageUrl={currentProfile.avatar_url || '/images/dimar.jpg'}
            name={currentProfile.name}
            callName={currentProfile.call_name}
            gradYear={currentProfile.grad_year}
          />
        </div>
      </div>
    </section>
  );
}
