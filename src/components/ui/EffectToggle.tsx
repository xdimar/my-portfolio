'use client';

import React, { useState } from 'react';
import { Layers, Cpu, Waves } from 'lucide-react';
import styles from './EffectToggle.module.css';
import { soundFx } from '@/utils/audio';

export type EffectType = 'cyber' | 'liquid';

const EFFECTS: { id: EffectType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id:    'cyber',
    label: 'Cyber Core',
    icon:  <Cpu size={14} />,
    desc:  'Wireframe 3D • Particle Network',
  },
  {
    id:    'liquid',
    label: 'Liquid Metal',
    icon:  <Waves size={14} />,
    desc:  'Wave Shader • Metallic Grid',
  },
];

interface EffectToggleProps {
  onChange?: (effect: EffectType) => void;
  current: EffectType;
}

export default function EffectToggle({ onChange, current }: EffectToggleProps) {
  const [open, setOpen] = useState(false);

  const select = (id: EffectType) => {
    soundFx.playClick();
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} role="region" aria-label="Background effect switcher">
      {/* Main pill trigger */}
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => { soundFx.playHover(); setOpen((o) => !o); }}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Switch background effect"
      >
        <Layers size={15} className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>BG Effect</span>
        <span className={styles.triggerCaret}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown panel */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="listbox"
        aria-label="Available background effects"
      >
        {EFFECTS.map((fx) => (
          <button
            key={fx.id}
            role="option"
            aria-selected={current === fx.id}
            className={`${styles.option} ${current === fx.id ? styles.optionActive : ''}`}
            onClick={() => select(fx.id)}
          >
            <span className={styles.optionIcon}>{fx.icon}</span>
            <span className={styles.optionText}>
              <span className={styles.optionLabel}>{fx.label}</span>
              <span className={styles.optionDesc}>{fx.desc}</span>
            </span>
            {current === fx.id && (
              <span className={styles.optionCheck} aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
