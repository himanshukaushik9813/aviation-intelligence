"use client";

import { motion } from "framer-motion";
import { GlobeVisualization } from "@/components/maps/globe-visualization";
import { AirspaceStatus } from "@/components/dashboard/airspace-status";
import { flightDisruptions, airspaceZones } from "@/lib/aviation-data";
import { getStatusColor } from "@/lib/utils";
import { MapPin, Radar } from "lucide-react";

export default function MapPage() {
  const closedZones = airspaceZones.filter((z) => z.status === "closed");
  const restrictedZones = airspaceZones.filter((z) => z.status === "restricted");

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white heading-display">Global Disruption Map</h1>
        <p className="text-sm text-slate-500 mt-1">Interactive 3D visualization of global aviation disruptions</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-4">
          <p className="label-caps mb-1">Closed Airspaces</p>
          <p className="text-2xl font-bold text-red-400 font-mono">{closedZones.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-4">
          <p className="label-caps mb-1">Restricted Zones</p>
          <p className="text-2xl font-bold text-amber-400 font-mono">{restrictedZones.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-4">
          <p className="label-caps mb-1">Active Routes</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">{flightDisruptions.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel p-4">
          <p className="label-caps mb-1">Total Affected</p>
          <p className="text-2xl font-bold text-blue-400 font-mono">
            {airspaceZones.reduce((sum, z) => sum + z.affected_flights, 0).toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Map + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlobeVisualization />
        </div>
        <div className="space-y-6">
          <AirspaceStatus />

          {/* Active Disruption Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Disruption Hotspots</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">GEOSPATIAL CLUSTERS</p>
            </div>
            <div className="space-y-2">
              {airspaceZones.slice(0, 5).map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" style={{ color: getStatusColor(zone.status) }} />
                  <span className="text-xs text-slate-400 flex-1">{zone.country}</span>
                  <span className="text-[10px] font-mono" style={{ color: getStatusColor(zone.status) }}>
                    {zone.lat.toFixed(1)}°, {zone.lng.toFixed(1)}°
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
