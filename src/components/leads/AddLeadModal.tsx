'use client';

import { useState } from 'react';
import { createLead } from '@/actions/lead';
import { X, Building2, Briefcase, Globe, Send, RefreshCw } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  async function handleSubmit(formData: FormData) {
    const companyName = formData.get('companyName');
    if (!companyName || companyName.toString().trim() === '') {
      setToast({ message: '会社名は必須項目です。', type: 'error' });
      return;
    }

    setIsPending(true);
    try {
      await createLead(formData);
      setToast({ message: '顧客情報を保存しました', type: 'success' });
      setTimeout(onClose, 1500);
    } catch (e) {
      console.error(e);
      setToast({ message: '保存に失敗しました。もう一度お試しください。', type: 'error' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-white/20">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
            新規顧客登録
          </h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">会社名 *</label>
            <input 
              name="companyName" 
              required 
              autoFocus
              placeholder="株式会社イグニテラ"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">業界</label>
            <input 
              name="industry" 
              placeholder="IT / 小売 / 製造 など"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Webサイト URL</label>
            <input 
              name="websiteUrl" 
              type="url"
              placeholder="https://ignitera.com"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">リードソース</label>
            <select 
              name="source"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="manual">直接入力</option>
              <option value="outbound">アウトバウンド</option>
              <option value="inbound">インバウンド</option>
              <option value="referral">紹介</option>
            </select>
          </div>

          <div className="pt-6 flex gap-4">
             <button 
                type="button" 
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all active:scale-95"
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    保存中...
                  </>
                ) : (
                  <>
                    顧客を保存
                    <Send size={18} />
                  </>
                )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
