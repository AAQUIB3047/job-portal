import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import ApplyModal from "../../components/jobs/ApplyModal";
import { MapPin, Briefcase, IndianRupee, Calendar, Building2, Bookmark, CheckCircle, ArrowLeft, Send } from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobApi
      .getJobById(id)
      .then((res) => {
        setJob(res.data);
        if (user?.role === "JOB_SEEKER") {
          jobApi.checkIsSaved(id).then((savedRes) => setIsSaved(savedRes.data.saved)).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await jobApi.toggleSaveJob(id);
      setIsSaved(res.data.saved);
    } catch {
      // Handle save error
    }
  };

  if (loading) return <Loader text="Loading job details..." />;
  if (!job)
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-lg font-bold text-slate-700">Job position not found.</p>
        <button onClick={() => navigate("/jobs")} className="mt-4 text-xs font-semibold text-indigo-600 hover:underline">
          ← Back to jobs
        </button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 overflow-hidden shrink-0">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900">{job.title}</h1>
                <Badge status={job.status} />
              </div>
              <p className="text-sm font-semibold text-indigo-600">
                {job.company?.name || "Company Confidential"}
                {job.company?.verified && (
                  <span className="inline-flex items-center text-xs text-emerald-600 ml-2 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Verified Employer
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {user?.role === "JOB_SEEKER" && (
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-2xl border transition ${
                  isSaved
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"
                }`}
                title={isSaved ? "Saved" : "Save Job"}
              >
                <Bookmark className="w-5 h-5 fill-current" />
              </button>
            )}

            {user?.role !== "RECRUITER" && (
              <button
                onClick={() => {
                  if (!user) return navigate("/login");
                  setApplyModalOpen(true);
                }}
                disabled={job.status !== "OPEN"}
                className="flex-1 sm:flex-initial px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Location</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {job.location || "Remote"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Job Type</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> {job.jobType?.replace("_", " ")}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Salary Range</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
              {job.salaryMin ? `₹${job.salaryMin.toLocaleString()}` : "Confidential"}
              {job.salaryMax ? ` - ₹${job.salaryMax.toLocaleString()}` : ""}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Experience Required</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {job.experienceRequired || 0}+ Years
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Job Description & Requirements</h2>
        <div className="prose max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={job}
      />
    </div>
  );
}
