'use client';

import { toggleTask } from "@/actions/activity";
import { TaskStatus } from "@prisma/client";
import { useState } from "react";

export function TaskItem({ task }: { task: any }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const isDone = status === 'DONE';

  const handleToggle = async () => {
    const nextStatus = isDone ? 'OPEN' : 'DONE';
    setStatus(nextStatus);
    await toggleTask(task.id, status);
  };

  return (
    <div className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${isDone ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:border-blue-300'}`}>
      <div className="mt-1">
          <input 
            type="checkbox" 
            checked={isDone} 
            onChange={handleToggle}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm ${isDone ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.title}
        </div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
          Due {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No date'}
        </div>
      </div>
    </div>
  );
}
