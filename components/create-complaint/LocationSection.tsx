"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, RefreshCw } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationSectionProps {
  coordinates: Coordinates | null;
  onLocationChange: (coords: Coordinates | null) => void;
}

export default function LocationSection({ coordinates, onLocationChange }: LocationSectionProps) {
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
        onLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError("Unable to fetch location. Please allow access.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-1 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Incident Location
        </CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">Automatic GPS coordinate capture</p>
      </CardHeader>

      <CardContent className="px-5 pb-5 flex flex-col flex-1 justify-between space-y-4">
        {/* Spacer to push coords + button to bottom like screenshot */}
        <div className="flex-1" />

        {/* Coordinates row */}
        <div className="flex justify-between items-end px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Latitude
            </p>
            <p className="text-lg font-bold text-slate-800 tabular-nums">
              {coordinates ? coordinates.lat.toFixed(4) : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Longitude
            </p>
            <p className="text-lg font-bold text-slate-800 tabular-nums">
              {coordinates ? coordinates.lng.toFixed(4) : "—"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        {/* Refresh Location button — matches screenshot style */}
        <Button
          type="button"
          onClick={fetchLocation}
          disabled={loading}
          variant="outline"
          className="w-full h-10 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium
            hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 mr-2" />
              Refresh Location
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}