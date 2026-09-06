'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';
import { soundFx } from '@/utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand Info */}
          <div className={styles.brandArea}>
            <div className={styles.brandLogo}>
              <span className="status-dot" />
              <span>DIMAR<span style={{ color: 'var(--neon-cyan)' }}>.DEV</span></span>
            </div>
            <p className={styles.brandDesc}>
              Portfolio resmi <strong>Muhammad Jihan Dimar</strong>. Lulusan SMK NU Sunan Ampel Poncokusumo 2021 (TKJ) yang berdedikasi menciptakan arsitektur software web Frontend &amp; Backend modern berkinerja tinggi.
            </p>
          </div>

          {/* Nav Links */}
          <ul className={styles.footerLinks}>
            <li>
              <Link href="#hero" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Beranda
              </Link>
            </li>
            <li>
              <Link href="#about" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Tentang
              </Link>
            </li>
            <li>
              <Link href="#skills" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Keahlian
              </Link>
            </li>
            <li>
              <Link href="#projects" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Proyek
              </Link>
            </li>
            <li>
              <Link href="#terminal" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Terminal
              </Link>
            </li>
            <li>
              <Link href="#contact" className={styles.footerLink} onClick={() => soundFx.playClick()}>
                Kontak
              </Link>
            </li>
          </ul>

          {/* Back to Top */}
          <button
            type="button"
            className={styles.backToTopBtn}
            onClick={scrollToTop}
            onMouseEnter={() => soundFx.playHover()}
          >
            <span>Kembali ke Atas</span>
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {new Date().getFullYear()} Muhammad Jihan Dimar. All rights reserved.
          </div>
          <div className={styles.serverStatus}>
            <span className="status-dot" />
            <span>NODE STATUS: 100% ONLINE &bull; MALANG, INDONESIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
