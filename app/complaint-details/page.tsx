"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGetComplaintByIdQuery } from "@/redux/api/complaintApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Navbar from "@/components/ui/navbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  STATUS_CONFIG,
  STATUS_FALLBACK,
  SEVERITY_COLORS,
} from "@/lib/constants";
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
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-sm">
          No complaint ID provided.
        </p>
        <Link
          href="/complaint"
          className="text-sm mt-3 inline-block text-foreground underline underline-offset-4 hover:opacity-70"
        >
          Back to complaints
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-destructive">
          Failed to load complaint details.
        </p>
        <Link
          href="/complaint"
          className="text-sm mt-3 inline-block text-foreground underline underline-offset-4 hover:opacity-70"
        >
          Back to complaints
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  const statusStyle = STATUS_CONFIG[complaint.status] ?? STATUS_FALLBACK;

  const lat = complaint.location.coordinates[1];
  const lng = complaint.location.coordinates[0];

  return (
    <>
      {/* Back link — subtle, editorial */}
      <Link
        href="/complaint"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to complaints
      </Link>

      {/* Evidence image — hero, full-width */}
      <div className="rounded-lg overflow-hidden mb-8 bg-muted">
        <img
          src={complaint.imageUrl}
          alt="Complaint evidence"
          className="w-full aspect-[16/9] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/800x450/e5e5e5/a3a3a3?text=No+Image";
          }}
        />
      </div>

      {/* Header row — badges left, status right */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="font-normal text-xs">
            {complaint.category}
          </Badge>
          <Badge
            className={`text-xs font-normal border ${
              SEVERITY_COLORS[complaint.severity] ??
              "text-muted-foreground bg-muted"
            }`}
          >
            {complaint.severity}
          </Badge>
        </div>

        {/* Status indicator with dot */}
        <div
          className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
          />
          {complaint.status}
        </div>
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-foreground mb-3">
        {complaint.description || "No description provided."}
      </p>

      {/* Meta line — date · department · resolved */}
      <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground mb-10">
        <span>Submitted {formattedDate}</span>
        {complaint.department && (
          <>
            <span className="text-border">·</span>
            <span>{complaint.department}</span>
          </>
        )}
        {complaint.resolvedAt && (
          <>
            <span className="text-border">·</span>
            <span>
              Resolved{" "}
              {new Date(complaint.resolvedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </>
        )}
      </div>

      {/* Location — clean, no card wrapping */}
      <div className="border-t border-border pt-8 mb-10">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Location
        </h2>
        <p className="text-sm text-foreground">
          {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
        </p>
        {complaint.location.address && (
          <p className="text-sm text-muted-foreground mt-1">
            {complaint.location.address}
          </p>
        )}
      </div>

      {/* Verification + AI Analysis — side-by-side grid */}
      {(complaint.imageVerification || complaint.aiAnalysis) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {complaint.imageVerification && (
            <ImageVerificationCard
              verification={complaint.imageVerification}
            />
          )}
          {complaint.aiAnalysis && (
            <AIAnalysisCard aiAnalysis={complaint.aiAnalysis} />
          )}
        </div>
      )}
    </>
  );
}

export default function ComplaintDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <ComplaintDetailsContent />
        </Suspense>
      </main>
    </div>
  );
}
