"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Camera,
  FileText,
  MapPin,
  Home,
  User,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from "lucide-react";
import type { LocationSource } from "./Mainform";
import type { ImageVerification } from "@/lib/imageVerification";

interface Coordinates {
  lat: number;
  lng: number;
}

interface ReviewStepProps {
  image: File | null;
  description: string;
  address: string;
  coordinates: Coordinates | null;
  locationSource: LocationSource;
  verification: ImageVerification | null;
  username: string;
}

export default function ReviewStep({
  image,
  description,
  address,
  coordinates,
  locationSource,
  verification,
  username,
}: ReviewStepProps) {
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  const TrustIcon =
    verification?.trustLevel === "high"
      ? ShieldCheck
      : verification?.trustLevel === "medium"
      ? ShieldAlert
      : ShieldX;

  const trustColor =
    verification?.trustLevel === "high"
      ? "text-emerald-600"
      : verification?.trustLevel === "medium"
      ? "text-amber-600"
      : "text-red-500";

  const trustLabel =
    verification?.trustLevel === "high"
      ? "High Trust"
      : verification?.trustLevel === "medium"
      ? "Medium Trust"
      : "Low Trust";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Please review your grievance details before submitting.
        </p>
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <div className="aspect-[16/9] relative">
            <Image
              src={previewUrl}
              alt="Evidence"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2">
        {/* Submitted by */}
        {username && (
          <Row icon={User} iconColor="text-blue-500" label="Submitted by">
            <p className="text-sm text-gray-700">{username}</p>
          </Row>
        )}

        {/* Description */}
        <Row icon={FileText} iconColor="text-blue-500" label="Description">
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {description || (
              <span className="italic text-gray-400">No description provided</span>
            )}
          </p>
        </Row>

        {/* Address */}
        {address && (
          <Row icon={Home} iconColor="text-violet-500" label="Address">
            <p className="text-sm text-gray-700">{address}</p>
          </Row>
        )}

        {/* Location */}
        <Row icon={MapPin} iconColor="text-emerald-500" label={`Location (${locationSource === "exif" ? "from photo" : "device GPS"})`}>
          {coordinates ? (
            <p className="text-sm text-gray-700 tabular-nums">
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No location</p>
          )}
        </Row>

        {/* Verification */}
        {verification && (
          <Row icon={Camera} iconColor="text-amber-500" label="Image Verification">
            <div className="flex items-center gap-1.5">
              <TrustIcon className={`w-4 h-4 ${trustColor}`} />
              <span className={`text-sm font-medium ${trustColor}`}>
                {trustLabel}
              </span>
            </div>
            {verification.cameraMake && (
              <p className="text-xs text-gray-400 mt-0.5">
                Camera: {verification.cameraMake}{" "}
                {verification.cameraModel ?? ""}
              </p>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}

/* Small helper for consistent rows */
function Row({
  icon: Icon,
  iconColor,
  label,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
