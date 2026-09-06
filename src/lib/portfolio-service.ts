import fs from 'fs';
import path from 'path';
import { getSupabase } from './supabase';
import { sendNotificationEmail } from './email-service';
import { recordAnalyticsEvent } from './analytics-service';
import {
  FullPortfolioData,
  ProfileData,
  ProjectItem,
  SkillItem,
  TimelineItem,
  ContactMessage,
} from '@/types/portfolio';
import {
  defaultPortfolioData,
  defaultProfile,
  defaultProjects,
  defaultSkills,
  defaultTimeline,
} from '@/data/defaultData';

interface ProjectDbRow {
  id: string;
  title: string;
  category: 'fullstack' | 'frontend' | 'backend';
  icon?: string;
  short_desc?: string;
  tech?: string[];
  live_url?: string;
  github_url?: string;
  details?: {
    overview: string;
    architecture: string;
    features: string[];
  };
  order_index?: number;
}

interface SkillDbRow {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'networking';
  level: number;
  icon?: string;
  desc?: string;
  description?: string;
  color_grad?: string | null;
  order_index?: number;
}

interface TimelineDbRow {
  id: string;
  year: string;
  institution: string;
  title: string;
  text: string;
  tags?: string[];
  order_index?: number;
}

interface MessageDbRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

// Local storage paths
const LOCAL_MESSAGES_FILE = path.join(process.cwd(), 'src', 'data', 'local-messages.json');
const LOCAL_PORTFOLIO_FILE = path.join(process.cwd(), 'src', 'data', 'local-portfolio.json');

function readLocalMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(LOCAL_MESSAGES_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LOCAL_MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

function writeLocalMessages(messages: ContactMessage[]) {
  try {
    const dir = path.dirname(LOCAL_MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Gagal menulis local-messages.json:', err);
  }
}

function readLocalPortfolio(): FullPortfolioData {
  try {
    if (!fs.existsSync(LOCAL_PORTFOLIO_FILE)) {
      return defaultPortfolioData;
    }
    const raw = fs.readFileSync(LOCAL_PORTFOLIO_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile || defaultProfile,
      projects: parsed.projects?.length ? parsed.projects : defaultProjects,
      skills: parsed.skills?.length ? parsed.skills : defaultSkills,
      timeline: parsed.timeline?.length ? parsed.timeline : defaultTimeline,
    };
  } catch {
    return defaultPortfolioData;
  }
}

function writeLocalPortfolio(data: FullPortfolioData) {
  try {
    const dir = path.dirname(LOCAL_PORTFOLIO_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_PORTFOLIO_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Gagal menulis local-portfolio.json:', err);
  }
}

export async function getPortfolioData(): Promise<FullPortfolioData> {
  const localData = readLocalPortfolio();
  const supabase = getSupabase();

  if (!supabase) {
    return localData;
  }

  try {
    const [profileRes, projectsRes, skillsRes, timelineRes] = await Promise.all([
      supabase.from('portfolio_profile').select('*').eq('id', 'main').single(),
      supabase.from('portfolio_projects').select('*').order('order_index', { ascending: true }),
      supabase.from('portfolio_skills').select('*').order('order_index', { ascending: true }),
      supabase.from('portfolio_timeline').select('*').order('order_index', { ascending: true }),
    ]);

    let profile: ProfileData = localData.profile;
    if (profileRes.data && !profileRes.error) {
      profile = {
        id: profileRes.data.id,
        name: profileRes.data.name || localData.profile.name,
        call_name: profileRes.data.call_name || localData.profile.call_name,
        school: profileRes.data.school || localData.profile.school,
        grad_year: profileRes.data.grad_year || localData.profile.grad_year,
        major: profileRes.data.major || localData.profile.major,
        roles: Array.isArray(profileRes.data.roles) ? profileRes.data.roles : localData.profile.roles,
        bio_description: profileRes.data.bio_description || localData.profile.bio_description,
        avatar_url: profileRes.data.avatar_url || localData.profile.avatar_url || '/images/dimar.jpg',
        cv_url: profileRes.data.cv_url || localData.profile.cv_url || '/cv/CV_Muhammad_Jihan_Dimar.pdf',
        cv_last_updated: profileRes.data.cv_last_updated || localData.profile.cv_last_updated,
        stats: profileRes.data.stats || localData.profile.stats,
        social_links: profileRes.data.social_links || localData.profile.social_links,
      };
    }

    let projects: ProjectItem[] = localData.projects;
    if (projectsRes.data && projectsRes.data.length > 0 && !projectsRes.error) {
      projects = (projectsRes.data as ProjectDbRow[]).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        icon: item.icon || '🌐',
        shortDesc: item.short_desc || '',
        tech: Array.isArray(item.tech) ? item.tech : [],
        liveUrl: item.live_url || '#',
        githubUrl: item.github_url || '#',
        details: item.details || { overview: '', architecture: '', features: [] },
        orderIndex: item.order_index ?? 0,
      }));
    }

    let skills: SkillItem[] = localData.skills;
    if (skillsRes.data && skillsRes.data.length > 0 && !skillsRes.error) {
      skills = (skillsRes.data as SkillDbRow[]).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        level: item.level,
        icon: item.icon || '⚡',
        desc: item.description || item.desc || '',
        colorGrad: item.color_grad || undefined,
        orderIndex: item.order_index ?? 0,
      }));
    }

    let timeline: TimelineItem[] = localData.timeline;
    if (timelineRes.data && timelineRes.data.length > 0 && !timelineRes.error) {
      timeline = (timelineRes.data as TimelineDbRow[]).map((item) => ({
        id: item.id,
        year: item.year,
        institution: item.institution,
        title: item.title,
        text: item.text,
        tags: Array.isArray(item.tags) ? item.tags : [],
        orderIndex: item.order_index ?? 0,
      }));
    }

    const combined: FullPortfolioData = { profile, projects, skills, timeline };
    // Synchronize to local backup cache
    writeLocalPortfolio(combined);
    return combined;
  } catch (err) {
    console.warn('Supabase query error, menggunakan data lokal:', err);
    return localData;
  }
}

