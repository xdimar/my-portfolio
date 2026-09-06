'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Masukkan password admin terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Password salah. Akses ditolak.');
      }
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.iconWrap}>
            <ShieldCheck size={28} />
          </div>
          <h1 className={styles.title}>ADMIN CONSOLE // AUTH</h1>
          <p className={styles.subtitle}>
            Masukkan Master Key untuk mengelola data portofolio live (Supabase).
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner} style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Security Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className={styles.input}
                autoFocus
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Password bawaan awal: <code style={{ color: '#38bdf8' }}>dimar2021</code> (dapat diubah di .env.local)
            </span>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memverifikasi Otorisasi...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Buka Panel Kendali</span>
              </>
            )}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Kembali ke Website Utama</span>
        </Link>
      </div>
    </main>
  );
}
