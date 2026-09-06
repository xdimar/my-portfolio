'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Terminal as TerminalIcon } from 'lucide-react';
import styles from './TerminalSection.module.css';
import { soundFx } from '@/utils/audio';
import { useCyberTheme, CyberTheme } from '@/context/ThemeContext';

interface CommandOutput {
  command?: string;
  output: string | React.ReactNode;
}

export default function TerminalSection() {
  const { setTheme: setCyberTheme } = useCyberTheme();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      output: (
        <div>
          <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
            ⚡ DIMAR OS v2.4.0 [TKJ-Fullstack-Engine Initialized]
          </p>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>
            Ketik <span style={{ color: '#00f2fe' }}>help</span> untuk melihat daftar perintah, atau klik tombol pintas di bawah.
          </p>
        </div>
      ),
    },
  ]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleExecute = (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    soundFx.playClick();
    const cmd = trimmed.toLowerCase();

    let result: React.ReactNode = null;

    switch (cmd) {
      case 'help':
      case '?':
        result = (
          <div style={{ color: '#cbd5e1' }}>
            <p style={{ color: 'var(--neon-cyan)', marginBottom: '6px' }}>Perintah yang tersedia:</p>
            <p>• <span style={{ color: '#38bdf8' }}>about</span> / <span style={{ color: '#38bdf8' }}>bio</span> : Profil ringkas Muhammad Jihan Dimar</p>
            <p>• <span style={{ color: '#38bdf8' }}>education</span> / <span style={{ color: '#38bdf8' }}>edu</span> : Riwayat SMK NU Sunan Ampel Poncokusumo 2021</p>
            <p>• <span style={{ color: '#38bdf8' }}>skills</span> : Kemampuan Frontend &amp; Backend</p>
            <p>• <span style={{ color: '#38bdf8' }}>projects</span> : Daftar proyek unggulan</p>
            <p>• <span style={{ color: '#38bdf8' }}>contact</span> : Info saluran komunikasi</p>
            <p>• <span style={{ color: '#38bdf8' }}>theme &lt;nama&gt;</span> : Ganti tema (cyan / matrix / synthwave / amber)</p>
            <p>• <span style={{ color: '#38bdf8' }}>sudo hire-dimar</span> : [Easter Egg] Rekrut Dimar!</p>
            <p>• <span style={{ color: '#38bdf8' }}>clear</span> : Bersihkan layar konsol</p>
          </div>
        );
        break;

      case 'about':
      case 'bio':
        result = (
          <div>
            <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>[IDENTITAS DEVELOPER]</p>
            <p>Nama: Muhammad Jihan Dimar (Dimar)</p>
            <p>Peran: Fullstack Web Developer (Frontend &amp; Backend)</p>
            <p>Pendidikan: SMK NU Sunan Ampel Poncokusumo (Lulus 2021 - TKJ)</p>
            <p>Karakter: Detail-oriented, tangguh dalam problem solving jaringan &amp; logika kode.</p>
          </div>
        );
        break;

      case 'education':
      case 'edu':
        result = (
          <div>
            <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>[RIWAYAT PENDIDIKAN]</p>
            <p>Sekolah: SMK NU Sunan Ampel Poncokusumo</p>
            <p>Tahun Kelulusan: 2021</p>
            <p>Konsentrasi: Teknik Komputer dan Jaringan (TKJ)</p>
            <p>Keahlian Inti: Topologi Jaringan, Routing Mikrotik, Linux Server, Konfigurasi LAN/WAN.</p>
          </div>
        );
        break;

      case 'skills':
        result = (
          <div>
            <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>[ARSENAL TEKNOLOGI]</p>
            <p>🎨 <strong style={{ color: '#38bdf8' }}>Frontend:</strong> Next.js 15, React 19, TypeScript, Three.js 3D, CSS Responsive</p>
            <p>🛡️ <strong style={{ color: '#c77dff' }}>Backend:</strong> Node.js, Express, REST API, MySQL, PostgreSQL, MongoDB, JWT</p>
            <p>🌐 <strong style={{ color: '#34d399' }}>Networking/TKJ:</strong> Linux Administration, TCP/IP, Mikrotik, Git &amp; CI/CD</p>
          </div>
        );
        break;

      case 'projects':
        result = (
          <div>
            <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>[DAFTAR PROYEK]</p>
            <p>1. DimarCloud • 3D Network Topology &amp; Real-Time Server Telemetry</p>
            <p>2. CyberCommerce • Modern Next.js 15 High-Speed E-Commerce</p>
            <p>3. Sentinel • Enterprise Microservice REST API &amp; RBAC Auth</p>
            <p>4. Aura3D • WebGL Shader &amp; Audio Visualizer Experiment</p>
          </div>
        );
        break;

      case 'contact':
        result = (
          <div>
            <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>[SALURAN KOMUNIKASI]</p>
            <p>📧 Email: jihandimar@gmail.com</p>
            <p>💬 WhatsApp: +62 822-XXXX-XXXX (Tersedia di form bawah)</p>
            <p>🐙 GitHub: github.com/dimar-dev</p>
            <p>💼 Status: Siap bekerja secara Remote / On-site / Kontrak Proyek</p>
          </div>
        );
        break;

      case 'sudo hire-dimar':
      case 'hire':
      case 'hire-dimar':
        soundFx.playSuccess();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#9d4edd', '#38bdf8', '#ffffff'],
        });
        result = (
          <div style={{ padding: '8px', border: '1px solid #10b981', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)' }}>
            <p style={{ color: '#34d399', fontWeight: 700 }}>
              🎉 ACCESS GRANTED! Kontrak Rekrutmen Siap Ditandatangani!
            </p>
            <p style={{ color: '#f8fafc', marginTop: '4px' }}>
              Muhammad Jihan Dimar siap memberikan solusi software terbaik untuk tim Anda.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Silakan kirim pesan melalui form kontak di bawah atau email langsung ke jihandimar@gmail.com.
            </p>
          </div>
        );
        break;

      case 'matrix':
      case 'theme': {
        const parts = trimmed.split(' ');
        const targetTheme = (cmd === 'matrix' ? 'matrix' : parts[1] || '').toLowerCase().trim() as CyberTheme;
        if (['cyan', 'matrix', 'synthwave', 'amber'].includes(targetTheme)) {
          setCyberTheme(targetTheme);
          result = (
            <div style={{ color: 'var(--neon-emerald)', fontWeight: 600 }}>
              ✔ TEMA BERHASIL DIUBAH: Tema sistem kini aktif sebagai{' '}
              <strong style={{ textTransform: 'uppercase' }}>{targetTheme}</strong>.
            </div>
          );
        } else {
          result = (
            <div>
              <p style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>Preset Tema Siber Tersedia:</p>
              <p>• <span style={{ color: '#00f2fe' }}>theme cyan</span> : Cyber Deep Space (Default)</p>
              <p>• <span style={{ color: '#00ff88' }}>theme matrix</span> : Matrix Emerald Hacker</p>
              <p>• <span style={{ color: '#f72585' }}>theme synthwave</span> : Synthwave Neon Violet</p>
              <p>• <span style={{ color: '#f59e0b' }}>theme amber</span> : Amber CRT Retro Terminal</p>
            </div>
          );
        }
        break;
      }

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      default:
        result = (
          <span style={{ color: '#ef4444' }}>
            Perintah tidak dikenali: &quot;{trimmed}&quot;. Ketik &quot;help&quot; untuk melihat daftar perintah.
          </span>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        output: result,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundFx.playKey();
    if (e.key === 'Enter') {
      handleExecute(inputVal);
    }
  };

  return (
    <section id="terminal" className="section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="cyber-badge">
            <TerminalIcon size={14} />
            INTERACTIVE CLI &bull; DEVELOPER CONSOLE
          </div>
          <h2 className="section-title">
            Jalankan Terminal <br />
            <span className="gradient-text">Eksplorasi Melalui Baris Perintah</span>
          </h2>
          <p className="section-subtitle">
            Coba ketikkan perintah di bawah ini seperti pada server Linux untuk mengetahui informasi mendalam tentang Dimar secara langsung.
          </p>
        </div>

        {/* Terminal Box */}
        <div
          className={styles.terminalContainer}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Mac/Linux styled Top Bar */}
          <div className={styles.terminalHeader}>
            <div className={styles.windowControls}>
              <div className={`${styles.controlDot} ${styles.dotRed}`} />
              <div className={`${styles.controlDot} ${styles.dotYellow}`} />
              <div className={`${styles.controlDot} ${styles.dotGreen}`} />
            </div>
            <span className={styles.terminalTitle}>dimar@tkj-node-poncokusumo:~ (bash)</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>bash 5.2</span>
          </div>

          {/* Terminal Logs & Input */}
          <div ref={bodyRef} className={styles.terminalBody}>
            {history.map((item, idx) => (
              <div key={idx} className={styles.terminalLog}>
                {item.command && (
                  <div className={styles.promptLine}>
                    <span className={styles.promptHost}>dimar@fullstack:~$</span>
                    <span style={{ color: '#f8fafc' }}>{item.command}</span>
                  </div>
                )}
                <div style={{ marginTop: '4px' }}>{item.output}</div>
              </div>
            ))}

            {/* Current Active Prompt */}
            <div className={styles.promptLine}>
              <span className={styles.promptHost}>dimar@fullstack:~$</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.terminalInput}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik 'help' lalu tekan Enter..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Quick Command Pills */}
            <div className={styles.quickCommandsRow}>
              <span>Pintasan Cepat:</span>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('help')}
              >
                help
              </button>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('about')}
              >
                about
              </button>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('edu')}
              >
                edu
              </button>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('skills')}
              >
                skills
              </button>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('sudo hire-dimar')}
              >
                sudo hire-dimar 🎉
              </button>
              <button
                type="button"
                className={styles.quickCmdBtn}
                onClick={() => handleExecute('clear')}
              >
                clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
