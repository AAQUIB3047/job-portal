import React, { useState, useEffect } from "react";
import { userApi } from "../../api/userApi";
import Loader from "../../components/common/Loader";
import { User, Upload, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    headline: "",
    summary: "",
    skills: "",
    experienceYears: 0,
    currentLocation: "",
    expectedSalary: "",
  });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([userApi.getProfile(), userApi.getResumes()])
      .then(([profRes, resumesRes]) => {
        if (profRes.data) setProfile(profRes.data);
        setResumes(resumesRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");
    try {
      await userApi.updateProfile(profile);
      setMsg("Profile details saved successfully!");
    } catch {
      setErr("Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    setErr("");
    try {
      await userApi.uploadResume(file);
      const res = await userApi.getResumes();
      setResumes(res.data);
      setMsg("Resume uploaded successfully!");
    } catch (uploadErr) {
      setErr("Failed to upload resume file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await userApi.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
      setMsg("Resume deleted.");
    } catch {
      setErr("Failed to delete resume.");
    }
  };

  if (loading) return <Loader text="Loading your profile..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Profile & Resumes</h1>
        <p className="text-xs text-slate-500 font-medium">Keep your credentials and resume updated for employers</p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {msg}
        </div>
      )}

      {err && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {err}
        </div>
      )}

      {/* Resume Management */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Resume Documents
          </h2>
          <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload New Resume"}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        {resumes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No resumes uploaded yet. Upload your PDF or DOCX file.</p>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <div>
                    <span className="font-bold text-slate-800 block">{r.fileName}</span>
                    <span className="text-[10px] text-slate-400">Uploaded {new Date(r.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteResume(r.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Info */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Candidate Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Developer | React & TypeScript"
              value={profile.headline || ""}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Location</label>
            <input
              type="text"
              placeholder="e.g. Mumbai, India"
              value={profile.currentLocation || ""}
              onChange={(e) => setProfile({ ...profile, currentLocation: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Experience (Years)</label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={profile.experienceYears || 0}
              onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expected Salary (₹ Annual)</label>
            <input
              type="number"
              placeholder="e.g. 1200000"
              value={profile.expectedSalary || ""}
              onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Skills (Comma Separated)</label>
          <input
            type="text"
            placeholder="Java, Spring Boot, React, JavaScript, SQL, AWS"
            value={profile.skills || ""}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary</label>
          <textarea
            rows={4}
            placeholder="Write a brief professional summary about your background..."
            value={profile.summary || ""}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          {saving ? "Saving..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}
