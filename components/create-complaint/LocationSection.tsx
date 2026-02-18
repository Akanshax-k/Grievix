import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationSectionProps {
  latitude: string;
  longitude: string;
}

export default function LocationSection({
  latitude,
  longitude,
}: LocationSectionProps) {
  return (
    <section className="flex flex-col gap-4">

      {/* Heading */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-800">Incident Location</h2>
      </div>

      {/* Bottom row: lat/lng + map + status — exact screenshot layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Left: Latitude + Longitude stacked */}
        <div className="flex flex-col gap-3">
          {/* Latitude */}
          <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-gray-50 min-w-[160px]">
            <CardContent className="px-4 py-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Latitude
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {latitude}
              </span>
            </CardContent>
          </Card>

          {/* Longitude */}
          <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-gray-50 min-w-[160px]">
            <CardContent className="px-4 py-3 flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Longitude
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {longitude}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Center: Interactive Map View */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              Interactive Map View
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Geo-coordinates pinned successfully
            </p>
          </div>
        </div>

        {/* Right: Current Status */}
        <div className="flex flex-col items-end gap-1 ml-auto">
          <span className="text-sm font-bold text-gray-800">Current Status :</span>
          <span className="text-base font-bold text-blue-600">In progress</span>
        </div>

      </div>
    </section>
  );
}