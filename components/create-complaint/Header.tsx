"use client";

import { ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-[#447b82]" style={{ backgroundColor: "#447b82" }}>
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm leading-tight">
            Grievance 
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/create-complaint"
            className="text-sm font-semibold text-white hover:text-cyan-200 transition-colors duration-200"
          >
            New Greviance
          </Link>
          <Link
            href="/previous-complaints"
            className="text-sm font-medium text-cyan-100 hover:text-white transition-colors duration-200"
          >
            Previous Greviance
          </Link>
        </nav>

        {/* Right side: logout icon + avatar */}
        <div className="flex items-center gap-3">
          <button className="text-cyan-200 hover:text-white transition-colors duration-200">
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity duration-200 overflow-hidden">
            <span>👮</span>
          </div>
        </div>
      </div>
    </header>
  );
}