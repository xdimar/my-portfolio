import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPortfolioData, getContactMessages } from '@/lib/portfolio-service';
import { getAnalyticsSummary } from '@/lib/analytics-service';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session_token');

  if (!token || token.value !== 'dimar_authenticated_session_active') {
    redirect('/admin/login');
  }

  const [portfolioData, messages, analytics] = await Promise.all([
    getPortfolioData(),
    getContactMessages(),
    getAnalyticsSummary(),
  ]);

  return (
    <AdminDashboardClient
      initialData={portfolioData}
      initialMessages={messages}
      initialAnalytics={analytics}
    />
  );
}
