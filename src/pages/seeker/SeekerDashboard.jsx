import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { applicationApi } from "../../api/applicationApi";
import { userApi } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import { Briefcase, FileText, Bookmark, ArrowRight, User } from "lucide-react";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([applicationApi.getMyApplications({ page: 0, size: 5 }), userApi.getResumes()])
      .then(([appsRes, resumesRes]) => {
        setApplications(appsRes.data.content || []);
        setResumes(resumesRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-lg space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.fullName}!</h1>
        <p className="text-xs text-indigo-200">Track your job applications, profile details and resume uploads.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Applications</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Resumes Uploaded</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{resumes.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Account Status</span>
            <h3 className="text-sm font-bold text-emerald-600 mt-1">Active Candidate</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
          <Link to="/my-applications" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">You haven't submitted any job applications yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">{app.jobTitle}</h4>
                  <p className="text-slate-400 font-medium">{app.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <Badge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
