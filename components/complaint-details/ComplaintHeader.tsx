import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, CalendarDays } from "lucide-react";

interface ComplaintHeaderProps {
  category: string;
  severity: string;
  title: string;
  description: string;
  submissionDate: string;
}

export default function ComplaintHeader({
  category,
  severity,
  title,
  description,
  submissionDate,
}: ComplaintHeaderProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium text-xs px-3 py-1 rounded-full">
          {category}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-600 hover:bg-gray-100 font-medium text-xs px-3 py-1 rounded-full"
        >
          Severity : {severity}
        </Badge>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
        {title}
      </h2>

      <Separator className="bg-gray-100" />

      {/* Description */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
          <FileText className="w-4 h-4 text-gray-500" />
          Description
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>

      <Separator className="bg-gray-100" />

      {/* Submission Date */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
          <CalendarDays className="w-4 h-4" />
          Submission Date
        </div>
        <p className="text-gray-800 font-medium text-sm pl-6">
          {submissionDate}
        </p>
      </div>

    </div>
  );
}