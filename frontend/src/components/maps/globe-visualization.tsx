"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { flightDisruptions, airspaceZones } from "@/lib/aviation-data";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function generateArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number = 64,
  altitude: number = 0.15
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    const midFactor = Math.sin(t * Math.PI);
    point.normalize().multiplyScalar(1.01 + altitude * midFactor);
    points.push(point);
  }
  return points;
}

function GlobeCore() {
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  // Create earth texture using canvas (procedural generation)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Ocean base
      ctx.fillStyle = '#0a1f35';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some land masses (simplified continents)
      ctx.fillStyle = '#1a3a52';

      // Africa/Europe
      ctx.beginPath();
      ctx.ellipse(512, 256, 80, 120, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Americas
      ctx.beginPath();
      ctx.ellipse(200, 256, 60, 150, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(160, 350, 50, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Asia
      ctx.beginPath();
      ctx.ellipse(700, 200, 120, 100, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(800, 380, 40, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add grid lines
      ctx.strokeStyle = 'rgba(31, 163, 255, 0.08)';
      ctx.lineWidth = 1;

      // Latitude lines
      for (let i = 0; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 8) * i);
        ctx.lineTo(canvas.width, (canvas.height / 8) * i);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i <= 16; i++) {
        ctx.beginPath();
        ctx.moveTo((canvas.width / 16) * i, 0);
        ctx.lineTo((canvas.width / 16) * i, canvas.height);
        ctx.stroke();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={globeRef}>
      {/* Main Earth globe with texture */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          emissive="#0a2540"
          emissiveIntensity={0.2}
          shininess={25}
          specular="#1FA3FF"
        />
      </mesh>

      {/* Subtle clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 48, 48]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow (inner) */}
      <mesh>
        <sphereGeometry args={[1.015, 48, 48]} />
        <meshBasicMaterial
          color="#1FA3FF"
          transparent
          opacity={0.04}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere glow (outer) */}
      <mesh>
        <sphereGeometry args={[1.12, 48, 48]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Grid overlay */}
      <mesh>
        <sphereGeometry args={[1.008, 32, 32]} />
        <meshBasicMaterial
          color="#1FA3FF"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}

function FlightRoutes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const routes = useMemo(() => {
    return flightDisruptions.map((flight) => {
      const start = latLngToVector3(flight.origin_lat, flight.origin_lng, 1.02);
      const end = latLngToVector3(flight.dest_lat, flight.dest_lng, 1.02);
      const points = generateArcPoints(start, end, 64, 0.15);

      let color = "#10b981";
      let glowIntensity = 0.5;
      if (flight.status === "cancelled") {
        color = "#FF5A5F";
        glowIntensity = 0.9;
      } else if (flight.status === "diverted") {
        color = "#f59e0b";
        glowIntensity = 0.7;
      } else if (flight.status === "delayed") {
        color = "#f97316";
        glowIntensity = 0.6;
      }

      return { points, color, id: flight.flight_id, glowIntensity };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {routes.map((route) => (
        <group key={route.id}>
          {/* Main arc line */}
          <Line
            points={route.points}
            color={route.color}
            lineWidth={1.8}
            transparent
            opacity={route.glowIntensity}
          />
          {/* Glow effect line (slightly larger) */}
          <Line
            points={route.points}
            color={route.color}
            lineWidth={3.5}
            transparent
            opacity={route.glowIntensity * 0.3}
          />
        </group>
      ))}
    </group>
  );
}

function DisruptionPoints() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }

    // Pulsing animation for disruption points
    pointsRefs.current.forEach((point, index) => {
      if (point) {
        const pulse = Math.sin(clock.getElapsedTime() * 2 + index) * 0.3 + 1;
        point.scale.setScalar(pulse);
      }
    });
  });

  const points = useMemo(() => {
    return airspaceZones.map((zone) => {
      const position = latLngToVector3(zone.lat, zone.lng, 1.03);
      const color = zone.status === "closed" ? "#FF5A5F" : "#f59e0b";
      return { position, color, id: zone.id };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {points.map((point, index) => (
        <group key={point.id}>
          {/* Main point */}
          <mesh
            position={point.position}
            ref={(el) => {
              if (el) pointsRefs.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshBasicMaterial color={point.color} transparent opacity={1} />
          </mesh>
          {/* Glow halo */}
          <mesh position={point.position}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial
              color={point.color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#e2e8f0" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#1FA3FF" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#00E5FF" />
    </>
  );
}

export function GlobeVisualization() {
  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden glass-panel group">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Global Disruption Monitor</h3>
          <p className="text-xs text-slate-400 font-mono tracking-wider">REAL-TIME FLIGHT TRACKING</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-mono">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5A5F] shadow-[0_0_8px_rgba(255,90,95,0.6)]" />
            <span className="text-slate-300">Cancelled</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-slate-300">Diverted</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-slate-300">Delayed</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-slate-300">On Time</span>
          </span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <SceneLights />
        <GlobeCore />
        <FlightRoutes />
        <DisruptionPoints />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.0}
          maxDistance={5}
          autoRotate={false}
          rotateSpeed={0.6}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>

      {/* Bottom stats overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-[#050B1A] via-[#050B1A]/80 to-transparent">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-[#0E1C3A]/60 border border-[#1FA3FF]/10">
            8 RESTRICTED ZONES ACTIVE
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#0E1C3A]/60 border border-[#1FA3FF]/10">
            15 FLIGHT ROUTES TRACKED
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            ● LIVE DATA FEED
          </span>
        </div>
      </div>
    </div>
  );
}
