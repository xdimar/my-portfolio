export type AnalyticsEventType =
  | 'page_view'
  | 'cv_download'
  | 'project_click'
  | 'terminal_open'
  | 'contact_submit';

export interface AnalyticsEvent {
  id: string;
  event_type: AnalyticsEventType;
  event_data: {
    path?: string;
    referrer?: string;
    device?: 'desktop' | 'mobile';
    browser?: string;
    projectId?: string;
    projectTitle?: string;
    source?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalCvDownloads: number;
  totalProjectClicks: number;
  totalTerminalOpens: number;
  totalContactSubmissions: number;
  conversionRate: number; // in percent
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    desktopPercent: number;
    mobilePercent: number;
  };
  topProjects: {
    id: string;
    title: string;
    count: number;
  }[];
  cvSources: {
    hero: number;
    navbar: number;
    terminal: number;
    other: number;
  };
  recentEvents: AnalyticsEvent[];
}
