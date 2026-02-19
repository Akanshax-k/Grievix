"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPinned } from "lucide-react";

interface ComplaintDetailsCardProps {
  description: string;
  onDescriptionChange: (val: string) => void;
  address: string;
  onAddressChange: (val: string) => void;
}

export default function ComplaintDetailsCard({
  description,
  onDescriptionChange,
  address,
  onAddressChange,
}: ComplaintDetailsCardProps) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Provide details about the grievance — the more specific, the faster it
          gets resolved.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Statement of Grievance
        </label>
        <div className="relative">
          <Textarea
            placeholder="Describe the issue: exact location, how long it's been happening, impact on public health or safety…"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            maxLength={500}
            rows={6}
            className="w-full rounded-lg border border-gray-200 bg-white text-gray-700 placeholder:text-gray-400 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300 transition-all duration-200 pb-7 shadow-sm"
          />
          <span className="absolute bottom-3 right-3.5 text-[11px] text-gray-400 tabular-nums">
            {description.length} / 500
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <MapPinned className="w-3.5 h-3.5 text-blue-600" />
          Address
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <Input
          placeholder="e.g. 281/33, Main Road, Sector 5, Near City Mall"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder:text-gray-400 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300 transition-all duration-200 shadow-sm"
        />
      </div>
    </div>
  );
}
