"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { airspaceZones } from "@/lib/aviation-data";
import { getStatusColor } from "@/lib/utils";
import { Shield, AlertTriangle, XOctagon } from "lucide-react";

export function AirspaceStatus() {
  const closed = airspaceZones.filter((z) => z.status === "closed");
  const restricted = airspaceZones.filter((z) => z.status === "restricted");
  const sortedZones = useMemo(() => {
    return [...airspaceZones].sort((a, b) => {
      const aClosed = a.status === "closed";
      const bClosed = b.status === "closed";
      if (aClosed !== bClosed) return aClosed ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">Airspace Status</h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {closed.length} CLOSED · {restricted.length} RESTRICTED
        </p>
      </div>

      <div className="space-y-2">
        {sortedZones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `${getStatusColor(zone.status)}30`,
                  background: `${getStatusColor(zone.status)}10`,
                }}
              >
                {zone.status === "closed" ? (
                  <XOctagon className="h-4 w-4" style={{ color: getStatusColor(zone.status) }} />
                ) : (
                  <AlertTriangle className="h-4 w-4" style={{ color: getStatusColor(zone.status) }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white truncate">{zone.name}</span>
                  <span
                    className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border"
                    style={{
                      color: getStatusColor(zone.status),
                      borderColor: `${getStatusColor(zone.status)}30`,
                      background: `${getStatusColor(zone.status)}10`,
                    }}
                  >
                    {zone.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{zone.reason}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-semibold text-white">
                  {zone.affected_flights}
                </p>
                <p className="text-[9px] text-slate-500">flights</p>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}
