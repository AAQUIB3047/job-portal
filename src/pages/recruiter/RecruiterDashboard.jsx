import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { companyApi } from "../../api/companyApi";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import { Briefcase, Building, PlusCircle, Users, CheckCircle, Clock } from "lucide-react";

export default function RecruiterDashboard() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      companyApi.getMyCompany().catch(() => null),
      jobApi.getRecruiterJobs({ page: 0, size: 5 }).catch(() => null),
    ])
      .then(([compRes, jobsRes]) => {
        if (compRes?.data) setCompany(compRes.data);
        if (jobsRes?.data) setJobs(jobsRes.data.content || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading employer console..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">{company?.name || "Company Console"}</h1>
            {company?.verified ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                Verified Company
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                Pending Verification
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 font-medium">Manage job postings, review applicants, and manage employer profile</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/company"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-1.5"
          >
            <Building className="w-4 h-4" /> Company Details
          </Link>
          <Link
            to="/recruiter/post-job"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Posted Jobs</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{jobs.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Company Profile</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">{company ? "Configured" : "Not Created"}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Verification</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">{company?.verified ? "Verified ✓" : "Pending Admin Review"}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">My Job Listings</h2>

        {jobs.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-slate-400">You haven't posted any jobs yet.</p>
            <Link
              to="/recruiter/post-job"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4" /> Create Your First Job Posting
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {jobs.map((job) => (
              <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    <Badge status={job.status} />
                  </div>
                  <p className="text-slate-400 mt-1">
                    {job.location} • {job.jobType?.replace("_", " ")} • Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/recruiter/jobs/${job.id}/applicants`}
                    className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" /> Applicants
                  </Link>
                  <Link
                    to={`/recruiter/edit-job/${job.id}`}
                    className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
