import { PrismaClient } from '@prisma/client';
import { KanbanBoard } from '@/components/opportunities/KanbanBoard';
import { OpportunitiesHeader } from '@/components/opportunities/OpportunitiesHeader';

const prisma = new PrismaClient();

export default async function OpportunitiesPage() {
  const rawOpps = await prisma.opportunity.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { account: true, owner: true }
  });

  const opps = rawOpps.map((o: any) => ({
    ...o,
    amount: o.amount ? Number(o.amount) : null
  }));

  const accounts = await prisma.account.findMany({
    select: { id: true, displayName: true },
    orderBy: { displayName: 'asc' }
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <OpportunitiesHeader accounts={accounts} />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialOpportunities={opps} />
      </div>
    </div>
  );
}
