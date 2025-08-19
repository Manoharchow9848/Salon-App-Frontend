import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  appointments: null,
  services: null,
  staff: null,

  addService: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/admin/add-service", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  addStaff: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/admin/add-staff", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  getAppointments: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/admin/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ appointments: res.data });
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  getServices: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/admin/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ services: res.data });
      console.log(res.data);
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  getStaff: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/admin/get-staff-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ staff: res.data });
      console.log(res.data);
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  deleteStaff: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.delete(`/admin/delete-staff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      get().getStaff();
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.delete(`/admin/delete-service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      await get().getServices();
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
    }
  },
}));
