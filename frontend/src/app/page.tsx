"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroStats } from "@/components/dashboard/hero-stats";
import { GlobeVisualization } from "@/components/maps/globe-visualization";
import { AirlineImpactChart } from "@/components/charts/airline-impact-chart";
import { DisruptionTimeline } from "@/components/charts/disruption-timeline";
import { CancellationDistribution } from "@/components/charts/cancellation-distribution";
import { AffectedRoutesTable } from "@/components/charts/affected-routes-table";
import { AirspaceStatus } from "@/components/dashboard/airspace-status";
import { BackendStatus } from "@/components/dashboard/backend-status";
import { Activity, Clock } from "lucide-react";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Set initial time on client mount
    setCurrentTime(new Date().toLocaleTimeString());

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-status-pulse" />
            <span className="text-[10px] font-mono text-emerald-400/80 tracking-[0.15em] uppercase">Live Monitoring</span>
          </div>
          <h1 className="text-4xl font-bold text-white heading-display mb-2">
            Aviation Intelligence
          </h1>
          <p className="text-base text-slate-400 font-light">
            Global disruption monitoring and predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-5">
          <BackendStatus />
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Clock className="h-4 w-4" />
            <span suppressHydrationWarning>LAST UPDATE: {currentTime || "Loading..."}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-xl border border-[#1FA3FF]/15 bg-[#1FA3FF]/8 glow-cyan">
            <Activity className="h-4 w-4 text-[#1FA3FF]" />
            <span className="text-[#1FA3FF]">48,729 FLIGHTS</span>
          </div>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <HeroStats />

      {/* Globe + Airspace Status */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlobeVisualization />
        </div>
        <AirspaceStatus />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <AirlineImpactChart />
        <DisruptionTimeline />
      </div>

      {/* Table + Distribution */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AffectedRoutesTable />
        </div>
        <CancellationDistribution />
      </div>
    </div>
  );
}
