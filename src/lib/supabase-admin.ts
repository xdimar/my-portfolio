/**
 * supabase-admin.ts
 * Server-side ONLY Supabase client using the service role key.
 * This bypasses all Row Level Security policies — use ONLY in API routes.
 * NEVER import this file in any client component ('use client').
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let adminInstance: SupabaseClient | null = null;

/**
 * Returns a Supabase client authenticated as service role.
 * Returns null when env vars are missing (graceful degradation).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[supabase-admin] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
    return null;
  }
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken:  false,
        persistSession:    false,
        detectSessionInUrl: false,
      },
    });
  }
  return adminInstance;
}

// ── Storage bucket names ──────────────────────────────────────────────────────
export const BUCKET_AVATARS = 'portfolio-avatars';
export const BUCKET_CV      = 'portfolio-cv';

/**
 * Ensures a public storage bucket exists; creates it if not.
 * Uses service role to bypass RLS.
 */
export async function ensureBucket(
  client: SupabaseClient,
  bucketName: string
): Promise<void> {
  const { data: buckets } = await client.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucketName);
  if (!exists) {
    const { error } = await client.storage.createBucket(bucketName, {
      public:               true,
      fileSizeLimit:        20 * 1024 * 1024, // 20 MB hard cap
      allowedMimeTypes:     bucketName === BUCKET_AVATARS
        ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        : ['application/pdf'],
    });
    if (error) {
      throw new Error(`Gagal membuat bucket "${bucketName}": ${error.message}`);
    }
  }
}
