import axiosClient from "./axiosClient";

export const companyApi = {
  createCompany: (data) => axiosClient.post("/companies", data),
  getCompanyById: (id) => axiosClient.get(`/companies/${id}`),
  getMyCompany: () => axiosClient.get("/companies/me"),
  updateCompany: (id, data) => axiosClient.put(`/companies/${id}`, data),
};
