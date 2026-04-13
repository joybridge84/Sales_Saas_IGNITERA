'use client';

import { useState } from 'react';
import { Target, Zap } from 'lucide-react';
import { AddOpportunityModal } from './AddOpportunityModal';

export function OpportunitiesHeader({ 
  accounts 
}: { 
  accounts: { id: string, displayName: string }[] 
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="p-10 pb-6 shrink-0 bg-white border-b border-gray-100 mb-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 italic">
              SALES FLOW / PIPELINE
            </nav>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">案件管理ボード</h1>
            <p className="text-gray-400 font-bold text-sm mt-2 italic flex items-center gap-2">
              <Zap size={14} className="text-blue-500" />
              ドラッグ＆ドロップで案件のステージを瞬時に更新
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="group bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/10"
          >
            <Target size={20} className="group-hover:rotate-12 transition-transform" />
            新規案件を追加
          </button>
        </div>
      </div>

      {showModal && (
        <AddOpportunityModal 
          onClose={() => setShowModal(false)} 
          accounts={accounts} 
        />
      )}
    </>
  );
}
