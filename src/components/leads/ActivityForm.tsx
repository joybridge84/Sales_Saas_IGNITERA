'use client';

import { addActivity } from "@/actions/activity";
import { useRef, useState } from "react";
import { Send, Hash, MessageSquare, Phone, Mail, RefreshCw } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export function ActivityForm({ leadId, creatorId }: { leadId: string, creatorId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const subject = formData.get('subject');
    if (!subject || subject.toString().trim() === '') {
        setToast({ message: '件名を入力してください', type: 'error' });
        return;
    }

    setIsPending(true);
    try {
        await addActivity(formData);
        formRef.current?.reset();
        setToast({ message: '活動を記録しました', type: 'success' });
    } catch (e) {
        console.error(e);
        setToast({ message: '保存に失敗しました。もう一度お試しください。', type: 'error' });
    } finally {
        setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <MessageSquare size={20} className="text-blue-600" />
        </div>
        活動履歴を記録
      </h3>
      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="creatorId" value={creatorId} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">TYPE</label>
                <select 
                    name="activityType" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 font-bold outline-none transition-all cursor-pointer appearance-none"
                >
                    <option value="NOTE">メモ</option>
                    <option value="MEETING">商談・面談</option>
                    <option value="CALL">架電 (Call)</option>
                    <option value="EMAIL">メール</option>
                    <option value="DM">DM/SNS</option>
                </select>
            </div>
            <div className="md:col-span-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">SUBJECT</label>
                <input 
                    type="text" 
                    name="subject" 
                    required 
                    placeholder="件名を入力..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 font-bold outline-none transition-all shadow-inner placeholder:text-gray-300"
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">DETAIL</label>
            <textarea 
                name="detail" 
                placeholder="詳細な内容を記録してください..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-5 font-bold outline-none transition-all min-h-[120px] shadow-inner placeholder:text-gray-300"
            />
        </div>

        <div className="flex justify-end pt-2">
            <button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
                {isPending ? (
                    <>
                        <RefreshCw size={18} className="animate-spin" />
                        記録中...
                    </>
                ) : (
                    <>
                        履歴を保存
                        <Send size={18} />
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}
