'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '@/utils/audio';

export type CyberTheme = 'cyan' | 'matrix' | 'synthwave' | 'amber';

export interface ThemeOption {
  id: CyberTheme;
  name: string;
  badge: string;
  color: string;
  desc: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    badge: 'DEFAULT',
    color: '#00f2fe',
    desc: 'Deep Space Navy & Electric Cyan',
  },
  {
    id: 'matrix',
    name: 'Matrix Emerald',
    badge: 'HACKER',
    color: '#10b981',
    desc: 'Obsidian & Terminal Matrix Green',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Neon',
    badge: 'VAPOR',
    color: '#f72585',
    desc: 'Neon Magenta & Cyberpunk Violet',
  },
  {
    id: 'amber',
    name: 'Amber CRT',
    badge: 'RETRO',
    color: '#f59e0b',
    desc: 'Vintage Phosphor & Golden Amber',
  },
];

interface ThemeContextType {
  theme: CyberTheme;
  setTheme: (theme: CyberTheme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyan',
  setTheme: () => {},
  cycleTheme: () => {},
});

const STORAGE_KEY = 'dimar_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CyberTheme>('cyan');

  useEffect(() => {
    // Read saved theme from localStorage or data-theme attribute on root
    const saved = (localStorage.getItem(STORAGE_KEY) as CyberTheme) || 'cyan';
    if (['cyan', 'matrix', 'synthwave', 'amber'].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const setTheme = (newTheme: CyberTheme) => {
    soundFx.playClick();
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const cycleTheme = () => {
    const currentIndex = THEME_OPTIONS.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
    setTheme(THEME_OPTIONS[nextIndex].id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCyberTheme() {
  return useContext(ThemeContext);
}
