import axiosClient from "./axiosClient";

export const jobApi = {
  searchJobs: (params) => axiosClient.get("/jobs", { params }),
  getJobById: (id) => axiosClient.get(`/jobs/${id}`),
  getRecruiterJobs: (params) => axiosClient.get("/jobs/recruiter/me", { params }),
  createJob: (data) => axiosClient.post("/jobs", data),
  updateJob: (id, data) => axiosClient.put(`/jobs/${id}`, data),
  updateJobStatus: (id, status) => axiosClient.patch(`/jobs/${id}/status`, null, { params: { status } }),
  deleteJob: (id) => axiosClient.delete(`/jobs/${id}`),
  toggleSaveJob: (id) => axiosClient.post(`/jobs/${id}/save`),
  checkIsSaved: (id) => axiosClient.get(`/jobs/${id}/is-saved`),
};
