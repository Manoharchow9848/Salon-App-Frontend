"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isLoggingIn, isCheckingAuth, checkAuth, isAuthenticated } =
    useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      setLoading(false);
      router.push("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth(); 
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
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
    <div className="flex min-h-screen bg-black text-white">
     
      <div className="flex-1 flex items-center justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1940/1940993.png"
          alt="Hair Tools"
          className="w-60 h-60"
        />
      </div>

      
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit}>
           
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-pink-500"
              />
            </div>

        
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div className="flex justify-end mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-pink-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>

            
            <p className="mt-4 text-center text-sm text-gray-400">
              New user?{" "}
              <Link
                href="/signup"
                className="text-pink-500 hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
