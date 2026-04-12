import { PrismaClient, Role, LeadStatus, DealType, Stage } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Setup User
  const user = await prisma.user.upsert({
    where: { email: 'test@ignitera.com' },
    update: {},
    create: {
      email: 'test@ignitera.com',
      name: 'Test Sales User',
      role: Role.SALES,
    },
  });

  console.log('Created test user:', user.name);

  // Setup Leads
  const lead1 = await prisma.lead.create({
    data: {
      companyName: 'Sample EC Retail Inc.',
      websiteUrl: 'https://example.com/ec',
      industry: 'Retail',
      companySize: '11-50',
      source: 'outbound',
      status: LeadStatus.NEW,
      fitScore: 85,
      painHypothesis: 'Mobile load time is over 5s, likely high cart abandonment.',
      ownerUserId: user.id,
    },
  });

  console.log('Created lead 1:', lead1.companyName);

  // Setup Account & Opportunities (To simulate a converted lead)
  const account1 = await prisma.account.create({
    data: {
      legalName: 'Yamashiroya Corp',
      displayName: 'Yamashiroya',
      ecFlag: true,
      ownerUserId: user.id,
    },
  });

  const opp1 = await prisma.opportunity.create({
    data: {
      accountId: account1.id,
      title: 'Yamashiroya EC CVR Improvement',
      dealType: DealType.EC_IMPROVEMENT,
      stage: Stage.PROPOSAL,
      amount: 450000,
      probability: 60,
      ownerUserId: user.id,
      nextActionDueAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      nextAction: 'Send final proposal PDF',
    },
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      accountId: account1.id,
      title: 'New Landing Page for High-End Product',
      dealType: DealType.LP_CREATION,
      stage: Stage.DISCOVERY,
      amount: 250000,
      probability: 30,
      ownerUserId: user.id,
      nextActionDueAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // Overdue (2 days ago)
      nextAction: 'Confirm required assets for LP',
    },
  });

  console.log('Created opportunities:', opp1.title, opp2.title);

  // Setup Tasks
  await prisma.task.create({
    data: {
      title: 'Follow up with Sample EC',
      leadId: lead1.id,
      assignedUserId: user.id,
      createdByUserId: user.id,
      dueAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday (overdue)
      status: 'OPEN',
    }
  });

  console.log('Created overdue task');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
