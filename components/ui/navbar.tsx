"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Public Grievance Portal</span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/grievance/new"
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              pathname === "/grievance/new"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            New Grievance
          </Link>
          <Link
            href="/grievance/previous"
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              pathname === "/grievance/previous"
                ? "text-blue-600 bg-blue-50"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Previous Grievance
          </Link>
        </nav>

        {/* Right — Logout + Avatar */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img
              src="https://api.dicebear.com/7.x/thumbs/svg?seed=user"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
}