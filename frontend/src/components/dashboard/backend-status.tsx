"use client";

import { useBackendHealth } from "@/hooks/useBackendHealth";
import { Server, Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export function BackendStatus() {
  const { status, message, lastChecked, backendInfo, refetch } = useBackendHealth(30000);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-emerald-400";
      case "checking":
        return "text-yellow-400";
      case "disconnected":
        return "text-red-400";
      case "error":
        return "text-orange-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4" />;
      case "checking":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Backend Connected";
      case "checking":
        return "Checking...";
      case "disconnected":
        return "Backend Offline";
      case "error":
        return "Connection Error";
      default:
        return "Unknown";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm"
    >
      <div className={`flex items-center gap-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-mono font-medium">{getStatusText()}</span>
      </div>

      {status === "connected" && backendInfo?.service && (
        <div className="text-[10px] text-slate-500 font-mono border-l border-white/10 pl-3">
          {backendInfo.service}
        </div>
      )}

      {status === "disconnected" && (
        <button
          onClick={refetch}
          className="text-[10px] text-slate-400 hover:text-white font-mono border-l border-white/10 pl-3 transition-colors"
          title="Retry connection"
        >
          RETRY
        </button>
      )}

      {lastChecked && status === "connected" && (
        <div className="text-[9px] text-slate-600 font-mono">
          {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
}
