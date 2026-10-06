import React, { useState, useEffect } from "react";
import { companyApi } from "../../api/companyApi";
import Loader from "../../components/common/Loader";
import { Building, Globe, MapPin, CheckCircle, AlertCircle } from "lucide-react";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    website: "",
    industry: "",
    location: "",
    logoUrl: "",
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    companyApi
      .getMyCompany()
      .then((res) => {
        if (res.data) setForm(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");

    try {
      if (form.id) {
        const res = await companyApi.updateCompany(form.id, form);
        setForm(res.data);
      } else {
        const res = await companyApi.createCompany(form);
        setForm(res.data);
      }
      setMsg("Company profile saved successfully!");
    } catch {
      setErr("Failed to save company profile details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading company details..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Employer Company Profile</h1>
        <p className="text-xs text-slate-500 font-medium">Create or edit your company profile details</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Acme Tech Solutions"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Industry</label>
            <input
              type="text"
              placeholder="e.g. Software & IT Services"
              value={form.industry || ""}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Headquarters Location</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, India"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={form.website || ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Logo Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/logo.png"
              value={form.logoUrl || ""}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Company Description</label>
          <textarea
            rows={4}
            placeholder="Tell candidates about your company mission, team culture and products..."
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition"
        >
          {saving ? "Saving..." : "Save Company Profile"}
        </button>
      </form>
    </div>
  );
}
