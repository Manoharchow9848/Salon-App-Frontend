"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminStore } from "@/store/useAdminStore";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { checkAuth, authUser, isCheckingAuth, isAuthenticated } =
    useAuthStore();
  const { staff, getStaff, deleteStaff } = useAdminStore();

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
      getStaff();
    }
  }, [isCheckingAuth, isAuthenticated, authUser, router, getStaff]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Staff Management</h1>

      {!staff || staff.length === 0 ? (
        <p className="text-center text-gray-400">No staff found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Staff Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Specialization</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, index) => (
                <tr key={member.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{member.user.name}</td>
                  <td className="px-4 py-2">{member.user.email}</td>
                  <td className="px-4 py-2">{member.specialization}</td>
                  <td className="px-4 py-2">
                    {member.availability
                      ? JSON.stringify(member.availability)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => deleteStaff(member.user.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Staff"
                    >
                      <Trash2 size={20} />
                    </button>
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
