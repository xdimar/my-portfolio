export interface ProfileData {
  id: string;
  name: string;
  call_name: string;
  school: string;
  grad_year: string;
  major: string;
  roles: string[];
  bio_description: string;
  avatar_url?: string;
  cv_url?: string;
  cv_last_updated?: string;
  stats: {
    year: string;
    label1: string;
    role: string;
    label2: string;
    background: string;
    label3: string;
  };
  social_links: {
    github: string;
    linkedin: string;
    instagram: string;
    whatsapp: string;
    email: string;
  };
}

export interface ProjectDetails {
  overview: string;
  architecture: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'fullstack' | 'frontend' | 'backend';
  icon: string;
  shortDesc: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  details: ProjectDetails;
  orderIndex?: number;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: 'frontend' | 'backend' | 'networking';
  level: number;
  icon: string;
  desc: string;
  colorGrad?: string;
  orderIndex?: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  institution: string;
  title: string;
  text: string;
  tags: string[];
  orderIndex?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface FullPortfolioData {
  profile: ProfileData;
  projects: ProjectItem[];
  skills: SkillItem[];
  timeline: TimelineItem[];
}
