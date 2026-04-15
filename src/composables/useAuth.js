import { ref, onMounted } from "vue";
import { adminLogin } from "../services/api.js";

export function useAuth() {
  const login = async (username, password) => {
    try {
      const { data } = await adminLogin({ username, password });
      if (data.success) {
        return { success: true, admin: data.admin };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };
  return {
    login,
  };
}
