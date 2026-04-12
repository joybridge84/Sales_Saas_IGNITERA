'use client';

import { addProofAsset } from "@/actions/asset";
import { useRef, useState } from "react";
import { FileText, Link as LinkIcon, BarChart3, Plus, ExternalLink } from "lucide-react";

export function ProofAssetWidget({ leadId, assets }: { leadId: string, assets: any[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FileText size={20} className="text-purple-600" />
            エビデンス資料
        </h3>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-lg transition"
        >
            <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <form 
            action={async (fd) => {
                await addProofAsset(fd);
                setShowForm(false);
            }} 
            className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-3"
        >
            <input type="hidden" name="leadId" value={leadId} />
            <div className="grid grid-cols-2 gap-2">
                <input name="title" placeholder="資料タイトル" required className="col-span-2 text-xs p-2 rounded-lg border-none font-bold" />
                <select name="assetType" className="text-xs p-2 rounded-lg border-none font-bold">
                    <option value="PROPOSAL">提案資料 (PDF)</option>
                    <option value="LP_PERFORMANCE">分析・実績数値</option>
                    <option value="SPEED_REPORT">スピードレポート</option>
                </select>
                <input name="url" placeholder="URLパス" className="text-xs p-2 rounded-lg border-none font-bold" />
            </div>
            <input name="impactMetric" placeholder="効果 (例: CVR +2.1%)" className="text-xs p-2 w-full rounded-lg border-none font-bold" />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-xl text-xs font-black shadow-lg shadow-purple-200">
                資料を保存
            </button>
        </form>
      )}

      <div className="grid gap-3">
        {assets.map(asset => (
            <div key={asset.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg text-purple-600 border border-gray-100">
                            {asset.assetType === 'LP_PERFORMANCE' ? <BarChart3 size={14} /> : <FileText size={14} />}
                        </div>
                        <span className="text-sm font-black text-gray-800">{asset.title}</span>
                    </div>
                    {asset.url && (
                        <a href={asset.url} target="_blank" className="text-gray-400 hover:text-purple-600">
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
                {asset.impactMetric && (
                    <div className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
                        インパクト: {asset.impactMetric}
                    </div>
                )}
            </div>
        ))}
        {assets.length === 0 && !showForm && (
            <div className="text-center py-8 opacity-40 italic text-xs font-bold font-mono">
                関連資料はまだありません。
            </div>
        )}
      </div>
    </div>
  );
}
