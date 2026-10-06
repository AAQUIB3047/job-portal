import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { userApi } from "../../api/userApi";
import { applicationApi } from "../../api/applicationApi";
import { FileText, Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ApplyModal({ isOpen, onClose, job, onApplied }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError("");
      setSuccess(false);
      userApi
        .getResumes()
        .then((res) => {
          setResumes(res.data);
          if (res.data.length > 0) {
            setSelectedResumeId(res.data[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setError("");

    try {
      await applicationApi.apply({
        jobId: job.id,
        resumeId: selectedResumeId ? Number(selectedResumeId) : null,
        coverLetter,
      });
      setSuccess(true);
      if (onApplied) onApplied(job.id);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already applied for this position.");
      } else {
        setError(err.response?.data?.message || "Failed to submit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to ${job?.title || "Job"}`}>
      {success ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
          <p className="text-xs text-slate-500">The recruiter has been notified of your application.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Resume <span className="text-rose-500">*</span>
            </label>
            {loading ? (
              <p className="text-xs text-slate-400">Loading resumes...</p>
            ) : resumes.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                You haven't uploaded any resumes yet. Go to your Profile page to upload one.
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} (Uploaded: {new Date(r.uploadedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cover Letter / Personal Note
            </label>
            <textarea
              rows={4}
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (resumes.length === 0 && !selectedResumeId)}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm disabled:opacity-50 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
