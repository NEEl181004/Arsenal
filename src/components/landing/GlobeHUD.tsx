/**
 * GlobeHUD.tsx - Fixed version
 * Fixes:
 *  - Black background (no red bleed)
 *  - Bloom threshold raised so only truly bright elements glow
 *  - CSS glow contained within canvas bounds
 *  - Proper camera framing
 */
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";


interface GlobeHUDProps { size: number }

export default function GlobeHUD({ size }: GlobeHUDProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        background: "#000000",          /* hard black — no red bleed */
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* Subtle deep-red ambient glow — CONTAINED inside the box */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, rgba(180,0,10,0.18) 0%, rgba(80,0,5,0.06) 55%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Canvas
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
        camera={{ position: [0, 0.3, 3.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,              /* opaque canvas = no bleed */
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1);   /* force black clear colour */
        }}
      >
        {/* Lighting — red point lights only */}
        <pointLight position={[-2.5, 2.5, 3.0]} intensity={5} color="#ff1010" />
        <pointLight position={[2.5, 0.5, 1.5]} intensity={1.8} color="#cc0010" />
        <pointLight position={[0.0, -1.5, -2.5]} intensity={0.8} color="#880000" />
        <ambientLight intensity={0.04} color="#100000" />

        <Suspense fallback={null}>

        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
          target={[0, -0.15, 0]}
        />

        {/* Bloom — only truly emissive (bright) elements glow */}
        <EffectComposer>
          <Bloom
            intensity={1.4}
            mipmapBlur
            luminanceThreshold={0.22}
            luminanceSmoothing={0.6}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
