import { PrismaClient } from '@prisma/client';
import { Users, Target, CircleDollarSign, AlertCircle, Zap, TrendingUp, Calendar, Clock } from 'lucide-react';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const [newLeadsCount, wonCount, wonAmount, overdueTasks, activitiesToday] = await Promise.all([
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.opportunity.count({ where: { stage: 'WON' } }),
    prisma.opportunity.aggregate({
      _sum: { amount: true },
      where: { stage: 'WON' }
    }),
    prisma.task.count({ where: { status: 'OPEN', dueAt: { lt: new Date() } } }),
    prisma.activity.count({ 
      where: { 
        createdAt: { 
          gte: new Date(new Date().setHours(0,0,0,0)) 
        } 
      } 
    })
  ]);

  return (
    <div className="p-10 space-y-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">
            経営ダッシュボード
          </h1>
          <p className="text-gray-400 font-bold text-sm italic">
            IGNITERA 営業パイプラインのリアルタイム概要
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <div className="px-4 py-2 bg-blue-50 rounded-xl text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> 最終更新: わずか数秒前
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard title="新規リード" value={newLeadsCount} subtitle="即時対応が必要" color="blue" icon={Users} />
        <SummaryCard title="成約数" value={wonCount} subtitle="今月の実績" color="green" icon={Target} />
        <SummaryCard title="成約額" value={`¥${((Number(wonAmount._sum.amount) || 0) / 10000).toFixed(1)}M`} subtitle="累計請求ベース" color="purple" icon={CircleDollarSign} />
        <SummaryCard title="期限切れ" value={overdueTasks} subtitle="SLA超過" color="orange" icon={AlertCircle} />
        <SummaryCard title="本日の活動" value={activitiesToday} subtitle="デイリーログ数" color="indigo" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                <TrendingUp className="text-blue-600" />
                フェーズ別成約率
            </h2>
            <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-100 shadow-sm">
                GOAL: 15%
            </div>
          </div>
          <div className="space-y-8 relative z-10">
             <BarChartRow label="リード → 有効商談" value={28.5} color="bg-blue-600" />
             <BarChartRow label="有効商談 → 提案済み" value={42.1} color="bg-indigo-600" />
             <BarChartRow label="提案済み → 成約" value={18.2} color="bg-emerald-600" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
        </div>
        
        <div className="lg:col-span-4 bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <h2 className="text-xl font-black tracking-tighter mb-8 flex items-center gap-2 italic">
                    <Calendar className="text-blue-400 not-italic" size={20} />
                    週間アクティビティ
                </h2>
                <div className="h-40 flex items-end justify-between px-4 pb-2 border-b border-gray-800 mb-6 gap-3">
                    <VelocityBar height="40%" label="M" />
                    <VelocityBar height="65%" label="T" />
                    <VelocityBar height="30%" label="W" />
                    <VelocityBar height="85%" label="T" active />
                    <VelocityBar height="20%" label="F" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">VELOCITY INDEX</span>
                    <span className="text-blue-400 font-black text-lg">+12.4%</span>
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function BarChartRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-3 group/row">
        <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest group-hover/row:text-gray-900 transition-colors">
            <span>{label}</span>
            <span className="text-gray-900">{value}%</span>
        </div>
        <div className="h-3.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner p-0.5">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 group-hover/row:scale-y-110`} style={{ width: `${value}%` }} />
        </div>
    </div>
  );
}

function VelocityBar({ height, label, active }: { height: string; label: string; active?: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
        <div 
            className={`w-full ${active ? 'bg-blue-600 shadow-lg shadow-blue-500/50' : 'bg-gray-800 hover:bg-gray-700'} rounded-t-xl transition-all duration-700 cursor-pointer`} 
            style={{ height }} 
        />
        <span className={`text-[10px] font-black ${active ? 'text-blue-400' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, color, icon: Icon }: { title: string; value: string | number; subtitle: string; color: string; icon: any }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/5',
    green: 'text-green-600 bg-green-50 border-green-100 shadow-green-500/5',
    purple: 'text-purple-600 bg-purple-50 border-purple-100 shadow-purple-500/5',
    orange: 'text-orange-600 bg-orange-50 border-orange-100 shadow-orange-500/5',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-500/5',
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] shadow-xl ${colorMap[color]} border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}>
      <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl bg-white shadow-sm border border-inherit`}>
            <Icon size={20} />
          </div>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 italic line-clamp-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
      </div>
      <p className="mt-2 text-[10px] font-bold text-gray-400 italic line-clamp-1">{subtitle}</p>
    </div>
  );
}
