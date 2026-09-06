'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Info, X, Rocket, Search, SearchX } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import styles from './Projects.module.css';
import { soundFx } from '@/utils/audio';
import { ProjectItem } from '@/types/portfolio';

type ProjectCategory = 'all' | 'fullstack' | 'frontend' | 'backend';

interface ProjectsProps {
  projects?: ProjectItem[];
}

const projectsList: ProjectItem[] = [
  {
    id: 'dimarcloud',
    title: 'DimarCloud • Network Topology & Server Monitor',
    category: 'fullstack',
    icon: '🌐',
    shortDesc: 'Platform visualisasi real-time topologi jaringan komputer dan status server live dengan WebGL 3D dan WebSockets.',
    tech: ['Next.js 15', 'Three.js', 'Node.js', 'WebSockets', 'Chart.js'],
    liveUrl: '#',
    githubUrl: 'https://github.com',
    details: {
      overview: 'Mengawinkan keilmuan Teknik Komputer dan Jaringan (TKJ) dengan rekayasa web fullstack. Sistem ini memvisualisasikan paket data jaringan secara 3D, memantau utilisasi bandwidth, latensi ping, status port terbuka, dan uptime server secara real-time.',
      architecture: 'Frontend Next.js merender node jaringan 3D via Three.js yang terhubung dengan WebSocket streaming dari backend Node.js. Mengumpulkan statistik CPU, RAM, dan I/O throughput server Linux.',
      features: [
        'Visualisasi topologi router, switch, dan client secara 3D interaktif',
        'Streaming telemetri real-time dengan socket latensi rendah',
        'Deteksi anomali jaringan dan notifikasi packet drop otomatis',
        'Dashboard analitik performa server dengan multi-device responsive view',
      ],
    },
    orderIndex: 1,
  },
  {
    id: 'cybercommerce',
    title: 'CyberCommerce • High-Performance E-Commerce',
    category: 'fullstack',
    icon: '⚡',
    shortDesc: 'Aplikasi belanja modern dengan Server Components Next.js, manajemen state responsif, dan checkout terintegrasi.',
    tech: ['Next.js', 'TypeScript', 'React 19', 'PostgreSQL', 'Stripe/Midtrans'],
    liveUrl: '#',
    githubUrl: 'https://github.com',
    details: {
      overview: 'Platform e-commerce kecepatan tinggi yang dibangun untuk pengalaman checkout yang mulus. Mengutamakan Core Web Vitals, SSR untuk SEO produk, serta filter instan multi-kategori.',
      architecture: 'Database PostgreSQL dengan relational schema produk & transaksi. Backend Next.js API routes dengan validasi payload Zod dan enkripsi token session aman.',
      features: [
        'Render instan produk dengan Server-Side Rendering (SSR)',
        'Pencarian dan filter multi-atribut real-time tanpa reload',
        'Keranjang belanja reaktif dengan optimistic updates',
        'Sistem manajemen inventori dan webhook konfirmasi pesanan',
      ],
    },
    orderIndex: 2,
  },
  {
    id: 'sentinelapi',
    title: 'Sentinel • Secure Microservice REST API Hub',
    category: 'backend',
    icon: '🛡️',
    shortDesc: 'Arsitektur backend tangguh berstandar enterprise dengan proteksi JWT, role-based access control, dan Redis caching.',
    tech: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker'],
    liveUrl: '#',
    githubUrl: 'https://github.com',
    details: {
      overview: 'Mesin backend handal yang dirancang untuk melayani ribuan request per detik dengan proteksi berlapis, sanitasi input, dan caching dinamis.',
      architecture: 'Struktur MVC / modular clean architecture. Memisahkan controller, service layer, dan data repository. Dilengkapi audit logging dan endpoint health-check otomatis.',
      features: [
        'Autentikasi berlapis JWT dengan refresh token rotation',
        'Role-Based Access Control (RBAC: Admin, Operator, User)',
        'Redis in-memory caching untuk mengurangi query overhead ke database hingga 70%',
        'Rate-limiting dan perlindungan serangan brute-force / DDoS dasar',
      ],
    },
    orderIndex: 3,
  },
  {
    id: 'aura3d',
    title: 'Aura3D • Immersive WebGL Shader & Audio Canvas',
    category: 'frontend',
    icon: '🎮',
    shortDesc: 'Eksperimen visual interaktif 3D WebGL dengan Web Audio API visualizer yang merespons irama suara dan mouse gravitasi.',
    tech: ['Three.js', 'WebGL', 'GLSL Shaders', 'Web Audio API', 'CSS3'],
    liveUrl: '#',
    githubUrl: 'https://github.com',
    details: {
      overview: 'Eksplorasi antarmuka masa depan (next-gen frontend) yang menggabungkan render grafis 3D realtime dengan pemrosesan sinyal frekuensi audio.',
      architecture: 'Pure Three.js canvas dengan custom vertex & fragment shaders untuk menghasilkan gelombang partikel dinamis pada 60 frame per detik tanpa membebani GPU klien.',
      features: [
        'Pemrosesan Fast Fourier Transform (FFT) dari audio input secara realtime',
        'Animasi partikel 3D dengan interaksi gravitasi kursor pengguna',
        'Performa teroptimasi penuh untuk perangkat mobile dan desktop',
        'Audio synth ambient generator berbasis Web Audio API',
      ],
    },
    orderIndex: 4,
  },
];

