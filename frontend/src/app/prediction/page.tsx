"use client";

import { motion } from "framer-motion";
import { PredictionPanel } from "@/components/prediction/prediction-panel";
import { Brain, Database, Cpu, GitBranch } from "lucide-react";

export default function PredictionPage() {
  const modelSpecs = [
    { label: "Model Type", value: "RandomForest + XGBoost", icon: GitBranch },
    { label: "Training Data", value: "48,729 flight records", icon: Database },
    { label: "Accuracy", value: "94.2%", icon: Brain },
    { label: "Last Trained", value: "2026-03-09 06:00 UTC", icon: Cpu },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white heading-display">Prediction Engine</h1>
        <p className="text-sm text-slate-500 mt-1">
          ML-powered disruption risk prediction for aviation routes
        </p>
      </motion.div>

      {/* Model Specs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {modelSpecs.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-4 flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/15">
              <spec.icon className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase">{spec.label}</p>
              <p className="text-xs font-semibold text-white">{spec.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Prediction Panel */}
      <PredictionPanel />

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-3">Model Architecture</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="label-caps mb-2">Feature Engineering</p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                Geopolitical risk encoding
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                Airspace status vectorization
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                Carrier historical patterns
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                Temporal conflict indicators
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-2">Ensemble Pipeline</p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-purple-400" />
                RandomForest (n=200 estimators)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-purple-400" />
                XGBoost (learning_rate=0.1)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-purple-400" />
                Soft voting ensemble
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-purple-400" />
                Cross-validation (k=5)
              </li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-2">Output Metrics</p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Disruption probability (0–100)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Confidence interval
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Feature importance ranking
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Actionable recommendations
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
