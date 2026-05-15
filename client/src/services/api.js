import axios from "axios";

const API = axios.create({
  baseURL: "team-task-manager-production-e4dc.up.railway.app",
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
