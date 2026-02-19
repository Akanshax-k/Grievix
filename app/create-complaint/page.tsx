// app/create-complaint/page.tsx
"use client";

import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import MainForm from "@/components/create-complaint/Mainform";

export default function CreateComplaintPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 pt-10 pb-12">
        {/* Page header — same style as grievance portal */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Report New Grievance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit your concern directly to the municipal authorities for rapid resolution.
          </p>
        </div>

        {/* Wizard card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <MainForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}