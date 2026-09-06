'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FolderGit2,
  User,
  Layers,
  Mail,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Database,
  Eye,
  Sparkles,
  Activity,
  RefreshCw,
  BarChart3,
  Download,
  Terminal as TerminalIcon,
  Monitor,
  Smartphone,
  MousePointerClick,
  Image as ImageIcon,
  UploadCloud,
  FileUp,
  FileCheck,
  FileText,
} from 'lucide-react';
import styles from './admin.module.css';
import { soundFx } from '@/utils/audio';
import {
  FullPortfolioData,
  ProfileData,
  ProjectItem,
  SkillItem,
  ContactMessage,
} from '@/types/portfolio';
import { AnalyticsSummary } from '@/types/analytics';
import {
  updateProfileAction,
  saveProjectAction,
  deleteProjectAction,
  saveSkillAction,
  deleteSkillAction,
  toggleMessageReadAction,
  deleteMessageAction,
  getAnalyticsSummaryAction,
  resetAnalyticsAction,
} from './actions';

interface Props {
  initialData: FullPortfolioData;
  initialMessages: ContactMessage[];
  initialAnalytics?: AnalyticsSummary;
}

type TabType = 'overview' | 'media' | 'projects' | 'bio' | 'skills' | 'messages' | 'analytics';

