import { PrismaClient } from '@prisma/client';
import { KanbanBoard } from '@/components/opportunities/KanbanBoard';

const prisma = new PrismaClient();

export default async function OpportunitiesPage() {
  const rawOpps = await prisma.opportunity.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { account: true, owner: true }
  });

  const opps = rawOpps.map(o => ({
    ...o,
    amount: o.amount ? Number(o.amount) : null
  }));

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="p-8 pb-4 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Opportunities</h1>
            <p className="text-gray-500 text-sm mt-1">Drag and drop cases to update their stage.</p>
          </div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition">
            + New Opp
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialOpportunities={opps} />
      </div>
    </div>
  );
}
