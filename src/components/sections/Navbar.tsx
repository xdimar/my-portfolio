'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Terminal,
  Home,
  User,
  Code2,
  FolderGit2,
  Mail,
  FileText,
  ChevronRight,
} from 'lucide-react';
import styles from './Navbar.module.css';
import { soundFx } from '@/utils/audio';
import InteractiveTerminal from '@/components/ui/InteractiveTerminal';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function Navbar() {
  const isMuted = useSyncExternalStore(
    soundFx.subscribe,
    () => soundFx.getMuted(),
    () => false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Global hotkey: Press backtick (`) or Ctrl + ~ to open terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;

      if (e.key === '`' || (e.ctrlKey && e.key === '~')) {
        e.preventDefault();
        soundFx.playClick();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleAudioToggle = () => {
    const nextState = soundFx.toggleMute();
    if (!nextState) {
      soundFx.playClick();
    }
  };

  const handleLinkClick = () => {
    soundFx.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.navWrapper}>
      {/* Mobile Backdrop Overlay to dismiss on click outside */}
      {mobileMenuOpen && (
        <div
          className={`${styles.mobileBackdrop} ${styles.backdropActive}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className={styles.navBar} aria-label="Main Navigation">
        {/* Brand Logo */}
        <Link
          href="#hero"
          className={styles.brandLogo}
          onMouseEnter={() => soundFx.playHover()}
          onClick={handleLinkClick}
        >
          <span className={styles.brandDot} />
          <span>DIMAR<span style={{ color: 'var(--neon-cyan)' }}>.DEV</span></span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link
              href="#hero"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Beranda
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Tentang
            </Link>
          </li>
          <li>
            <Link
              href="#skills"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Keahlian
            </Link>
          </li>
          <li>
            <Link
              href="#projects"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Proyek
            </Link>
          </li>
          <li>
            <Link
              href="#terminal"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Terminal
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className={styles.navLink}
              onMouseEnter={() => soundFx.playHover()}
              onClick={handleLinkClick}
            >
              Kontak
            </Link>
          </li>
          <li>
            <a
              href="/cv/CV_Muhammad_Jihan_Dimar.pdf"
              download="CV_Muhammad_Jihan_Dimar.pdf"
              className={styles.navLink}
              style={{ color: '#34d399', fontWeight: 600 }}
              onMouseEnter={() => soundFx.playHover()}
              data-analytics="cv_download"
              data-analytics-source="navbar"
              onClick={() => soundFx.playClick()}
              title="Unduh CV PDF"
            >
              Unduh CV
            </a>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.terminalBtn}
            onClick={() => {
              soundFx.playClick();
              setIsTerminalOpen(true);
            }}
            title="Buka Terminal CLI (Tekan tombol `)"
          >
            <Terminal size={14} />
            <span>Terminal</span>
          </button>

          <ThemeSwitcher />

          <button
            type="button"
            className={styles.audioBtn}
            onClick={handleAudioToggle}
            title={isMuted ? 'Aktifkan Audio SFX' : 'Bisukan Audio SFX'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <Link
            href="#contact"
            className={styles.hireBtn}
            onMouseEnter={() => soundFx.playHover()}
            onClick={handleLinkClick}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Hubungi Dimar
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.open : ''}`}>
          {/* Header Profile Badge */}
          <div className={styles.mobileDrawerHeader}>
            <div className={styles.mobileDrawerDev}>
              <span className={styles.mobileDrawerDot} />
              <div className={styles.mobileDrawerMeta}>
                <span className={styles.mobileDrawerName}>DIMAR.DEV</span>
                <span className={styles.mobileDrawerRole}>TKJ 2021 • Fullstack Developer</span>
              </div>
            </div>
            <span className={styles.mobileDrawerStatus}>
              <span className={styles.pulseDot} />
              ONLINE
            </span>
          </div>

          {/* Section 1: Main Navigation */}
          <div className={styles.mobileNavSection}>
            <span className={styles.mobileSectionTitle}>Navigasi Utama</span>
            <div className={styles.mobileNavGrid}>
              <Link href="#hero" className={styles.mobileNavItem} onClick={handleLinkClick}>
                <div className={styles.mobileNavIcon}>
                  <Home size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Beranda</span>
                <ChevronRight size={14} className={styles.mobileNavArrow} />
              </Link>
              <Link href="#about" className={styles.mobileNavItem} onClick={handleLinkClick}>
                <div className={styles.mobileNavIcon}>
                  <User size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Tentang</span>
                <ChevronRight size={14} className={styles.mobileNavArrow} />
              </Link>
              <Link href="#skills" className={styles.mobileNavItem} onClick={handleLinkClick}>
                <div className={styles.mobileNavIcon}>
                  <Code2 size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Keahlian</span>
                <ChevronRight size={14} className={styles.mobileNavArrow} />
              </Link>
              <Link href="#projects" className={styles.mobileNavItem} onClick={handleLinkClick}>
                <div className={styles.mobileNavIcon}>
                  <FolderGit2 size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Proyek</span>
                <ChevronRight size={14} className={styles.mobileNavArrow} />
              </Link>
              <Link href="#contact" className={styles.mobileNavItem} onClick={handleLinkClick}>
                <div className={styles.mobileNavIcon}>
                  <Mail size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Kontak</span>
                <ChevronRight size={14} className={styles.mobileNavArrow} />
              </Link>
            </div>
          </div>

          {/* Section 2: Interactive Tools & CV */}
          <div className={styles.mobileNavSection}>
            <span className={styles.mobileSectionTitle}>Fitur & Aksi Cepat</span>
            <div className={styles.mobileNavGrid}>
              <button
                type="button"
                className={styles.mobileNavItem}
                onClick={() => {
                  handleLinkClick();
                  setIsTerminalOpen(true);
                }}
              >
                <div className={`${styles.mobileNavIcon} ${styles.iconTerminal}`}>
                  <Terminal size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Terminal Interaktif</span>
                <span className={styles.mobileItemBadge}>CLI</span>
              </button>

              <a
                href="/cv/CV_Muhammad_Jihan_Dimar.pdf"
                download="CV_Muhammad_Jihan_Dimar.pdf"
                className={styles.mobileNavItem}
                data-analytics="cv_download"
                data-analytics-source="navbar_mobile"
                onClick={handleLinkClick}
              >
                <div className={`${styles.mobileNavIcon} ${styles.iconCv}`}>
                  <FileText size={16} />
                </div>
                <span className={styles.mobileNavLabel}>Unduh CV Resmi</span>
                <span className={`${styles.mobileItemBadge} ${styles.badgeEmerald}`}>PDF</span>
              </a>
            </div>
          </div>

          {/* Primary Action Button */}
          <Link
            href="#contact"
            className={styles.mobileCtaBtn}
            onClick={handleLinkClick}
          >
            <Sparkles size={16} />
            <span>Mulai Kolaborasi / Rekrut</span>
          </Link>

          {/* Preset Theme Switcher */}
          <ThemeSwitcher variant="mobile" onThemeSelect={() => setMobileMenuOpen(false)} />
        </div>
      </nav>

      {/* Global Interactive Terminal Modal */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </header>
  );
}
