'use client';

import { useState } from 'react';
import { createLead } from '@/actions/lead';
import { X, Building2, Briefcase, Globe, Send } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createLead(formData);
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
      {showToast && <Toast message="顧客情報を保存しました" onClose={() => setShowToast(false)} />}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Building2 className="text-blue-600" />
            新規顧客登録
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">会社名 *</label>
            <input 
              name="companyName" 
              required 
              placeholder="株式会社イグニテラ"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">業界</label>
            <input 
              name="industry" 
              placeholder="IT / 小売 / 製造 など"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Webサイト URL</label>
            <input 
              name="websiteUrl" 
              type="url"
              placeholder="https://ignitera.com"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">リードソース</label>
            <select 
              name="source"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold"
            >
              <option value="manual">直接入力</option>
              <option value="outbound">アウトバウンド</option>
              <option value="inbound">インバウンド</option>
              <option value="referral">紹介</option>
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
                className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? '保存中...' : '顧客を保存'}
                <Send size={18} />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
