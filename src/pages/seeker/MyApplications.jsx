import React, { useState, useEffect } from "react";
import { applicationApi } from "../../api/applicationApi";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { Briefcase, Calendar, Trash2 } from "lucide-react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApplications = (p = 0) => {
    setLoading(true);
    applicationApi
      .getMyApplications({ page: p, size: 8 })
      .then((res) => {
        setApplications(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications(0);
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await applicationApi.withdraw(id);
      fetchApplications(page);
    } catch {
      alert("Failed to withdraw application.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Submitted Applications</h1>
        <p className="text-xs text-slate-500 font-medium">Track your recruitment stage and application status</p>
      </div>

      {loading ? (
        <Loader text="Fetching your applications..." />
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-700">No applications found.</p>
          <p className="text-xs text-slate-500">Explore open jobs and apply with your uploaded resume.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{app.jobTitle}</td>
                      <td className="px-6 py-4 text-slate-600">{app.companyName}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status !== "WITHDRAWN" && app.status !== "REJECTED" && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                          >
                            Withdraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={fetchApplications} />
        </div>
      )}
    </div>
  );
}
