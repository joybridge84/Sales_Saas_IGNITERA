'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100/50 backdrop-blur-sm rounded-[2rem] p-6 min-w-[340px] flex flex-col h-full border border-gray-200/50 shadow-inner">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="font-black text-gray-900 text-xs uppercase tracking-[0.2em] italic">{title}</h2>
        <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-black border border-gray-100 shadow-sm">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 min-h-[200px] scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
