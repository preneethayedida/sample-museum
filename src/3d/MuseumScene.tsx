import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Html } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import Avatar from "./Avatar";

// Pedestal component
function Pedestal({ children }: { children: React.ReactNode }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
        <meshStandardMaterial metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.05, 1.2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {children}
    </group>
  );
}

// Artifact 3D model loader
function ArtifactModel({ url }: { url: string }) {
  const gltf = useGLTF(url) as GLTF;
  return <primitive object={gltf.scene} scale={0.8} position={[0, 1.1, 0]} />;
}

// Camera follows avatar
function CameraFollow({ avatarRef }: { avatarRef: React.RefObject<THREE.Mesh | null> }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!avatarRef.current) return;
    const pos = avatarRef.current.position;
    camera.position.lerp(new THREE.Vector3(pos.x, pos.y + 2, pos.z + 6), 0.1);
    camera.lookAt(pos);
  });
  return null;
}

export default function MuseumScene() {
  const avatarRef = useRef<THREE.Mesh | null>(null);

  return (
    <Canvas shadows camera={{ position: [0, 2, 6], fov: 60 }}>
      <color attach="background" args={[0.95, 0.95, 0.97]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, 5]} intensity={0.4} />

      <Suspense fallback={null}>
        {/* Pedestal + Artifact */}
        <Float rotationIntensity={0.2} floatIntensity={0.6}>
          <Pedestal>
            <ArtifactModel url="/models/sample_artifact.glb" />
          </Pedestal>
        </Float>

        {/* Artifact Info Popup */}
        <Html position={[2.2, 1.6, 0]} transform occlude>
          <div style={{ width: 260, background: "rgba(255,255,255,0.95)", padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: 0, fontWeight: 600 }}>Artifact Title</h3>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>Short description goes here.</p>
          </div>
        </Html>

        {/* Avatar */}
        <Avatar ref={avatarRef} />
      </Suspense>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#f5f5f4" />
      </mesh>

      {/* Camera follow avatar */}
      <CameraFollow avatarRef={avatarRef} />

      {/* OrbitControls for testing */}
      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
  );
}
