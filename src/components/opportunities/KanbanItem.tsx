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
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors ${isOverlay ? 'shadow-2xl ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="font-bold text-gray-900 text-sm mb-1 leading-snug">{opp.title}</div>
      <div className="text-xs text-gray-400 font-medium mb-3">{opp.account.displayName}</div>
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-blue-600">
          ¥{(Number(opp.amount) || 0).toLocaleString()}
        </div>
        <div className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
          {opp.probability}%
        </div>
      </div>
    </div>
  );
}
