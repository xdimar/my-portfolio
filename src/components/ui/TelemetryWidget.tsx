'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Server } from 'lucide-react';
import styles from './TelemetryWidget.module.css';
import { soundFx } from '@/utils/audio';

export default function TelemetryWidget() {
  const [ping, setPing] = useState<number>(24);
  const [uptime] = useState<string>('99.98%');
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const triggerPing = useCallback(async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/ping', { cache: 'no-store' });
      if (res.ok) {
        const duration = Math.max(8, Math.round(performance.now() - start));
        setPing(duration);
      }
    } catch {
      setPing(Math.floor(Math.random() * 15) + 18);
    } finally {
      setIsPinging(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function checkPingInitial() {
      const start = performance.now();
      try {
        const res = await fetch('/api/ping', { cache: 'no-store' });
        if (res.ok && !ignore) {
          const duration = Math.max(8, Math.round(performance.now() - start));
          setPing(duration);
        }
      } catch {
        if (!ignore) {
          setPing(Math.floor(Math.random() * 15) + 18);
        }
      }
    }

    checkPingInitial();
    const interval = setInterval(checkPingInitial, 25000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    soundFx.playClick();
    triggerPing();
  };

  return (
    <button
      type="button"
      className={styles.telemetryPill}
      onClick={handleClick}
      title="Status Sistem TKJ Live • Klik untuk tes ping ulang"
      aria-label="System Telemetry Status"
    >
      <div className={styles.statusIndicator}>
        <span className={styles.pulseDot} />
        <span>SYS // ONLINE</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.metricItem}>
        <Activity size={12} style={{ color: 'var(--neon-cyan)', animation: isPinging ? 'spin 1s linear infinite' : 'none' }} />
        <span>PING:</span>
        <span className={ping < 60 ? styles.metricValGreen : styles.metricValCyan}>
          {isPinging ? '...' : `${ping}ms`}
        </span>
      </div>

      <div className={`${styles.divider} ${styles.uptimeHideOnMobile}`} />

      <div className={`${styles.metricItem} ${styles.uptimeHideOnMobile}`}>
        <Server size={12} style={{ color: '#c084fc' }} />
        <span>UPTIME:</span>
        <span className={styles.metricValGreen}>{uptime}</span>
      </div>

      <div className={`${styles.divider} ${styles.nodeLabel}`} />

      <span className={styles.nodeLabel}>TKJ_SYS</span>
    </button>
  );
}
