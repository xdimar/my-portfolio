'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  upsertProfile,
  upsertProject,
  deleteProject,
  upsertSkill,
  deleteSkill,
  toggleMessageRead,
  deleteMessage,
} from '@/lib/portfolio-service';
import { ProfileData, ProjectItem, SkillItem } from '@/types/portfolio';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session_token');
  if (!token || token.value !== 'dimar_authenticated_session_active') {
    throw new Error('Unauthorized: Akses ditolak');
  }
}

export async function updateProfileAction(profile: ProfileData) {
  await checkAdminAuth();
  const result = await upsertProfile(profile);
  if (result.success) {
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/admin', 'layout');
  }
  return result;
}

export async function saveProjectAction(project: ProjectItem) {
  await checkAdminAuth();
  const result = await upsertProject(project);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/admin');
  }
  return result;
}

export async function deleteProjectAction(id: string) {
  await checkAdminAuth();
  const result = await deleteProject(id);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/admin');
  }
  return result;
}

export async function saveSkillAction(skill: SkillItem) {
  await checkAdminAuth();
  const result = await upsertSkill(skill);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/admin');
  }
  return result;
}

export async function deleteSkillAction(id: string) {
  await checkAdminAuth();
  const result = await deleteSkill(id);
  if (result.success) {
    revalidatePath('/');
    revalidatePath('/admin');
  }
  return result;
}

import { getAnalyticsSummary, resetAnalyticsData } from '@/lib/analytics-service';

export async function toggleMessageReadAction(id: string, isRead: boolean) {
  await checkAdminAuth();
  const result = await toggleMessageRead(id, isRead);
  if (result.success) {
    revalidatePath('/admin');
  }
  return result;
}

export async function deleteMessageAction(id: string) {
  await checkAdminAuth();
  const result = await deleteMessage(id);
  if (result.success) {
    revalidatePath('/admin');
  }
  return result;
}

export async function getAnalyticsSummaryAction() {
  await checkAdminAuth();
  return await getAnalyticsSummary();
}

export async function resetAnalyticsAction() {
  await checkAdminAuth();
  const result = await resetAnalyticsData();
  if (result.success) {
    revalidatePath('/admin');
  }
  return result;
}
