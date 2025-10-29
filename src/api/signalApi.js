import axiosClient from "./axiosClient";

const signalApi = {
  getAll: () => axiosClient.get("/SignalMeasurement"),
  getById: (id) => axiosClient.get(`/SignalMeasurement/${id}`),
  add: (data) => axiosClient.post("/SignalMeasurement", data),
  update: (id, data) => axiosClient.put(`/SignalMeasurement/${id}`, data),
  delete: (id) => axiosClient.delete(`/SignalMeasurement/${id}`),
};

export default signalApi;
