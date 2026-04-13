'use client';

import { useState } from 'react';
import { createOpportunity } from '@/actions/opportunity';
import { X, Target, DollarSign, Send } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export function AddOpportunityModal({ 
  onClose, 
  accounts 
}: { 
  onClose: () => void, 
  accounts: { id: string, displayName: string }[] 
}) {
  const [isPending, setIsPending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createOpportunity(formData);
      setShowToast(true);
      setTimeout(onClose, 1500);
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました。');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {showToast && <Toast message="案件を保存しました" onClose={() => setShowToast(false)} />}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Target className="text-indigo-600" />
            新規案件登録
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">対象顧客 *</label>
            <select 
              name="accountId" 
              required
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
            >
              <option value="">顧客を選択してください</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.displayName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">案件名 *</label>
            <input 
              name="title" 
              required 
              placeholder="ECサイト改善プロジェクト"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">予想金額 (¥)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                name="amount" 
                type="number"
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 pl-10 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">現在のフェーズ</label>
            <select 
              name="stage"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-bold"
            >
              <option value="PROSPECTING">アプローチ中</option>
              <option value="DISCOVERY">ヒアリング</option>
              <option value="QUALIFIED">有効商談</option>
              <option value="PROPOSAL">提案中</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
                type="button" 
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? '保存中...' : '案件を保存'}
                <Send size={18} />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
