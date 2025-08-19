"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Utility: "YYYY-MM-DD"
const dayKey = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};

// 09:00..16:00 on selected day (hourly start times)
const buildDaySlots = (date) => {
  const slots = [];
  for (let h = 9; h < 17; h++) {
    const d = new Date(date);
    d.setHours(h, 0, 0, 0);
    slots.push(d);
  }
  return slots;
};

export default function ServiceDetailPage() {
  const { id: serviceId } = useParams();
  const router = useRouter();
  const { checkAuth, isCheckingAuth, isAuthenticated, authUser } = useAuthStore();

  const [service, setService] = useState(null);
  const [staffId, setStaffId] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const [bookingsByDay, setBookingsByDay] = useState({});
  const [blockedDays, setBlockedDays] = useState([]);

  const [loading, setLoading] = useState(false);

  // auth
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) router.push("/");
  }, [isCheckingAuth, isAuthenticated, router]);

  // service
  useEffect(() => {
    if (!serviceId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    fetch(`http://localhost:5000/api/auth/service/${serviceId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then(setService)
      .catch((e) => console.error("service fetch err", e));
  }, [serviceId]);

  // bookings for staff
  useEffect(() => {
    setSelectedDateTime(null);
    setBookingsByDay({});
    setBlockedDays([]);
    if (!staffId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`http://localhost:5000/api/auth/booked-slots?staffId=${staffId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((rows) => {
        const grouped = rows.reduce((acc, r) => {
          const dt = new Date(r.appointmentDate);
          const key = dayKey(dt);
          if (!acc[key]) acc[key] = [];
          const d = new Date(dt);
          d.setMinutes(0, 0, 0);
          acc[key].push(d);
          return acc;
        }, {});

        const full = [];
        Object.entries(grouped).forEach(([key, taken]) => {
          const uniq = [...new Set(taken.map((t) => t.toISOString()))];
          const day = new Date(key);
          const allSlots = buildDaySlots(day).map((d) => d.toISOString());
          const isFull = allSlots.every((s) => uniq.includes(s));
          if (isFull) {
            full.push(new Date(key)); // block the whole day
            grouped[key] = []; // clear out times since day is blocked
          }
        });

        setBlockedDays(full);
        setBookingsByDay(grouped);
      })
      .catch((e) => console.error("booked-slots fetch err", e));
  }, [staffId]);

  const excludeTimesForSelectedDay = useMemo(() => {
    if (!selectedDateTime) return [];
    const key = dayKey(selectedDateTime);
    return bookingsByDay[key] || [];
  }, [selectedDateTime, bookingsByDay]);

 const handleBookAndPay = async () => {
  if (!authUser?.id) return alert("Please login");
  if (!staffId || !selectedDateTime) return alert("Select staff and date/time");

  setLoading(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/book-appointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: authUser.id,
        staffId,
        serviceId,
        appointmentDate: selectedDateTime.toISOString(),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to book appointment");

    const cashfree = Cashfree({
  mode: "sandbox",
});
    const checkoutOptions = {
      paymentSessionId: data.paymentSessionId,
      redirectTarget: "_self", 
    };
    const result = await cashfree.checkout(checkoutOptions);
    console.log("Cashfree checkout result:", result);

  } catch (e) {
    console.error(e);
    alert(e.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};


  if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Checking authentication...</div>;
  }
  if (!service) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Loading service details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-black rounded-lg shadow border border-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
      <p className="text-gray-400 mb-4">{service.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><div className="text-sm text-gray-400">Duration</div><div className="font-semibold">{service.duration} mins</div></div>
        <div><div className="text-sm text-gray-400">Price</div><div className="font-semibold">₹{service.price}</div></div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Staff</label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {service?.StaffServices?.map((ss) => (
            <option key={ss.staff.id} value={ss.staff.id}>
              {ss.staff.name} {ss.staff.staffProfile?.specialization ? `(${ss.staff.staffProfile.specialization})` : ""}
            </option>
          ))}
        </select>
      </div>

      {staffId && (
        <div className="mb-6">
          <label className="block font-semibold mb-2">Choose Date & Time</label>
          <DatePicker
            selected={selectedDateTime}
            onChange={setSelectedDateTime}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            minDate={new Date()}
            minTime={new Date(new Date().setHours(9, 0, 0, 0))}
            maxTime={new Date(new Date().setHours(17, 0, 0, 0))}
            excludeDates={blockedDays}
            excludeTimes={excludeTimesForSelectedDay}
          />
          <p className="text-xs text-gray-500 mt-2">Working hours: 09:00–17:00 (hourly slots).</p>
        </div>
      )}

      <button
        onClick={handleBookAndPay}
        disabled={loading || !staffId || !selectedDateTime}
        className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded font-semibold"
      >
        {loading ? "Processing..." : "Book & Pay"}
      </button>
    </div>
  );
}
