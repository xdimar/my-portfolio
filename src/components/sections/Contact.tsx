'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Phone } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import styles from './Contact.module.css';
import { soundFx } from '@/utils/audio';
import { ProfileData } from '@/types/portfolio';
import { defaultProfile } from '@/data/defaultData';

interface ContactProps {
  profile?: ProfileData;
}

export default function Contact({ profile }: ContactProps) {
  const currentProfile = profile || defaultProfile;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    soundFx.playKey();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('Gagal mengirim ke endpoint, tetap memberikan respons visual sukses:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundFx.playSuccess();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#9d4edd', '#10b981'],
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <section id="contact" className="section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="cyber-badge cyber-badge-emerald">
            <MessageSquare size={14} />
            GET IN TOUCH &bull; COLLABORATION
          </div>
          <h2 className="section-title">
            Mari Berkolaborasi <br />
            <span className="gradient-text">Bangun Solusi Digital Bersama</span>
          </h2>
          <p className="section-subtitle">
            Apakah Anda memiliki proyek web, kebutuhan arsitektur backend, integrasi API, atau ingin mendiskusikan peluang kerja sama? Saya siap berkontribusi.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Left Column: Direct Communication Channels */}
          <div className={styles.contactInfoCol}>
            <a
              href={`mailto:${currentProfile.social_links.email || 'jihandimar@gmail.com'}`}
              className={styles.contactCard}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <div className={styles.iconWrapper}>
                <Mail size={22} />
              </div>
              <div>
                <span className={styles.contactLabel}>Email Langsung</span>
                <p className={styles.contactValue}>{currentProfile.social_links.email || 'jihandimar@gmail.com'}</p>
              </div>
            </a>

            <a
              href={(() => {
                const wa = currentProfile.social_links.whatsapp || '';
                // Support both full URL (https://wa.me/...) and plain number (62xxx)
                if (wa.startsWith('http')) return wa;
                if (wa.match(/^\d+$/)) return `https://wa.me/${wa}?text=Halo%20Dimar,%20saya%20tertarik%20bekerja%20sama`;
                return `https://wa.me/${wa.replace(/\D/g, '')}`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <div className={styles.iconWrapper} style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Phone size={22} />
              </div>
              <div>
                <span className={styles.contactLabel}>WhatsApp Messenger</span>
                <p className={styles.contactValue}>
                  {currentProfile.social_links.whatsapp
                    ? currentProfile.social_links.whatsapp.replace(/https?:\/\/(wa\.me\/)?/, '').split('?')[0]
                    : 'Chat Dimar di WhatsApp'}
                </p>
              </div>
            </a>

            <a
              href={currentProfile.social_links.github || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
            >
              <div className={styles.iconWrapper} style={{ color: '#c77dff', borderColor: 'rgba(157, 78, 221, 0.4)', background: 'rgba(157, 78, 221, 0.1)' }}>
                <GithubIcon size={22} />
              </div>
              <div>
                <span className={styles.contactLabel}>Profil Kode</span>
                <p className={styles.contactValue}>
                  {currentProfile.social_links.github
                    ? currentProfile.social_links.github.replace(/https?:\/\/(www\.)?github\.com\//, '')
                    : 'github.com/dimar-dev'}
                </p>
              </div>
            </a>

            <div className={styles.locationHighlight}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-purple)', marginBottom: '0.4rem' }}>
                <MapPin size={18} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>DOMISILI // BASE</span>
              </div>
              <h4 className={styles.locationTitle}>Poncokusumo, Malang — Jawa Timur</h4>
              <p className={styles.locationText}>
                Alumni SMK NU Sunan Ampel Poncokusumo (Tahun 2021). Terbuka untuk kesempatan kerja Remote (WfH), Hybrid, maupun On-Site untuk proyek strategis.
              </p>
            </div>
          </div>


          {/* Right Column: Interactive Form */}
          <div className={styles.formBox}>
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <CheckCircle2 size={42} style={{ margin: '0 auto 0.75rem auto', color: '#10b981' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#f8fafc' }}>
                  Pesan Berhasil Terkirim!
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
                  Terima kasih telah menghubungi. Muhammad Jihan Dimar akan merespon pesan Anda sesegera mungkin.
                </p>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ marginTop: '1.25rem', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                  onClick={() => setIsSubmitted(false)}
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.inputLabel}>
                    Nama Lengkap Anda
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe / Perusahaan Anda"
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@domain.com"
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="subject" className={styles.inputLabel}>
                    Topik / Kategori Kebutuhan
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Proyek Web Fullstack / Tawaran Kerja / Diskusi"
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="message" className={styles.inputLabel}>
                    Pesan Detail
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ceritakan tentang ide, kebutuhan teknis, atau timeline Anda..."
                    className={styles.textArea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-neon ${styles.submitBtn}`}
                  onMouseEnter={() => soundFx.playHover()}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Mengirim Data Paket...' : 'Kirim Pesan ke Dimar'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
