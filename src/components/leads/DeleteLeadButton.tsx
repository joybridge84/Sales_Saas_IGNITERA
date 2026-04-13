'use client';

import { Trash2 } from 'lucide-react';
import { deleteLead } from '@/actions/lead';
import { useState } from 'react';

export function DeleteLeadButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('この顧客データを本当に削除しますか？関連する活動履歴も削除される可能性があります。')) {
      setIsDeleting(true);
      try {
        await deleteLead(id);
      } catch (err) {
        console.error(err);
        alert('削除に失敗しました。');
        setIsDeleting(false);
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="削除"
    >
      <Trash2 size={18} />
    </button>
  );
}
