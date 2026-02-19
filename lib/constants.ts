/**
 * Frontend Constants — mirrors backend complaint system enums
 */

/* ── Complaint Status ── */
export const COMPLAINT_STATUSES = [
  "Pending",
  "Acknowledged",
  "In Progress",
  "Under Review",
  "Resolved",
  "Closed",
  "Rejected",
] as const;

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

/* ── Status UI Config ── */
export const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Pending: {
    bg: "bg-amber-50 border border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  Acknowledged: {
    bg: "bg-sky-50 border border-sky-200",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  "In Progress": {
    bg: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  "Under Review": {
    bg: "bg-violet-50 border border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  Resolved: {
    bg: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  Closed: {
    bg: "bg-gray-50 border border-gray-200",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  Rejected: {
    bg: "bg-red-50 border border-red-200",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

/* Fallback for unknown statuses */
export const STATUS_FALLBACK = {
  bg: "bg-gray-50 border border-gray-200",
  text: "text-gray-600",
  dot: "bg-gray-400",
};

/* ── Severity ── */
export const SEVERITY_LEVELS = ["Low", "Medium", "High"] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number];

export const SEVERITY_COLORS: Record<string, string> = {
  High: "text-red-600 bg-red-50",
  Medium: "text-amber-600 bg-amber-50",
  Low: "text-green-600 bg-green-50",
};

/* ── Complaint Categories ── */
export const COMPLAINT_CATEGORIES = [
  "Water Logging/Flooding",
  "Water Shortage/No Supply",
  "Garbage Collection Issue",
  "Illegal Garbage Dumping",
  "Road Damage/Potholes",
  "Road Construction Issue",
  "Street Light Not Working",
  "Drainage Blockage/Overflow",
  "Sewage Overflow",
  "Illegal Construction",
  "Encroachment on Public Property",
  "Noise Pollution",
  "Air Pollution",
  "Stray Animals Issue",
  "Fallen Tree/Branch",
  "Park Maintenance Issue",
  "Public Toilet Issue",
  "Traffic Signal Not Working",
  "Traffic Congestion",
  "Illegal Parking",
  "Power Outage",
  "Mosquito Breeding/Fogging Required",
  "Open Manhole/Safety Hazard",
  "Other",
] as const;

/* ── Government Departments ── */
export const DEPARTMENTS = [
  "Water Supply Department",
  "Sanitation and Waste Management",
  "Public Works Department (PWD)",
  "Electricity and Street Lights",
  "Drainage and Sewage Department",
  "Parks and Gardens Department",
  "Health and Hygiene Department",
  "Traffic and Transport Department",
  "Building and Construction Department",
  "Municipal Corporation Office",
  "Revenue Department",
  "Other Department",
] as const;

/* ── Status filter options for the complaints list UI ── */
export const STATUS_FILTERS = [
  "All",
  "Pending",
  "Acknowledged",
  "In Progress",
  "Under Review",
  "Resolved",
  "Closed",
  "Rejected",
] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];
