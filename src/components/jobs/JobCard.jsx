import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Bookmark, Building2, Calendar } from "lucide-react";
import Badge from "../common/Badge";
import { jobApi } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";

export default function JobCard({ job, onSaveToggle }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(job.saved || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setSaving(true);
    try {
      const res = await jobApi.toggleSaveJob(job.id);
      setSaved(res.data.saved);
      if (onSaveToggle) onSaveToggle(job.id, res.data.saved);
    } catch {
      // Ignore error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 font-bold overflow-hidden shrink-0">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {job.company?.name || "Company Confidential"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge status={job.status || "OPEN"} />
            {user?.role === "JOB_SEEKER" && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`p-2 rounded-xl border transition ${
                  saved
                    ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                    : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50"
                }`}
                title={saved ? "Saved" : "Save Job"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-600 my-4 py-2 border-y border-slate-100">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location || "Remote"}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.jobType ? job.jobType.replace("_", " ") : "Full Time"}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <IndianRupee className="w-3.5 h-3.5" />
              {job.salaryMin ? `₹${job.salaryMin.toLocaleString()}` : ""}
              {job.salaryMin && job.salaryMax ? " - " : ""}
              {job.salaryMax ? `₹${job.salaryMax.toLocaleString()}` : ""}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
