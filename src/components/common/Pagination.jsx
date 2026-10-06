import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      <span className="text-sm font-medium text-slate-600 px-4">
        Page <strong className="text-slate-900">{page + 1}</strong> of{" "}
        <strong className="text-slate-900">{totalPages}</strong>
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
