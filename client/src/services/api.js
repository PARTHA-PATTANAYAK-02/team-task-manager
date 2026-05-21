import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-e4dc.up.railway.app/api",
  // baseURL: "http://localhost:5000/api",
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
