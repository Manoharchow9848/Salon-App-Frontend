"use client"
import React from "react";
import { Scissors, Sparkles } from "lucide-react";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

const SalonHeader = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="bg-gray-600 shadow-md p-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Scissors className="w-6 h-6 text-pink-500" />
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <Link href="/" className="text-xl font-bold text-white cursor-pointer">
            My Salon
          </Link>
        </div>

        {/* Right Section: Navigation */}
        <nav className="space-x-6 text-gray-200 flex items-center">
          {!authUser && (
            <>
              <Link href="/" className="hover:text-pink-400">Home</Link>
              <Link href="/about" className="hover:text-pink-400">About</Link>
              <Link href="/contact" className="hover:text-pink-400">Contact</Link>
              <Link href="/login" className="hover:text-pink-400">Login</Link>
              <Link href="/signup" className="hover:text-pink-400">Signup</Link>
            </>
          )}

          {authUser && authUser.role === "customer" && (
            <>
              <Link href="/services" className="hover:text-pink-400">Services</Link>
              <Link href="/profile" className="hover:text-pink-400">Profile</Link>
              
              <Link href="/my-appointments" className="hover:text-pink-400">My Appointments</Link>
              <button
                onClick={logout}
                className="hover:text-red-400 focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )}

          {authUser && authUser.role === "admin" && (
            <>
              
              <Link href="/admin/add-service" className="hover:text-pink-400">Add Service</Link>
              <Link href="/admin/add-staff" className="hover:text-pink-400">Add Staff</Link>
              <Link href="/admin/appointments" className="hover:text-pink-400">Manage Appointments</Link>
              <Link href="/admin/get-staff-details" className="hover:text-pink-400"> Manage Staff</Link>
              <Link href="/admin/get-service-details" className="hover:text-pink-400"> Manage Services</Link>
              <button
                onClick={logout}
                className="hover:text-red-400 focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
          {authUser && authUser.role === "staff" && (
            <>
              
              <Link href="/staff/schedules" className="hover:text-pink-400">Manage Schedules</Link>
              <button
                onClick={logout}
                className="hover:text-red-400 focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default SalonHeader;
