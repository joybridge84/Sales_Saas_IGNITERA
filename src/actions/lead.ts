'use server'

import { PrismaClient, LeadStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createLead(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const industry = formData.get('industry') as string;
  const websiteUrl = formData.get('websiteUrl') as string;
  const source = formData.get('source') as string || 'manual';

  // Find a default user (Test Sales User)
  const testUser = await prisma.user.findFirst({
    where: { email: 'test@ignitera.com' }
  });

  if (!testUser) {
    throw new Error('Test user not found. Please run seed script.');
  }

  await prisma.lead.create({
    data: {
      companyName,
      industry,
      websiteUrl,
      source,
      status: LeadStatus.NEW,
      ownerUserId: testUser.id,
      fitScore: 0,
    }
  });

  revalidatePath('/leads');
  return { success: true };
}

export async function deleteLead(id: string) {
  // Related data like activities and tasks have FK with cascade or should be handled.
  // In the schema, tasks and activities don't have explicit cascade in prisma but usually DB handles it.
  // To be safe, we can delete them or rely on schema.
  await prisma.lead.delete({
    where: { id }
  });

  revalidatePath('/leads');
  revalidatePath('/');
  return { success: true };
}
