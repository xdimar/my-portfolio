'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import styles from './Skills.module.css';
import { soundFx } from '@/utils/audio';
import { SkillItem } from '@/types/portfolio';

type Category = 'all' | 'frontend' | 'backend' | 'networking';

interface SkillsProps {
  skills?: SkillItem[];
}

const skillsData: SkillItem[] = [
  // Frontend
  {
    name: 'Next.js 15+ (App Router)',
    category: 'frontend',
    level: 90,
    icon: '⚡',
    desc: 'Server Components, SSR/SSG, routing cepat, integrasi API, dan arsitektur performa tinggi.',
  },
  {
    name: 'React.js & Hooks',
    category: 'frontend',
    level: 92,
    icon: '⚛️',
    desc: 'Pembuatan komponen modular, custom hooks, reactive state, dan lifecycle optimization.',
  },
  {
    name: 'TypeScript & JavaScript (ES6+)',
    category: 'frontend',
    level: 88,
    icon: '📘',
    desc: 'Type safety, async/await, closures, modern ES features, dan clean code structure.',
  },
  {
    name: 'Three.js & 3D WebGL',
    category: 'frontend',
    level: 82,
    icon: '🎮',
    desc: 'Render 3D scenes interaktif, particle constellation, camera control, dan optimasi 60fps.',
  },
  {
    name: 'Responsive CSS & Glassmorphism',
    category: 'frontend',
    level: 94,
    icon: '🎨',
    desc: 'Mobile-first styling, CSS animations, design tokens, dan antarmuka futuristik.',
  },

  // Backend
  {
    name: 'Node.js & Express.js',
    category: 'backend',
    level: 88,
    icon: '🚀',
    desc: 'REST API, middleware, asynchronous event-loop handling, dan error handling terstruktur.',
  },
  {
    name: 'Relational DB (MySQL & PostgreSQL)',
    category: 'backend',
    level: 86,
    icon: '🗄️',
    desc: 'Relational schema design, query indexing, normalisasi data, dan ORM/query builder.',
  },
  {
    name: 'RESTful API & JWT Security',
    category: 'backend',
    level: 90,
    icon: '🛡️',
    desc: 'Token-based authentication, password hashing bcrypt, CORS, dan rate-limiting.',
  },
  {
    name: 'MongoDB & NoSQL',
    category: 'backend',
    level: 80,
    icon: '🍃',
    desc: 'Document-oriented database, flexible schema modeling, dan aggregations.',
  },

  // Networking / TKJ
  {
    name: 'Linux Server (Ubuntu / Debian)',
    category: 'networking',
    level: 89,
    icon: '🐧',
    desc: 'CLI navigation, SSH management, daemon systemd, file permissions, dan web server setup.',
  },
  {
    name: 'Networking & TCP/IP Protocol',
    category: 'networking',
    level: 92,
    icon: '🌐',
    desc: 'Pondasi SMK NU Sunan Ampel: subnetting IPv4, DNS resolving, port mapping, dan traffic analysis.',
  },
  {
    name: 'Mikrotik & Routing Fundamentals',
    category: 'networking',
    level: 85,
    icon: '📡',
    desc: 'Bandwidth management, firewall NAT rules, queue tree, dan konfigurasi gateway.',
  },
  {
    name: 'Git & Version Control',
    category: 'networking',
    level: 90,
    icon: '📦',
    desc: 'Branching workflow, merge conflicts resolution, CI/CD automated deployment basics.',
  },
];

export default function Skills({ skills }: SkillsProps) {
  const activeSkills = skills && skills.length > 0 ? skills : skillsData;
  const [activeTab, setActiveTab] = useState<Category>('all');

  const filteredSkills = activeTab === 'all'
    ? activeSkills
    : activeSkills.filter((s) => s.category === activeTab);

  const handleTabChange = (cat: Category) => {
    soundFx.playClick();
    setActiveTab(cat);
  };

  return (
    <section id="skills" className="section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="cyber-badge">
            <Layers size={14} />
            ARSITEKTUR KEAHLIAN &bull; TECH ARSENAL
          </div>
          <h2 className="section-title">
            Teknologi &amp; Kompetensi <br />
            <span className="gradient-text">Frontend, Backend &amp; Jaringan</span>
          </h2>
          <p className="section-subtitle">
            Kombinasi kemampuan rekayasa perangkat lunak modern dengan kedisiplinan ilmu jaringan komputer SMK NU Sunan Ampel Poncokusumo.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => handleTabChange('all')}
            onMouseEnter={() => soundFx.playHover()}
          >
            Semua Keahlian ({activeSkills.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'frontend' ? styles.active : ''}`}
            onClick={() => handleTabChange('frontend')}
            onMouseEnter={() => soundFx.playHover()}
          >
            ⚡ Frontend ({activeSkills.filter((s) => s.category === 'frontend').length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'backend' ? styles.active : ''}`}
            onClick={() => handleTabChange('backend')}
            onMouseEnter={() => soundFx.playHover()}
          >
            🛡️ Backend ({activeSkills.filter((s) => s.category === 'backend').length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'networking' ? styles.active : ''}`}
            onClick={() => handleTabChange('networking')}
            onMouseEnter={() => soundFx.playHover()}
          >
            🌐 Networking &amp; TKJ ({activeSkills.filter((s) => s.category === 'networking').length})
          </button>
        </div>

        {/* Skills Grid */}
        <div className={styles.skillsGrid}>
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className={styles.skillCard}
              onMouseEnter={() => soundFx.playHover()}
            >
              <div className={styles.skillHeader}>
                <div className={styles.skillTitleArea}>
                  <div className={styles.skillIconWrap}>
                    <span>{skill.icon}</span>
                  </div>
                  <div>
                    <h3 className={styles.skillName}>{skill.name}</h3>
                    <span className={styles.skillCategoryBadge}>
                      {skill.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className={styles.skillScore}>{skill.level}%</span>
              </div>

              {/* Progress bar */}
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <p className={styles.skillDesc}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
