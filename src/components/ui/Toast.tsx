'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export function Toast({ 
  message, 
  onClose 
}: { 
  message: string, 
  onClose: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-[100]">
      <CheckCircle2 className="text-green-400" size={20} />
      <span className="font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white transition">
        <X size={16} />
      </button>
    </div>
  );
}
