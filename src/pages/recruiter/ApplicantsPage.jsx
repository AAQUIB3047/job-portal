import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationApi } from "../../api/applicationApi";
import { jobApi } from "../../api/jobApi";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { Users, FileText, ArrowLeft, CheckCircle } from "lucide-react";

export default function ApplicantsPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = (p = 0) => {
    setLoading(true);
    applicationApi
      .getJobApplicants(jobId, { page: p, size: 10 })
      .then((res) => {
        setApplicants(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    jobApi.getJobById(jobId).then((res) => setJob(res.data)).catch(() => {});
    fetchApplicants(0);
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationApi.updateStatus(appId, newStatus);
      fetchApplicants(page);
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigate("/recruiter")}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Console
      </button>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Candidates Applied for: <span className="text-indigo-600">{job?.title || "Job"}</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium">Review candidates, access resumes, and update hiring stage</p>
      </div>

      {loading ? (
        <Loader text="Loading applicants..." />
      ) : applicants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-700">No applicants yet.</p>
          <p className="text-xs text-slate-500">Candidates will appear here as soon as they submit applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Candidate Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4">Cover Letter</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Update Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{app.seekerName}</td>
                      <td className="px-6 py-4 text-slate-600">{app.seekerEmail}</td>
                      <td className="px-6 py-4">
                        {app.resume ? (
                          <a
                            href={app.resume.filePath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" /> {app.resume.fileName}
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500">{app.coverLetter || "N/A"}</td>
                      <td className="px-6 py-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="OFFERED">OFFERED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={fetchApplicants} />
        </div>
      )}
    </div>
  );
}
