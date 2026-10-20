export const APP_CONFIG = {
  name: "CivicFix",
  tagline: "From Complaint → Public Support → Official Action → Transparent Resolution",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== "false",
};

export const ISSUE_STATUSES = {
  REPORTED: {
    key: "reported",
    label: "Reported",
    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    dotColor: "bg-red-500",
    description: "Issue has been submitted and is awaiting department review.",
  },
  ACKNOWLEDGED: {
    key: "acknowledged",
    label: "Authority Acknowledged",
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    dotColor: "bg-amber-500",
    description: "Responsible municipal department has reviewed and verified the report.",
  },
  ACTION_UNDERWAY: {
    key: "action_underway",
    label: "Action Underway",
    color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
    dotColor: "bg-orange-500",
    description: "Field teams or contractors have been assigned and work is in progress.",
  },
  RESOLVED: {
    key: "resolved",
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
    description: "Issue repaired and verified with photographic evidence.",
  },
} as const;

export const ISSUE_SEVERITIES = {
  LOW: {
    key: "low",
    label: "Low Severity",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  MEDIUM: {
    key: "medium",
    label: "Medium Severity",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  HIGH: {
    key: "high",
    label: "High Severity",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CRITICAL: {
    key: "critical",
    label: "Critical / Urgent",
    badgeColor: "bg-red-100 text-red-800 border-red-200 font-semibold",
  },
} as const;

export const DEPARTMENTS = [
  { id: "roads", name: "Roads & Public Works", icon: "Road" },
  { id: "waste", name: "Sanitation & Waste Management", icon: "Trash2" },
  { id: "electrical", name: "Electricity & Street Lighting", icon: "Lightbulb" },
  { id: "water", name: "Water Supply & Sewage", icon: "Droplets" },
  { id: "parks", name: "Parks & Urban Greenery", icon: "Trees" },
  { id: "traffic", name: "Traffic & Transit Infrastructure", icon: "ShieldAlert" },
] as const;
