'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

export function Toast({ 
  message, 
  type = 'success',
  onClose 
}: { 
  message: string, 
  type?: ToastType,
  onClose: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 ${type === 'success' ? 'bg-gray-900' : 'bg-red-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-[100]`}>
      {type === 'success' ? (
        <CheckCircle2 className="text-green-400" size={20} />
      ) : (
        <AlertCircle className="text-white" size={20} />
      )}
      <span className="font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white transition">
        <X size={16} />
      </button>
    </div>
  );
}
