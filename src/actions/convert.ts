'use server'

import { PrismaClient, LeadStatus, Stage, DealType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function convertLead(formData: FormData) {
  const leadId = formData.get('leadId') as string;
  const ownerUserId = formData.get('ownerUserId') as string;
  const companyName = formData.get('companyName') as string;
  
  // Minimal logic for Sprint 1
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Account
    const account = await tx.account.create({
      data: {
        legalName: companyName,
        displayName: companyName,
        ownerUserId: ownerUserId,
      }
    });

    // 2. Create Opportunity
    const opp = await tx.opportunity.create({
      data: {
        accountId: account.id,
        title: `${companyName} - New Opportunity`,
        dealType: DealType.EC_IMPROVEMENT, // default for MVP
        stage: Stage.PROSPECTING,
        amount: 0,
        ownerUserId: ownerUserId,
        sourceLeadId: leadId,
      }
    });

    // 3. Update Lead Status
    await tx.lead.update({
      where: { id: leadId },
      data: {
        status: LeadStatus.CONVERTED,
        convertedAccountId: account.id,
        convertedOppId: opp.id,
      }
    });

    // 4. Log Activity
    await tx.activity.create({
      data: {
        leadId,
        opportunityId: opp.id,
        activityType: 'NOTE',
        subject: 'Lead Converted',
        detail: `Converted to ${account.displayName}`,
        happenedAt: new Date(),
        createdByUserId: ownerUserId,
      }
    });

    return opp;
  });

  revalidatePath('/leads');
  revalidatePath('/opportunities');
  redirect('/opportunities');
}
