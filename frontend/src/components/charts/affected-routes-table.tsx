"use client";

import { motion } from "framer-motion";
import { flightDisruptions } from "@/lib/aviation-data";
import { getStatusColor, getRiskColor } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function AffectedRoutesTable({ limit = 8 }: { limit?: number }) {
  const flights = flightDisruptions
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-panel p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Affected Routes</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">HIGH RISK FLIGHT ROUTES</p>
        </div>
        <button className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
          VIEW ALL <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="text-left py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Flight</th>
              <th className="text-left py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Airline</th>
              <th className="text-left py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Route</th>
              <th className="text-left py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Airspace</th>
              <th className="text-right py-2.5 px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, i) => (
              <motion.tr
                key={flight.flight_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-3">
                  <span className="text-xs font-mono font-semibold text-white">
                    {flight.flight_id}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs text-slate-400">{flight.airline}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs font-mono text-cyan-400/80">{flight.route}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: getStatusColor(flight.status),
                      borderColor: `${getStatusColor(flight.status)}30`,
                      background: `${getStatusColor(flight.status)}15`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: getStatusColor(flight.status) }}
                    />
                    {flight.status}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className="text-[10px] font-mono uppercase"
                    style={{ color: getStatusColor(flight.airspace_status) }}
                  >
                    {flight.airspace_status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${flight.risk_score}%`,
                          background: getRiskColor(flight.risk_score),
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono font-bold w-7 text-right"
                      style={{ color: getRiskColor(flight.risk_score) }}
                    >
                      {flight.risk_score}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
