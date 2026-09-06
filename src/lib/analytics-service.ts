import fs from 'fs';
import path from 'path';
import { getSupabase } from './supabase';
import { AnalyticsEvent, AnalyticsEventType, AnalyticsSummary } from '@/types/analytics';

const LOCAL_ANALYTICS_FILE = path.join(process.cwd(), 'src', 'data', 'local-analytics.json');

function readLocalAnalytics(): AnalyticsEvent[] {
  try {
    if (!fs.existsSync(LOCAL_ANALYTICS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LOCAL_ANALYTICS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalAnalytics(events: AnalyticsEvent[]) {
  try {
    const dir = path.dirname(LOCAL_ANALYTICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Cap at 500 latest events for file performance
    const trimmed = events.slice(0, 500);
    fs.writeFileSync(LOCAL_ANALYTICS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Gagal menulis local-analytics.json:', err);
  }
}

export async function recordAnalyticsEvent(
  eventType: AnalyticsEventType,
  eventData: Record<string, unknown> = {}
): Promise<{ success: boolean; id?: string }> {
  const supabase = getSupabase();
  let supabaseId: string | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_analytics')
        .insert({
          event_type: eventType,
          event_data: eventData,
        })
        .select('id')
        .single();

      if (!error && data?.id) {
        supabaseId = data.id;
      }
    } catch {
      // Graceful fallback to local storage
    }
  }

  const newEvent: AnalyticsEvent = {
    id: supabaseId || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event_type: eventType,
    event_data: eventData,
    created_at: new Date().toISOString(),
  };

  try {
    const currentList = readLocalAnalytics();
    currentList.unshift(newEvent);
    writeLocalAnalytics(currentList);
  } catch (err) {
    console.warn('Gagal mencadangkan event analitik ke lokal:', err);
  }

  return { success: true, id: newEvent.id };
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const localList = readLocalAnalytics();
  const supabase = getSupabase();

  if (!supabase) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error || !data) {
      return localList;
    }

    const sbList: AnalyticsEvent[] = data.map((row: { id: string; event_type: AnalyticsEventType; event_data?: Record<string, unknown>; created_at: string }) => ({
      id: row.id,
      event_type: row.event_type,
      event_data: row.event_data || {},
      created_at: row.created_at,
    }));

    // Deduplicate by ID
    const eventMap = new Map<string, AnalyticsEvent>();
    sbList.forEach((e) => eventMap.set(e.id, e));
    localList.forEach((e) => {
      if (!eventMap.has(e.id)) {
        eventMap.set(e.id, e);
      }
    });

    return Array.from(eventMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch {
    return localList;
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await getAnalyticsEvents();

  let totalPageViews = 0;
  let totalCvDownloads = 0;
  let totalProjectClicks = 0;
  let totalTerminalOpens = 0;
  let totalContactSubmissions = 0;

  const deviceCounts = { desktop: 0, mobile: 0 };
  const projectMap = new Map<string, { id: string; title: string; count: number }>();
  const cvSources = { hero: 0, navbar: 0, terminal: 0, other: 0 };

  for (const evt of events) {
    const data = evt.event_data || {};

    if (data.device === 'mobile') {
      deviceCounts.mobile++;
    } else if (data.device === 'desktop') {
      deviceCounts.desktop++;
    }

    switch (evt.event_type) {
      case 'page_view':
        totalPageViews++;
        break;
      case 'cv_download':
        totalCvDownloads++;
        if (data.source === 'hero') cvSources.hero++;
        else if (data.source === 'navbar') cvSources.navbar++;
        else if (data.source === 'terminal') cvSources.terminal++;
        else cvSources.other++;
        break;
      case 'project_click': {
        totalProjectClicks++;
        const pId = (data.projectId as string) || 'unknown';
        const pTitle = (data.projectTitle as string) || (data.title as string) || 'Proyek Portofolio';
        const existing = projectMap.get(pId) || { id: pId, title: pTitle, count: 0 };
        existing.count++;
        projectMap.set(pId, existing);
        break;
      }
      case 'terminal_open':
        totalTerminalOpens++;
        break;
      case 'contact_submit':
        totalContactSubmissions++;
        break;
    }
  }

  const totalDevices = deviceCounts.desktop + deviceCounts.mobile;
  const desktopPercent = totalDevices > 0 ? Math.round((deviceCounts.desktop / totalDevices) * 100) : 50;
  const mobilePercent = totalDevices > 0 ? 100 - desktopPercent : 50;

  const topProjects = Array.from(projectMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const conversionRate =
    totalPageViews > 0
      ? Number(((totalContactSubmissions / totalPageViews) * 100).toFixed(1))
      : 0;

  return {
    totalPageViews,
    totalCvDownloads,
    totalProjectClicks,
    totalTerminalOpens,
    totalContactSubmissions,
    conversionRate,
    deviceBreakdown: {
      desktop: deviceCounts.desktop,
      mobile: deviceCounts.mobile,
      desktopPercent,
      mobilePercent,
    },
    topProjects,
    cvSources,
    recentEvents: events.slice(0, 30),
  };
}

export async function resetAnalyticsData(): Promise<{ success: boolean }> {
  writeLocalAnalytics([]);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('portfolio_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch {}
  }

  return { success: true };
}
