'use client';

import { generateAISuggestion } from "@/actions/ai_support";
import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, Wand2 } from "lucide-react";

export function AISupportWidget({ leadId }: { leadId: string }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    try {
        const result = await generateAISuggestion(leadId);
        setSuggestion(result.suggestion);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (suggestion) {
        navigator.clipboard.writeText(suggestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black flex items-center gap-2 tracking-tight">
                <Sparkles size={24} className="text-yellow-400" />
                AI営業アシスタント
            </h3>
            {suggestion && (
                <button 
                    onClick={handleGenerate}
                    className="text-white/60 hover:text-white transition"
                    title="Regenerate"
                >
                    <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
                </button>
            )}
        </div>

        {!suggestion ? (
            <div className="text-center py-6 space-y-4">
                <p className="text-indigo-100 font-bold text-sm leading-relaxed max-w-sm mx-auto">
                    活動履歴とエビデンス資料を解析し、最適なフォローアップメールを下書きします。
                </p>
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                    {isGenerating ? 'コンテキストを解析中...' : 'AIメール下書き生成'}
                    <Wand2 size={20} />
                </button>
            </div>
        ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 relative">
                    <pre className="text-sm font-bold leading-relaxed whitespace-pre-wrap font-sans text-indigo-50">
                        {suggestion}
                    </pre>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 bg-white text-indigo-600 p-2 rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                        生成モデル: IGNITERA-Brain-v1
                    </span>
                    {copied && (
                        <span className="text-xs font-black text-green-300 animate-pulse">
                            クリップボードにコピーしました！
                        </span>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Background patterns */}
      <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
        <Sparkles size={250} />
      </div>
    </div>
  );
}
