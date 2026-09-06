import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    timestamp: Date.now(),
    node: 'TKJ_SYS_PONCOKUSUMO',
    protocol: 'HTTP/2',
    uptime: '99.98%',
  });
}
