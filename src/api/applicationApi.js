import axiosClient from "./axiosClient";

export const applicationApi = {
  apply: (data) => axiosClient.post("/applications", data),
  getMyApplications: (params) => axiosClient.get("/applications/me", { params }),
  getJobApplicants: (jobId, params) => axiosClient.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, status) => axiosClient.patch(`/applications/${id}/status`, { status }),
  withdraw: (id) => axiosClient.delete(`/applications/${id}`),
};
