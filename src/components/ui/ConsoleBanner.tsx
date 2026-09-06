'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '@/utils/audio';

declare global {
  interface Window {
    __dimar_console_banner_loaded?: boolean;
    dimar?: {
      hire: () => void;
      skills: () => void;
      projects: () => void;
      about: () => void;
      cv: () => void;
      theme: (name?: string) => void;
      help: () => void;
    };
  }
}

export default function ConsoleBanner() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.__dimar_console_banner_loaded) return;
    window.__dimar_console_banner_loaded = true;

    // Suppress harmless browser & dev deprecation warnings to keep console pristine
    const originalWarn = console.warn;
    console.warn = function (...args: unknown[]) {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (
        msg.includes('THREE.Clock') ||
        msg.includes('The AudioContext was not allowed to start') ||
        msg.includes('was preloaded using link preload')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    const originalError = console.error;
    console.error = function (...args: unknown[]) {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (msg.includes('The AudioContext was not allowed to start')) {
        return;
      }
      originalError.apply(console, args);
    };

    // ASCII Art Banner
    const asciiArt = `
%c  ██████╗  ██╗███╗   ███╗  █████╗  ██████╗ 
  ██╔══██╗ ██║████╗ ████║ ██╔══██╗ ██╔══██╗
  ██║  ██║ ██║██╔████╔██║ ███████║ ██████╔╝
  ██║  ██║ ██║██║╚██╔╝██║ ██╔══██║ ██╔══██╗
  ██████╔╝ ██║██║ ╚═╝ ██║ ██║  ██║ ██║  ██║
  ╚═════╝  ╚═╝╚═╝     ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ .DEV
`;

    // Neon Cyan glow banner
    console.log(
      asciiArt,
      'color: #00f2fe; font-family: monospace; font-weight: 900; text-shadow: 0 0 10px rgba(0, 242, 254, 0.9), 0 0 20px rgba(0, 242, 254, 0.5), 0 0 35px rgba(0, 242, 254, 0.3); font-size: 13px; line-height: 1.15;'
    );

    // Styled Badges
    console.log(
      '%c ⚡ DEV %c MUHAMMAD JIHAN DIMAR %c TKJ 2021 %c FULLSTACK %c',
      'background: #00f2fe; color: #07090e; font-weight: 800; font-family: monospace; padding: 4px 8px; border-radius: 4px 0 0 4px; font-size: 11px;',
      'background: #0d1527; color: #38bdf8; font-weight: 700; font-family: monospace; padding: 4px 10px; font-size: 11px; border-top: 1px solid #00f2fe; border-bottom: 1px solid #00f2fe;',
      'background: #10b981; color: #022c22; font-weight: 800; font-family: monospace; padding: 4px 8px; font-size: 11px;',
      'background: #8b5cf6; color: #ffffff; font-weight: 800; font-family: monospace; padding: 4px 8px; border-radius: 0 4px 4px 0; font-size: 11px;',
      'background: transparent;'
    );

    // Monospace details box
    console.log(
      '%c' +
        '┌─────────────────────────────────────────────────────────────┐\n' +
        '│  👨‍💻 DEVELOPER : Muhammad Jihan Dimar                         │\n' +
        '│  🎓 ALUMNI    : SMK NU Sunan Ampel Poncokusumo (TKJ 2021)    │\n' +
        '│  🚀 EXPERTISE : Fullstack Web (Next.js 15, Three.js, Node)   │\n' +
        '│  📍 LOCATION  : Poncokusumo, Malang, Jawa Timur              │\n' +
        '│  🐙 GITHUB    : https://github.com/JihanDimar                │\n' +
        '│  📧 EMAIL     : ddimar74@gmail.com                           │\n' +
        '│  💼 STATUS    : Available for Fulltime & Freelance Projects  │\n' +
        '└─────────────────────────────────────────────────────────────┘\n\n' +
        '💡 Ingin berinteraksi lewat console? Coba ketik perintah di bawah ini:\n' +
        '   • dimar.hire()     -> Hubungi langsung untuk kolaborasi proyek\n' +
        '   • dimar.skills()   -> Lihat tabel keahlian teknologi & tools\n' +
        '   • dimar.projects() -> Lihat ringkasan proyek unggulan\n' +
        '   • dimar.about()    -> Cerita latar belakang & rekam jejak\n' +
        '   • dimar.cv()       -> Buka & unduh CV resmi (PDF)\n' +
        '   • dimar.theme("amber") -> Ganti tema (cyan/matrix/synthwave/amber)\n' +
        '   • Atau tekan tombol backtick [ ` ] di website untuk Terminal CLI!\n',
      'color: #94a3b8; font-family: monospace; font-size: 11.5px; line-height: 1.55;'
    );

    // Interactive Dimar API in DevTools
    window.dimar = {
      hire: () => {
        soundFx.playSuccess();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#00f2fe', '#10b981', '#facc15', '#a855f7'],
        });
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        console.log(
          '%c🎉 [COLLABORATION INITIATED] Mengarahkan ke form kontak & pemesanan proyek. Mari bekerja sama!',
          'background: #022c22; color: #34d399; font-weight: bold; font-family: monospace; padding: 6px 12px; border: 1px solid #10b981; border-radius: 4px; font-size: 12px;'
        );
      },
      skills: () => {
        console.log(
          '%c⚡ TECH STACK & COMPETENCY MATRIX - MUHAMMAD JIHAN DIMAR',
          'color: #00f2fe; font-weight: bold; font-family: monospace; font-size: 12px;'
        );
        console.table([
          { Kategori: 'Frontend Core', Teknologi: 'Next.js 15, React 19, TypeScript', Level: 'Expert', Penguasaan: '92%' },
          { Kategori: '3D & Interaktif', Teknologi: 'Three.js, WebGL, Canvas Confetti', Level: 'Advanced', Penguasaan: '88%' },
          { Kategori: 'Styling & UI', Teknologi: 'CSS3 Neon, Responsive, Tailwind-ready', Level: 'Expert', Penguasaan: '95%' },
          { Kategori: 'Backend & API', Teknologi: 'Node.js, Express, RESTful APIs, JWT', Level: 'Advanced', Penguasaan: '87%' },
          { Kategori: 'Database', Teknologi: 'PostgreSQL, MySQL, Prisma ORM', Level: 'Advanced', Penguasaan: '85%' },
          { Kategori: 'Networking & Ops', Teknologi: 'Linux, Mikrotik (TKJ 2021), Git, Docker', Level: 'Expert', Penguasaan: '90%' },
        ]);
      },
      projects: () => {
        console.log(
          '%c📂 FEATURED PROJECTS - MUHAMMAD JIHAN DIMAR',
          'color: #facc15; font-weight: bold; font-family: monospace; font-size: 12px;'
        );
        console.table([
          { Proyek: '3D Interactive Portfolio', Stack: 'Next.js 15, Three.js, TS', Status: 'Live (dimar.dev)' },
          { Proyek: 'Enterprise ERP System', Stack: 'React, Node.js, PostgreSQL', Status: 'Completed' },
          { Proyek: 'Network Monitoring Tool', Stack: 'Python, SNMP, Linux API', Status: 'Completed' },
          { Proyek: 'AI Prompt Studio Platform', Stack: 'Next.js, Tailwind, Gemini API', Status: 'In Progress' },
        ]);
      },
      about: () => {
        console.log(
          '%c📖 ABOUT DEVELOPER\n' +
            'Muhammad Jihan Dimar adalah Fullstack Developer berlatar belakang Teknik Komputer & Jaringan (TKJ) ' +
            'lulusan SMK NU Sunan Ampel Poncokusumo tahun 2021. ' +
            'Menggabungkan keahlian infrastruktur jaringan, hardware, dan arsitektur web modern (Next.js, Three.js, Node.js) ' +
            'untuk membangun aplikasi web berperforma tinggi, aman, dan memukau secara visual.',
          'color: #e2e8f0; font-family: monospace; font-size: 12px; line-height: 1.6;'
        );
      },
      cv: () => {
        window.open('/cv/CV_Muhammad_Jihan_Dimar.pdf', '_blank');
        console.log(
          '%c📄 [DOWNLOAD] CV resmi Muhammad Jihan Dimar dibuka di tab baru.',
          'color: #00f2fe; font-weight: bold; font-family: monospace;'
        );
      },
      theme: (name?: string) => {
        const validThemes = ['cyan', 'matrix', 'synthwave', 'amber'];
        if (!name || !validThemes.includes(name)) {
          console.warn(`Pilihan tema tidak valid. Gunakan: ${validThemes.join(', ')}`);
          return;
        }
        document.documentElement.setAttribute('data-theme', name);
        localStorage.setItem('dimar_theme', name);
        soundFx.playSuccess();
        console.log(
          `%c🎨 Tema berhasil diubah ke: ${name.toUpperCase()}`,
          'color: #a855f7; font-weight: bold; font-family: monospace;'
        );
      },
      help: () => {
        console.log(
          '%c⚡ PERINTAH KONSOL:\n' +
            '• dimar.hire()\n' +
            '• dimar.skills()\n' +
            '• dimar.projects()\n' +
            '• dimar.about()\n' +
            '• dimar.cv()\n' +
            '• dimar.theme("matrix" | "cyan" | "synthwave" | "amber")',
          'color: #38bdf8; font-family: monospace; font-weight: bold;'
        );
      },
    };
  }, []);

  return null;
}
