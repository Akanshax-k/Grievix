// app/create-complaint/page.tsx
// Server Component — no "use client"

import type { Metadata } from "next";
import Header from "@/components/create-complaint/Header";
import MainForm from "@/components/create-complaint/Mainform";

export const metadata: Metadata = {
  title: "Report New Grievance | Public Grievance Portal",
  description: "Submit your concern directly to the municipal authorities for rapid resolution.",
};

export default function CreateComplaintPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EAEFEF" }}>
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-16">
        {/* Page Title — exactly like screenshot */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Report New Grievance
          </h1>
          <p className="text-slate-500 text-sm">
            Submit your concern directly to the municipal authorities for rapid resolution.
          </p>
        </div>

        {/* MainForm: 3-card grid + submit */}
        <MainForm />

        {/* Footer */}
        <p className="text-xs text-slate-400 mt-10">
          © 2026 Public Grievance Portal. All rights reserved.
        </p>
      </main>
    </div>
  );
}