"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ServicePage = () => {
  const router = useRouter();
  const {
    services,
    authUser,
    checkAuth,
    isCheckingAuth,
    isAuthenticated,
    getAllServices,
  } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      if (authUser?.role === "customer") getAllServices();
      else {
        router.push("/");
      }
    };
    verifyAuth();
  }, [checkAuth]);

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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>
      <div className="flex flex-col items-center gap-6">
        {services?.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-lg text-center cursor-pointer hover:bg-gray-800 transition"
            onClick={() => router.push(`/services/${service.id}`)}
          >
            <h2 className="text-2xl font-semibold">{service.name}</h2>
            <p className="text-gray-400 mt-2">
              {service.description?.slice(0, 100)}...
            </p>
            <p className="mt-3 text-pink-400 font-bold">${service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
