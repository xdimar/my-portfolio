import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import path from 'path';
import { getPortfolioData, upsertProfile } from '@/lib/portfolio-service';
import {
  getSupabaseAdmin,
  ensureBucket,
  BUCKET_AVATARS,
  BUCKET_CV,
} from '@/lib/supabase-admin';

const COOKIE_NAME  = 'admin_session_token';
const TOKEN_VALUE  = 'dimar_authenticated_session_active';

// ─── MIME type helpers ────────────────────────────────────────────────────────
const MIME_MAP: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.pdf':  'application/pdf',
};

// ─── Local filesystem fallback (dev only) ─────────────────────────────────────
async function saveToLocalFs(
  buffer: Buffer,
  filename: string,
  subDir: string
): Promise<string> {
  // Dynamic import so the build doesn't pull fs into edge bundles
  const fs   = await import('fs');
  const dir  = path.join(process.cwd(), 'public', subDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/${subDir}/${filename}`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Authorize admin
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session || session.value !== TOKEN_VALUE) {
    return NextResponse.json(
      { success: false, message: 'Akses ditolak: Hanya admin terautentikasi yang dapat mengunggah file' },
      { status: 401 }
    );
  }

  // 2. Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal membaca form data. Pastikan request menggunakan multipart/form-data.' },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  if (!file || !type) {
    return NextResponse.json(
      { success: false, message: 'Parameter "file" dan "type" (avatar/cv) wajib disertakan' },
      { status: 400 }
    );
  }

  // 3. Read file into buffer
  const bytes     = await file.arrayBuffer();
  const buffer    = Buffer.from(bytes);
  const ext       = path.extname(file.name).toLowerCase();
  const timestamp = Date.now();
  const mimeType  = MIME_MAP[ext] || file.type || 'application/octet-stream';

  // 4. Determine storage mode: Supabase Storage (preferred) or local FS (fallback)
  const supabaseAdmin = getSupabaseAdmin();
  const useSupabase   = !!supabaseAdmin;

  try {
    // ─────────────────────────────────────────────────────────────────────────
    //  AVATAR UPLOAD
    // ─────────────────────────────────────────────────────────────────────────
    if (type === 'avatar') {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
      if (!allowed.includes(ext)) {
        return NextResponse.json(
          { success: false, message: `Format tidak didukung (${ext}). Gunakan JPG, PNG, atau WebP.` },
          { status: 400 }
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Ukuran foto melebihi batas 5 MB' },
          { status: 400 }
        );
      }

      let avatarUrl: string;

      if (useSupabase) {
        // ── Supabase Storage path ──────────────────────────────────────
        await ensureBucket(supabaseAdmin!, BUCKET_AVATARS);

        const storageFilename = `avatar-${timestamp}${ext}`;

        const { error: uploadError } = await supabaseAdmin!.storage
          .from(BUCKET_AVATARS)
          .upload(storageFilename, buffer, {
            contentType: mimeType,
            upsert:      true,
          });

        if (uploadError) {
          throw new Error(`Gagal upload ke Supabase Storage: ${uploadError.message}`);
        }

        const { data: urlData } = supabaseAdmin!.storage
          .from(BUCKET_AVATARS)
          .getPublicUrl(storageFilename);

        avatarUrl = urlData.publicUrl;
      } else {
        // ── Local filesystem fallback (dev without service role key) ───
        const filename = `avatar-${timestamp}${ext}`;
        await saveToLocalFs(buffer, filename, 'uploads');
        // Also overwrite the canonical dimar.jpg for immediate display
        await saveToLocalFs(buffer, 'dimar.jpg', 'images');
        avatarUrl = `/uploads/${filename}?v=${timestamp}`;
      }

      // Update profile
      const portfolio = await getPortfolioData();
      portfolio.profile.avatar_url = avatarUrl;
      await upsertProfile(portfolio.profile);

      revalidatePath('/');
      revalidatePath('/admin');

      return NextResponse.json({
        success:  true,
        type:     'avatar',
        url:      avatarUrl,
        storage:  useSupabase ? 'supabase' : 'local',
        size:     file.size,
        message:  'Foto profil utama berhasil diperbarui dan aktif di website!',
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  CV UPLOAD
    // ─────────────────────────────────────────────────────────────────────────
    if (type === 'cv') {
      if (ext !== '.pdf') {
        return NextResponse.json(
          { success: false, message: `Format tidak valid (${ext}). CV harus berformat PDF.` },
          { status: 400 }
        );
      }
      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Ukuran CV melebihi batas 15 MB' },
          { status: 400 }
        );
      }

      let cvUrl: string;
      const updatedAt = new Date().toISOString();

      if (useSupabase) {
        // ── Supabase Storage path ──────────────────────────────────────
        await ensureBucket(supabaseAdmin!, BUCKET_CV);

        // Always use a fixed canonical filename so all download links work
        const storageFilename = 'CV_Muhammad_Jihan_Dimar.pdf';

        const { error: uploadError } = await supabaseAdmin!.storage
          .from(BUCKET_CV)
          .upload(storageFilename, buffer, {
            contentType: 'application/pdf',
            upsert:      true,      // overwrite previous version
          });

        if (uploadError) {
          throw new Error(`Gagal upload CV ke Supabase Storage: ${uploadError.message}`);
        }

        const { data: urlData } = supabaseAdmin!.storage
          .from(BUCKET_CV)
          .getPublicUrl(storageFilename);

        // Add cache-busting param so browser downloads fresh version
        cvUrl = `${urlData.publicUrl}?v=${timestamp}`;
      } else {
        // ── Local filesystem fallback ───────────────────────────────────
        await saveToLocalFs(buffer, 'CV_Muhammad_Jihan_Dimar.pdf', 'cv');
        await saveToLocalFs(buffer, `cv-dimar-${timestamp}.pdf`, 'uploads');
        cvUrl = `/cv/CV_Muhammad_Jihan_Dimar.pdf?v=${timestamp}`;
      }

      // Update profile
      const portfolio = await getPortfolioData();
      portfolio.profile.cv_url          = cvUrl;
      portfolio.profile.cv_last_updated = updatedAt;
      await upsertProfile(portfolio.profile);

      revalidatePath('/');
      revalidatePath('/admin');

      return NextResponse.json({
        success:    true,
        type:       'cv',
        url:        cvUrl,
        storage:    useSupabase ? 'supabase' : 'local',
        size:       file.size,
        updatedAt,
        message:    'Berkas CV resmi berhasil diunggah dan aktif di semua tombol unduh website!',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Tipe tidak valid. Gunakan "avatar" atau "cv".' },
      { status: 400 }
    );

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan server saat mengunggah file';
    console.error('[upload/route] Error:', msg);
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

