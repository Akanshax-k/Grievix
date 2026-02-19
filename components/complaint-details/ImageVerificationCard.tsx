import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Camera,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ImageVerificationData = {
  trustLevel: "high" | "medium" | "low";
  hasExif: boolean;
  hasGps: boolean;
  locationSource: "exif" | "gps" | "manual";
  hasTimestamp: boolean;
  takenAt: string | null;
  cameraMake: string | null;
  cameraModel: string | null;
  warnings: string[];
};

interface ImageVerificationCardProps {
  verification: ImageVerificationData;
}

export default function ImageVerificationCard({
  verification,
}: ImageVerificationCardProps) {
  const trustBadge = {
    high: {
      icon: ShieldCheck,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      label: "High Trust — Original verified photo",
    },
    medium: {
      icon: ShieldAlert,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      label: "Medium Trust — Partially verified",
    },
    low: {
      icon: ShieldX,
      color: "text-red-700 bg-red-50 border-red-200",
      label: "Low Trust — Limited verification",
    },
  }[verification.trustLevel];

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Image Verification</h3>
        </div>

        {/* Trust Level Badge */}
        <div
          className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium ${trustBadge.color}`}
        >
          <trustBadge.icon className="w-4 h-4 shrink-0" />
          {trustBadge.label}
        </div>

        {/* Metadata Pills */}
        <div className="flex flex-wrap gap-2">
          {verification.locationSource && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
              <MapPin className="w-3 h-3 text-blue-500" />
              Location: {verification.locationSource.toUpperCase()}
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
          {verification.hasExif && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-md text-xs text-emerald-700 font-medium">
              <Camera className="w-3 h-3" />
              EXIF Data Present
            </span>
          )}
        </div>

        {/* Warnings */}
        {verification.warnings && verification.warnings.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase">Warnings:</p>
            {verification.warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-md"
              >
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {warning}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
