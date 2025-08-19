import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStaffStore = create((set, get) => ({
  schedules: null,

  getSchedules: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/staff/schedules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ schedules: res.data });
    } catch (error) {
      toast.error(` ${error.response.data.message}`);
      console.error("Error fetching schedules:", error);
    }
  },
  getMarkAsCompleted: async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(
        `/staff/appointments/${appointmentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      get().getSchedules(); // refresh list
    } catch (error) {
      toast.error("Failed to mark as completed");
      console.error(error);
    }
  },

  getMarkAsCancelled: async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/staff/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment cancelled");
      get().getSchedules(); // refresh list
    } catch (error) {
      toast.error("Failed to cancel appointment");
      console.error(error);
    }
  },
}));
