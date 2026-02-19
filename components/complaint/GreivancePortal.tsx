"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../ui/navbar";
import ComplaintCard from "./complaintCard";
import Footer from "../ui/footer";
import { useGetComplaintsQuery } from "@/redux/api/complaintApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { STATUS_FILTERS, type StatusFilter } from "@/lib/constants";

export default function GrievancePortal() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const token = useSelector((s: RootState) => s.user.token);

  const { data, isLoading, isError, error } = useGetComplaintsQuery(undefined, {
    skip: !token,
  });

  const complaints = data?.data?.complaints ?? [];

  const filtered = complaints.filter((c) => {
    const matchFilter = activeFilter === "All" || c.status === activeFilter;
    const matchSearch =
      search === "" ||
      c._id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.category ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 pt-10 pb-12">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your submitted grievances with the local authorities.
            </p>
          </div>
          <button
            onClick={() => router.push("/create-complaint")}
            className="ml-4 mt-1 shrink-0 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm whitespace-nowrap"
          >
            Submit New Complaint
          </button>
        </div>

        {/* Search + Filter Row */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className="flex-1 min-w-0 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by ID, description, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 bg-white text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {!token && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-3">Please log in to view your complaints.</p>
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Go to Login →
            </button>
          </div>
        )}

        {token && isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {token && isError && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">
              Failed to load complaints.{" "}
              {(error as { data?: { message?: string } })?.data?.message || "Please try again."}
            </p>
          </div>
        )}

        {token && !isLoading && !isError && (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-10 text-sm">No complaints found.</p>
            )}
            {filtered.map((complaint) => (
              <ComplaintCard 
                key={complaint._id} 
                complaint={{
                  ...complaint,
                  category: complaint.category ?? "Uncategorized",
                  severity: complaint.severity ?? "Medium",
                  department: complaint.department ?? "General"
                }} 
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}