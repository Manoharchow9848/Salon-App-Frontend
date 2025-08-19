"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

const AddStaffPage = () => {
  const {
    checkAuth,
    authUser,
    isCheckingAuth,
    isAuthenticated,
    services,
    getAllServices,
  } = useAuthStore();
  const { addStaff } = useAdminStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [availability, setAvailability] = useState({
    mon: ["09:00-17:00"],
    tue: ["09:00-17:00"],
    wed: ["09:00-17:00"],
    thu: ["09:00-17:00"],
    fri: ["09:00-17:00"],
  });

  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      await getAllServices();
    };
    verifyAuth();
  }, [checkAuth, getAllServices]);

  
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/");
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  
  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  
  const handleAvailabilityChange = (day, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [value],
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await addStaff({
        name,
        email,
        phone,
        specialization,
        serviceIds: selectedServices,
        availability,
      });
      toast.success("Staff added successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setSpecialization("");
      setSelectedServices([]);
    } catch (error) {
      toast.error(error.message || "Failed to add staff");
    }
  };

  
  if (!authUser || authUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Access Denied. Admins only.
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Staff</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

       
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

        
          <div>
            <label className="block mb-2 text-sm font-medium">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

         
          <div>
            <label className="block mb-2 text-sm font-medium">
              Specialization
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Hair Stylist, Barber"
            />
          </div>

          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Assign Services
            </label>
            <div className="flex flex-wrap gap-3">
              {services?.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  {service.name}
                </label>
              ))}
            </div>
          </div>

         
          <div>
            <label className="block mb-2 text-sm font-medium">
              Availability
            </label>
            {Object.keys(availability).map((day) => (
              <div key={day} className="flex items-center gap-3 mb-2">
                <span className="capitalize w-12">{day}</span>
                <input
                  type="text"
                  value={availability[day][0]}
                  onChange={(e) =>
                    handleAvailabilityChange(day, e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  placeholder="09:00-17:00"
                />
              </div>
            ))}
          </div>

          
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-lg font-semibold transition"
          >
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffPage;