export default function Projects({ projects }: ProjectsProps) {
  const activeProjects = projects && projects.length > 0 ? projects : projectsList;
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll and handle Escape key when modal is active
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProject]);

  const filteredProjects = activeProjects.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      p.title.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query) ||
      p.tech.some((t: string) => t.toLowerCase().includes(query)) ||
      p.details.overview.toLowerCase().includes(query) ||
      p.details.features.some((f: string) => f.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const handleFilterClick = (cat: ProjectCategory) => {
    soundFx.playClick();
    setActiveCategory(cat);
  };

  const handleOpenDetail = (p: ProjectItem) => {
    soundFx.playClick();
    setSelectedProject(p);
  };

  const handleCloseDetail = () => {
    soundFx.playClick();
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="section-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="cyber-badge cyber-badge-emerald">
            <Rocket size={14} />
            SHOWCASE PROYEK &bull; REAL-WORLD BUILDS
          </div>
          <h2 className="section-title">
            Karya Rekayasa <br />
            <span className="gradient-text">Frontend &amp; Backend Pilihan</span>
          </h2>
          <p className="section-subtitle">
            Kumpulan proyek yang mendemonstrasikan keahlian fullstack, visualisasi interaktif 3D, serta integrasi sistem jaringan yang kokoh.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchInputContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                soundFx.playKey();
                setSearchQuery(e.target.value);
              }}
              placeholder="Cari proyek atau teknologi (Next.js, Three.js, Redis)..."
              className={styles.searchInput}
              aria-label="Cari proyek"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSearchQuery('');
                }}
                className={styles.clearSearchBtn}
                title="Hapus kata kunci pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {searchQuery && (
            <span className={styles.searchResultCount}>
              Ditemukan {filteredProjects.length} dari {activeProjects.length} proyek
            </span>
          )}
        </div>

        {/* Filter Buttons */}
        <div className={styles.projectFilterRow}>
          <button
            type="button"
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => handleFilterClick('all')}
            onMouseEnter={() => soundFx.playHover()}
          >
            Semua Proyek ({activeProjects.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${activeCategory === 'fullstack' ? styles.active : ''}`}
            onClick={() => handleFilterClick('fullstack')}
            onMouseEnter={() => soundFx.playHover()}
          >
            ⚡ Fullstack ({activeProjects.filter(p => p.category === 'fullstack').length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${activeCategory === 'frontend' ? styles.active : ''}`}
            onClick={() => handleFilterClick('frontend')}
            onMouseEnter={() => soundFx.playHover()}
          >
            🎨 Frontend &amp; 3D ({activeProjects.filter(p => p.category === 'frontend').length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${activeCategory === 'backend' ? styles.active : ''}`}
            onClick={() => handleFilterClick('backend')}
            onMouseEnter={() => soundFx.playHover()}
          >
            🛡️ Backend ({activeProjects.filter(p => p.category === 'backend').length})
          </button>
        </div>

        {/* Projects Grid or Empty Search State */}
        {filteredProjects.length === 0 ? (
          <div className={styles.emptySearchState}>
            <SearchX size={44} style={{ color: '#64748b', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
              Tidak Ada Proyek yang Sesuai
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem', maxWidth: '440px' }}>
              Tidak ditemukan proyek dengan kata kunci &ldquo;{searchQuery}&rdquo;
              {activeCategory !== 'all' ? ` pada kategori ${activeCategory}` : ''}.
            </p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                soundFx.playClick();
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              <span>Reset Pencarian &amp; Filter</span>
            </button>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={styles.projectCard}
              onMouseEnter={() => soundFx.playHover()}
            >
              {/* Card Graphical Header */}
              <div className={styles.cardPreviewArea}>
                <div className={styles.cardGraphicPattern} />
                <span className={styles.cardIconBig}>{project.icon}</span>
                <span className={styles.categoryTag}>
                  {project.category.toUpperCase()}
                </span>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.shortDesc}</p>

                {/* Tech Pills */}
                <div className={styles.techPillsList}>
                  {project.tech.map((t: string) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtnSmall} ${styles.actionBtnPrimary}`}
                    onClick={() => handleOpenDetail(project)}
                    data-analytics="project_click"
                    data-analytics-title={project.title}
                  >
                    <Info size={15} />
                    Detail Arsitektur
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtnSmall}
                    onClick={() => soundFx.playClick()}
                    data-analytics="project_click"
                    data-analytics-title={`${project.title} (GitHub)`}
                  >
                    <GithubIcon size={15} />
                    Repo
                  </a>

                  <a
                    href={project.liveUrl}
                    className={styles.actionBtnSmall}
                    onClick={() => soundFx.playClick()}
                    data-analytics="project_click"
                    data-analytics-title={`${project.title} (Live)`}
                  >
                    <ExternalLink size={15} />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Detail Modal Rendered in Portal to Escape Section Stacking Context */}
        {mounted &&
          selectedProject &&
          createPortal(
            <div
              className={styles.modalOverlay}
              onClick={handleCloseDetail}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={handleCloseDetail}
                  aria-label="Tutup Modal"
                >
                  <X size={20} />
                </button>

                <span className={styles.modalCategory}>
                  {selectedProject.icon} KATEGORI: {selectedProject.category.toUpperCase()}
                </span>
                <h3 id="project-modal-title" className={styles.modalTitle}>
                  {selectedProject.title}
                </h3>

                <h4 className={styles.modalSectionTitle}>Ringkasan Proyek</h4>
                <p className={styles.modalText}>{selectedProject.details.overview}</p>

                <h4 className={styles.modalSectionTitle}>Arsitektur &amp; Solusi Teknis</h4>
                <p className={styles.modalText}>{selectedProject.details.architecture}</p>

                <h4 className={styles.modalSectionTitle}>Fitur-Fitur Kunci</h4>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: '#94a3b8' }}>
                  {selectedProject.details.features.map((feat, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem', fontSize: '0.92rem' }}>
                      {feat}
                    </li>
                  ))}
                </ul>

                <h4 className={styles.modalSectionTitle}>Tech Stack Digunakan</h4>
                <div className={styles.techPillsList} style={{ marginTop: '0.5rem' }}>
                  {selectedProject.tech.map((t: string) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
}
