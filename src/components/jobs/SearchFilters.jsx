import React from "react";
import { Search, MapPin, Briefcase, Filter, X } from "lucide-react";

export default function SearchFilters({ filter, onChange, onReset }) {
  const handleChange = (field, value) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" /> Filter & Search Jobs
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
        >
          <X className="w-3.5 h-3.5" /> Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Job title, skills, keyword..."
            value={filter.keyword || ""}
            onChange={(e) => handleChange("keyword", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="City or location..."
            value={filter.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Job Type */}
        <div className="relative">
          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={filter.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition appearance-none"
          >
            <option value="">All Job Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        {/* Max Experience */}
        <div>
          <select
            value={filter.experience || ""}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          >
            <option value="">Any Experience</option>
            <option value="0">Fresher (0 years)</option>
            <option value="2">Up to 2 years</option>
            <option value="5">Up to 5 years</option>
            <option value="10">Up to 10 years</option>
          </select>
        </div>
      </div>
    </div>
  );
}
