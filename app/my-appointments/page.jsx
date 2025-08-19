"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { format } from "date-fns";

const Page = () => {
  const router = useRouter();
  const {
    appointments,
    checkAuth,
    isCheckingAuth,
    isAuthenticated,
    getAllAppointments,
  } = useAuthStore();

  
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);


  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);


  useEffect(() => {
    if (isAuthenticated) {
      getAllAppointments();
    }
  }, [isAuthenticated, getAllAppointments]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My Appointments</h1>

      {appointments?.length === 0 ? (
        <div className="text-center bg-gray-600 text-gray-600">
          No completed appointments found.
        </div>
      ) : (
        <div className="grid  gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments?.map((appointment) => {
            const apptDate = new Date(appointment.appointmentDate);

            return (
              <div
                key={appointment.id}
                className="bg-gray-600 p-4 rounded-lg shadow-md border border-gray-200"
              >
              
                <h2 className="font-semibold  text-lg">
                  {appointment.service?.name || "Service"}
                </h2>
                <p className="text-white">
                  <span className="font-medium">Price:</span> ₹
                  {appointment.service?.price || 0}
                </p>
                <p className="text-white">
                  <span className="font-medium">Date:</span>{" "}
                  {format(apptDate, "dd-MM-yyyy")}
                </p>
                <p className="text-white">
                  <span className="font-medium">Time:</span>{" "}
                  {format(apptDate, "hh:mm a")}
                </p>
                <p className="text-white">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
                    {appointment.status}
                  </span>
                </p>
                <p className="text-white">
                  <span className="font-medium">Staff Name</span>{" "}
                  <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
                    {appointment.staff.name}
                  </span>
                </p>
                <p className="text-white">
                  <span className="font-medium">Staff Email</span>{" "}
                  <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
                    {appointment.staff.email}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
