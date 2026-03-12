"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  BarChart3,
  Route,
  Brain,
  FileText,
  BookOpen,
  Radar,
  ChevronRight,
} from "lucide-react";

export const SIDEBAR_WIDTH = 72;

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Global Map", href: "/map", icon: Globe },
  { label: "Airline Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Route Disruptions", href: "/routes", icon: Route },
  { label: "Prediction Engine", href: "/prediction", icon: Brain },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "How to Use", href: "/guide", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-[#1FA3FF]/10 bg-[#0E1C3A]/90 backdrop-blur-2xl"
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-[#1FA3FF]/10">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1FA3FF]/20 to-[#00E5FF]/20 border border-[#1FA3FF]/20">
          <Radar className="h-5 w-5 text-[#1FA3FF]" />
          <div className="absolute inset-0 rounded-xl animate-status-pulse" style={{ boxShadow: "0 0 0 0 rgba(31, 163, 255, 0.3)" }} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="text-sm font-bold text-white tracking-wider">ADIP</div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wide">INTEL PLATFORM</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group ${
                  isActive
                    ? "bg-[#1FA3FF]/10 text-[#1FA3FF]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#1FA3FF]"
                    style={{ boxShadow: "0 0 12px rgba(31, 163, 255, 0.6)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#1FA3FF]" : ""}`} />

                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && expanded && (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-[#1FA3FF]/50" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-3 pb-4 border-t border-cyan-500/10 pt-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-status-pulse" />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-[10px] font-mono text-emerald-400/80 tracking-wider">
                  SYSTEMS ONLINE
                </div>
                <div className="text-[9px] font-mono text-slate-600 tracking-wide">
                  LAST SYNC 2m AGO
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
