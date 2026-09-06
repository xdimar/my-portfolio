import { NextRequest, NextResponse } from 'next/server';
import { recordAnalyticsEvent, getAnalyticsSummary } from '@/lib/analytics-service';
import { AnalyticsEventType } from '@/types/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, eventData } = body;

    const allowedEvents: AnalyticsEventType[] = [
      'page_view',
      'cv_download',
      'project_click',
      'terminal_open',
      'contact_submit',
    ];

    if (!eventType || !allowedEvents.includes(eventType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing eventType' },
        { status: 400 }
      );
    }

    // Auto-detect user agent device if not provided
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const enrichedData = {
      device: isMobile ? 'mobile' : 'desktop',
      ...eventData,
    };

    const result = await recordAnalyticsEvent(eventType, enrichedData);
    return NextResponse.json({ success: true, id: result.id });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mencatat analitik' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json({ success: true, summary });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memuat ringkasan analitik' },
      { status: 500 }
    );
  }
}
