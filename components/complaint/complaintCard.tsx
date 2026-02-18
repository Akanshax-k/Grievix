type Complaint = {
  id: string;
  department: string;
  status: string;
  description: string;
  date: string;
  image: string;
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: {
    bg: "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  "In Progress": {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  Resolved: {
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
};

export default function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const s = statusConfig[complaint.status];

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex"
      style={{ gap: "2vw", padding: "2vw" }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={complaint.image}
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
              REF ID:
            </span>
            <span className="font-bold text-gray-800" style={{ fontSize: "clamp(9px,0.85vw,11px)" }}>
              {complaint.id}
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
          {complaint.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap" style={{ gap: "1vh" }}>
          <span className="text-gray-400" style={{ fontSize: "clamp(9px,0.8vw,10px)" }}>
            Submitted on {complaint.date}
          </span>

          <button
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
