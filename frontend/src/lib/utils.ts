import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
}

export function getRiskColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

export function getRiskLevel(score: number): "low" | "moderate" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "cancelled": return "#ef4444";
    case "diverted": return "#f59e0b";
    case "delayed": return "#f97316";
    case "on_time": return "#10b981";
    case "closed": return "#ef4444";
    case "restricted": return "#f59e0b";
    case "open": return "#10b981";
    default: return "#64748b";
  }
}
