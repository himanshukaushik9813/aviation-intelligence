"use client";

import { motion } from "framer-motion";
import { cancellationReasons } from "@/lib/aviation-data";

const colors = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6", "#8b5cf6", "#64748b"];

export function CancellationDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel p-5"
    >
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">Cancellation Reasons</h3>
        <p className="text-xs text-slate-500 font-mono mt-0.5">DISTRIBUTION ANALYSIS</p>
      </div>

      <div className="space-y-3.5">
        {cancellationReasons.map((item, i) => (
          <div key={item.reason}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">{item.reason}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{item.count.toLocaleString()}</span>
                <span className="text-xs font-mono font-semibold" style={{ color: colors[i] }}>
                  {item.percentage}%
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.03] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{ background: colors[i] }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
