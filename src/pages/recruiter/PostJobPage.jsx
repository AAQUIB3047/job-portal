import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function PostJobPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    experienceRequired: 0,
    applicationDeadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      jobApi
        .getJobById(id)
        .then((res) => {
          const j = res.data;
          setForm({
            title: j.title || "",
            description: j.description || "",
            location: j.location || "",
            jobType: j.jobType || "FULL_TIME",
            salaryMin: j.salaryMin || "",
            salaryMax: j.salaryMax || "",
            experienceRequired: j.experienceRequired || 0,
            applicationDeadline: j.applicationDeadline || "",
          });
        })
        .catch(() => setError("Failed to fetch job data."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        experienceRequired: Number(form.experienceRequired),
        applicationDeadline: form.applicationDeadline || null,
      };

      if (id) {
        await jobApi.updateJob(id, payload);
      } else {
        await jobApi.createJob(payload);
      }
      navigate("/recruiter");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job posting. Ensure company profile is created.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{id ? "Edit Job Posting" : "Post a New Job Opening"}</h1>
        <p className="text-xs text-slate-500 font-medium">Provide job description, location, salary range and experience</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Full Stack Java Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mumbai, India or Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Type *</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Salary Min (₹)</label>
            <input
              type="number"
              placeholder="e.g. 800000"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Salary Max (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1500000"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              min={0}
              placeholder="2"
              value={form.experienceRequired}
              onChange={(e) => setForm({ ...form, experienceRequired: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
          <input
            type="date"
            value={form.applicationDeadline}
            onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Job Description & Qualifications *</label>
          <textarea
            rows={6}
            required
            placeholder="Specify job duties, tech stack, experience requirements, perks..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/recruiter")}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
          >
            {loading ? "Publishing..." : id ? "Update Job" : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
