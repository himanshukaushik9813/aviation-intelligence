"use client";

import { useEffect, useState } from "react";

export type BackendStatus = "checking" | "connected" | "disconnected" | "error";

export interface BackendHealthState {
  status: BackendStatus;
  message: string;
  lastChecked: Date | null;
  backendInfo?: {
    service?: string;
    version?: string;
  };
}

export function useBackendHealth(checkInterval: number = 30000) {
  const [health, setHealth] = useState<BackendHealthState>({
    status: "checking",
    message: "Checking backend connection...",
    lastChecked: null,
  });

  const checkHealth = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${backendUrl}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setHealth({
          status: "connected",
          message: "Backend is running",
          lastChecked: new Date(),
          backendInfo: {
            service: data.service,
            version: data.version,
          },
        });
      } else {
        setHealth({
          status: "error",
          message: `Backend returned status ${response.status}`,
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setHealth({
            status: "disconnected",
            message: "Backend connection timeout",
            lastChecked: new Date(),
          });
        } else {
          setHealth({
            status: "disconnected",
            message: "Backend is not running",
            lastChecked: new Date(),
          });
        }
      } else {
        setHealth({
          status: "error",
          message: "Unknown error checking backend",
          lastChecked: new Date(),
        });
      }
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkHealth, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return { ...health, refetch: checkHealth };
}
