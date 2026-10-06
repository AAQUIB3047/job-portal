import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { ShieldCheck, Users, Briefcase, Building, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // users | jobs
  const [usersList, setUsersList] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [usersPage, setUsersPage] = useState(0);
  const [jobsPage, setJobsPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [jobsTotalPages, setJobsTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    adminApi.getStats().then((res) => setStats(res.data)).catch(() => {});
  };

  const fetchUsers = (p = 0) => {
    adminApi.listUsers({ page: p, size: 10 }).then((res) => {
      setUsersList(res.data.content || []);
      setUsersTotalPages(res.data.totalPages || 0);
      setUsersPage(p);
    });
  };

  const fetchPendingJobs = (p = 0) => {
    adminApi.getPendingJobs({ page: p, size: 10 }).then((res) => {
      setPendingJobs(res.data.content || []);
      setJobsTotalPages(res.data.totalPages || 0);
      setJobsPage(p);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchStats();
    Promise.all([
      adminApi.listUsers({ page: 0, size: 10 }),
      adminApi.getPendingJobs({ page: 0, size: 10 }),
    ])
      .then(([usersRes, jobsRes]) => {
        setUsersList(usersRes.data.content || []);
        setUsersTotalPages(usersRes.data.totalPages || 0);
        setPendingJobs(jobsRes.data.content || []);
        setJobsTotalPages(jobsRes.data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    try {
      await adminApi.updateUserStatus(id, nextStatus);
      fetchUsers(usersPage);
      fetchStats();
    } catch {
      alert("Failed to update user status.");
    }
  };

  const handleModerateJob = async (id, approve) => {
    try {
      await adminApi.moderateJob(id, approve);
      fetchPendingJobs(jobsPage);
      fetchStats();
    } catch {
      alert("Failed to moderate job.");
    }
  };

  if (loading) return <Loader text="Loading admin control center..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Admin Portal</h1>
          <p className="text-xs text-slate-500 font-medium">System moderation, user access management, and platform analytics</p>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Users</span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
            <p className="text-slate-500 text-[10px]">Seekers: {stats.totalSeekers} | Recruiters: {stats.totalRecruiters}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Open Jobs</span>
            <p className="text-2xl font-extrabold text-emerald-600">{stats.activeJobs}</p>
            <p className="text-slate-500 text-[10px]">Pending Approval: {stats.pendingJobs}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Applications Sent</span>
            <p className="text-2xl font-extrabold text-indigo-600">{stats.totalApplications}</p>
            <p className="text-slate-500 text-[10px]">Across all job postings</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Verified Companies</span>
            <p className="text-2xl font-extrabold text-purple-600">{stats.verifiedCompanies}</p>
            <p className="text-slate-500 text-[10px]">Trusted employer badges</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 font-bold text-xs transition border-b-2 ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          User Accounts ({stats?.totalUsers || 0})
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 px-4 font-bold text-xs transition border-b-2 ${
            activeTab === "jobs"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Pending Job Moderation ({stats?.pendingJobs || 0})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
            <table className="w-full text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-400">#{u.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{u.role}</td>
                    <td className="px-6 py-4">
                      <Badge status={u.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`font-bold transition ${
                            u.status === "BLOCKED"
                              ? "text-emerald-600 hover:underline"
                              : "text-rose-600 hover:underline"
                          }`}
                        >
                          {u.status === "BLOCKED" ? "Unblock User" : "Block User"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={usersPage} totalPages={usersTotalPages} onPageChange={fetchUsers} />
        </div>
      )}

      {/* Moderation Jobs Tab */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          {pendingJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-sm font-bold text-slate-700">No pending jobs awaiting moderation.</p>
              <p className="text-xs text-slate-500">All unverified employer job postings have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <p className="text-slate-500">
                      Company: <strong className="text-slate-800">{job.company?.name}</strong> • Location: {job.location}
                    </p>
                    <p className="text-slate-400 mt-1 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleModerateJob(job.id, true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerateJob(job.id, false)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}

              <Pagination page={jobsPage} totalPages={jobsTotalPages} onPageChange={fetchPendingJobs} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
