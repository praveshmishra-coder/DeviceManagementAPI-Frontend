import axiosClient from "./axiosClient";

const assetApi = {
  getAll: () => axiosClient.get("/Asset"),
  getById: (id) => axiosClient.get(`/Asset/${id}`),
  add: (data) => axiosClient.post("/Asset", data),
  update: (id, data) => axiosClient.put(`/Asset/${id}`, data),
  delete: (id) => axiosClient.delete(`/Asset/${id}`),
};

export default assetApi;
