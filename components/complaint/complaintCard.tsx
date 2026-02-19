"use client";

import { useRouter } from "next/navigation";
import { STATUS_CONFIG, STATUS_FALLBACK } from "@/lib/constants";

type Complaint = {
  _id: string;
  description: string;
  imageUrl: string;
  category: string;
  department: string;
  status: string;
  severity: string;
  createdAt: string;
};

export default function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const router = useRouter();
  const s = STATUS_CONFIG[complaint.status] ?? STATUS_FALLBACK;

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex"
      style={{ gap: "2vw", padding: "2vw" }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={complaint.imageUrl}
          alt=""
          className="object-cover rounded-lg"
          style={{
            width: "clamp(60px,8vw,100px)",
            height: "clamp(46px,6vw,76px)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/100x76/e2e8f0/94a3b8?text=IMG";
          }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* REF + Status */}
        <div className="flex items-start justify-between" style={{ gap: "1vw", marginBottom: "0.5vh" }}>
          <div>
            <span className="text-gray-400 font-medium" style={{ fontSize: "clamp(9px,0.85vw,11px)" }}>
              REF ID:{" "}
            </span>
            <span className="font-bold text-gray-800" style={{ fontSize: "clamp(9px,0.85vw,11px)" }}>
              {complaint._id.slice(-8).toUpperCase()}
            </span>
          </div>

          <span
            className={`inline-flex items-center rounded-full font-medium flex-shrink-0 ${s.bg} ${s.text}`}
            style={{ fontSize: "clamp(9px,0.8vw,11px)", gap: "0.4vw", padding: "0.4vh 1vw" }}
          >
            <span
              className={`rounded-full flex-shrink-0 ${s.dot}`}
              style={{ width: "clamp(4px,0.5vw,6px)", height: "clamp(4px,0.5vw,6px)" }}
            />
            {complaint.status}
          </span>
        </div>

        {/* Department */}
        <span className="text-gray-500" style={{ fontSize: "clamp(9px,0.85vw,11px)" }}>
          {complaint.department}
        </span>

        {/* Description */}
        <p
          className="text-gray-600 leading-relaxed line-clamp-2"
          style={{ fontSize: "clamp(9px,0.85vw,11px)", marginBottom: "1.2vh" }}
        >
          {complaint.description || complaint.category}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap" style={{ gap: "1vh" }}>
          <span className="text-gray-400" style={{ fontSize: "clamp(9px,0.8vw,10px)" }}>
            Submitted on {formattedDate}
          </span>

          <button
            onClick={() => router.push(`/complaint-details?id=${complaint._id}`)}
            className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
            style={{ fontSize: "clamp(9px,0.85vw,11px)", gap: "0.3vw" }}
          >
            See Full Detail →
          </button>
        </div>
      </div>
    </div>
  );
}
