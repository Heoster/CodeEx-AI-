'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function useReducedMotion() {
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mediaQuery.matches;

    const onChange = () => {
      reducedMotion.current = mediaQuery.matches;
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return reducedMotion;
}

function LatticeScene({ mobile }: { mobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRef = useRef(new THREE.Vector2(0, 0));
  const reducedMotion = useReducedMotion();

  const density = mobile ? 420 : 900;
  const points = useMemo(() => {
    const positions = new Float32Array(density * 3);
    const linePositions: number[] = [];

    const pointVectors = Array.from({ length: density }, (_, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / density);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
      const radius = mobile ? 7 + Math.sin(index * 0.4) * 0.35 : 8 + Math.sin(index * 0.35) * 0.55;

      const point = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.7,
        radius * Math.sin(phi) * Math.sin(theta)
      );

      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;

      return point;
    });

    for (let index = 0; index < density; index += mobile ? 2 : 1) {
      const current = pointVectors[index];
      const next = pointVectors[(index + 13) % density];
      const diagonal = pointVectors[(index + 34) % density];

      linePositions.push(current.x, current.y, current.z, next.x, next.y, next.z);
      if (!mobile || index % 3 === 0) {
        linePositions.push(current.x, current.y, current.z, diagonal.x, diagonal.y, diagonal.z);
      }
    }

    return {
      positions,
      linePositions: new Float32Array(linePositions),
    };
  }, [density, mobile]);

  useEffect(() => {
    const onPointerMove = (event: MouseEvent) => {
      targetRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      targetRef.current.x = THREE.MathUtils.clamp(event.gamma / 35, -1, 1);
      targetRef.current.y = THREE.MathUtils.clamp(event.beta / 50, -1, 1);
    };

    const onScroll = () => {
      const scrollInfluence = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      targetRef.current.y = THREE.MathUtils.lerp(targetRef.current.y, -scrollInfluence * 0.4, 0.18);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const pointerX = targetRef.current.x;
    const pointerY = targetRef.current.y;
    const motionScale = reducedMotion.current ? 0.3 : 1;

    group.rotation.y += delta * 0.035 * motionScale;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerY * 0.18, 0.04);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointerX * 0.12, 0.04);
    group.position.x = THREE.MathUtils.lerp(group.position.x, pointerX * 0.65, 0.035);
    group.position.y = THREE.MathUtils.lerp(group.position.y, pointerY * 0.45, 0.035);

    const huePulse = 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    state.scene.fog = new THREE.FogExp2(new THREE.Color().setHSL(0.68, 0.38, huePulse * 0.08), 0.07);
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.positions.length / 3}
            array={points.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8df4ff"
          size={mobile ? 0.03 : 0.04}
          sizeAttenuation
          transparent
          opacity={mobile ? 0.65 : 0.82}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.linePositions.length / 3}
            array={points.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6b5cff" transparent opacity={mobile ? 0.14 : 0.18} />
      </lineSegments>
    </group>
  );
}

export function NeuralLatticeBackground() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setMobile(window.innerWidth < 768);
    };

    updateMobile();
    window.addEventListener('resize', updateMobile, { passive: true });
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,242,255,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(112,0,255,0.12),transparent_38%)]" />
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 52 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.18} />
        <pointLight position={[0, 0, 8]} intensity={3} color="#00f2ff" />
        <pointLight position={[-8, -4, -6]} intensity={2.2} color="#7000ff" />
        <LatticeScene mobile={mobile} />
      </Canvas>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.38),rgba(5,5,5,0.66)_72%,rgba(5,5,5,0.92))]" />
    </div>
  );
}
