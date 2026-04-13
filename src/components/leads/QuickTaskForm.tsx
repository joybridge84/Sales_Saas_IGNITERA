'use client';

import { createQuickTask } from "@/actions/task";
import { useRef, useState } from "react";
import { Plus, Calendar, RefreshCw } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export function QuickTaskForm({ leadId, creatorId }: { leadId: string, creatorId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get('title');
    if (!title || title.toString().trim() === '') {
        setToast({ message: 'タスク内容を入力してください', type: 'error' });
        return;
    }

    setIsPending(true);
    try {
        await createQuickTask(formData);
        formRef.current?.reset();
        setToast({ message: 'タスクを追加しました', type: 'success' });
    } catch (e) {
        console.error(e);
        setToast({ message: '追加に失敗しました。もう一度お試しください。', type: 'error' });
    } finally {
        setIsPending(false);
    }
  };

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form ref={formRef} action={handleSubmit} className="mt-4 p-5 bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="creatorId" value={creatorId} />
        
        <div className="flex gap-3 items-center">
             <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="次のアクションを入力..."
                  className="flex-1 bg-transparent border-none text-sm font-black outline-none placeholder:text-gray-300 text-gray-900"
              />
              <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
              >
                  {isPending ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={18} />}
              </button>
        </div>
        <div className="mt-3 flex items-center gap-2 px-1">
              <Calendar size={14} className="text-blue-500/50" />
              <input 
                  type="date" 
                  name="dueAt"
                  className="text-xs bg-transparent border-none font-black text-gray-400 outline-none cursor-pointer hover:text-blue-600 transition-colors"
              />
        </div>
      </form>
    </div>
  );
}
