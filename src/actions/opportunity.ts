'use server'

import { PrismaClient, Stage } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateOpportunityStage(id: string, stage: Stage) {
  await prisma.opportunity.update({
    where: { id },
    data: { stage }
  });
  revalidatePath('/opportunities');
}

export async function createOpportunity(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = Number(formData.get('amount')) || 0;
  const stage = formData.get('stage') as Stage || Stage.PROSPECTING;
  const accountId = formData.get('accountId') as string;

  // Find a default user
  const testUser = await prisma.user.findFirst({
    where: { email: 'test@ignitera.com' }
  });

  if (!testUser) throw new Error('Test user not found.');

  await prisma.opportunity.create({
    data: {
      title,
      amount,
      stage,
      accountId,
      ownerUserId: testUser.id,
      dealType: 'EC_IMPROVEMENT', // default
    }
  });

  revalidatePath('/opportunities');
  return { success: true };
}
