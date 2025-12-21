import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="p-2 glass-card hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl text-white transition-colors border border-white/5"
      >
        <ChevronLeft size={20} className="text-slate-700" />
      </button>

      <div className="glass-card px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest bg-slate-900/60">
        <span className="text-slate-500 mr-2">Index</span>
        <span className="text-slate-500">{page}</span>
        <span className="text-slate-500 mx-2">/</span>
        <span className="text-slate-500">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2 glass-card hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl text-white transition-colors border border-white/5"
      >
        <ChevronRight size={20} className="text-slate-700" />
      </button>
    </div>
  );
}
