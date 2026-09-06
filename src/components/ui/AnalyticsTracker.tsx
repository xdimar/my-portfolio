'use client';

import { useEffect } from 'react';
import { AnalyticsEventType } from '@/types/analytics';

export function trackClientEvent(
  eventType: AnalyticsEventType,
  eventData: Record<string, unknown> = {}
) {
  try {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));

    const payload = {
      eventType,
      eventData: {
        path: typeof window !== 'undefined' ? window.location.pathname : '/',
        device: isMobile ? 'mobile' : 'desktop',
        screen:
          typeof window !== 'undefined'
            ? `${window.innerWidth}x${window.innerHeight}`
            : 'unknown',
        ...eventData,
      },
    };

    // Use sendBeacon if available, otherwise fetch
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export default function AnalyticsTracker() {
  useEffect(() => {
    // Record page view once per browser session
    const hasRecorded = sessionStorage.getItem('dimar_pv_tracked');
    if (!hasRecorded) {
      sessionStorage.setItem('dimar_pv_tracked', '1');
      trackClientEvent('page_view', {
        referrer: document.referrer || 'direct',
      });
    }

    // Global listener for data-analytics clicks
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-analytics]');
      if (target) {
        const eventType = target.getAttribute('data-analytics') as AnalyticsEventType;
        const source = target.getAttribute('data-analytics-source') || undefined;
        const title = target.getAttribute('data-analytics-title') || undefined;
        if (eventType) {
          trackClientEvent(eventType, { source, title });
        }
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
