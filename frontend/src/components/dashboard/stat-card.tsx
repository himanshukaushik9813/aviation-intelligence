"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "cyan" | "red" | "amber" | "emerald" | "blue";
  delay?: number;
}

const colorMap = {
  cyan: {
    icon: "text-blue-400",
    bg: "from-blue-500/12 to-blue-600/3",
    border: "border-blue-500/12",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.1)]",
    value: "text-blue-400",
  },
  red: {
    icon: "text-rose-400",
    bg: "from-rose-500/12 to-rose-600/3",
    border: "border-rose-500/12",
    glow: "shadow-[0_0_40px_rgba(244,63,94,0.1)]",
    value: "text-rose-400",
  },
  amber: {
    icon: "text-amber-400",
    bg: "from-amber-500/12 to-amber-600/3",
    border: "border-amber-500/12",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.1)]",
    value: "text-amber-400",
  },
  emerald: {
    icon: "text-emerald-400",
    bg: "from-emerald-500/12 to-emerald-600/3",
    border: "border-emerald-500/12",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    value: "text-emerald-400",
  },
  blue: {
    icon: "text-cyan-400",
    bg: "from-cyan-500/12 to-cyan-600/3",
    border: "border-cyan-500/12",
    glow: "shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    value: "text-cyan-400",
  },
};

export function StatCard({ label, value, subtitle, icon: Icon, color, delay = 0 }: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`glass-panel glass-panel-hover ${c.glow} p-6 relative overflow-hidden group`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="label-caps mb-3 text-slate-400">{label}</p>
            <p className={`text-4xl font-bold ${c.value} heading-display mb-1 tracking-tight`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-2 font-mono tracking-wide">{subtitle}</p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`h-6 w-6 ${c.icon}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
