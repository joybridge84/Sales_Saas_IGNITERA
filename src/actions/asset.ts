'use server'

import { PrismaClient, DealType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addProofAsset(formData: FormData) {
  const leadId = formData.get('leadId') as string | null;
  const title = formData.get('title') as string;
  const assetType = formData.get('assetType') as string;
  const url = formData.get('url') as string;
  const impactMetric = formData.get('impactMetric') as string;
  const summary = formData.get('summary') as string;

  await prisma.proofAsset.create({
    data: {
      leadId,
      title,
      assetType,
      url,
      impactMetric,
      summary: summary || 'No summary provided',
      dealType: DealType.EC_IMPROVEMENT, // default
    }
  });

  if (leadId) revalidatePath(`/leads/${leadId}`);
}
