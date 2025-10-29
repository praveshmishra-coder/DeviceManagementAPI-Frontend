import axiosClient from "./axiosClient";

const deviceApi = {
  getAll: () => axiosClient.get("/Device"),
  getById: (id) => axiosClient.get(`/Device/${id}`),
  add: (data) => axiosClient.post("/Device", data),
  update: (id, data) => axiosClient.put(`/Device/${id}`, data),
  delete: (id) => axiosClient.delete(`/Device/${id}`),
};

export default deviceApi;
