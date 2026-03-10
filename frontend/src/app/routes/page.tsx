"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { flightDisruptions } from "@/lib/aviation-data";
import { getStatusColor, getRiskColor } from "@/lib/utils";
import { Search, Filter, Plane, ArrowRight, MapPin, Clock } from "lucide-react";

export default function RoutesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = flightDisruptions.filter((f) => {
    const matchesSearch =
      f.flight_id.toLowerCase().includes(search.toLowerCase()) ||
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.route.toLowerCase().includes(search.toLowerCase()) ||
      f.origin_city.toLowerCase().includes(search.toLowerCase()) ||
      f.destination_city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: flightDisruptions.length,
    cancelled: flightDisruptions.filter((f) => f.status === "cancelled").length,
    diverted: flightDisruptions.filter((f) => f.status === "diverted").length,
    delayed: flightDisruptions.filter((f) => f.status === "delayed").length,
    on_time: flightDisruptions.filter((f) => f.status === "on_time").length,
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white heading-display">Route Disruptions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed view of all monitored flight routes and their disruption status
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search flights, airlines, routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-cyan-500/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/30 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "cancelled", "diverted", "delayed", "on_time"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg border px-3 py-2 text-[11px] font-mono uppercase transition-all flex items-center gap-1.5 ${
                statusFilter === status
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : "border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/10"
              }`}
            >
              {status !== "all" && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: getStatusColor(status) }} />
              )}
              {status === "all" ? "All" : status.replace("_", " ")}
              <span className="text-[10px] text-slate-600">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Route Cards */}
      <div className="grid gap-3">
        {filtered.sort((a, b) => b.risk_score - a.risk_score).map((flight, i) => (
          <motion.div
            key={flight.flight_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.03 }}
            className="glass-panel glass-panel-hover p-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Flight ID & Airline */}
              <div className="flex items-center gap-3 lg:w-48">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `${getStatusColor(flight.status)}20`,
                    background: `${getStatusColor(flight.status)}08`,
                  }}
                >
                  <Plane
                    className="h-5 w-5"
                    style={{ color: getStatusColor(flight.status) }}
                  />
                </div>
                <div>
                  <p className="text-sm font-mono font-bold text-white">{flight.flight_id}</p>
                  <p className="text-xs text-slate-500">{flight.airline}</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 flex-1">
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{flight.origin_city}</p>
                  <p className="text-[10px] text-slate-500">{flight.origin_country}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-3 w-3" />
                  <div className="h-px w-12 bg-gradient-to-r from-slate-600 to-cyan-500/50" />
                  <ArrowRight className="h-3 w-3 text-cyan-500/50" />
                  <div className="h-px w-12 bg-gradient-to-r from-cyan-500/50 to-slate-600" />
                  <MapPin className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{flight.destination_city}</p>
                  <p className="text-[10px] text-slate-500">{flight.destination_country}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-full border"
                  style={{
                    color: getStatusColor(flight.status),
                    borderColor: `${getStatusColor(flight.status)}30`,
                    background: `${getStatusColor(flight.status)}12`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: getStatusColor(flight.status) }} />
                  {flight.status}
                </span>

                <span
                  className="text-[10px] font-mono uppercase px-2 py-1 rounded border"
                  style={{
                    color: getStatusColor(flight.airspace_status),
                    borderColor: `${getStatusColor(flight.airspace_status)}20`,
                    background: `${getStatusColor(flight.airspace_status)}08`,
                  }}
                >
                  {flight.airspace_status}
                </span>

                {/* Risk Score */}
                <div className="flex items-center gap-2 min-w-[80px]">
                  <div className="w-12 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${flight.risk_score}%`,
                        background: getRiskColor(flight.risk_score),
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: getRiskColor(flight.risk_score) }}
                  >
                    {flight.risk_score}
                  </span>
                </div>
              </div>
            </div>

            {/* Reason */}
            {flight.cancellation_reason !== "None" && (
              <div className="mt-3 pt-3 border-t border-white/[0.03]">
                <p className="text-[11px] text-slate-500">
                  <span className="text-slate-600 font-mono">REASON:</span> {flight.cancellation_reason}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
