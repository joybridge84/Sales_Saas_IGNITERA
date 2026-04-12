'use server'

import { PrismaClient, ActivityType, TaskStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addActivity(formData: FormData) {
  const leadId = formData.get('leadId') as string | null;
  const opportunityId = formData.get('opportunityId') as string | null;
  const activityType = formData.get('activityType') as ActivityType;
  const subject = formData.get('subject') as string;
  const detail = formData.get('detail') as string;
  const creatorId = formData.get('creatorId') as string;

  await prisma.activity.create({
    data: {
      leadId: leadId || undefined,
      opportunityId: opportunityId || undefined,
      activityType,
      subject,
      detail,
      happenedAt: new Date(),
      createdByUserId: creatorId,
    }
  });

  if (leadId) revalidatePath(`/leads/${leadId}`);
  if (opportunityId) revalidatePath(`/opportunities/${opportunityId}`);
}

export async function toggleTask(taskId: string, currentStatus: TaskStatus) {
  const newStatus = currentStatus === 'DONE' ? 'OPEN' : 'DONE';
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { 
      status: newStatus,
      completedAt: newStatus === 'DONE' ? new Date() : null
    }
  });

  if (task.leadId) revalidatePath(`/leads/${task.leadId}`);
  if (task.opportunityId) revalidatePath(`/opportunities/${task.opportunityId}`);
}
