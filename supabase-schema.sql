-- ============================================================
-- SUPABASE SCHEMA FOR MUHAMMAD JIHAN DIMAR PORTFOLIO
-- Jalankan skrip ini di SQL Editor di dashboard Supabase Anda
-- URL: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Tabel Profile & Biodata
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT 'MUHAMMAD JIHAN DIMAR',
  call_name TEXT NOT NULL DEFAULT 'Dimar',
  school TEXT NOT NULL DEFAULT 'SMK NU Sunan Ampel Poncokusumo',
  grad_year TEXT NOT NULL DEFAULT '2021',
  major TEXT NOT NULL DEFAULT 'Teknik Komputer dan Jaringan (TKJ)',
  roles JSONB NOT NULL DEFAULT '["Fullstack Developer", "Frontend Specialist", "Backend Architect", "TKJ & Network Alumnus"]'::jsonb,
  bio_description TEXT NOT NULL,
  stats JSONB NOT NULL,
  social_links JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fullstack', 'frontend', 'backend')),
  icon TEXT NOT NULL DEFAULT '🌐',
  short_desc TEXT NOT NULL,
  tech JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT DEFAULT '#',
  github_url TEXT DEFAULT '#',
  details JSONB NOT NULL DEFAULT '{"overview":"","architecture":"","features":[]}'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Skills
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'networking')),
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  icon TEXT NOT NULL DEFAULT '⚡',
  description TEXT NOT NULL,
  color_grad TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Timeline / Perjalanan Karir & Edukasi
