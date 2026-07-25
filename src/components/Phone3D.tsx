"use client";

// 3D phone mockup for the login page hero panel.
// Replaces the earlier CSS-only phone with the real .glb model the user
// provided (iphone-17-pro-max.glb). The model ships with a wallpaper photo
// baked onto its screen material — this component swaps that texture for a
// generated Billora dashboard image (public/screens/dashboard-screen.png)
// so the phone shows "our product" instead of a stock wallpaper, per the
// user's request.
//
// Reference: same phone-in-hand tilt/angle as the previous CSS version
// (rotateY -22deg / rotateX 4deg) so the swap doesn't change the login
// page's established look — see design-reference/billora_login_signup_page.png
// and MOTION_SYSTEM.md (motion should be subtle, GPU-friendly, never
// distracting).

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/iphone-17-pro-max.glb";
const SCREEN_TEXTURE_URL = "/screens/dashboard-screen.png";
const SCREEN_MATERIAL_NAME = "17ProMax_Screen";

// Model's own bounding-box center (computed once from the .glb, in meters).
// Used to re-pivot the mesh so it rotates around its visual center instead
// of its geometry origin (which sits near the bottom of the phone).
const MODEL_CENTER: [number, number, number] = [-0.00017, 0.08153, 0.00189];

function PhoneModel() {
  const { scene } = useGLTF(MODEL_URL);
  const screenTexture = useTexture(SCREEN_TEXTURE_URL);

  useEffect(() => {
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.flipY = false; // glTF UVs use a top-left origin
    screenTexture.needsUpdate = true;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (mesh.isMesh && mat?.name === SCREEN_MATERIAL_NAME) {
        mat.map = screenTexture;
        mat.emissiveMap = screenTexture;
        mat.emissive = new THREE.Color(0xffffff);
        mat.emissiveIntensity = 0.4; // subtle "lit screen" glow, not blown out
        mat.needsUpdate = true;
      }
    });
  }, [scene, screenTexture]);

  return <primitive object={scene} />;
}

// Floating animation lives on its own outer group and only ever touches
// position.y — nothing here writes to `rotation`, so it can never fight
// with the static tilt below (this was the exact bug in the old CSS phone).
function FloatingRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.004;
  });
  return <group ref={group}>{children}</group>;
}

export default function Phone3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 0.52], fov: 22 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[0.6, 0.8, 0.6]} intensity={1.5} />
      <directionalLight position={[-0.8, 0.2, -0.4]} intensity={0.3} color="#FF8A5C" />
      <pointLight position={[0, -0.3, 0.3]} intensity={0.25} color="#5B7FDB" />

      <Suspense fallback={null}>
        <FloatingRig>
          {/* static 3D turn — matches the previous CSS phone's angle.
              +180deg on Y flips the model to face its screen toward the
              camera — the raw .glb's front (screen) faces away from the
              camera by default, which is why the back panel (camera bumps
              + logo) was showing instead of the dashboard screen. */}
          <group
            rotation={[
              THREE.MathUtils.degToRad(4),
              THREE.MathUtils.degToRad(180 - 22),
              0,
            ]}
          >
            {/* re-pivot so rotation happens around the phone's visual
                center rather than the model's raw geometry origin */}
            <group position={[-MODEL_CENTER[0], -MODEL_CENTER[1], -MODEL_CENTER[2]]}>
              <PhoneModel />
            </group>
          </group>
        </FloatingRig>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
