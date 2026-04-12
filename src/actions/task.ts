'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createQuickTask(formData: FormData) {
  const leadId = formData.get('leadId') as string | null;
  const opportunityId = formData.get('opportunityId') as string | null;
  const title = formData.get('title') as string;
  const creatorId = formData.get('creatorId') as string;
  const dueAtStr = formData.get('dueAt') as string;

  await prisma.task.create({
    data: {
      leadId: leadId || undefined,
      opportunityId: opportunityId || undefined,
      title,
      assignedUserId: creatorId,
      createdByUserId: creatorId,
      dueAt: dueAtStr ? new Date(dueAtStr) : new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Default 1 day later
      status: 'OPEN',
    }
  });

  if (leadId) revalidatePath(`/leads/${leadId}`);
  if (opportunityId) revalidatePath(`/opportunities/${opportunityId}`);
}
