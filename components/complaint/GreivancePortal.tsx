"use client";

import { useState } from "react";
import Navbar from "../ui/navbar";
import ComplaintCard from "./complaintCard";
import Footer from "../ui/footer";

const complaints = [
  {
    id: "CMP-2024-8812",
    department: "Road & Infrastructure",
    status: "Pending",
    description:
      "A large pothole has formed at the intersection of Main St and 4th Ave, causing significant traffic delays and safety hazards for evening commuters.",
    date: "Oct 24, 2025",
    image:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=120&h=90&fit=crop",
  },
  {
    id: "CMP-2024-9120",
    department: "Sanitation Department",
    status: "In Progress",
    description:
      "Regular garbage collection has been missed for the last two weeks on Elm Street. Waste is accumulating near the community park.",
    date: "Oct 22, 2025",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=90&fit=crop",
  },
  {
    id: "CMP-2024-7741",
    department: "Water Department",
    status: "Resolved",
    description:
      "A major water pipe leak is flooding the sidewalk near the public library. Water pressure in the surrounding residential area has dropped significantly.",
    date: "Oct 15, 2025",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=120&h=90&fit=crop",
  },
  {
    id: "CMP-2024-6632",
    department: "Street Lighting",
    status: "Pending",
    description:
      "Three streetlights are non-functional on Oak Avenue, creating dark zones that make walking unsafe for residents during night hours.",
    date: "Oct 25, 2025",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=120&h=90&fit=crop",
  },
  {
    id: "CMP-2024-5510",
    department: "Public Parks",
    status: "Resolved",
    description:
      "The playground equipment in Sunset Park has been vandalized with graffiti and one of the swings is broken, posing a risk to children.",
    date: "Oct 10, 2025",
    image:
      "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=120&h=90&fit=crop",
  },
];

type StatusFilter = "All" | "Pending" | "In Progress" | "Resolved";

export default function GrievancePortal() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = complaints.filter((c) => {
    const matchFilter = activeFilter === "All" || c.status === activeFilter;
    const matchSearch =
      search === "" ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

      {/* Navbar */}
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
          <button className="ml-4 mt-1 shrink-0 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm whitespace-nowrap">
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
              placeholder="Search by ID or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 bg-white text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1">
            {(["All", "Pending", "In Progress", "Resolved"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
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

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No complaints found.</p>
          )}
          {filtered.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}