import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { User, Building2, Target, Calendar } from 'lucide-react';

const prisma = new PrismaClient();

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { owner: true }
  });

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">顧客一覧</h1>
          <p className="text-gray-500 mt-1">新規リードの管理と商談化プロセスの追跡</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
          <Building2 size={18} />
          新規追加
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead: any) => (
          <Link 
            key={lead.id} 
            href={`/leads/${lead.id}`}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
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
