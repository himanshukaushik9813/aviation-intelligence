"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, Shield, Zap, Target } from "lucide-react";
import { airlines, countries } from "@/lib/aviation-data";
import { getRiskColor, getRiskLevel } from "@/lib/utils";

interface PredictionResult {
  risk_score: number;
  risk_level: string;
  confidence: number;
  factors: { factor: string; weight: number }[];
  recommendation: string;
}

function simulatePrediction(
  airline: string,
  origin: string,
  destination: string,
  airspace: string
): PredictionResult {
  const highRiskCountries = ["Ukraine", "Syria", "Afghanistan", "Yemen", "Somalia", "Libya", "Iraq", "Iran", "Russia", "Mali"];
  const sanctionedAirlines = ["Aeroflot"];

  let score = 20;

  if (highRiskCountries.includes(destination)) score += 35;
  if (highRiskCountries.includes(origin)) score += 25;
  if (sanctionedAirlines.includes(airline)) score += 30;
  if (airspace === "closed") score += 25;
  if (airspace === "restricted") score += 15;

  score += Math.random() * 10;
  score = Math.min(99, Math.max(5, Math.round(score)));

  const factors = [
    { factor: "Destination risk assessment", weight: highRiskCountries.includes(destination) ? 0.85 : 0.2 },
    { factor: "Origin security level", weight: highRiskCountries.includes(origin) ? 0.7 : 0.15 },
    { factor: "Airspace status", weight: airspace === "closed" ? 0.9 : airspace === "restricted" ? 0.6 : 0.1 },
    { factor: "Carrier risk profile", weight: sanctionedAirlines.includes(airline) ? 0.95 : 0.25 },
    { factor: "Geopolitical tension index", weight: score > 60 ? 0.75 : 0.3 },
  ].sort((a, b) => b.weight - a.weight);

  const level = getRiskLevel(score);
  const recommendations: Record<string, string> = {
    low: "Route is currently safe for operations. Standard monitoring protocols apply.",
    moderate: "Elevated awareness recommended. Monitor situation closely and prepare contingency routes.",
    high: "Significant disruption risk. Consider alternate routing and prepare for possible cancellation.",
    critical: "Extreme risk level. Route cancellation or indefinite postponement strongly recommended.",
  };

  return {
    risk_score: score,
    risk_level: level,
    confidence: 87 + Math.round(Math.random() * 8),
    factors,
    recommendation: recommendations[level],
  };
}

export function PredictionPanel() {
  const [airline, setAirline] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [airspace, setAirspace] = useState("open");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePredict() {
    if (!airline || !origin || !destination) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1500));

    const prediction = simulatePrediction(airline, origin, destination, airspace);
    setResult(prediction);
    setLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ML Disruption Predictor</h3>
            <p className="text-xs text-slate-500 font-mono">RANDOM FOREST / XGBOOST MODEL</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-caps mb-1.5 block">Airline</label>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="w-full rounded-lg border border-cyan-500/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none transition-colors"
            >
              <option value="" className="bg-[#0a1628]">Select airline...</option>
              {airlines.map((a) => (
                <option key={a} value={a} className="bg-[#0a1628]">{a}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-caps mb-1.5 block">Origin Country</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-lg border border-cyan-500/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none transition-colors"
              >
                <option value="" className="bg-[#0a1628]">Select origin...</option>
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-[#0a1628]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-caps mb-1.5 block">Destination Country</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-cyan-500/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-cyan-500/30 focus:outline-none transition-colors"
              >
                <option value="" className="bg-[#0a1628]">Select destination...</option>
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-[#0a1628]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-caps mb-1.5 block">Airspace Status</label>
            <div className="grid grid-cols-3 gap-2">
              {["open", "restricted", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setAirspace(status)}
                  className={`rounded-lg border px-3 py-2 text-xs font-mono uppercase transition-all ${
                    airspace === status
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : "border-white/[0.05] bg-white/[0.02] text-slate-500 hover:border-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={!airline || !origin || !destination || loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing Route...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Predict Disruption Risk
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Result Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-6"
      >
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Risk Score Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                      cx="80" cy="80" r="68"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="80" cy="80" r="68"
                      fill="none"
                      stroke={getRiskColor(result.risk_score)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.risk_score / 100) * 427} 427`}
                      transform="rotate(-90 80 80)"
                      style={{ filter: `drop-shadow(0 0 8px ${getRiskColor(result.risk_score)}40)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-4xl font-bold font-mono"
                      style={{ color: getRiskColor(result.risk_score) }}
                    >
                      {result.risk_score}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">
                      Risk Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="flex justify-center mb-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase border risk-bg-${result.risk_level}`}
                  style={{
                    color: getRiskColor(result.risk_score),
                    borderColor: `${getRiskColor(result.risk_score)}30`,
                    background: `${getRiskColor(result.risk_score)}15`,
                  }}
                >
                  {result.risk_level === "critical" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <Shield className="h-3.5 w-3.5" />
                  )}
                  {result.risk_level} RISK
                </span>
              </div>

              {/* Confidence */}
              <div className="text-center mb-5">
                <span className="text-[10px] font-mono text-slate-500">
                  MODEL CONFIDENCE: <span className="text-cyan-400">{result.confidence}%</span>
                </span>
              </div>

              {/* Risk Factors */}
              <div className="mb-5">
                <h4 className="label-caps mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {result.factors.map((f) => (
                    <div key={f.factor} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-slate-400">{f.factor}</span>
                          <span className="text-[11px] font-mono" style={{ color: getRiskColor(f.weight * 100) }}>
                            {(f.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/[0.03] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${f.weight * 100}%`,
                              background: getRiskColor(f.weight * 100),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div
                className="rounded-lg border p-3"
                style={{
                  borderColor: `${getRiskColor(result.risk_score)}20`,
                  background: `${getRiskColor(result.risk_score)}08`,
                }}
              >
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 shrink-0 mt-0.5" style={{ color: getRiskColor(result.risk_score) }} />
                  <p className="text-xs text-slate-300 leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500 mb-1">No prediction yet</p>
              <p className="text-xs text-slate-600">
                Configure route parameters and run the ML model
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
