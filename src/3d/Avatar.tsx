import React, { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Avatar = forwardRef<THREE.Mesh>((_, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const keys: Record<string, boolean> = {};
  const speed = 0.1;

  // Expose mesh to parent
  useImperativeHandle(ref, () => meshRef.current!);

  // Track key presses
  const handleKeyDown = (e: KeyboardEvent) => {
    keys[e.key.toLowerCase()] = true;
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    keys[e.key.toLowerCase()] = false;
  };

  // Add / remove event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Move avatar based on keys
  useFrame(() => {
    if (!meshRef.current) return;

    const velocity = new THREE.Vector3();
    if (keys["w"]) velocity.z -= speed;
    if (keys["s"]) velocity.z += speed;
    if (keys["a"]) velocity.x -= speed;
    if (keys["d"]) velocity.x += speed;

    meshRef.current.position.add(velocity);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 3]}>
      <capsuleGeometry args={[0.3, 1, 4, 8]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
});

export default Avatar;
