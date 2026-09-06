'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useCyberTheme, THEME_OPTIONS, CyberTheme } from '@/context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

interface ThemeSwitcherProps {
  variant?: 'navbar' | 'mobile';
  onThemeSelect?: () => void;
}

export default function ThemeSwitcher({ variant = 'navbar', onThemeSelect }: ThemeSwitcherProps) {
  const { theme, setTheme } = useCyberTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSelect = (id: CyberTheme) => {
    setTheme(id);
    setDropdownOpen(false);
    if (onThemeSelect) onThemeSelect();
  };

  if (variant === 'mobile') {
    return (
      <div className={styles.mobileThemeRow}>
        <span className={styles.mobileThemeLabel}>
          <Palette size={13} style={{ color: 'var(--neon-cyan)' }} />
          Preset Tema Siber:
        </span>
        <div className={styles.mobileThemeGrid}>
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${styles.mobileThemeChip} ${opt.id === theme ? styles.active : ''}`}
              onClick={() => handleSelect(opt.id)}
            >
              <span
                className={styles.themeDot}
                style={{ backgroundColor: opt.color, color: opt.color }}
              />
              <span>{opt.name.replace('Cyber ', '')}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.switcherWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.switcherBtn}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title="Pilih Preset Tema Siber (Cyan, Matrix, Synthwave, Amber)"
        aria-label="Pilih Tema"
      >
        <span
          className={styles.themeDot}
          style={{ backgroundColor: activeOption.color, color: activeOption.color }}
        />
        <Palette size={14} />
      </button>

      {dropdownOpen && (
        <div className={styles.dropdownMenu}>
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${styles.themeOption} ${opt.id === theme ? styles.active : ''}`}
              onClick={() => handleSelect(opt.id)}
            >
              <div className={styles.optionLeft}>
                <span
                  className={styles.themeDot}
                  style={{ backgroundColor: opt.color, color: opt.color }}
                />
                <span>{opt.name}</span>
              </div>
              {opt.id === theme && <Check size={14} style={{ color: opt.color }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
