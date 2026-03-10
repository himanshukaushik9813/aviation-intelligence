"use client";

import {
  Plane,
  AlertTriangle,
  Building2,
  ShieldOff,
  Route,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { disruptionStats } from "@/lib/aviation-data";

export function HeroStats() {
  const stats = disruptionStats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatCard
        label="Flights Monitored"
        value={stats.total_flights_monitored}
        subtitle="Global tracking"
        icon={Plane}
        color="cyan"
        delay={0}
      />
      <StatCard
        label="Flights Affected"
        value={stats.flights_affected}
        subtitle={`${stats.cancellation_rate}% disruption rate`}
        icon={AlertTriangle}
        color="red"
        delay={0.05}
      />
      <StatCard
        label="Airlines Impacted"
        value={stats.airlines_impacted}
        subtitle="Across all regions"
        icon={Building2}
        color="amber"
        delay={0.1}
      />
      <StatCard
        label="Airspaces Restricted"
        value={stats.airspaces_restricted}
        subtitle="Active restrictions"
        icon={ShieldOff}
        color="red"
        delay={0.15}
      />
      <StatCard
        label="Routes Disrupted"
        value={stats.routes_disrupted}
        subtitle="International routes"
        icon={Route}
        color="blue"
        delay={0.2}
      />
      <StatCard
        label="Avg Risk Score"
        value={stats.avg_risk_score}
        subtitle="Elevated threat level"
        icon={TrendingUp}
        color="amber"
        delay={0.25}
      />
    </div>
  );
}
