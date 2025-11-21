import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- AUTH APIs ----
export const registerUser = (data) => API.post("/auth/register", data);

export const loginUser = (data) => API.post("/auth/login", data);

// ---- TASK APIs ----
export const createTask = (data) => API.post("/tasks", data);

export const getTasks = () => API.get("/tasks");

export const getTaskById = (id) => API.get(`/tasks/${id}`);

export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
