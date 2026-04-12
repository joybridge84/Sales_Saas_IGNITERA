'use client';

import { createQuickTask } from "@/actions/task";
import { useRef, useState } from "react";
import { Plus, Calendar } from "lucide-react";

export function QuickTaskForm({ leadId, creatorId }: { leadId: string, creatorId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    await createQuickTask(formData);
    formRef.current?.reset();
    setIsPending(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="mt-4 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200 group-focus-within:border-blue-300 transition-colors">
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="creatorId" value={creatorId} />
      
      <div className="flex gap-2">
           <input 
                type="text" 
                name="title" 
                required 
                placeholder="次のアクションを入力..."
                className="flex-1 bg-transparent border-none text-xs font-bold outline-none placeholder:text-gray-300"
            />
            <button 
                type="submit" 
                disabled={isPending}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
                <Plus size={18} />
            </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
            <Calendar size={12} className="text-gray-400" />
            <input 
                type="date" 
                name="dueAt"
                className="text-[10px] bg-transparent border-none font-bold text-gray-400 outline-none"
            />
      </div>
    </form>
  );
}
