import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  // baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL
  //   ? `http://${import.meta.env.VITE_API_BASE_URL_LOCAL}/api`
  //   : import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 60000, // Increased for Puppeteer PDF generation
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

// ─── Invoices ─────────────────────────────────────────────
export const getImageUrl = (url) => url || null;
export default api;

// ── NEW ──────────────────────────────────────────────────────
 
// Check if a record already exists for room + month
// Returns { data: record } or { data: null }
export const checkRecord = (roomId, month) =>
  api.get("/records/check", { params: { room_id: roomId, month } });
 
// Partially update an existing record (electric, water, or both)
export const patchRecord = (id, fd) =>
  api.patch(`/records/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