// ==========================================
// ADMIN MUTATION OPERATIONS
// ==========================================

export async function upsertProfile(profile: ProfileData): Promise<{ success: boolean; error?: string }> {
  // 1. Always update local storage
  const current = readLocalPortfolio();
  current.profile = profile;
  writeLocalPortfolio(current);

  // 2. Update Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_profile').upsert({
        id: 'main',
        name: profile.name,
        call_name: profile.call_name,
        school: profile.school,
        grad_year: profile.grad_year,
        major: profile.major,
        roles: profile.roles,
        bio_description: profile.bio_description,
        avatar_url: profile.avatar_url,
        cv_url: profile.cv_url,
        cv_last_updated: profile.cv_last_updated,
        stats: profile.stats,
        social_links: profile.social_links,
        updated_at: new Date().toISOString(),
      });
    } catch (err: unknown) {
      console.warn('Gagal menyimpan profil ke Supabase (tersimpan lokal):', err);
    }
  }

  return { success: true };
}

export async function upsertProject(project: ProjectItem): Promise<{ success: boolean; error?: string }> {
  // 1. Always update local storage
  const current = readLocalPortfolio();
  const existingIdx = current.projects.findIndex((p) => p.id === project.id);
  if (existingIdx >= 0) {
    current.projects[existingIdx] = project;
  } else {
    current.projects.push(project);
  }
  writeLocalPortfolio(current);

  // 2. Update Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_projects').upsert({
        id: project.id,
        title: project.title,
        category: project.category,
        icon: project.icon,
        short_desc: project.shortDesc,
        tech: project.tech,
        live_url: project.liveUrl,
        github_url: project.githubUrl,
        details: project.details,
        order_index: project.orderIndex ?? 0,
      });
    } catch (err: unknown) {
      console.warn('Gagal menyimpan proyek ke Supabase (tersimpan lokal):', err);
    }
  }

  return { success: true };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  // 1. Always update local storage
  const current = readLocalPortfolio();
  current.projects = current.projects.filter((p) => p.id !== id);
  writeLocalPortfolio(current);

  // 2. Update Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_projects').delete().eq('id', id);
    } catch (err: unknown) {
      console.warn('Gagal menghapus proyek di Supabase (dihapus lokal):', err);
    }
  }

  return { success: true };
}

export async function upsertSkill(skill: SkillItem): Promise<{ success: boolean; error?: string }> {
  const id = skill.id || skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const skillWithId = { ...skill, id };

  // 1. Always update local storage
  const current = readLocalPortfolio();
  const existingIdx = current.skills.findIndex((s) => s.id === id || s.name === skill.name);
  if (existingIdx >= 0) {
    current.skills[existingIdx] = skillWithId;
  } else {
    current.skills.push(skillWithId);
  }
  writeLocalPortfolio(current);

  // 2. Update Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_skills').upsert({
        id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon,
        description: skill.desc,
        color_grad: skill.colorGrad || null,
        order_index: skill.orderIndex ?? 0,
      });
    } catch (err: unknown) {
      console.warn('Gagal menyimpan keahlian di Supabase (tersimpan lokal):', err);
    }
  }

  return { success: true };
}

