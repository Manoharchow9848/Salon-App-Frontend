"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6">
        <Image
          src="/Hair-Styling.png"
          alt="Salon Background"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-pink-400">Glamour Salon</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Where beauty meets perfection. Book your next appointment with our expert stylists today.
          </p>
          <Link
            href="/services"
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Popular Services
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Hair Styling", image: "/Hair-Styling.png" },
            { name: "Facial & Skincare", image: "/Hair-Styling.png" },
            { name: "Manicure & Pedicure", image: "/Hair-Styling.png" },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <Image
                src={service.image}
                alt={service.name}
                width={400}
                height={300}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Experience luxury and care with our professional {service.name.toLowerCase()} services.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pink-500 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Transform Your Look?
        </h2>
        <p className="mb-6 text-lg">
          Book your appointment today and let our experts bring out your best self.
        </p>
        <Link
          href="/services"
          className="bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
        >
          View Services
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Glamour Salon. All Rights Reserved.
      </footer>
    </div>
  );
}
