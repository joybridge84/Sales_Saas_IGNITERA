'use client';

import { addActivity } from "@/actions/activity";
import { useRef, useState } from "react";
import { Send, Hash, MessageSquare, Phone, Mail } from "lucide-react";

export function ActivityForm({ leadId, creatorId }: { leadId: string, creatorId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    await addActivity(formData);
    formRef.current?.reset();
    setIsPending(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MessageSquare size={18} className="text-blue-600" />
        Log New Activity
      </h3>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="creatorId" value={creatorId} />
        
        <div className="flex gap-4">
            <select 
                name="activityType" 
                required
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-bold"
            >
                <option value="NOTE">Note</option>
                <option value="MEETING">Meeting</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="DM">DM</option>
            </select>
            <input 
                type="text" 
                name="subject" 
                required 
                placeholder="Subject of the activity..."
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-medium shadow-inner"
            />
        </div>

        <textarea 
            name="detail" 
            placeholder="Describe what happened..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 font-medium min-h-[100px] shadow-inner"
        />

        <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100"
            >
                {isPending ? 'Logging...' : 'Log Activity'}
                <Send size={16} />
            </button>
        </div>
      </form>
    </div>
  );
}
