import axiosClient from "./axiosClient";

export const userApi = {
  getProfile: () => axiosClient.get("/users/me"),
  updateProfile: (data) => axiosClient.put("/users/me", data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/users/me/resumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getResumes: () => axiosClient.get("/users/me/resumes"),
  deleteResume: (id) => axiosClient.delete(`/users/me/resumes/${id}`),
};
