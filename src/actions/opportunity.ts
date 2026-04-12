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
