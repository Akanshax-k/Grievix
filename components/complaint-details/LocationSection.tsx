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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Latitude card */}
        <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Latitude
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {latitude}
            </span>
          </CardContent>
        </Card>

        {/* Longitude card */}
        <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Longitude
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {longitude}
            </span>
          </CardContent>
        </Card>

        {/* Interactive map placeholder */}
        <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 min-h-[80px]">
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
          </CardContent>
        </Card>

      </div>
    </section>
  );
}