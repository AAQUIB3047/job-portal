import React from "react";

export default function Badge({ status }) {
  const styles = {
    // Job status
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
    PENDING_APPROVAL: "bg-amber-50 text-amber-700 border-amber-200",
    DRAFT: "bg-slate-50 text-slate-600 border-slate-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    EXPIRED: "bg-purple-50 text-purple-700 border-purple-200",

    // Application status
    APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
    REVIEWED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
    INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
    OFFERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    WITHDRAWN: "bg-slate-100 text-slate-600 border-slate-200",

    // User status
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    BLOCKED: "bg-rose-50 text-rose-700 border-rose-200",
    PENDING_VERIFICATION: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const style = styles[status] || "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {status ? status.replace("_", " ") : "N/A"}
    </span>
  );
}
