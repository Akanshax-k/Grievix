"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  RefreshCw,
  Camera,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
} from "lucide-react";
import type { LocationSource } from "./Mainform";
import type { ImageVerification } from "@/lib/imageVerification";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationSectionProps {
  coordinates: Coordinates | null;
  onLocationChange: (coords: Coordinates | null) => void;
  locationSource: LocationSource;
  onLocationSourceChange: (source: LocationSource) => void;
  verification: ImageVerification | null;
}

export default function LocationSection({
  coordinates,
  onLocationChange,
  locationSource,
  onLocationSourceChange,
  verification,
}: LocationSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        onLocationSourceChange("gps");
        setLoading(false);
      },
      () => {
        setError("Unable to fetch location. Please allow access.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

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

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Verify the incident location. You can use the GPS from your photo or your
          current device position.
        </p>
      </div>

      {/* Source badge */}
      {coordinates && (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${
              locationSource === "exif"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {locationSource === "exif" ? (
              <>
                <Camera className="w-3 h-3" />
                From photo metadata (EXIF)
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                Current device GPS
              </>
            )}
          </span>
        </div>
      )}

      {/* Coordinates display */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
        {coordinates ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Latitude
              </p>
              <p className="text-xl font-bold text-gray-800 tabular-nums">
                {coordinates.lat.toFixed(6)}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Longitude
              </p>
              <p className="text-xl font-bold text-gray-800 tabular-nums">
                {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 gap-2 text-gray-400">
            <MapPin className="w-7 h-7" />
            <p className="text-sm text-center">
              No location detected. Upload a geotagged photo or click below.
            </p>
          </div>
        )}
      </div>

      {/* Verification summary */}
      {verification && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <TrustIcon className={`w-5 h-5 shrink-0 ${trustColor}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700">
              {verification.trustLevel === "high"
                ? "Verified original photo"
                : verification.trustLevel === "medium"
                ? "Partially verified"
                : "Unverified image"}
            </p>
            {verification.hasTimestamp && verification.takenAt && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Taken {new Date(verification.takenAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={fetchLocation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg
          bg-white border border-gray-200 text-gray-700 shadow-sm
          hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Fetching location…
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            {coordinates ? "Use Current Location Instead" : "Get My Location"}
          </>
        )}
      </button>
    </div>
  );
}
