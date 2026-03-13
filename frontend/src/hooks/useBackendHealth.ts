"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BackendStatus = "online" | "reconnecting" | "disconnected";

export interface BackendHealthState {
  status: BackendStatus;
  message: string;
  lastChecked: Date | null;
  backendInfo?: {
    service?: string;
    version?: string;
  };
}

const DEFAULT_CHECK_INTERVAL_MS = 5000;
const DISCONNECT_AFTER_FAILURES = 3;

export function useBackendHealth(checkInterval: number = DEFAULT_CHECK_INTERVAL_MS) {
  const [health, setHealth] = useState<BackendHealthState>({
    status: "reconnecting",
    message: "Reconnecting to backend...",
    lastChecked: null,
  });

  const failureCountRef = useRef(0);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const markFailure = useCallback((checkedAt: Date) => {
    failureCountRef.current += 1;
    const status =
      failureCountRef.current >= DISCONNECT_AFTER_FAILURES ? "disconnected" : "reconnecting";

    setHealth({
      status,
      message:
        status === "disconnected" ? "Backend disconnected" : "Reconnecting to backend...",
      lastChecked: checkedAt,
      backendInfo: undefined,
    });
  }, []);

  const checkHealth = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const healthUrl = new URL("/health", backendUrl);
    healthUrl.searchParams.set("_ts", Date.now().toString());

    const checkedAt = new Date();

    try {
      const response = await fetch(healthUrl.toString(), {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        failureCountRef.current = 0;
        setHealth({
          status: "online",
          message: "Backend online",
          lastChecked: checkedAt,
          backendInfo: {
            service: data.service,
            version: data.version,
          },
        });
        return;
      }

      markFailure(checkedAt);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      markFailure(checkedAt);
    }
  }, [markFailure]);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkHealth, checkInterval);

    return () => {
      clearInterval(interval);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [checkInterval, checkHealth]);

  return { ...health, refetch: checkHealth };
}
