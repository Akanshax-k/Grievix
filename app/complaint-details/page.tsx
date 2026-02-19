"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGetComplaintByIdQuery } from "@/redux/api/complaintApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Navbar from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { STATUS_CONFIG, STATUS_FALLBACK, SEVERITY_COLORS } from "@/lib/constants";
import ImageVerificationCard from "@/components/complaint-details/ImageVerificationCard";
import AIAnalysisCard from "@/components/complaint-details/AIAnalysisCard";

function ComplaintDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = useSelector((s: RootState) => s.user.token);

  const { data, isLoading, isError } = useGetComplaintByIdQuery(id ?? "", {
    skip: !id || !token,
  });

  const complaint = data?.data;

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">No complaint ID provided.</p>
        <Link href="/complaint" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Back to complaints
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-sm">Failed to load complaint details.</p>
        <Link href="/complaint" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Back to complaints
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const statusStyle = STATUS_CONFIG[complaint.status] ?? STATUS_FALLBACK;

  return (
    <>
      {/* Back link + Title */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/complaint"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Complaint Details
        </h1>
      </div>

      {/* Image + Info Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Image */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={complaint.imageUrl}
            alt="Complaint evidence"
            className="w-full h-64 md:h-80 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image";
            }}
          />
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {complaint.category}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SEVERITY_COLORS[complaint.severity] ?? "text-gray-600 bg-gray-50"}`}>
              {complaint.severity} Severity
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {complaint.description || "No description provided."}
          </p>

          <div className="text-xs text-gray-400">
            Submitted on {formattedDate}
          </div>
        </div>
      </section>

      <Separator className="bg-gray-200 my-6" />

      {/* Location + Status */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Incident Location</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Coordinates */}
          <div className="flex flex-col gap-3">
            <Card className="rounded-xl border-0 shadow-sm bg-gray-50 min-w-[160px]">
              <CardContent className="px-4 py-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Latitude
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {complaint.location.coordinates[1].toFixed(4)}°
                </span>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-0 shadow-sm bg-gray-50 min-w-[160px]">
              <CardContent className="px-4 py-3 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Longitude
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {complaint.location.coordinates[0].toFixed(4)}°
                </span>
              </CardContent>
            </Card>
            {complaint.location.address && (
              <Card className="rounded-xl border-0 shadow-sm bg-gray-50 min-w-[160px]">
                <CardContent className="px-4 py-3 flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Address
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {complaint.location.address}
                  </span>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status */}
          <Card className="rounded-xl border shadow-sm w-full sm:w-auto sm:min-w-[200px]">
            <CardContent className="p-5 flex flex-col items-end gap-1">
              <span className="text-sm font-semibold text-gray-700">Current Status:</span>
              <span className={`text-base font-bold px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                {complaint.status}
              </span>
              {complaint.resolvedAt && (
                <span className="text-xs text-gray-400 mt-1">
                  Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                </span>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Verification Section */}
      {complaint.imageVerification && (
        <>
          <Separator className="bg-gray-200 my-6" />
          <ImageVerificationCard verification={complaint.imageVerification} />
        </>
      )}

      {/* AI Analysis Section */}
      {complaint.aiAnalysis && (
        <>
          <Separator className="bg-gray-200 my-6" />
          <AIAnalysisCard aiAnalysis={complaint.aiAnalysis} />
        </>
      )}
    </>
  );
}

export default function ComplaintDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          }
        >
          <ComplaintDetailsContent />
        </Suspense>
      </main>
    </div>
  );
}