'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanItemProps {
  opp: any;
  isOverlay?: boolean;
}

export function KanbanItem({ opp, isOverlay }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opp.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group/item ${isOverlay ? 'shadow-2xl ring-4 ring-blue-500/10 scale-105' : ''}`}
    >
      <div className="font-black text-gray-900 text-base mb-1 leading-tight group-hover/item:text-blue-600 transition-colors tracking-tighter italic">{opp.title}</div>
      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        {opp.account.displayName}
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
            <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">ESTIMATED AMOUNT</div>
            <div className="text-lg font-black text-gray-900 tracking-tighter leading-none">
              ¥{(Number(opp.amount) || 0).toLocaleString()}
            </div>
        </div>
        <div className={`text-[10px] font-black px-2 py-1 rounded-lg border flex flex-col items-center
            ${opp.probability > 70 ? 'bg-green-50 text-green-600 border-green-100' : 
              opp.probability > 30 ? 'bg-blue-50 text-blue-600 border-blue-100' : 
              'bg-gray-50 text-gray-400 border-gray-100'}`}>
          <span className="text-[8px] opacity-50">PROB</span>
          {opp.probability}%
        </div>
      </div>
    </div>
  );
}
