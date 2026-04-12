import { PrismaClient } from '@prisma/client';

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
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of IGNITERA sales pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard title="New Leads" value={newLeadsCount} subtitle="Immediate action" color="blue" />
        <SummaryCard title="Won Deals" value={wonCount} subtitle="This month" color="green" />
        <SummaryCard title="Won Revenue" value={`¥${(Number(wonAmount._sum.amount) || 0).toLocaleString()}`} subtitle="Invoiced total" color="purple" />
        <SummaryCard title="Overdue Tasks" value={overdueTasks} subtitle="SLA breaches" color="orange" />
        <SummaryCard title="Daily Logic" value={activitiesToday} subtitle="Activities today" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Stage Conversion Rate</h2>
            <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Target: 15%
            </div>
          </div>
          <div className="space-y-4">
             <BarChartRow label="Lead -> Qualified" value={28.5} color="bg-blue-500" />
             <BarChartRow label="Qualified -> Proposal" value={42.1} color="bg-indigo-500" />
             <BarChartRow label="Proposal -> Won" value={18.2} color="bg-green-500" />
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 text-center">Pipeline Velocity</h2>
            <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-gray-100 mb-2 gap-4">
                <VelocityBar height="40%" label="Mon" />
                <VelocityBar height="65%" label="Tue" />
                <VelocityBar height="30%" label="Wed" />
                <VelocityBar height="85%" label="Thu" active />
                <VelocityBar height="0%" label="Fri" />
            </div>
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Index: +12%</p>
        </div>
      </div>
    </div>
  );
}

function BarChartRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tighter">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
            <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
        </div>
    </div>
  );
}

function VelocityBar({ height, label, active }: { height: string; label: string; active?: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2">
        <div 
            className={`w-full ${active ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-100 hover:bg-gray-200'} rounded-t-lg transition-all duration-700`} 
            style={{ height }} 
        />
        <span className="text-[10px] font-black text-gray-400">{label}</span>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, color }: { title: string; value: string | number; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    purple: 'border-purple-500 text-purple-600',
    orange: 'border-orange-500 text-orange-600',
    indigo: 'border-indigo-500 text-indigo-600',
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${colorMap[color]} border-gray-100`}>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
