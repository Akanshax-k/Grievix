"use client";

import { useState, useRef, useMemo } from "react";
import {
  ImagePlus,
  X,
  ZoomIn,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Loader2,
  Camera,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ImageVerification } from "@/lib/imageVerification";

interface UploadSectionProps {
  image: File | null;
  onImageChange: (file: File | null) => void;
  verification: ImageVerification | null;
  verifying: boolean;
}

export default function UploadSection({
  image,
  onImageChange,
  verification,
  verifying,
}: UploadSectionProps) {
  const [dragging, setDragging] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  const handleFile = (files: FileList) => {
    const file = Array.from(files).find((f) => f.type.startsWith("image/"));
    if (file) onImageChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files);
  };

  const trustBadge = verification
    ? {
        high: {
          icon: ShieldCheck,
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          label: "High Trust — Original geotagged photo",
        },
        medium: {
          icon: ShieldAlert,
          color: "text-amber-700 bg-amber-50 border-amber-200",
          label: verification.isFreshCapture
            ? "Medium Trust — Fresh capture, limited metadata"
            : "Medium Trust — Some metadata missing",
        },
        low: {
          icon: ShieldX,
          color: "text-red-700 bg-red-50 border-red-200",
          label: verification.warnings.some(w => /WhatsApp|Telegram|Signal|Messenger|Instagram/i.test(w))
            ? "Low Trust — Shared via messaging app (metadata stripped)"
            : "Low Trust — Likely not an original photo",
        },
      }[verification.trustLevel]
    : null;

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Take or upload a clear photo of the issue. We&apos;ll extract
            location data from the photo if available.
          </p>
        </div>

        {/* Upload area */}
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-all duration-200
              ${
                dragging
                  ? "border-blue-400 bg-blue-50/60"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }
            `}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Drag & drop or{" "}
                <span className="text-blue-600">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, HEIC — max 10 MB
              </p>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <div className="aspect-[16/10] relative">
              <Image
                src={previewUrl!}
                alt="Evidence"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setLightboxUrl(previewUrl)}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="w-9 h-9 rounded-full bg-red-500/90 flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="px-3 py-2 flex items-center justify-between bg-white border-t border-gray-100">
              <span className="text-xs text-gray-500 truncate max-w-[65%]">
                {image.name}
              </span>
              <span className="text-[11px] text-gray-400">
                {(image.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFile(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Verification loading */}
        {verifying && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing image metadata…
          </div>
        )}

        {/* Verification results */}
        {verification && !verifying && trustBadge && (
          <div className="space-y-3">
            <div
              className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium ${trustBadge.color}`}
            >
              <trustBadge.icon className="w-4 h-4 shrink-0" />
              {trustBadge.label}
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap gap-2">
              {verification.isFreshCapture && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-md text-xs text-emerald-700 font-medium">
                  <Camera className="w-3 h-3" />
                  Fresh Capture
                </span>
              )}
              {verification.hasGps && verification.gps && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {verification.gps.lat.toFixed(4)},{" "}
                  {verification.gps.lng.toFixed(4)}
                  {verification.locationSource === "gps" && " (GPS)"}
                  {verification.locationSource === "exif" && " (EXIF)"}
                </span>
              )}
              {!verification.hasGps && verification.locationSource === "manual" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
                  <MapPin className="w-3 h-3" />
                  Manual Location
                </span>
              )}
              {verification.hasTimestamp && verification.takenAt && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
                  <Clock className="w-3 h-3 text-blue-500" />
                  {new Date(verification.takenAt).toLocaleString()}
                </span>
              )}
              {verification.cameraMake && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
                  <Camera className="w-3 h-3 text-violet-500" />
                  {verification.cameraMake}{" "}
                  {verification.cameraModel ?? ""}
                </span>
              )}
            </div>

            {/* Warnings */}
            {verification.warnings.length > 0 && (
              <div className="space-y-1.5">
                {verification.warnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-md"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-xl p-2">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {lightboxUrl && (
            <Image
              src={lightboxUrl}
              alt="preview"
              width={800}
              height={600}
              className="rounded-lg object-contain w-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