export default function AdminDashboardClient({ initialData, initialMessages, initialAnalytics }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Media upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Local state initialized with server data
  const [profile, setProfile] = useState<ProfileData>(initialData.profile);
  const [projects, setProjects] = useState<ProjectItem[]>(initialData.projects);
  const [skills, setSkills] = useState<SkillItem[]>(initialData.skills);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | undefined>(initialAnalytics);
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false);

  // Modals & form state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [techTagInput, setTechTagInput] = useState('');
  const [featureItemInput, setFeatureItemInput] = useState('');

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const [newRoleInput, setNewRoleInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ==========================================
  // AUTH
  // ==========================================
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  // ==========================================
  // MEDIA (AVATAR & CV) MUTATIONS
  // ==========================================
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedExts = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedExts.includes(file.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 5MB', 'error');
      return;
    }
    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    soundFx.playClick();
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('type', 'avatar');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProfile((prev) => ({ ...prev, avatar_url: data.url }));
        setAvatarFile(null);
        setAvatarPreview(null);
        soundFx.playSuccess();
        showToast('🎉 Foto profil utama berhasil diperbarui dan aktif di website!');
        router.refresh();
      } else {
        showToast(data.message || 'Gagal mengunggah foto', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi saat mengunggah foto', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleResetAvatar = async () => {
    try {
      const updated = { ...profile, avatar_url: '/images/dimar.jpg' };
      const res = await updateProfileAction(updated);
      if (res.success) {
        setProfile(updated);
        setAvatarFile(null);
        setAvatarPreview(null);
        soundFx.playSuccess();
        showToast('Foto profil dikembalikan ke bawaan');
        router.refresh();
      }
    } catch {
      showToast('Gagal mereset foto profil', 'error');
    }
  };

  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Berkas CV harus berformat PDF (.pdf)', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('Ukuran berkas CV maksimal 15MB', 'error');
      return;
    }
    setCvFile(file);
    soundFx.playClick();
  };

  const handleUploadCv = async () => {
    if (!cvFile) return;
    setIsUploadingCv(true);
    try {
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('type', 'cv');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          cv_url: data.url,
          cv_last_updated: data.updatedAt,
        }));
        setCvFile(null);
        soundFx.playSuccess();
        showToast('🎉 Berkas CV resmi berhasil diperbarui dan aktif di seluruh link unduh!');
        router.refresh();
      } else {
        showToast(data.message || 'Gagal mengunggah CV', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi saat mengunggah CV', 'error');
    } finally {
      setIsUploadingCv(false);
    }
  };

  // ==========================================
  // PROFILE MUTATIONS
  // ==========================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfileAction(profile);
      if (res.success) {
        showToast('Biodata & profil berhasil diperbarui!');
      } else {
        showToast(res.error || 'Gagal menyimpan biodata', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan profil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRole = () => {
    if (!newRoleInput.trim()) return;
    if (profile.roles.includes(newRoleInput.trim())) return;
    setProfile({
      ...profile,
      roles: [...profile.roles, newRoleInput.trim()],
    });
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setProfile({
      ...profile,
      roles: profile.roles.filter((r) => r !== roleToRemove),
    });
  };

  // ==========================================
  // PROJECT MUTATIONS
  // ==========================================
  const handleOpenAddProject = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      category: 'fullstack',
      icon: '🚀',
      shortDesc: '',
      tech: [],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      details: {
        overview: '',
        architecture: '',
        features: [],
      },
      orderIndex: projects.length + 1,
    });
    setTechTagInput('');
    setFeatureItemInput('');
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProject({ ...proj });
    setTechTagInput('');
    setFeatureItemInput('');
    setProjectModalOpen(true);
  };

  const handleAddTechTag = () => {
    if (!techTagInput.trim() || !editingProject) return;
    if (editingProject.tech.includes(techTagInput.trim())) return;
    setEditingProject({
      ...editingProject,
      tech: [...editingProject.tech, techTagInput.trim()],
    });
    setTechTagInput('');
  };

  const handleRemoveTechTag = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tech: editingProject.tech.filter((t) => t !== tag),
    });
  };

  const handleAddFeatureItem = () => {
    if (!featureItemInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      details: {
        ...editingProject.details,
        features: [...editingProject.details.features, featureItemInput.trim()],
      },
    });
    setFeatureItemInput('');
  };

  const handleRemoveFeatureItem = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      details: {
        ...editingProject.details,
        features: editingProject.details.features.filter((_, i) => i !== index),
      },
    });
  };

  const handleSaveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) {
      showToast('Judul proyek wajib diisi', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveProjectAction(editingProject);
      if (res.success) {
        setProjects((prev) => {
          const index = prev.findIndex((p) => p.id === editingProject.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = editingProject;
            return next;
          }
          return [...prev, editingProject];
        });
        setProjectModalOpen(false);
        showToast('Proyek berhasil disimpan!');
      } else {
        showToast(res.error || 'Gagal menyimpan proyek', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan proyek', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus proyek "${title}"?`)) return;

    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showToast('Proyek berhasil dihapus');
      } else {
        showToast(res.error || 'Gagal menghapus proyek', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus proyek', 'error');
    }
  };

  // ==========================================
  // SKILLS MUTATIONS
  // ==========================================
  const handleOpenAddSkill = () => {
    setEditingSkill({
      id: `skill-${Date.now()}`,
      name: '',
      category: 'frontend',
      level: 80,
      icon: '⚡',
      desc: '',
      orderIndex: skills.length + 1,
    });
    setSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: SkillItem) => {
    setEditingSkill({ ...skill });
    setSkillModalOpen(true);
  };

  const handleSaveSkillModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) {
      showToast('Nama keahlian wajib diisi', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveSkillAction(editingSkill);
      if (res.success) {
        setSkills((prev) => {
          const index = prev.findIndex((s) => s.id === editingSkill.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = editingSkill;
            return next;
          }
          return [...prev, editingSkill];
        });
        setSkillModalOpen(false);
        showToast('Keahlian berhasil disimpan!');
      } else {
        showToast(res.error || 'Gagal menyimpan keahlian', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan keahlian', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string | undefined, name: string) => {
    if (!id) return;
    if (!confirm(`Yakin ingin menghapus keahlian "${name}"?`)) return;

    try {
      const res = await deleteSkillAction(id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showToast('Keahlian berhasil dihapus');
      } else {
        showToast(res.error || 'Gagal menghapus keahlian', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus keahlian', 'error');
    }
  };

  // ==========================================
  // MESSAGES MUTATIONS
  // ==========================================
  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    const nextStatus = !currentReadStatus;
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: nextStatus } : m))
    );
    await toggleMessageReadAction(id, nextStatus);
  };

  const handleDeleteMsg = async (id: string) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await deleteMessageAction(id);
    showToast('Pesan berhasil dihapus');
  };

  const handleRefreshAnalytics = async () => {
    setIsRefreshingAnalytics(true);
    try {
      const fresh = await getAnalyticsSummaryAction();
      setAnalytics(fresh);
      showToast('Data telemetri & analitik diperbarui');
    } catch {
      showToast('Gagal memuat analitik', 'error');
    } finally {
      setIsRefreshingAnalytics(false);
    }
  };

  const handleResetAnalytics = async () => {
    if (!confirm('Yakin ingin mereset seluruh log telemetri dan analitik?')) return;
    try {
      await resetAnalyticsAction();
      const fresh = await getAnalyticsSummaryAction();
      setAnalytics(fresh);
      showToast('Log analitik berhasil direset');
    } catch {
      showToast('Gagal mereset analitik', 'error');
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className={styles.adminWrapper}>
      {/* Top Navbar */}
      <header className={styles.topNav}>
        <div className={styles.brandWrap}>
          <div className={styles.brandBadge}>
            <Database size={14} />
            <span>PORTFOLIO CONSOLE</span>
          </div>
          <span className={styles.brandTitle}>DIMAR // ADMIN</span>
        </div>

        <div className={styles.topActions}>
          <Link href="/" target="_blank" className={`${styles.actionBtn} ${styles.btnViewSite}`}>
            <Eye size={15} />
            <span>Lihat Website</span>
            <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.actionBtn} ${styles.btnLogout}`}
          >
            <LogOut size={15} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className={styles.tabNavRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Sparkles size={16} />
          <span>Ringkasan</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderGit2 size={16} />
          <span>Proyek</span>
          <span className={styles.badgeCount}>{projects.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'media' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('media')}
        >
          <ImageIcon size={16} />
          <span>Foto &amp; CV</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'bio' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('bio')}
        >
          <User size={16} />
          <span>Biodata &amp; Hero</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'skills' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Layers size={16} />
          <span>Keahlian &amp; Skills</span>
          <span className={styles.badgeCount}>{skills.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <Mail size={16} />
          <span>Pesan Masuk</span>
          {unreadCount > 0 && <span className={styles.badgeAlert}>{unreadCount}</span>}
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'analytics' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Activity size={16} />
          <span>Telemetri &amp; Analitik</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.contentContainer}>
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Selamat Datang, {profile.call_name}!</h2>
                <p className={styles.sectionSub}>
                  Panel kendali portofolio terhubung langsung dengan Supabase PostgreSQL &amp; Vercel.
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>
                  <FolderGit2 size={24} />
                </div>
                <div>
                  <div className={styles.metricVal}>{projects.length}</div>
                  <div className={styles.metricLabel}>Total Proyek Showcase</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                  <Layers size={24} />
                </div>
                <div>
                  <div className={styles.metricVal}>{skills.length}</div>
                  <div className={styles.metricLabel}>Kompetensi &amp; Tech Arsenal</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <div className={styles.metricVal}>{messages.length}</div>
                  <div className={styles.metricLabel}>
                    Pesan Masuk ({unreadCount} belum dibaca)
                  </div>
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className={styles.glassCard}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} style={{ color: 'var(--neon-cyan)' }} />
                Status Koneksi Database &amp; Deployment
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
                Portofolio Anda telah dikonfigurasi dengan Supabase URL (<code>{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Terkonfigurasi di .env.local'}</code>). Setiap perubahan data yang Anda simpan di panel ini akan langsung tersimpan di Supabase dan mengupdate cache Vercel secara otomatis menggunakan <code>revalidatePath</code>.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setActiveTab('projects')}
                >
                  <FolderGit2 size={16} />
                  <span>Kelola Proyek</span>
                </button>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setActiveTab('bio')}
                >
                  <User size={16} />
                  <span>Edit Biodata &amp; Hero</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROJECTS */}
        {/* ========================================================= */}
        {activeTab === 'projects' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Manajemen Proyek Portofolio</h2>
                <p className={styles.sectionSub}>
                  Tambah, perbarui, atau hapus karya rekayasa web yang ditampilkan di halaman utama.
                </p>
              </div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleOpenAddProject}
              >
                <Plus size={16} />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            <div className={styles.gridCards}>
              {projects.map((proj) => (
                <div key={proj.id} className={styles.projectAdminCard}>
                  <div>
                    <div className={styles.projectCardTop}>
                      <span style={{ fontSize: '1.6rem' }}>{proj.icon || '🚀'}</span>
                      <span className={styles.projectCategoryBadge}>{proj.category}</span>
                    </div>

                    <h3 className={styles.projectCardTitle} style={{ marginTop: '0.75rem' }}>
                      {proj.title}
                    </h3>
                    <p className={styles.projectDesc} style={{ marginTop: '0.5rem' }}>
                      {proj.shortDesc}
                    </p>

                    <div className={styles.techTagList} style={{ marginTop: '0.75rem' }}>
                      {proj.tech.map((t, idx) => (
                        <span key={idx} className={styles.techTag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardActionRow}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleOpenEditProject(proj)}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className={styles.btnDanger}
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: MEDIA & BERKAS (FOTO UTAMA & CV) */}
        {/* ========================================================= */}
        {activeTab === 'media' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Media &amp; Berkas Utama</h2>
                <p className={styles.sectionSub}>
                  Ubah foto profil utama di Hero 3D dan perbarui berkas CV resmi (PDF). Perubahan akan langsung aktif secara real-time di seluruh website.
                </p>
              </div>
            </div>

            <div className={styles.mediaGrid}>
              {/* Card 1: Foto Profil Utama */}
              <div className={styles.mediaCard}>
                <div className={styles.mediaCardHeader}>
                  <span className={styles.mediaCardTitle}>
                    <ImageIcon size={18} style={{ color: 'var(--neon-cyan)' }} />
                    Foto Profil Utama (Hero 3D)
                  </span>
                  <span className={styles.mediaStatusBadge}>
                    <span className={styles.pulseDot} />
                    Live di Hero
                  </span>
                </div>

                <div className={styles.mediaPreviewContainer}>
                  <div className={styles.mediaAvatarWrap}>
                    <Image
                      src={avatarPreview || profile.avatar_url || '/images/dimar.jpg'}
                      alt="Pratinjau Foto Profil"
                      fill
                      sizes="90px"
                      style={{ objectFit: 'cover' }}
                      priority
                      unoptimized
                    />
                  </div>
                  <div className={styles.mediaMetaInfo}>
                    <span className={styles.mediaMetaTitle}>
                      {avatarFile ? avatarFile.name : (profile.avatar_url?.split('/').pop()?.split('?')[0] || 'dimar.jpg')}
                    </span>
                    <span>Format: JPG, PNG, WebP (Maks 5MB)</span>
                    <span>Status: {avatarFile ? 'Foto baru dipilih (belum disimpan)' : 'Foto saat ini aktif di website'}</span>
                    {profile.avatar_url && profile.avatar_url !== '/images/dimar.jpg' && (
                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          fontSize: '0.75rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          marginTop: '0.25rem',
                        }}
                      >
                        Reset ke foto default asli
                      </button>
                    )}
                  </div>
                </div>

                {/* Dropzone / File Picker */}
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarSelect}
                />

                <div
                  className={`${styles.mediaDropzone} ${avatarFile ? styles.mediaDropzoneActive : ''}`}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <UploadCloud size={28} className={styles.dropzoneIcon} />
                  <span className={styles.dropzoneText}>
                    {avatarFile ? 'Ganti foto yang dipilih' : 'Klik untuk memilih foto baru dari komputer'}
                  </span>
                  <span className={styles.dropzoneSub}>
                    Rekomendasi: Foto formal/semi-formal rasio 3:4 atau 1:1 resolusi tinggi
                  </span>
                </div>

                {avatarFile && (
                  <div className={styles.fileSelectedBadge}>
                    <span>📷 {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className={styles.mediaActionRow}>
                  <button
                    type="button"
                    className={styles.mediaUploadBtn}
                    disabled={!avatarFile || isUploadingAvatar}
                    onClick={handleUploadAvatar}
                  >
                    {isUploadingAvatar ? (
                      <>
                        <RefreshCw size={16} className={styles.spin} />
                        <span>Mengunggah Foto...</span>
                      </>
                    ) : (
                      <>
                        <FileUp size={16} />
                        <span>Simpan &amp; Terapkan Foto</span>
                      </>
                    )}
                  </button>
                  {avatarFile && (
                    <button
                      type="button"
                      className={styles.mediaCancelBtn}
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Berkas CV Resmi (PDF) */}
              <div className={styles.mediaCard}>
                <div className={styles.mediaCardHeader}>
                  <span className={styles.mediaCardTitle}>
                    <FileText size={18} style={{ color: '#34d399' }} />
                    Berkas CV Resmi (PDF)
                  </span>
                  <span className={styles.mediaStatusBadge}>
                    <span className={styles.pulseDot} />
                    Siap Diunduh
                  </span>
                </div>

                <div className={styles.mediaPreviewContainer}>
                  <div className={styles.mediaCvWrap}>
                    <FileCheck size={36} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>PDF</span>
                  </div>
                  <div className={styles.mediaMetaInfo}>
                    <span className={styles.mediaMetaTitle}>
                      {cvFile ? cvFile.name : 'CV_Muhammad_Jihan_Dimar.pdf'}
                    </span>
                    <span>Format: Adobe PDF Document (.pdf)</span>
                    <span>
                      Diperbarui:{' '}
                      {profile.cv_last_updated
                        ? new Date(profile.cv_last_updated).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Bawaan Sistem'}
                    </span>
                    <a
                      href={profile.cv_url || '/cv/CV_Muhammad_Jihan_Dimar.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mediaTestLink}
                    >
                      <ExternalLink size={13} />
                      <span>Uji Buka / Unduh Berkas Aktif</span>
                    </a>
                  </div>
                </div>

                {/* Dropzone / File Picker */}
                <input
                  type="file"
                  ref={cvInputRef}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleCvSelect}
                />

                <div
                  className={`${styles.mediaDropzone} ${cvFile ? styles.mediaDropzoneActive : ''}`}
                  onClick={() => cvInputRef.current?.click()}
                >
                  <FileUp size={28} style={{ color: '#34d399' }} />
                  <span className={styles.dropzoneText}>
                    {cvFile ? 'Ganti file PDF yang dipilih' : 'Klik untuk memilih file PDF CV baru'}
                  </span>
                  <span className={styles.dropzoneSub}>
                    Maksimal 15MB. Otomatis terhubung ke tombol unduh di Navbar, Hero, &amp; Terminal.
                  </span>
                </div>

                {cvFile && (
                  <div className={styles.fileSelectedBadge} style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}>
                    <span>📄 {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className={styles.mediaActionRow}>
                  <button
                    type="button"
                    className={styles.mediaUploadBtn}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #00f2fe 100%)' }}
                    disabled={!cvFile || isUploadingCv}
                    onClick={handleUploadCv}
                  >
                    {isUploadingCv ? (
                      <>
                        <RefreshCw size={16} className={styles.spin} />
                        <span>Mengunggah CV...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} />
                        <span>Simpan &amp; Terapkan CV Baru</span>
                      </>
                    )}
                  </button>
                  {cvFile && (
                    <button
                      type="button"
                      className={styles.mediaCancelBtn}
                      onClick={() => setCvFile(null)}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BIODATA & HERO */}
        {/* ========================================================= */}
        {activeTab === 'bio' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Biodata &amp; Identitas Pengembang</h2>
                <p className={styles.sectionSub}>
                  Perbarui teks perkenalan, peran typing dinamis di hero, profil lulusan TKJ, dan tautan sosial.
                </p>
              </div>
            </div>

            {/* Quick Media Jump Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.05)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ImageIcon size={22} style={{ color: 'var(--neon-cyan)' }} />
                <div>
                  <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.92rem', display: 'block' }}>
                    Foto Profil Utama &amp; Berkas CV
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    Ingin mengganti foto wajah di Hero atau file CV PDF? Buka tab Media untuk upload langsung.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                onClick={() => setActiveTab('media')}
              >
                Buka Pengelola Foto &amp; CV &rarr;
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.glassCard}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nama Lengkap</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nama Panggilan</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.call_name}
                    onChange={(e) => setProfile({ ...profile, call_name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Sekolah Asal</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.school}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Tahun Kelulusan &amp; Jurusan</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={`${profile.grad_year} • ${profile.major}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('•');
                      setProfile({
                        ...profile,
                        grad_year: parts[0]?.trim() || profile.grad_year,
                        major: parts[1]?.trim() || profile.major,
                      });
                    }}
                  />
                </div>

                {/* Rotating Roles in Hero */}
                <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                  <label className={styles.fieldLabel}>
                    Peran Berputar / Typing Roles di Hero (Ditampilkan bergantian secara otomatis)
                  </label>
                  <div className={styles.responsiveActionRow}>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Contoh: Cloud Engineer, DevOps Specialist..."
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRole();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={handleAddRole}
                    >
                      <Plus size={16} />
                      <span>Tambah Role</span>
                    </button>
                  </div>

                  <div className={styles.chipContainer}>
                    {profile.roles.map((role, idx) => (
                      <div key={idx} className={styles.chip}>
                        <span>{role}</span>
                        <button
                          type="button"
                          className={styles.chipRemove}
                          onClick={() => handleRemoveRole(role)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio Description */}
                <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                  <label className={styles.fieldLabel}>Deskripsi Paragraf Hero</label>
                  <textarea
                    className={styles.fieldTextarea}
                    rows={4}
                    value={profile.bio_description}
                    onChange={(e) =>
                      setProfile({ ...profile, bio_description: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Social Links */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>URL GitHub</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.social_links.github}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, github: e.target.value },
                      })
                    }
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>URL LinkedIn</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.social_links.linkedin}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, linkedin: e.target.value },
                      })
                    }
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>URL Instagram</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={profile.social_links.instagram}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, instagram: e.target.value },
                      })
                    }
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nomor WhatsApp</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    placeholder="Contoh: 6282312345678 atau https://wa.me/6282312345678"
                    value={profile.social_links.whatsapp}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, whatsapp: e.target.value },
                      })
                    }
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    Masukkan nomor saja (628xxx) atau URL lengkap wa.me. Kode negara wajib (62 untuk Indonesia).
                  </small>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Alamat Email</label>
                  <input
                    type="email"
                    className={styles.fieldInput}
                    value={profile.social_links.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, email: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isSaving} className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>{isSaving ? 'Menyimpan ke Supabase...' : 'Simpan Perubahan Biodata'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SKILLS */}
        {/* ========================================================= */}
        {activeTab === 'skills' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Manajemen Keahlian &amp; Tech Stack</h2>
                <p className={styles.sectionSub}>
                  Atur daftar teknologi, ikon, kategori, dan slider persentase penguasaan (0 - 100%).
                </p>
              </div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleOpenAddSkill}
              >
                <Plus size={16} />
                <span>Tambah Keahlian Baru</span>
              </button>
            </div>

            <div className={styles.skillsAdminGrid}>
              {skills.map((skill) => (
                <div key={skill.id || skill.name} className={styles.skillItemCard}>
                  <div className={styles.skillTop}>
                    <div className={styles.skillName}>
                      <span>{skill.icon || '⚡'}</span>
                      <span>{skill.name}</span>
                    </div>
                    <span className={styles.skillLevelBadge}>{skill.level}%</span>
                  </div>

                  <div className={styles.skillProgressTrack}>
                    <div
                      className={styles.skillProgressBar}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {skill.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      {skill.category}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleOpenEditSkill(skill)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        onClick={() => handleDeleteSkill(skill.id, skill.name)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MESSAGES */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Kotak Pesan Kontak</h2>
                <p className={styles.sectionSub}>
                  Daftar pesan dan tawaran kolaborasi yang dikirim pengunjung melalui form website.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className={styles.glassCard} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <Mail size={40} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Belum Ada Pesan Masuk
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                  Setiap pesan yang dikirim lewat form kontak akan otomatis tersimpan di sini.
                </p>
              </div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageCard} ${!msg.is_read ? styles.messageUnread : ''}`}
                  >
                    <div className={styles.messageHeader}>
                      <div>
                        <div className={styles.senderName}>{msg.name}</div>
                        <a href={`mailto:${msg.email}`} className={styles.senderEmail}>
                          {msg.email}
                        </a>
                      </div>
                      <div className={styles.messageDate}>
                        {new Date(msg.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>

                    <div className={styles.messageSubject}>Subjek: {msg.subject}</div>
                    <div className={styles.messageBody}>{msg.message}</div>

                    <div className={styles.messageActions}>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={() => handleToggleRead(msg.id, msg.is_read)}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      >
                        {msg.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                      </button>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        onClick={() => handleDeleteMsg(msg.id)}
                      >
                        <Trash2 size={14} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TELEMETRI & ANALYTICS                             */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionHeading}>Telemetri Sistem &amp; Analitik Pengunjung</h2>
                <p className={styles.sectionSub}>
                  Pantau metrik kunjungan, unduhan CV, interaksi terminal hacker, dan minat proyek secara real-time.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={handleRefreshAnalytics}
                  disabled={isRefreshingAnalytics}
                  style={{ gap: '0.4rem' }}
                >
                  <RefreshCw size={15} className={isRefreshingAnalytics ? 'animate-spin' : ''} />
                  <span>{isRefreshingAnalytics ? 'Memuat...' : 'Segarkan Data'}</span>
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={handleResetAnalytics}
                  style={{ gap: '0.4rem' }}
                >
                  <Trash2 size={15} />
                  <span>Reset Log</span>
                </button>
              </div>
            </div>

            {/* Top 5 Metrics Cards */}
            <div className={styles.metricsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>
                  <Eye size={22} />
                </div>
                <div>
                  <div className={styles.metricVal}>{analytics?.totalPageViews || 0}</div>
                  <div className={styles.metricLabel}>Total Kunjungan Web</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                  <Download size={22} />
                </div>
                <div>
                  <div className={styles.metricVal}>{analytics?.totalCvDownloads || 0}</div>
                  <div className={styles.metricLabel}>Unduhan Berkas CV</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                  <MousePointerClick size={22} />
                </div>
                <div>
                  <div className={styles.metricVal}>{analytics?.totalProjectClicks || 0}</div>
                  <div className={styles.metricLabel}>Interaksi Proyek</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15' }}>
                  <TerminalIcon size={22} />
                </div>
                <div>
                  <div className={styles.metricVal}>{analytics?.totalTerminalOpens || 0}</div>
                  <div className={styles.metricLabel}>Buka Terminal CLI</div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricIconWrap} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div className={styles.metricVal}>{analytics?.conversionRate || 0}%</div>
                  <div className={styles.metricLabel}>
                    Konversi Kontak ({analytics?.totalContactSubmissions || 0} pesan)
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Breakdown Grid */}
            <div className={styles.analyticsGrid}>
              {/* Device Ratio */}
              <div className={styles.glassCard}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Monitor size={17} style={{ color: '#00f2fe' }} />
                  <span>Rasio Perangkat Pengunjung</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Proporsi pengguna yang mengakses melalui komputer (desktop) vs ponsel pintar (mobile).
                </p>

                <div className={styles.deviceRatioBar}>
                  <div
                    className={styles.deviceBarDesktop}
                    style={{ width: `${analytics?.deviceBreakdown.desktopPercent || 50}%` }}
                    title={`Desktop: ${analytics?.deviceBreakdown.desktopPercent || 0}%`}
                  />
                  <div
                    className={styles.deviceBarMobile}
                    style={{ width: `${analytics?.deviceBreakdown.mobilePercent || 50}%` }}
                    title={`Mobile: ${analytics?.deviceBreakdown.mobilePercent || 0}%`}
                  />
                </div>

                <div className={styles.deviceLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ background: '#00f2fe' }} />
                    <Monitor size={14} />
                    <span>Desktop: <strong>{analytics?.deviceBreakdown.desktop || 0}</strong> ({analytics?.deviceBreakdown.desktopPercent || 0}%)</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ background: '#ec4899' }} />
                    <Smartphone size={14} />
                    <span>Mobile: <strong>{analytics?.deviceBreakdown.mobile || 0}</strong> ({analytics?.deviceBreakdown.mobilePercent || 0}%)</span>
                  </div>
                </div>

                {/* CV Sources */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    Distribusi Sumber Unduh CV:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{analytics?.cvSources.hero || 0}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Hero Section</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{analytics?.cvSources.navbar || 0}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Navbar Web</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#facc15' }}>{analytics?.cvSources.terminal || 0}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Terminal CLI</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Projects */}
              <div className={styles.glassCard}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <BarChart3 size={17} style={{ color: '#c084fc' }} />
                  <span>Proyek Paling Banyak Dilihat</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Peringkat proyek yang paling sering diklik atau dieksplorasi oleh pengunjung.
                </p>

                {(!analytics?.topProjects || analytics.topProjects.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
                    Belum ada data klik proyek tercatat.
                  </div>
                ) : (
                  <div className={styles.rankingList}>
                    {analytics.topProjects.map((tp, idx) => (
                      <div key={tp.id || idx} className={styles.rankingItem}>
                        <span className={styles.rankingRank}>#{idx + 1}</span>
                        <span className={styles.rankingName}>{tp.title}</span>
                        <span className={styles.rankingCount}>{tp.count} klik</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Visitor Activity Feed */}
            <div className={styles.glassCard}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Activity size={17} style={{ color: '#34d399' }} />
                <span>Riwayat Log Aktivitas Pengunjung (Real-Time)</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>
                Catatan event telemetri terkini yang dipancarkan secara otomatis oleh browser pengunjung.
              </p>

              {(!analytics?.recentEvents || analytics.recentEvents.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b', fontSize: '0.88rem' }}>
                  Belum ada aktivitas tercatat. Buka website publik untuk mulai merekam telemetri.
                </div>
              ) : (
                <div className={styles.eventFeedList}>
                  {analytics.recentEvents.map((evt) => {
                    let badgeClass = styles.badgePageView;
                    let badgeLabel = 'KUNJUNGAN';
                    if (evt.event_type === 'cv_download') {
                      badgeClass = styles.badgeCvDownload;
                      badgeLabel = 'UNDUH CV';
                    } else if (evt.event_type === 'project_click') {
                      badgeClass = styles.badgeProjectClick;
                      badgeLabel = 'KLIK PROYEK';
                    } else if (evt.event_type === 'terminal_open') {
                      badgeClass = styles.badgeTerminalOpen;
                      badgeLabel = 'TERMINAL';
                    } else if (evt.event_type === 'contact_submit') {
                      badgeClass = styles.badgeContactSubmit;
                      badgeLabel = 'PESAN KONTAK';
                    }

                    const data = evt.event_data || {};
                    const detail =
                      (data.title as string) ||
                      (data.projectTitle as string) ||
                      (data.path as string) ||
                      (data.source ? `Sumber: ${data.source}` : '') ||
                      JSON.stringify(data);

                    return (
                      <div key={evt.id} className={styles.eventFeedItem}>
                        <span className={`${styles.eventBadge} ${badgeClass}`}>
                          {badgeLabel}
                        </span>
                        <span className={styles.eventDetail}>
                          {detail} {data.device ? `• ${data.device}` : ''}
                        </span>
                        <span className={styles.eventTime}>
                          {new Date(evt.created_at).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: PROJECT EDITOR */}
      {/* ========================================================= */}
      {projectModalOpen && editingProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProject.id.startsWith('proj-') ? 'Tambah Proyek Baru' : 'Edit Proyek'}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setProjectModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProjectModal}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Ikon Emoji / Simbol</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editingProject.icon}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, icon: e.target.value })
                      }
                      placeholder="Contoh: 🌐, ⚡, 🛡️, 🎮"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Kategori</label>
                    <select
                      className={styles.fieldSelect}
                      value={editingProject.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as 'fullstack' | 'frontend' | 'backend',
                        })
                      }
                    >
                      <option value="fullstack">Fullstack</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                    </select>
                  </div>

                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Judul Proyek</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Deskripsi Singkat (Short Desc)</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={2}
                      value={editingProject.shortDesc}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortDesc: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Tech stack */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Tech Stack Tags</label>
                    <div className={styles.responsiveActionRow}>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        placeholder="Contoh: Next.js, Three.js, PostgreSQL"
                        value={techTagInput}
                        onChange={(e) => setTechTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTechTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={handleAddTechTag}
                      >
                        Tambah Tag
                      </button>
                    </div>
                    <div className={styles.chipContainer}>
                      {editingProject.tech.map((t, idx) => (
                        <div key={idx} className={styles.chip}>
                          <span>{t}</span>
                          <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={() => handleRemoveTechTag(t)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Live URL (Demo)</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editingProject.liveUrl}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, liveUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>GitHub URL (Repository)</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editingProject.githubUrl}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, githubUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Detail Overview</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={2}
                      value={editingProject.details.overview}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          details: { ...editingProject.details, overview: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Detail Arsitektur</label>
                    <textarea
                      className={styles.fieldTextarea}
                      rows={2}
                      value={editingProject.details.architecture}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          details: { ...editingProject.details, architecture: e.target.value },
                        })
                      }
                    />
                  </div>

                  {/* Features */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label className={styles.fieldLabel}>Fitur Unggulan</label>
                    <div className={styles.responsiveActionRow}>
                      <input
                        type="text"
                        className={styles.fieldInput}
                        placeholder="Contoh: Visualisasi topologi 3D real-time..."
                        value={featureItemInput}
                        onChange={(e) => setFeatureItemInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeatureItem();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={handleAddFeatureItem}
                      >
                        Tambah Fitur
                      </button>
                    </div>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      {editingProject.details.features.map((feat, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setProjectModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Proyek'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SKILL EDITOR */}
      {/* ========================================================= */}
      {skillModalOpen && editingSkill && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ maxWidth: '480px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingSkill.id?.startsWith('skill-') ? 'Tambah Keahlian' : 'Edit Keahlian'}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSkillModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSkillModal}>
              <div className={styles.modalBody}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Nama Teknologi / Keahlian</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Ikon Emoji / Simbol</label>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={editingSkill.icon}
                    onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                    placeholder="Contoh: ⚡, ⚛️, 🚀, 🐧"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Kategori</label>
                  <select
                    className={styles.fieldSelect}
                    value={editingSkill.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setEditingSkill({
                        ...editingSkill,
                        category: e.target.value as 'frontend' | 'backend' | 'networking',
                      })
                    }
                  >
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend &amp; Database</option>
                    <option value="networking">Networking &amp; Sysadmin (TKJ)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.fieldLabel}>Tingkat Penguasaan (Level %)</label>
                    <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>
                      {editingSkill.level}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingSkill.level}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, level: parseInt(e.target.value, 10) })
                    }
                    style={{ width: '100%', accentColor: '#22d3ee', cursor: 'pointer' }}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Deskripsi Singkat</label>
                  <textarea
                    className={styles.fieldTextarea}
                    rows={2}
                    value={editingSkill.desc}
                    onChange={(e) => setEditingSkill({ ...editingSkill, desc: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setSkillModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className={styles.btnPrimary}>
                  <Save size={16} />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Keahlian'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.toastSuccess : styles.toastError
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
