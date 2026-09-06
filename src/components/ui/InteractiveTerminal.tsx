'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  X,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './InteractiveTerminal.module.css';
import { soundFx } from '@/utils/audio';
import { ProfileData, ProjectItem, SkillItem } from '@/types/portfolio';
import { trackClientEvent } from './AnalyticsTracker';
import { useCyberTheme, CyberTheme } from '@/context/ThemeContext';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: ProfileData;
  projects?: ProjectItem[];
  skills?: SkillItem[];
}

interface HistoryItem {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: React.ReactNode;
}

const defaultBanner: HistoryItem = {
  id: 'init-1',
  type: 'system',
  content: (
    <div>
      <span className={styles.outputCyan}>⚡ TKJ OS v4.21.0 (GNU/Linux x86_64)</span>
      <br />
      Sistem Terminal Interaktif &bull; Host: <strong>tkj-station-poncokusumo</strong>
      <br />
      Ketik <strong className={styles.outputSuccess}>help</strong> untuk melihat daftar perintah atau klik tombol cepat di bawah.
    </div>
  ),
};

export default function InteractiveTerminal({
  isOpen,
  onClose,
  profile,
  projects = [],
  skills = [],
}: TerminalProps) {
  const { setTheme: setCyberTheme } = useCyberTheme();
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([defaultBanner]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isPinging, setIsPinging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Initialize terminal banner
  useEffect(() => {
    if (isOpen) {
      trackClientEvent('terminal_open');
      // Only autofocus on desktop to prevent mobile virtual keyboard from covering screen immediately
      if (typeof window !== 'undefined' && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen]);

  // Auto-scroll to bottom on output change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, isPinging]);

  if (!isOpen) return null;

  const handleExecute = async (cmdToRun?: string) => {
    const rawCmd = cmdToRun !== undefined ? cmdToRun : input;
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundFx.playKey();

    // Append to command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput('');

    // Echo user input
    const inputItem: HistoryItem = {
      id: `in-${Date.now()}`,
      type: 'input',
      content: (
        <div className={styles.inputEcho}>
          <span className={styles.inputPrompt}>dimar@tkj:~$</span>
          <span>{trimmed}</span>
        </div>
      ),
    };

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let outputItem: HistoryItem;

    switch (cmd) {
      case 'help': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className={styles.outputCyan} style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                --- DAFTAR PERINTAH RESMI SISTEM ---
              </div>
              <div className={styles.helpCommandGrid}>
                <span className={styles.outputSuccess}>bio / about</span>
                <span>Biodata lengkap &amp; latar belakang TKJ 2021</span>
                <span className={styles.outputSuccess}>skills</span>
                <span>Matriks keahlian Fullstack &amp; Jaringan</span>
                <span className={styles.outputSuccess}>projects</span>
                <span>Daftar showcase proyek &amp; tautan demo</span>
                <span className={styles.outputSuccess}>cv</span>
                <span>Unduh langsung berkas resmi CV format PDF</span>
                <span className={styles.outputSuccess}>contact</span>
                <span>Informasi kontak &amp; kanal komunikasi</span>
                <span className={styles.outputSuccess}>ping [host]</span>
                <span>Tes latensi jaringan real-time (contoh: ping dimar)</span>
                <span className={styles.outputSuccess}>traceroute</span>
                <span>Visualisasi rute transmisi paket jaringan</span>
                <span className={styles.outputSuccess}>clear</span>
                <span>Bersihkan riwayat tampilan terminal</span>
                <span className={styles.outputSuccess}>exit</span>
                <span>Tutup jendela terminal</span>
                <span className={styles.outputYellow}>sudo hire-dimar</span>
                <span>[ROOT ACCESS] Rekrut Dimar sekarang juga!</span>
              </div>
            </div>
          ),
        };
        break;
      }

      case 'bio':
      case 'about': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div style={{ lineHeight: 1.7 }}>
              <div className={styles.outputCyan} style={{ fontWeight: 700 }}>
                [IDENTITY RECORD #2021]
              </div>
              <div><strong>Nama Lengkap:</strong> {profile?.name || 'MUHAMMAD JIHAN DIMAR'}</div>
              <div><strong>Panggilan:</strong> {profile?.call_name || 'Dimar'}</div>
              <div><strong>Pendidikan:</strong> {profile?.school || 'SMK NU Sunan Ampel Poncokusumo'} (Lulus 2021)</div>
              <div><strong>Program Keahlian:</strong> {profile?.major || 'Teknik Komputer dan Jaringan (TKJ)'}</div>
              <div><strong>Fokus Karir:</strong> Fullstack Web Engineering (Next.js, React, Node.js, Three.js 3D)</div>
              <div style={{ marginTop: '0.4rem', color: '#94a3b8' }}>
                <em>&quot;Berakar dari pemahaman mendalam tentang arsitektur jaringan fisik dan server, berevolusi membangun ekosistem aplikasi web modern skala penuh.&quot;</em>
              </div>
            </div>
          ),
        };
        break;
      }

      case 'skills': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className={styles.outputCyan} style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                [COMPETENCY & ARSENAL MATRIX]
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#38bdf8' }}>⚡ Frontend:</strong> Next.js App Router, React 19, TypeScript, Three.js (WebGL 3D), TailwindCSS
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#c084fc' }}>⚙️ Backend & DB:</strong> Node.js, REST APIs, Supabase, PostgreSQL, MySQL, JWT Auth
              </div>
              <div>
                <strong style={{ color: '#34d399' }}>🌐 TKJ & Sysadmin:</strong> TCP/IP, Linux Server (Debian/Ubuntu), Mikrotik Routing, DNS/DHCP, Subnetting CIDR
              </div>
              {skills.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                  Total {skills.length} keahlian terverifikasi di database portofolio.
                </div>
              )}
            </div>
          ),
        };
        break;
      }

      case 'projects': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className={styles.outputCyan} style={{ fontWeight: 700, marginBottom: '0.4rem' }}>
                [FEATURED PROJECTS CATALOG]
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {projects.slice(0, 5).map((p, idx) => (
                  <div key={p.id || idx} style={{ borderLeft: '2px solid #00f2fe', paddingLeft: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                      {p.icon || '🌐'} {p.title} <span style={{ fontSize: '0.75rem', color: '#10b981' }}>[{p.category}]</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{p.shortDesc}</div>
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                      Stack: {(p.tech || []).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
        break;
      }

      case 'cv':
      case 'download-cv': {
        trackClientEvent('cv_download', { source: 'terminal' });
        window.open('/cv/CV_Muhammad_Jihan_Dimar.pdf', '_blank');
        soundFx.playSuccess();
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'success',
          content: (
            <div>
              <span className={styles.outputSuccess}>✔ SUKSES:</span> Berkas CV resmi <code>CV_Muhammad_Jihan_Dimar.pdf</code> berhasil diunduh.
              <br />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Jika unduhan tidak otomatis dimulai, klik tautan: </span>
              <a href="/cv/CV_Muhammad_Jihan_Dimar.pdf" download style={{ color: '#00f2fe', textDecoration: 'underline' }}>
                Unduh PDF
              </a>
            </div>
          ),
        };
        break;
      }

      case 'contact': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className={styles.outputCyan} style={{ fontWeight: 700 }}>[CONTACT & CHANNELS]</div>
              <div><strong>Email:</strong> <a href="mailto:ddimar74@gmail.com" style={{ color: '#00f2fe' }}>ddimar74@gmail.com</a></div>
              <div><strong>GitHub:</strong> <a href="https://github.com/JihanDimar" target="_blank" rel="noreferrer" style={{ color: '#00f2fe' }}>github.com/JihanDimar</a></div>
              <div><strong>Lokasi:</strong> Poncokusumo, Malang, Jawa Timur</div>
              <div style={{ marginTop: '0.4rem', color: '#10b981' }}>
                Silakan kirim pesan melalui form di halaman utama atau email langsung.
              </div>
            </div>
          ),
        };
        break;
      }

      case 'ping': {
        setIsPinging(true);
        const targetHost = arg || 'dimar.dev';
        soundFx.playClick();

        try {
          const t0 = performance.now();
          const res = await fetch('/api/ping');
          const data = await res.json();
          const t1 = performance.now();
          const latency = Math.round(t1 - t0);

          outputItem = {
            id: `out-${Date.now()}`,
            type: 'output',
            content: (
              <div>
                PING {targetHost} (127.0.0.1): 56 data bytes
                <br />
                64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time={latency} ms
                <br />
                64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time={Math.max(1, latency - 2)} ms
                <br />
                <span className={styles.outputSuccess}>
                  --- {targetHost} ping statistics ---
                </span>
                <br />
                2 packets transmitted, 2 received, 0% packet loss | Node: {data.node || 'TKJ_SYS'} | Protocol: HTTP/2
              </div>
            ),
          };
        } catch {
          outputItem = {
            id: `out-${Date.now()}`,
            type: 'output',
            content: <div>PING {targetHost} - 64 bytes response time=21ms (OK)</div>,
          };
        } finally {
          setIsPinging(false);
        }
        break;
      }

      case 'traceroute': {
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className={styles.outputCyan}>traceroute to dimar-portfolio.vercel.app, 30 hops max, 60 byte packets</div>
              <div> 1  gateway.local (192.168.1.1)  1.124 ms  1.082 ms</div>
              <div> 2  router-tkj-poncokusumo.id (10.24.0.1)  4.321 ms  3.890 ms</div>
              <div> 3  core-backbone-sby.telkom.net (103.145.2.1)  12.450 ms  11.890 ms</div>
              <div> 4  vercel-edge-singapore.anycast (76.76.21.21)  18.230 ms  17.940 ms</div>
              <div className={styles.outputSuccess}>✔ [TARGET REACHED - 0% PACKET LOSS]</div>
            </div>
          ),
        };
        break;
      }

      case 'matrix': {
        setCyberTheme('matrix');
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'success',
          content: (
            <div style={{ color: '#00ff88', fontFamily: 'monospace' }}>
              Wake up, Neo... The Matrix has you. Tema dialihkan ke Matrix Emerald.
              <br />
              01001101 01010101 01001000 01000001 01001101 01001101 01000001 01000100 00100000 01000100 01001001 01001101 01000001 01010010
            </div>
          ),
        };
        break;
      }

      case 'theme': {
        const targetTheme = arg.toLowerCase().trim() as CyberTheme;
        if (['cyan', 'matrix', 'synthwave', 'amber'].includes(targetTheme)) {
          setCyberTheme(targetTheme);
          outputItem = {
            id: `out-${Date.now()}`,
            type: 'success',
            content: (
              <div>
                <span className={styles.outputSuccess}>✔ TEMA BERHASIL DIUBAH:</span> Tema sistem kini aktif sebagai{' '}
                <strong style={{ textTransform: 'uppercase' }}>{targetTheme}</strong>.
              </div>
            ),
          };
        } else {
          outputItem = {
            id: `out-${Date.now()}`,
            type: 'output',
            content: (
              <div>
                <div className={styles.outputCyan} style={{ fontWeight: 700, marginBottom: '4px' }}>
                  Preset Tema Siber Tersedia:
                </div>
                • <code style={{ color: '#00f2fe' }}>theme cyan</code> : Cyber Deep Space (Default)
                <br />
                • <code style={{ color: '#00ff88' }}>theme matrix</code> : Matrix Emerald Hacker
                <br />
                • <code style={{ color: '#f72585' }}>theme synthwave</code> : Synthwave Neon Violet
                <br />
                • <code style={{ color: '#f59e0b' }}>theme amber</code> : Amber CRT Retro Terminal
              </div>
            ),
          };
        }
        break;
      }

      case 'hire':
      case 'hire-dimar':
      case 'sudo': {
        if (cmd === 'hire' || cmd === 'hire-dimar' || arg === 'hire-dimar' || arg === 'hire') {
          soundFx.playSuccess();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#00f2fe', '#10b981', '#facc15'],
          });

          // Scroll to contact section
          setTimeout(() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 800);

          outputItem = {
            id: `out-${Date.now()}`,
            type: 'success',
            content: (
              <div>
                <span className={styles.outputYellow}>[ACCESS GRANTED: ROOT]</span>
                <br />
                <span className={styles.outputSuccess}>
                  🎉 Keputusan luar biasa! Anda sedang diarahkan ke form kolaborasi &amp; penawaran kerja...
                </span>
              </div>
            ),
          };
        } else {
          outputItem = {
            id: `out-${Date.now()}`,
            type: 'error',
            content: <div>sudo: {arg || 'command'}: Perintah hanya berlaku untuk <code>sudo hire-dimar</code></div>,
          };
        }
        break;
      }

      case 'clear': {
        setHistory([]);
        return;
      }

      case 'exit': {
        onClose();
        return;
      }

      default: {
        soundFx.playAlert();
        outputItem = {
          id: `out-${Date.now()}`,
          type: 'error',
          content: (
            <div>
              bash: {cmd}: perintah tidak ditemukan. Ketik <strong className={styles.outputSuccess}>help</strong> untuk panduan.
            </div>
          ),
        };
        break;
      }
    }

    setHistory((prev) => [...prev, inputItem, outputItem]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['help', 'bio', 'skills', 'projects', 'cv', 'contact', 'ping', 'traceroute', 'matrix', 'clear', 'exit', 'sudo hire-dimar'];
      const match = commands.find((c) => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  return (
    <div className={styles.terminalOverlay} onClick={onClose}>
      <div
        className={`${styles.terminalContainer} ${isMaximized ? styles.maximized : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        {/* Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.windowButtons}>
            <button
              type="button"
              className={`${styles.winBtn} ${styles.closeBtn}`}
              onClick={onClose}
              title="Tutup (ESC)"
            />
            <button
              type="button"
              className={`${styles.winBtn} ${styles.minBtn}`}
              onClick={onClose}
              title="Minimalkan"
            />
            <button
              type="button"
              className={`${styles.winBtn} ${styles.maxBtn}`}
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Pulihkan' : 'Maksimalkan'}
            />
          </div>

          <div className={styles.terminalTitle}>
            <TerminalIcon size={14} style={{ color: '#00f2fe' }} />
            <span className={styles.userHost}>dimar@tkj-station:~</span>
            <span className={styles.tkjTag}>TKJ 2021</span>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsMaximized(!isMaximized)}
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button type="button" className={styles.iconBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.terminalBody} ref={bodyRef}>
          {history.map((item) => (
            <div key={item.id} className={styles.outputRow}>
              {item.content}
            </div>
          ))}

          {isPinging && (
            <div className={styles.outputCyan} style={{ fontStyle: 'italic' }}>
              Memancarkan paket ICMP... mohon tunggu...
            </div>
          )}

          {/* Interactive Prompt Line */}
          <div className={styles.promptRow}>
            <div className={styles.promptSymbol}>
              <Zap size={13} />
              <span>dimar@tkj:~$</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              className={styles.terminalInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Command Chips (Mobile Friendly) */}
        <div className={styles.quickBar}>
          <span className={styles.quickTitle}>Perintah Cepat:</span>
          {['help', 'bio', 'skills', 'projects', 'cv', 'ping', 'clear', 'sudo hire-dimar'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              className={styles.quickChip}
              onClick={() => handleExecute(cmd)}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
