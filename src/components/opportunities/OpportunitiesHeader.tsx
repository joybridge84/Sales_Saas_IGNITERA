'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import { AddOpportunityModal } from './AddOpportunityModal';

export function OpportunitiesHeader({ 
  accounts 
}: { 
  accounts: { id: string, displayName: string }[] 
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="p-8 pb-4 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">案件（パイプライン）</h1>
            <p className="text-gray-500 text-sm mt-1">ドラッグ＆ドロップで案件のステージを更新できます。</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition flex items-center gap-2"
          >
            <Target size={16} />
            + 新規案件
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
