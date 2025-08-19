"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useStaffStore } from "@/store/useStaffStore";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
const Page = () => {
  const router = useRouter();
  const { checkAuth, authUser, isCheckingAuth, isAuthenticated } =
    useAuthStore();

  const { schedules, getSchedules, getMarkAsCompleted, getMarkAsCancelled } =
    useStaffStore();

  
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();

      getSchedules();
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Staff Schedules</h1>

      {!schedules || schedules.length === 0 ? (
        <p className="text-center text-gray-600">No schedules available.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-600">
          <table className="w-full bg-white rounded-lg shadow-md border border-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-2  text-left">Service</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch) => (
                <tr key={sch.id} className="border-t">
                  <td className="px-4 text-black py-2">
                    {sch.service?.name || "N/A"}
                  </td>
                  <td className="px-4 text-black py-2">
                    {sch.customer?.name || "N/A"}
                  </td>
                  <td className="px-4 text-black py-2">
                    {new Date(sch.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 text-black py-2">
                    {format(sch.appointmentDate, "hh:mm a")}
                  </td>
                  <td className="px-4 text-black py-2 capitalize">
                    {sch.status}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    {sch.status === "booked" ? (
                      <>
                        <button
                          onClick={() => getMarkAsCompleted(sch.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => getMarkAsCancelled(sch.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-600">{sch.status}</span>
                    )}
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
