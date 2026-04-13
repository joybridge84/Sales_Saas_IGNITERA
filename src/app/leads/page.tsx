import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { User, Building2, Target, Calendar } from 'lucide-react';
import { LeadsHeader } from '@/components/leads/LeadsHeader';
import { DeleteLeadButton } from '@/components/leads/DeleteLeadButton';

const prisma = new PrismaClient();

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { owner: true }
  });

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      <LeadsHeader />

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead: any) => (
          <div key={lead.id} className="relative group">
            <Link 
              href={`/leads/${lead.id}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between pr-20"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg text-center leading-[48px]">
                  {lead.companyName.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lead.companyName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Building2 size={14} /> {lead.industry || 'Multi-sector'}</span>
                    <span className="flex items-center gap-1.5"><User size={14} /> {lead.owner?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">戦略ランク</div>
                    <div className={`text-xl font-black ${lead.fitScore > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                      {lead.fitScore}%
                    </div>
                </div>
                
                <div className="w-px h-10 bg-gray-100" />

                <div className="min-w-[120px]">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold block text-center
                      ${lead.status === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {lead.status === 'NEW' ? '新規' : lead.status === 'CONVERTED' ? '商談化済み' : lead.status}
                    </span>
                </div>
              </div>
            </Link>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <DeleteLeadButton id={lead.id} />
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-500">
            顧客データが見つかりません。シードスクリプトを実行するか、新規作成してください。
          </div>
        )}
      </div>
    </div>
  );
}