CREATE TABLE IF NOT EXISTS portfolio_timeline (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL,
  institution TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Pesan Kontak Pengunjung
CREATE TABLE IF NOT EXISTS portfolio_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabel Telemetri & Analitik Pengunjung
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'page_view', 'cv_download', 'project_click', 'terminal_open', 'contact_submit'
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- Izinkan publik membaca data portofolio
CREATE POLICY "Public profile read" ON portfolio_profile FOR SELECT USING (true);
CREATE POLICY "Public projects read" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public skills read" ON portfolio_skills FOR SELECT USING (true);
CREATE POLICY "Public timeline read" ON portfolio_timeline FOR SELECT USING (true);

-- Izinkan publik mengirim pesan kontak
CREATE POLICY "Public contact insert" ON portfolio_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public contact select" ON portfolio_messages FOR SELECT USING (true);
CREATE POLICY "Public contact update" ON portfolio_messages FOR UPDATE USING (true);
CREATE POLICY "Public contact delete" ON portfolio_messages FOR DELETE USING (true);

-- Izinkan publik mencatat & membaca data telemetri analitik
CREATE POLICY "Public analytics insert" ON portfolio_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public analytics select" ON portfolio_analytics FOR SELECT USING (true);
CREATE POLICY "Public analytics delete" ON portfolio_analytics FOR DELETE USING (true);

-- Izinkan modifikasi data portofolio (diotentikasi & diamankan di level Server Next.js)
CREATE POLICY "Admin profile modify" ON portfolio_profile FOR ALL USING (true);
CREATE POLICY "Admin projects modify" ON portfolio_projects FOR ALL USING (true);
CREATE POLICY "Admin skills modify" ON portfolio_skills FOR ALL USING (true);
CREATE POLICY "Admin timeline modify" ON portfolio_timeline FOR ALL USING (true);

-- ============================================================
-- SEED DATA AWAL (Data Portofolio Muhammad Jihan Dimar)
-- ============================================================

-- Profile
INSERT INTO portfolio_profile (id, name, call_name, school, grad_year, major, roles, bio_description, stats, social_links)
VALUES (
  'main',
  'MUHAMMAD JIHAN DIMAR',
  'Dimar',
  'SMK NU Sunan Ampel Poncokusumo',
  '2021',
  'Teknik Komputer dan Jaringan (TKJ)',
  '["Fullstack Developer", "Frontend Specialist", "Backend Architect", "TKJ & Network Alumnus"]'::jsonb,
  'Biasa dipanggil Dimar. Lulusan SMK NU Sunan Ampel Poncokusumo 2021 jurusan Teknik Komputer dan Jaringan (TKJ). Memiliki antusiasme mendalam dalam dunia pemrograman Frontend & Backend—menggabungkan logika pemahaman arsitektur jaringan komputer dengan rekayasa web modern untuk menciptakan aplikasi digital yang cepat, tangguh, dan bernilai guna tinggi.',
  '{"year": "2021", "label1": "Alumni SMK NU Sunan Ampel", "role": "Fullstack", "label2": "Frontend & Backend", "background": "TKJ", "label3": "Network & Sysadmin Base"}'::jsonb,
  '{"github": "https://github.com", "linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "whatsapp": "https://wa.me/", "email": "contact@dimar.dev"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio_description = EXCLUDED.bio_description,
  updated_at = now();

-- Projects
INSERT INTO portfolio_projects (id, title, category, icon, short_desc, tech, live_url, github_url, details, order_index)
VALUES 
(
  'dimarcloud',
  'DimarCloud • Network Topology & Server Monitor',
  'fullstack',
  '🌐',
  'Platform visualisasi real-time topologi jaringan komputer dan status server live dengan WebGL 3D dan WebSockets.',
  '["Next.js 15", "Three.js", "Node.js", "WebSockets", "Chart.js"]'::jsonb,
  '#',
  'https://github.com',
  '{"overview": "Mengawinkan keilmuan Teknik Komputer dan Jaringan (TKJ) dengan rekayasa web fullstack. Sistem ini memvisualisasikan paket data jaringan secara 3D, memantau utilisasi bandwidth, latensi ping, status port terbuka, dan uptime server secara real-time.", "architecture": "Frontend Next.js merender node jaringan 3D via Three.js yang terhubung dengan WebSocket streaming dari backend Node.js. Mengumpulkan statistik CPU, RAM, dan I/O throughput server Linux.", "features": ["Visualisasi topologi router, switch, dan client secara 3D interaktif", "Streaming telemetri real-time dengan socket latensi rendah", "Deteksi anomali jaringan dan notifikasi packet drop otomatis", "Dashboard analitik performa server dengan multi-device responsive view"]}'::jsonb,
  1
),
(
  'cybercommerce',
  'CyberCommerce • High-Performance E-Commerce',
  'fullstack',
  '⚡',
  'Aplikasi belanja modern dengan Server Components Next.js, manajemen state responsif, dan checkout terintegrasi.',
  '["Next.js", "TypeScript", "React 19", "PostgreSQL", "Stripe/Midtrans"]'::jsonb,
  '#',
  'https://github.com',
  '{"overview": "Platform e-commerce kecepatan tinggi yang dibangun untuk pengalaman checkout yang mulus. Mengutamakan Core Web Vitals, SSR untuk SEO produk, serta filter instan multi-kategori.", "architecture": "Database PostgreSQL dengan relational schema produk & transaksi. Backend Next.js API routes dengan validasi payload Zod dan enkripsi token session aman.", "features": ["Render instan produk dengan Server-Side Rendering (SSR)", "Pencarian dan filter multi-atribut real-time tanpa reload", "Keranjang belanja reaktif dengan optimistic updates", "Sistem manajemen inventori dan webhook konfirmasi pesanan"]}'::jsonb,
  2
),
(
  'sentinelapi',
  'Sentinel • Secure Microservice REST API Hub',
  'backend',
  '🛡️',
  'Arsitektur backend tangguh berstandar enterprise dengan proteksi JWT, role-based access control, dan Redis caching.',
  '["Node.js", "Express.js", "PostgreSQL", "Redis", "Docker"]'::jsonb,
  '#',
  'https://github.com',
  '{"overview": "Mesin backend handal yang dirancang untuk melayani ribuan request per detik dengan proteksi berlapis, sanitasi input, dan caching dinamis.", "architecture": "Struktur MVC / modular clean architecture. Memisahkan controller, service layer, dan data repository. Dilengkapi audit logging dan endpoint health-check otomatis.", "features": ["Autentikasi berlapis JWT dengan refresh token rotation", "Role-Based Access Control (RBAC: Admin, Operator, User)", "Redis in-memory caching untuk mengurangi query overhead ke database hingga 70%", "Rate-limiting dan perlindungan serangan brute-force / DDoS dasar"]}'::jsonb,
  3
),
(
  'aura3d',
  'Aura3D • Immersive WebGL Shader & Audio Canvas',
  'frontend',
  '🎮',
  'Eksperimen visual interaktif 3D WebGL dengan Web Audio API visualizer yang merespons irama suara dan mouse gravitasi.',
  '["Three.js", "WebGL", "GLSL Shaders", "Web Audio API", "CSS3"]'::jsonb,
  '#',
  'https://github.com',
  '{"overview": "Eksplorasi antarmuka masa depan (next-gen frontend) yang menggabungkan render grafis 3D realtime dengan pemrosesan sinyal frekuensi audio.", "architecture": "Pure Three.js canvas dengan custom vertex & fragment shaders untuk menghasilkan gelombang partikel dinamis pada 60 frame per detik tanpa membebani GPU klien.", "features": ["Pemrosesan Fast Fourier Transform (FFT) dari audio input secara realtime", "Animasi partikel 3D dengan interaksi gravitasi kursor pengguna", "Performa teroptimasi penuh untuk perangkat mobile dan desktop", "Audio synth ambient generator berbasis Web Audio API"]}'::jsonb,
  4
)
ON CONFLICT (id) DO NOTHING;

-- Skills
INSERT INTO portfolio_skills (id, name, category, level, icon, description, order_index)
VALUES
('nextjs', 'Next.js 15+ (App Router)', 'frontend', 90, '⚡', 'Server Components, SSR/SSG, routing cepat, integrasi API, dan arsitektur performa tinggi.', 1),
('react', 'React.js & Hooks', 'frontend', 92, '⚛️', 'Pembuatan komponen modular, custom hooks, reactive state, dan lifecycle optimization.', 2),
('typescript', 'TypeScript & JavaScript (ES6+)', 'frontend', 88, '📘', 'Type safety, async/await, closures, modern ES features, dan clean code structure.', 3),
('threejs', 'Three.js & 3D WebGL', 'frontend', 82, '🎮', 'Render 3D scenes interaktif, particle constellation, camera control, dan optimasi 60fps.', 4),
('css', 'Responsive CSS & Glassmorphism', 'frontend', 94, '🎨', 'Mobile-first styling, CSS animations, design tokens, dan antarmuka futuristik.', 5),
('nodejs', 'Node.js & Express.js', 'backend', 88, '🚀', 'REST API, middleware, asynchronous event-loop handling, dan error handling terstruktur.', 6),
('rdbms', 'Relational DB (MySQL & PostgreSQL)', 'backend', 86, '🗄️', 'Relational schema design, query indexing, normalisasi data, dan ORM/query builder.', 7),
('jwt', 'RESTful API & JWT Security', 'backend', 90, '🛡️', 'Token-based authentication, password hashing bcrypt, CORS, dan rate-limiting.', 8),
('mongodb', 'MongoDB & NoSQL', 'backend', 80, '🍃', 'Document-oriented database, flexible schema modeling, dan aggregations.', 9),
('linux', 'Linux Server (Ubuntu / Debian)', 'networking', 89, '🐧', 'CLI navigation, SSH management, daemon systemd, file permissions, dan web server setup.', 10),
('tcpip', 'Networking & TCP/IP Protocol', 'networking', 92, '🌐', 'Pondasi SMK NU Sunan Ampel: subnetting IPv4, DNS resolving, port mapping, dan traffic analysis.', 11),
('mikrotik', 'Mikrotik & Routing Fundamentals', 'networking', 85, '📡', 'Bandwidth management, firewall NAT rules, queue tree, dan konfigurasi gateway.', 12),
('git', 'Git & Version Control', 'networking', 90, '📦', 'Branching workflow, merge conflicts resolution, CI/CD automated deployment basics.', 13)
ON CONFLICT (id) DO NOTHING;

-- Timeline
INSERT INTO portfolio_timeline (id, year, institution, title, text, tags, order_index)
VALUES
(
  'smk-nu',
  '2018 — 2021 (LULUS)',
  'SMK NU Sunan Ampel Poncokusumo',
  'Teknik Komputer dan Jaringan (TKJ)',
  'Menempa fondasi pemikiran teknik dan logika komputasi. Menguasai arsitektur jaringan komputer, routing protokol, subnetting IP, konfigurasi Linux Debian/Ubuntu Server, manajemen bandwidth Mikrotik, hingga pemeliharaan sistem perangkat keras. Menjadi batu loncatan yang melatih pemahaman esensial tentang bagaimana data terkirim antar server di dunia nyata.',
  '["🌐 TCP/IP & DNS", "🐧 Linux Server", "📡 Mikrotik Routing", "🔧 Network Troubleshooting"]'::jsonb,
  1
),
(
  'self-taught',
  '2021 — 2023',
  'Independent Engineering',
  'Eksplorasi Algoritma & Backend Engineering',
  'Melangkah dari instalasi jaringan fisik ke rekayasa perangkat lunak. Mempelajari JavaScript/TypeScript secara mendalam, memahami pola arsitektur backend, RESTful API design, relasi database (MySQL & PostgreSQL), serta manajemen autentikasi JWT.',
  '["⚙️ JavaScript / TS", "🗄️ MySQL & PostgreSQL", "🛡️ REST APIs", "📦 Git & GitHub"]'::jsonb,
  2
),
(
  'fullstack-specialist',
  '2023 — SEKARANG',
  'Next-Gen Web Architecture',
  'Fullstack Web Developer (Frontend & Backend)',
  'Membangun ekosistem aplikasi web modern skala penuh menggunakan Next.js App Router, React, Three.js WebGL untuk pengalaman interaktif 3D, serta backend Node.js yang cepat dan handal. Berfokus pada kecepatan muat, responsivitas multi-device, dan estetika visual kelas atas.',
  '["⚡ Next.js 15+", "⚛️ React & State", "🎮 Three.js 3D", "🚀 Node.js Architecture"]'::jsonb,
  3
)
ON CONFLICT (id) DO NOTHING;
