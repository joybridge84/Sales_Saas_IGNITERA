import { PrismaClient } from '@prisma/client';
import { convertLead } from '@/actions/convert';
import { redirect } from 'next/navigation';
import { Building2, Mail, Phone, Target, CheckCircle2, AlertCircle, MessageSquare, ListTodo, History, ArrowLeft, ChevronRight } from 'lucide-react';
import { TaskItem } from '@/components/leads/TaskItem';
import { ActivityForm } from '@/components/leads/ActivityForm';
import { QuickTaskForm } from '@/components/leads/QuickTaskForm';
import { ProofAssetWidget } from '@/components/leads/ProofAssetWidget';
import { AISupportWidget } from '@/components/leads/AISupportWidget';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  let lead;
  try {
    lead = await prisma.lead.findUnique({
      where: { id },
      include: { 
          owner: true, 
          activities: { orderBy: { happenedAt: 'desc' } }, 
          tasks: { orderBy: { dueAt: 'asc' } },
          proofAssets: { orderBy: { createdAt: 'desc' } }
      }
    });
  } catch (e) {
    console.error("Error fetching lead:", e);
    return redirect('/leads');
  }

  if (!lead) return redirect('/leads');

  const isConverted = lead.status === 'CONVERTED';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/leads" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all mb-8 group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            顧客一覧に戻る
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex gap-8 items-center text-left">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-2xl shadow-blue-100 ring-8 ring-blue-50 shrink-0">
                {lead.companyName.charAt(0)}
              </div>
              <div>
                <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  <Link href="/leads" className="hover:text-blue-600 transition">CLIENTS</Link>
                  <ChevronRight size={10} className="text-gray-300" />
                  <span className="text-gray-900">DETAIL</span>
                </nav>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                  {lead.companyName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-bold text-sm">
                   <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 italic">
                      <Building2 size={16} className="text-blue-500" /> {lead.industry || 'Multi-sector'}
                   </span>
                   <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 italic">
                      <Target size={16} className="text-orange-500" /> Source: {lead.source}
                   </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4 self-center md:self-start">
              <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ring-1 ring-inset
                ${isConverted ? 'bg-blue-50 text-blue-700 ring-blue-700/20' : 'bg-green-50 text-green-700 ring-green-700/20'}`}>
                {lead.status === 'NEW' ? '新規リード' : lead.status === 'CONVERTED' ? '商談化済み' : lead.status}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-black italic bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xs text-blue-700 font-black shadow-inner">
                      {lead.owner?.name?.charAt(0)}
                  </div>
                  {lead.owner?.name || 'Unassigned'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Conversion CTA */}
          {!isConverted ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-green-500 shadow-2xl shadow-green-100 bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative group">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-tight">
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-green-800 mb-2">ステージアップの準備はいいですか？</h2>
                    <p className="text-green-700 font-bold text-sm leading-relaxed max-w-md opacity-80">
                      このリードを有効な商談およびアカウントに変換し、提案プロセスを開始します。
                    </p>
                  </div>
                  <form action={convertLead}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <input type="hidden" name="companyName" value={lead.companyName} />
                    <input type="hidden" name="ownerUserId" value={lead.ownerUserId} />
                    <button type="submit" className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-green-200 hover:bg-green-700 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-3 whitespace-nowrap">
                      <CheckCircle2 size={24} />
                      商談化する
                    </button>
                  </form>
               </div>
               <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <CheckCircle2 size={300} className="text-green-900" />
               </div>
            </div>
          ) : (
            <div className="bg-gray-900 text-white rounded-3xl p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                        <CheckCircle2 size={16} /> 商談化に成功しました
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter">このリードは現在パートナーシップ段階です</h2>
                    <p className="text-gray-400 font-bold max-w-sm">すべての履歴データは新しい商談レコードに同期されました。</p>
                </div>
                <Link href="/opportunities" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 whitespace-nowrap">
                    パイプラインへ移動 →
                </Link>
            </div>
          )}

          {/* AI Support Finale */}
          <AISupportWidget leadId={lead.id} />

          {/* Activity Log & Form */}
          <div className="space-y-6">
            <ActivityForm leadId={lead.id} creatorId={lead.ownerUserId} />

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tighter italic">
                       <History size={24} className="text-gray-300 not-italic" /> 
                       活動タイムライン
                    </h3>
                    <div className="h-px flex-1 mx-6 bg-gray-50" />
               </div>
               
               <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-blue-100 before:via-gray-100 before:to-transparent">
                  {lead.activities.map((act: any) => (
                     <div key={act.id} className="relative pl-14 group">
                        <div className="absolute left-1.5 top-1 w-8 h-8 bg-white border-2 border-blue-500 rounded-full z-10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit">
                                {act.activityType}
                            </div>
                            <div className="text-xs font-bold text-gray-400 italic">
                                {act.happenedAt.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="font-black text-gray-900 text-xl tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {act.subject}
                        </div>
                        <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-2xl bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner italic">
                            {act.detail}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
           {/* Tasks Widget */}
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <ListTodo size={20} className="text-blue-600" />
                    タスク
                </h3>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-black min-w-[24px] text-center shadow-lg shadow-blue-100">
                    {lead.tasks.filter((t: any) => t.status !== 'DONE').length}
                </span>
              </div>
              <div className="space-y-4">
                {lead.tasks.map((task: any) => (
                   <TaskItem key={task.id} task={task} />
                ))}
                <QuickTaskForm leadId={lead.id} creatorId={lead.ownerUserId} />
              </div>
           </div>

           {/* Proof Assets Widget */}
           <ProofAssetWidget leadId={lead.id} assets={lead.proofAssets} />

           {/* Metrics Widget */}
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    戦略ランク
                </h3>
                <div className="flex items-center justify-center relative mb-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * lead.fitScore / 100)} className="text-blue-600 transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-gray-900 leading-none">{lead.fitScore}%</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">確信度</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest mb-2 italic">
                        <AlertCircle size={14} /> 課題仮説 (Pain Points)
                    </div>
                    <p className="text-gray-600 text-sm font-bold leading-relaxed italic">
                        "{lead.painHypothesis || 'No pain hypothesis found.'}"
                    </p>
                </div>
           </div>

           {/* Info Widget */}
           <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">連絡先情報</h3>
              <div className="space-y-5">
                 <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-800 group hover:border-blue-500/30 transition-colors">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-400 shadow-inner"><Mail size={20} /></div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Digital Hub</div>
                        <div className="text-sm font-bold truncate tracking-tight">{lead.websiteUrl || 'No domain'}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-800">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-blue-400 shadow-inner"><Phone size={20} /></div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Call Line</div>
                        <div className="text-sm font-bold tracking-tight">Access via CRM</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
