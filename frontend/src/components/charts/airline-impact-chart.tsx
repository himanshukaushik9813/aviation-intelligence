"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { airlineImpacts } from "@/lib/aviation-data";

const chartData = airlineImpacts
  .sort((a, b) => b.impact_score - a.impact_score)
  .map((a) => ({
    name: a.code,
    Cancelled: a.cancelled,
    Diverted: a.diverted,
    Delayed: a.delayed,
  }));

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  const airline = airlineImpacts.find((a) => a.code === label);
  return (
    <div className="glass-panel-strong p-3 border border-cyan-500/20 min-w-[180px]">
      <p className="text-xs font-semibold text-white mb-2">{airline?.airline || label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey}
          </span>
          <span className="font-mono text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AirlineImpactChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Airline Impact Analysis</h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">DISRUPTIONS BY CARRIER</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(6,182,212,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6,182,212,0.05)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}
            />
            <Bar dataKey="Cancelled" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={24} />
            <Bar dataKey="Diverted" fill="#f59e0b" radius={[2, 2, 0, 0]} maxBarSize={24} />
            <Bar dataKey="Delayed" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
