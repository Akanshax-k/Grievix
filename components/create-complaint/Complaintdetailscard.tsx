"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon } from "lucide-react";

interface ComplaintDetailsCardProps {
  description: string;
  onDescriptionChange: (val: string) => void;
}

export default function ComplaintDetailsCard({
  description,
  onDescriptionChange,
}: ComplaintDetailsCardProps) {
  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-1 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <InfoIcon className="w-4 h-4 text-blue-600" />
          Complaint Details
        </CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">Describe the issue in detail</p>
      </CardHeader>

      <CardContent className="px-5 pb-5 flex flex-col flex-1 space-y-3">
        <div className="flex flex-col flex-1 space-y-2">
          <p className="text-xs font-medium text-slate-600">Statement of Grievance</p>
          <div className="relative flex-1">
            <Textarea
              placeholder="Please provide specifics: exact landmark, duration of issue, and impact on public health or safety..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              maxLength={500}
              className="w-full h-full min-h-[160px] rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 text-xs resize-none
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 transition-all duration-300 pb-6"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 tabular-nums">
              {description.length} / 500
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}