"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  GradientTexture, 
  RoundedBox,
  Text,
  PerspectiveCamera,
  Environment,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";

function TicketMesh({ color1 = "#a855f7", color2 = "#3b82f6", ...props }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 2) * 0.1;
    meshRef.current.rotation.y = Math.sin(time / 4) * 0.2;
  });

  return (
    <group {...props}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <RoundedBox 
          args={[3, 5, 0.1]} 
          radius={0.15} 
          smoothness={4} 
          ref={meshRef}
        >
          <MeshDistortMaterial 
            speed={2} 
            distort={0.1} 
            radius={1}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.9}
          >
            <GradientTexture
              stops={[0, 1]}
              colors={[color1, color2]}
              size={1024}
            />
          </MeshDistortMaterial>
          
          {/* Ticket Details Overlay (Simulated) */}
          <group position={[0, 0, 0.051]}>
            <Text
              position={[0, 1.8, 0]}
              fontSize={0.2}
              color="white"
            >
              VIP PASS
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.4}
              color="white"
              maxWidth={2.5}
              textAlign="center"
            >
              METAVERSE FEST 2026
            </Text>
            <mesh position={[0, -1.8, 0]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color="white" />
              {/* QR Code Simulation */}
            </mesh>
          </group>
        </RoundedBox>
      </Float>
    </group>
  );
}

export default function Ticket3D({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: "400px" }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <TicketMesh position={[0, 0, 0]} />
        
        <Environment preset="city" />
        <ContactShadows 
          position={[0, -3.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
      </Canvas>
    </div>
  );
}
