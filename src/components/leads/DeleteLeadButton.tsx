'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { deleteLead } from '@/actions/lead';
import { useState } from 'react';
import { Toast } from '@/components/ui/Toast';

export function DeleteLeadButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('この顧客データを本当に削除しますか？')) {
      setIsDeleting(true);
      try {
        const result = await deleteLead(id);
        if (result && !result.success) {
          setToast({ message: result.error || '削除に失敗しました。', type: 'error' });
          setIsDeleting(false);
        } else {
          // Success is handled by revalidatePath in the action
          // If we want a toast for success, we can add it here, 
          // but usually revalidatePath will refresh the list.
          setToast({ message: '顧客データを削除しました。', type: 'success' });
        }
      } catch (err) {
        console.error(err);
        setToast({ message: '予期せぬエラーが発生しました。', type: 'error' });
        setIsDeleting(false);
      }
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 disabled:opacity-50 group/del"
        title="削除"
      >
        {isDeleting ? <Loader2 size={18} className="animate-spin text-red-600" /> : <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />}
      </button>
    </>
  );
}
