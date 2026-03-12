"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { flightDisruptions, airspaceZones } from "@/lib/aviation-data";

const EARTH_RADIUS = 1;

const EARTH_TEXTURES = {
  day: "/textures/earth_daymap_2048.jpg",
  normal: "/textures/earth_normal_2048.jpg",
  specular: "/textures/earth_specular_2048.jpg",
  lights: "/textures/earth_lights_2048.png",
  clouds: "/textures/earth_clouds_1024.png",
};

const AIRPORT_NODES = [
  { code: "JFK", lat: 40.6413, lng: -73.7781 },
  { code: "LHR", lat: 51.47, lng: -0.4543 },
  { code: "CDG", lat: 49.0097, lng: 2.5479 },
  { code: "DXB", lat: 25.2532, lng: 55.3657 },
  { code: "SIN", lat: 1.3644, lng: 103.9915 },
  { code: "HND", lat: 35.5494, lng: 139.7798 },
  { code: "ICN", lat: 37.4602, lng: 126.4407 },
  { code: "SYD", lat: -33.9399, lng: 151.1753 },
  { code: "JNB", lat: -26.1337, lng: 28.242 },
  { code: "GRU", lat: -23.4356, lng: -46.4731 },
];

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
  segments: number = 128,
  altitude: number = 0.25
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    const midFactor = Math.sin(t * Math.PI);
    point.normalize().multiplyScalar(EARTH_RADIUS + 0.02 + altitude * midFactor);
    points.push(point);
  }
  return points;
}

function GlobeCore() {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const [dayMap, normalMap, specularMap, lightsMap, cloudsMap] = useLoader(
    THREE.TextureLoader,
    [
      EARTH_TEXTURES.day,
      EARTH_TEXTURES.normal,
      EARTH_TEXTURES.specular,
      EARTH_TEXTURES.lights,
      EARTH_TEXTURES.clouds,
    ]
  );

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    [dayMap, normalMap, specularMap, lightsMap, cloudsMap].forEach((map) => {
      map.anisotropy = maxAnisotropy;
      map.wrapS = THREE.ClampToEdgeWrapping;
      map.wrapT = THREE.ClampToEdgeWrapping;
    });
    dayMap.colorSpace = THREE.SRGBColorSpace;
    lightsMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
  }, [dayMap, normalMap, specularMap, lightsMap, cloudsMap, gl]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.08;
    }
  });

  const atmosphereConfig = useMemo(
    () => ({
      uniforms: {
        uColor: { value: new THREE.Color("#5ad1ff") },
        uIntensity: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float intensity = pow(1.0 - dot(vNormal, viewDir), 2.6);
          gl_FragColor = vec4(uColor, intensity * uIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    }),
    []
  );

  return (
    <group>
      {/* Earth */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          specularMap={specularMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color("#1b4b7a")}
          emissiveIntensity={0.45}
          specular={new THREE.Color("#2aaaff")}
          shininess={25}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_RADIUS + 0.012, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Soft neon glow */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.08, 64, 64]} />
        <meshBasicMaterial
          color="#2bc4ff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.055, 64, 64]} />
        <shaderMaterial {...atmosphereConfig} />
      </mesh>
    </group>
  );
}

