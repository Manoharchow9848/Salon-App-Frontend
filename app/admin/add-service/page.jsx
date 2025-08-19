"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
const AddService = () => {
  const { checkAuth, authUser, isCheckingAuth, isAuthenticated } =
    useAuthStore();
  const { addService } = useAdminStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth(); 
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !duration || !price) {
      toast.error("Please fill all fields");
      return;
    }
    const data = {
      name,
      description,
      duration: Number(duration),
      price: Number(price),
    };
    addService(data);

    setName("");
    setDescription("");
    setDuration("");
    setPrice("");
  };

  if (!authUser || authUser.role !== "admin") {
    return (
      <div className="text-center mt-10 text-red-500">
        Access Denied. Admins only.
      </div>
    );
  }
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black ">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Service</h2>
        <form onSubmit={handleSubmit}>
         
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-pink-500"
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter service description"
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-pink-500"
            />
          </div>

       
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-pink-500"
            />
          </div>

       
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-pink-500"
            />
          </div>

          
          <button
            type="submit"
            className="w-full cursor-pointer bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddService;