export async function deleteSkill(id: string): Promise<{ success: boolean; error?: string }> {
  // 1. Always update local storage
  const current = readLocalPortfolio();
  current.skills = current.skills.filter((s) => s.id !== id);
  writeLocalPortfolio(current);

  // 2. Update Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_skills').delete().eq('id', id);
    } catch (err: unknown) {
      console.warn('Gagal menghapus keahlian di Supabase (dihapus lokal):', err);
    }
  }

  return { success: true };
}

// ==========================================
// MESSAGES OPERATIONS (DUAL STORAGE)
// ==========================================

export async function getContactMessages(): Promise<ContactMessage[]> {
  const localList = readLocalMessages();
  const supabase = getSupabase();

  if (!supabase) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localList;
    }

    const sbList: ContactMessage[] = (data as MessageDbRow[]).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      created_at: m.created_at,
      is_read: m.is_read ?? false,
    }));

    // Deduplicate: If Supabase is connected and working, sbList is primary.
    // A local message is only included if it does NOT already exist in Supabase:
    // 1) Same ID, OR
    // 2) Same email, same message content, and timestamp within 30 minutes
    const isDuplicateOfSupabase = (localMsg: ContactMessage) => {
      return sbList.some((sb) => {
        if (sb.id === localMsg.id) return true;
        const sameEmail =
          sb.email?.toLowerCase().trim() === localMsg.email?.toLowerCase().trim();
        const sameMessage = sb.message?.trim() === localMsg.message?.trim();
        if (sameEmail && sameMessage) {
          const timeDiff = Math.abs(
            new Date(sb.created_at).getTime() - new Date(localMsg.created_at).getTime()
          );
          if (timeDiff < 1000 * 60 * 30) return true;
        }
        return false;
      });
    };

    const uniqueLocal = localList.filter((m) => !isDuplicateOfSupabase(m));

    const merged = [...sbList, ...uniqueLocal].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return merged;
  } catch {
    return localList;
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  let supabaseRecordId: string | null = null;

  // 1. Try writing to Supabase first if connected
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_messages')
        .insert({
          name: payload.name,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
        })
        .select('id, created_at')
        .single();

      if (!error && data?.id) {
        supabaseRecordId = data.id;
      } else if (error) {
        console.warn('Gagal insert ke Supabase portfolio_messages:', error.message);
      }
    } catch (sbErr) {
      console.warn('Supabase portfolio_messages table belum siap, menyimpan ke lokal:', sbErr);
    }
  }

  // 2. Local storage persistence:
  // If Supabase assigned an ID (UUID), reuse that exact ID for local storage mirror!
  // If Supabase wasn't available, generate a fallback local ID.
  const newMsg: ContactMessage = {
    id: supabaseRecordId || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    created_at: new Date().toISOString(),
    is_read: false,
  };

  try {
    const currentList = readLocalMessages();
    const alreadyExists = currentList.some(
      (m) =>
        m.id === newMsg.id ||
        (m.email.toLowerCase() === newMsg.email.toLowerCase() &&
          m.message === newMsg.message &&
          Math.abs(new Date(m.created_at).getTime() - new Date(newMsg.created_at).getTime()) < 60000)
    );
    if (!alreadyExists) {
      currentList.unshift(newMsg);
      writeLocalMessages(currentList);
    }
  } catch (localErr) {
    console.warn('Gagal menyimpan pesan lokal:', localErr);
  }

  // 3. Trigger email notification to ddimar74@gmail.com (asynchronous, non-blocking)
  sendNotificationEmail({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
  }).catch((err) => {
    console.warn('Background email dispatch error:', err);
  });

  // 4. Record analytics event
  recordAnalyticsEvent('contact_submit', {
    name: payload.name,
    subject: payload.subject,
  }).catch(() => {});

  return { success: true };
}

export async function toggleMessageRead(id: string, isRead: boolean): Promise<{ success: boolean }> {
  // Update local
  try {
    const list = readLocalMessages();
    const updated = list.map((m) => (m.id === id ? { ...m, is_read: isRead } : m));
    writeLocalMessages(updated);
  } catch {}

  // Update Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_messages').update({ is_read: isRead }).eq('id', id);
    } catch {}
  }

  return { success: true };
}

export async function deleteMessage(id: string): Promise<{ success: boolean }> {
  // Delete local
  try {
    const list = readLocalMessages();
    const filtered = list.filter((m) => m.id !== id);
    writeLocalMessages(filtered);
  } catch {}

  // Delete Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_messages').delete().eq('id', id);
    } catch {}
  }

  return { success: true };
}
