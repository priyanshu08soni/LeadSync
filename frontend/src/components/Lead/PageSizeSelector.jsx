import React from "react";
import { ListFilter } from "lucide-react";

export default function PageSizeSelector({ limit, onLimitChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <ListFilter size={14} className="text-slate-600" />
        Records:
      </label>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="bg-slate-950/50 border border-white/5 text-slate-50 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer hover:bg-slate-900 transition-colors uppercase"
      >
        <option value={10} className="bg-slate-900 text-slate-50">10 CNT</option>
        <option value={20} className="bg-slate-900 text-slate-50">20 CNT</option>
        <option value={50} className="bg-slate-900 text-slate-50">50 CNT</option>
      </select>
    </div>
  );
}
