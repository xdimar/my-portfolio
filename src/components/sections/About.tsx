'use client';

import React from 'react';
import { Network, Server, Code2, GraduationCap } from 'lucide-react';
import styles from './About.module.css';
import { soundFx } from '@/utils/audio';

export default function About() {
  return (
    <section id="about" className="section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="cyber-badge cyber-badge-purple">
            <GraduationCap size={14} />
            ABOUT &bull; IDENTITY &bull; JOURNEY
          </div>
          <h2 className="section-title">
            Dari Logika Jaringan (TKJ) Menuju <br />
            <span className="gradient-text">Rekayasa Web Fullstack Modern</span>
          </h2>
          <p className="section-subtitle">
            Mengenal Muhammad Jihan Dimar—pengembang yang mengawinkan pemahaman mendalam infrastruktur sistem dengan keahlian pengembangan aplikasi frontend dan backend berstandar tinggi.
          </p>
        </div>

        <div className={styles.aboutGrid}>
          {/* Left Column: Education & Journey Timeline */}
          <div className={styles.timelineCol}>
            {/* 1. SMK NU Sunan Ampel Poncokusumo */}
            <div
              className={styles.timelineItem}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineHeader}>
                <span className={styles.timelineYear}>2018 — 2021 (LULUS)</span>
                <span className={styles.timelineInstitution}>SMK NU Sunan Ampel Poncokusumo</span>
              </div>
              <h3 className={styles.timelineTitle}>
                Teknik Komputer dan Jaringan (TKJ)
              </h3>
              <p className={styles.timelineText}>
                Menempa fondasi pemikiran teknik dan logika komputasi. Menguasai arsitektur jaringan komputer, routing protokol, subnetting IP, konfigurasi Linux Debian/Ubuntu Server, manajemen bandwidth Mikrotik, hingga pemeliharaan sistem perangkat keras. Menjadi batu loncatan yang melatih pemahaman esensial tentang bagaimana data terkirim antar server di dunia nyata.
              </p>
              <div className={styles.techTags}>
                <span className="tech-pill">🌐 TCP/IP &amp; DNS</span>
                <span className="tech-pill">🐧 Linux Server</span>
                <span className="tech-pill">📡 Mikrotik Routing</span>
                <span className="tech-pill">🔧 Network Troubleshooting</span>
              </div>
            </div>

            {/* 2. Self-Taught & Programming Leap */}
            <div
              className={styles.timelineItem}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineHeader}>
                <span className={styles.timelineYear}>2021 — 2023</span>
                <span className={styles.timelineInstitution}>Independent Engineering</span>
              </div>
              <h3 className={styles.timelineTitle}>
                Eksplorasi Algoritma &amp; Backend Engineering
              </h3>
              <p className={styles.timelineText}>
                Melangkah dari instalasi jaringan fisik ke rekayasa perangkat lunak. Mempelajari JavaScript/TypeScript secara mendalam, memahami pola arsitektur backend, RESTful API design, relasi database (MySQL &amp; PostgreSQL), serta manajemen autentikasi JWT.
              </p>
              <div className={styles.techTags}>
                <span className="tech-pill">⚙️ JavaScript / TS</span>
                <span className="tech-pill">🗄️ MySQL &amp; PostgreSQL</span>
                <span className="tech-pill">🛡️ REST APIs</span>
                <span className="tech-pill">📦 Git &amp; GitHub</span>
              </div>
            </div>

            {/* 3. Modern Fullstack Specialist */}
            <div
              className={styles.timelineItem}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineHeader}>
                <span className={styles.timelineYear}>2023 — SEKARANG</span>
                <span className={styles.timelineInstitution}>Next-Gen Web Architecture</span>
              </div>
              <h3 className={styles.timelineTitle}>
                Fullstack Web Developer (Frontend &amp; Backend)
              </h3>
              <p className={styles.timelineText}>
                Membangun ekosistem aplikasi web modern skala penuh menggunakan Next.js App Router, React, Three.js WebGL untuk pengalaman interaktif 3D, serta backend Node.js yang cepat dan handal. Berfokus pada kecepatan muat, responsivitas multi-device, dan estetika visual kelas atas.
              </p>
              <div className={styles.techTags}>
                <span className="tech-pill">⚡ Next.js 15+</span>
                <span className="tech-pill">⚛️ React &amp; State</span>
                <span className="tech-pill">🎮 Three.js 3D</span>
                <span className="tech-pill">🚀 Node.js Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Philosophy & Engineering Edge */}
          <div className={styles.highlightsCol}>
            <div
              className={styles.highlightCard}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.highlightIconWrap}>
                <Network size={22} />
              </div>
              <h4 className={styles.highlightTitle}>Kelebihan Latar Belakang TKJ</h4>
              <p className={styles.highlightDesc}>
                Memiliki keunggulan perspektif infrastruktur yang jarang dimiliki developer murni. Sangat memahami latensi jaringan, proses handshake TCP/IP, keamanan port, dan optimasi paket data yang membuat aplikasi web berjalan jauh lebih efisien.
              </p>
            </div>

            <div
              className={styles.highlightCard}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.highlightIconWrap}>
                <Code2 size={22} style={{ color: '#c77dff' }} />
              </div>
              <h4 className={styles.highlightTitle}>Frontend Yang Hidup &amp; Responsif</h4>
              <p className={styles.highlightDesc}>
                Bukan sekadar tampilan statis. Menggabungkan animasi halus, interaktivitas 3D dengan Three.js, visual feedback, dan adaptasi responsif menyeluruh di smartphone, tablet, maupun layar desktop ultra-wide.
              </p>
            </div>

            <div
              className={styles.highlightCard}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.highlightIconWrap}>
                <Server size={22} style={{ color: '#34d399' }} />
              </div>
              <h4 className={styles.highlightTitle}>Backend Yang Aman &amp; Terstruktur</h4>
              <p className={styles.highlightDesc}>
                Mendesain endpoint API yang aman dengan validasi ketat, arsitektur database terorganisir rapi, proteksi CORS/rate-limiting, dan penanganan error terpusat agar server tetap kokoh saat beban puncak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
