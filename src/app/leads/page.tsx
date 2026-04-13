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
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <LeadsHeader />

        <div className="grid grid-cols-1 gap-6">
          {leads.map((lead: any) => (
            <div key={lead.id} className="relative group">
              <Link 
                href={`/leads/${lead.id}`}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:border-blue-200 transition-all duration-500 flex items-center justify-between pr-32 relative overflow-hidden"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {lead.companyName.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <div className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors tracking-tighter">
                      {lead.companyName}
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-500">
                        <Building2 size={14} className="text-blue-500" /> {lead.industry || 'Multi-sector'}
                      </span>
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-500">
                        <User size={14} className="text-blue-500" /> {lead.owner?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 italic">FIT SCORE</div>
                      <div className={`text-3xl font-black ${lead.fitScore > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                        {lead.fitScore}%
                      </div>
                  </div>
                  
                  <div className="w-px h-12 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-500" />

                  <div className="min-w-[140px]">
                      <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest block text-center shadow-sm border
                        ${lead.status === 'NEW' ? 'bg-green-50 text-green-700 border-green-100' : 
                          lead.status === 'CONVERTED' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {lead.status === 'NEW' ? '新規リード' : lead.status === 'CONVERTED' ? '商談化済み' : lead.status}
                      </span>
                  </div>
                </div>

                {/* Decorative hover sparkle */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700" />
              </Link>
              
              <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                <DeleteLeadButton id={lead.id} />
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="bg-white p-24 rounded-[2.5rem] border border-dashed border-gray-200 text-center animate-pulse">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Building2 size={40} />
              </div>
              <div className="text-xl font-black text-gray-400 tracking-tighter">顧客データが見つかりません。</div>
              <p className="text-gray-400 mt-2 font-bold text-sm italic">新規作成ボタンから最初の顧客を追加してください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
