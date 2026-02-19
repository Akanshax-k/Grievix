import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Camera,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";

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

const TRUST_MAP = {
  high: {
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "High Trust",
    description: "Original verified photo",
  },
  medium: {
    icon: ShieldAlert,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Medium Trust",
    description: "Partially verified",
  },
  low: {
    icon: ShieldX,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    label: "Low Trust",
    description: "Limited verification",
  },
} as const;

export default function ImageVerificationCard({
  verification,
}: ImageVerificationCardProps) {
  const trust = TRUST_MAP[verification.trustLevel];
  const TrustIcon = trust.icon;

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Image Verification
      </h3>

      {/* Trust level */}
      <div
        className={`flex items-center gap-3 p-3 rounded-md border ${trust.bg} ${trust.border} mb-4`}
      >
        <TrustIcon className={`w-5 h-5 shrink-0 ${trust.text}`} />
        <div>
          <p className={`text-sm font-medium ${trust.text}`}>{trust.label}</p>
          <p className={`text-xs ${trust.text} opacity-80`}>
            {trust.description}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {verification.locationSource && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {verification.locationSource.toUpperCase()}
          </span>
        )}
        {verification.hasTimestamp && verification.takenAt && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(verification.takenAt).toLocaleString()}
          </span>
        )}
        {verification.cameraMake && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
            <Camera className="w-3 h-3" />
            {verification.cameraMake} {verification.cameraModel ?? ""}
          </span>
        )}
        {verification.hasExif && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded text-xs text-emerald-700 font-medium">
            EXIF ✓
          </span>
        )}
      </div>

      {/* Warnings */}
      {verification.warnings?.length > 0 && (
        <div className="space-y-1.5">
          {verification.warnings.map((warning, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-2 rounded"
            >
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
