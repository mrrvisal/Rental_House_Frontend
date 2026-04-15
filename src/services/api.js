import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/admin",
  timeout: 10000,
});

// ─── Rooms ───────────────────────────────────────────────
export const getRooms = () => api.get("/rooms");
export const createRoom = (data) => api.post("/rooms", data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

// ─── Tenants ─────────────────────────────────────────────
export const getTenants = () => api.get("/tenants");
export const createTenant = (data) => api.post("/tenants", data);
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);

// ─── Monthly Records ──────────────────────────────────────
export const getDashboard = () => api.get("/records/dashboard");
export const getRecordsByRoom = (roomId) => api.get(`/records/${roomId}`);
export const getLastRecord = (roomId) => api.get(`/records/${roomId}/last`);
export const createRecord = (formData) =>
  api.post("/records", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getImageUrl = (url) => url || null;

export const adminLogin = (credentials) =>
  axios.post("http://localhost:4000/admin/login", credentials);

export default api;