function GlobeGrid() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const radius = EARTH_RADIUS + 0.03;
    const latStep = 15;
    const lonStep = 15;
    const latSegments = 72;
    const lonSegments = 72;

    for (let lat = -75; lat <= 75; lat += latStep) {
      for (let i = 0; i < lonSegments; i++) {
        const lng1 = -180 + (360 / lonSegments) * i;
        const lng2 = -180 + (360 / lonSegments) * (i + 1);
        const p1 = latLngToVector3(lat, lng1, radius);
        const p2 = latLngToVector3(lat, lng2, radius);
        positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }

    for (let lon = -180; lon <= 180; lon += lonStep) {
      for (let i = 0; i < latSegments; i++) {
        const lat1 = -90 + (180 / latSegments) * i;
        const lat2 = -90 + (180 / latSegments) * (i + 1);
        const p1 = latLngToVector3(lat1, lon, radius);
        const p2 = latLngToVector3(lat2, lon, radius);
        positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return gridGeometry;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#39c5ff"
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function ScanningRings() {
  const ringsRef = useRef<THREE.Mesh[]>([]);

  const rings = useMemo(
    () => [
      { scale: 1.0, speed: 0.15, tilt: [0.4, 0.2, 0.0], phase: 0.0 },
      { scale: 1.0, speed: 0.22, tilt: [-0.2, 0.35, 0.1], phase: 0.35 },
      { scale: 1.0, speed: 0.12, tilt: [0.1, -0.45, -0.1], phase: 0.7 },
    ],
    []
  );

  useFrame(({ clock }) => {
    ringsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const t = (clock.getElapsedTime() * rings[index].speed + rings[index].phase) % 1;
      const scale = 0.9 + t * 0.9;
      mesh.scale.setScalar(scale);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - t) * 0.25;
      mesh.rotation.z += 0.002;
    });
  });

  return (
    <group>
      {rings.map((ring, index) => (
        <mesh
          key={`ring-${index}`}
          ref={(el) => {
            if (el) ringsRef.current[index] = el;
          }}
          rotation={ring.tilt as [number, number, number]}
        >
          <ringGeometry args={[EARTH_RADIUS + 0.16, EARTH_RADIUS + 0.18, 128]} />
          <meshBasicMaterial
            color="#52d6ff"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function HoloParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = THREE.MathUtils.lerp(1.2, 1.8, Math.random());
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return bufferGeometry;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#5ad1ff"
        size={0.012}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GlobeSystem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <GlobeCore />
      <GlobeGrid />
      <ScanningRings />
      <HoloParticles />
      <FlightRoutes />
      <AirportNodes />
      <DisruptionPoints />
    </group>
  );
}

function AirportNodes() {
  const nodeRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    nodeRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const pulse = Math.sin(clock.getElapsedTime() * 2.5 + index) * 0.25 + 1;
      mesh.scale.setScalar(pulse);
    });
  });

  return (
    <group>
      {AIRPORT_NODES.map((node, index) => {
        const position = latLngToVector3(node.lat, node.lng, EARTH_RADIUS + 0.035);
        return (
          <group key={node.code} position={position}>
            <mesh
              ref={(el) => {
                if (el) nodeRefs.current[index] = el;
              }}
            >
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshBasicMaterial color="#7fe7ff" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial
                color="#7fe7ff"
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function DisruptionPoints() {
  const pointsRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    pointsRefs.current.forEach((point, index) => {
      if (!point) return;
      const pulse = Math.sin(clock.getElapsedTime() * 2 + index) * 0.35 + 1;
      point.scale.setScalar(pulse);
    });
  });

  const points = useMemo(() => {
    return airspaceZones.map((zone) => {
      const position = latLngToVector3(zone.lat, zone.lng, EARTH_RADIUS + 0.04);
      const color = zone.status === "closed" ? "#ff4d6d" : "#ffb247";
      return { position, color, id: zone.id };
    });
  }, []);

  return (
    <group>
      {points.map((point, index) => (
        <group key={point.id} position={point.position}>
          <mesh
            ref={(el) => {
              if (el) pointsRefs.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshBasicMaterial color={point.color} transparent opacity={0.95} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial
              color={point.color}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RouteArc({
  points,
  color,
  speed,
  glow,
}: {
  points: THREE.Vector3[];
  color: string;
  speed: number;
  glow: number;
}) {
  const lineRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * speed;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={1.2}
        dashed
        dashSize={0.18}
        gapSize={0.12}
        transparent
        opacity={0.9}
      />
      <Line
        points={points}
        color={color}
        lineWidth={3.2}
        transparent
        opacity={glow}
      />
    </group>
  );
}

function RouteParticle({
  curve,
  color,
  speed,
  offset,
}: {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
  offset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    groupRef.current.position.copy(curve.getPointAt(t));
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FlightRoutes() {
  const routes = useMemo(() => {
    return flightDisruptions.map((flight, index) => {
      const start = latLngToVector3(flight.origin_lat, flight.origin_lng, EARTH_RADIUS + 0.02);
      const end = latLngToVector3(flight.dest_lat, flight.dest_lng, EARTH_RADIUS + 0.02);
      const points = generateArcPoints(start, end, 96, 0.24);
      const curve = new THREE.CatmullRomCurve3(points);

      let color = "#53d9ff";
      let glow = 0.18;
      if (flight.status === "cancelled") {
        color = "#ff4d6d";
        glow = 0.4;
      } else if (flight.status === "diverted") {
        color = "#ffb347";
        glow = 0.32;
      } else if (flight.status === "delayed") {
        color = "#ff914d";
        glow = 0.28;
      }

      return {
        id: flight.flight_id,
        points,
        curve,
        color,
        glow,
        speed: 0.25 + index * 0.02,
      };
    });
  }, []);

  return (
    <group>
      {routes.map((route, index) => (
        <group key={route.id}>
          <RouteArc
            points={route.points}
            color={route.color}
            speed={route.speed}
            glow={route.glow}
          />
          <RouteParticle
            curve={route.curve}
            color={route.color}
            speed={0.12 + index * 0.01}
            offset={index * 0.15}
          />
          <RouteParticle
            curve={route.curve}
            color={route.color}
            speed={0.1 + index * 0.015}
            offset={index * 0.3 + 0.4}
          />
        </group>
      ))}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#7dbce8" />
      <directionalLight position={[4, 2, 4]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#1b6b9a" />
      <pointLight position={[0, 3, 0]} intensity={0.35} color="#5ad1ff" />
    </>
  );
}

export function GlobeVisualization() {
  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden glass-panel bg-[#050B1A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(32,92,150,0.35),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(13,33,64,0.65),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(84,182,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(84,182,255,0.08) 1px, transparent 1px)",
        backgroundSize: "120px 120px",
      }} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Global Disruption Monitor</h3>
          <p className="text-xs text-slate-400 font-mono tracking-wider">HOLOGRAPHIC AIRSPACE INTELLIGENCE</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-mono">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4d6d] shadow-[0_0_10px_rgba(255,77,109,0.7)]" />
            <span className="text-slate-300">Cancelled</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
            <span className="text-slate-300">Diverted</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]" />
            <span className="text-slate-300">Delayed</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
            <span className="text-slate-300">On Time</span>
          </span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 2.9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneLights />
        <GlobeSystem />
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={2.2}
          maxDistance={5.0}
          autoRotate
          autoRotateSpeed={0.3}
          rotateSpeed={0.6}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {/* Bottom stats overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-[#050B1A] via-[#050B1A]/80 to-transparent">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-[#0E1C3A]/70 border border-[#1FA3FF]/20">
            8 RESTRICTED ZONES ACTIVE
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#0E1C3A]/70 border border-[#1FA3FF]/20">
            15 FLIGHT ROUTES TRACKED
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
            ● LIVE HOLOGRAPHIC FEED
          </span>
        </div>
      </div>
    </div>
  );
}
