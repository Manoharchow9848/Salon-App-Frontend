"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const Page = () => {
  const router = useRouter();
  const { checkAuth, authUser, isCheckingAuth, isAuthenticated } =
    useAuthStore();
  const { getAppointments, appointments } = useAdminStore();

 
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && (!isAuthenticated || authUser?.role !== "admin")) {
      router.push("/");
    } else {
      getAppointments();
    }
  }, [isCheckingAuth, isAuthenticated, authUser, router, getAppointments]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">All Appointments</h1>

      {!appointments || appointments.length === 0 ? (
        <p className="text-center text-gray-400">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Staff</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{appt.service?.name}</td>
                  <td className="px-4 py-2">{appt.customer?.name || "N/A"}</td>
                  <td className="px-4 py-2">{appt.staff?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {format(new Date(appt.appointmentDate), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(appt.appointmentDate), "hh:mm a")}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      appt.status === "completed"
                        ? "text-green-400"
                        : appt.status === "cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {appt.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
