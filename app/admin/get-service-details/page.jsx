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
  const { services, getServices, deleteService } = useAdminStore();

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
      getServices();
    }
  }, [isCheckingAuth, isAuthenticated, authUser, router, getServices]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">All Services</h1>

      {!services || services.length === 0 ? (
        <p className="text-center text-gray-400">No services found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Service Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service.id}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{service.name}</td>
                  <td className="px-4 py-2">{service.description}</td>
                  <td className="px-4 py-2">₹{service.price}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => deleteService(service.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Service"
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
