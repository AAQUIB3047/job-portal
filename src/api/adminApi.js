import axiosClient from "./axiosClient";

export const adminApi = {
  listUsers: (params) => axiosClient.get("/admin/users", { params }),
  updateUserStatus: (id, status) => axiosClient.patch(`/admin/users/${id}/status`, null, { params: { status } }),
  getPendingJobs: (params) => axiosClient.get("/admin/jobs/pending", { params }),
  moderateJob: (id, approve) => axiosClient.patch(`/admin/jobs/${id}/approval`, null, { params: { approve } }),
  verifyCompany: (id, verify) => axiosClient.patch(`/admin/companies/${id}/verify`, null, { params: { verify } }),
  getStats: () => axiosClient.get("/admin/stats"),
};
