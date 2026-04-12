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
    <div ref={setNodeRef} className="bg-gray-100 rounded-xl p-4 min-w-[320px] flex flex-col h-full border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-700 text-sm tracking-tight">{title}</h2>
        <span className="bg-white text-gray-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-200">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px]">
        {children}
      </div>
    </div>
  );
}
