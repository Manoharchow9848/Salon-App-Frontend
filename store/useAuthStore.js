import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  services: null,
  appointments: null,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ authUser: null, isAuthenticated: false });
        return;
      }

      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        authUser: res.data,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        authUser: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/register", data);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({
        authUser: res.data.user,
        isAuthenticated: true,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ authUser: null, isAuthenticated: false });
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  },
  getAllServices: async () => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.get("/auth/get-services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    set({ services: res.data });
  },
  getAllAppointments: async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axiosInstance.get("/auth/get-appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ appointments: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch appointments"
      );
    }
  },
}));
