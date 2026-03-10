"use client";

import { motion } from "framer-motion";
import { AirlineImpactChart } from "@/components/charts/airline-impact-chart";
import { DisruptionTimeline } from "@/components/charts/disruption-timeline";
import { CancellationDistribution } from "@/components/charts/cancellation-distribution";
import { airlineImpacts } from "@/lib/aviation-data";
import { getRiskColor } from "@/lib/utils";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AnalyticsPage() {
  const sorted = [...airlineImpacts].sort((a, b) => b.impact_score - a.impact_score);
  const topImpacted = sorted.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white heading-display">Airline Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Comprehensive carrier impact analysis and disruption trends
        </p>
      </motion.div>

      {/* Top Impacted Airlines */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {topImpacted.map((airline, i) => (
          <motion.div
            key={airline.code}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel glass-panel-hover p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold font-mono text-white">{airline.code}</span>
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
                style={{
                  color: getRiskColor(airline.impact_score),
                  borderColor: `${getRiskColor(airline.impact_score)}30`,
                  background: `${getRiskColor(airline.impact_score)}10`,
                }}
              >
                {airline.impact_score}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2 truncate">{airline.airline}</p>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <p className="text-[10px] text-slate-500">CXL</p>
                <p className="text-xs font-mono text-red-400">{airline.cancelled}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">DVR</p>
                <p className="text-xs font-mono text-amber-400">{airline.diverted}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">DLY</p>
                <p className="text-xs font-mono text-blue-400">{airline.delayed}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AirlineImpactChart />
        <DisruptionTimeline />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CancellationDistribution />

        {/* Airline Ranking Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-5"
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Impact Ranking</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ALL CARRIERS SORTED BY IMPACT</p>
          </div>
          <div className="space-y-1.5">
            {sorted.map((airline, i) => (
              <div
                key={airline.code}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                <span className="text-xs font-mono font-semibold text-white w-8">{airline.code}</span>
                <span className="text-xs text-slate-400 flex-1 truncate">{airline.airline}</span>
                <div className="w-20 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${airline.impact_score}%`,
                      background: getRiskColor(airline.impact_score),
                    }}
                  />
                </div>
                <span
                  className="text-xs font-mono font-bold w-6 text-right"
                  style={{ color: getRiskColor(airline.impact_score) }}
                >
                  {airline.impact_score}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
