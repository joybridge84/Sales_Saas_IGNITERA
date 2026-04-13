'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { AddLeadModal } from './AddLeadModal';

export function LeadsHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">顧客一覧</h1>
          <p className="text-gray-500 mt-1">新規リードの管理と商談化プロセスの追跡</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          <Building2 size={18} />
          新規追加
        </button>
      </div>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} />}
    </>
  );
}
