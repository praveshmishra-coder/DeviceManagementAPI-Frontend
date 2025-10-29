import axios from "axios";

// Use Vite environment variable VITE_API_BASE_URL when available, otherwise fall back to the default.
// This lets you run the frontend against different backends without changing code.
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7166/api";

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
