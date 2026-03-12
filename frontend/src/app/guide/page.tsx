import { Activity, CloudOff, Globe2, Radar, Route, ShieldAlert } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-300/80">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-status-pulse" />
          Operator Guide
        </div>
        <h1 className="text-3xl font-bold text-white heading-display">How to Use the Platform</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          A quick walkthrough of the aviation intelligence dashboard, globe visualization, and
          disruption monitoring tools.
        </p>
      </div>

      {/* Quick start */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
              <Radar className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Open the Dashboard</h3>
              <p className="text-xs text-slate-500">Landing page overview</p>
            </div>
          </div>
          <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
            <li>Review the system status and live monitoring badge.</li>
            <li>Scan the globe for disrupted routes and hotspots.</li>
            <li>Check airspace status cards for closures and restrictions.</li>
          </ol>
        </div>

        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
              <Globe2 className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Explore the Globe</h3>
              <p className="text-xs text-slate-500">Interactive 3D view</p>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>Drag to rotate and inspect global traffic corridors.</li>
            <li>Scroll to zoom and focus on high-risk regions.</li>
            <li>Watch pulsing nodes for major hubs and disruptions.</li>
          </ul>
        </div>

        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Read the Analytics</h3>
              <p className="text-xs text-slate-500">Trends and metrics</p>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>Use the charts to track cancellations and delays.</li>
            <li>Compare airline impact scores.</li>
            <li>Review affected routes for operational planning.</li>
          </ul>
        </div>
      </div>

      {/* Deep dive */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
              <Route className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Route Disruptions</h3>
              <p className="text-xs text-slate-500">Understand route severity</p>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>Cyan routes indicate normal operations.</li>
            <li>Orange or red routes indicate delays, diversions, or cancellations.</li>
            <li>Animated particles represent aircraft movement along the route.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Airspace Risk Zones</h3>
              <p className="text-xs text-slate-500">Monitor closures</p>
            </div>
          </div>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>Closed zones show immediate operational impact.</li>
            <li>Restricted zones require rerouting or review.</li>
            <li>Use affected flight counts to prioritize action.</li>
          </ul>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="glass-panel p-6 border border-cyan-400/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
            <CloudOff className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Backend Offline?</h3>
            <p className="text-xs text-slate-500">Quick checks before escalation</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 space-y-2">
          <p>1. Open the backend health endpoint and confirm it returns healthy.</p>
          <p>2. Ensure the frontend environment variable points to the backend URL.</p>
          <p>3. If you use a custom domain, verify CORS settings in the backend.</p>
        </div>
      </div>
    </div>
  );
}
