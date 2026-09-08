import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, Object3D } from "three";
import { Box3, MeshStandardMaterial, Vector3 } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { BodyRegion } from "./types";

const hotspotData: Array<{ id: BodyRegion; label: string; position: [number, number, number]; scale: [number, number, number] }> = [
  { id: "head", label: "Head", position: [0, 1.25, 0.2], scale: [0.38, 0.36, 0.32] },
  { id: "neck", label: "Neck", position: [0, 0.85, 0.2], scale: [0.28, 0.24, 0.23] },
  { id: "chest", label: "Chest", position: [0, 0.48, 0.18], scale: [0.72, 0.54, 0.36] },
  { id: "abdomen", label: "Abdomen", position: [0, -0.03, 0.18], scale: [0.57, 0.42, 0.3] },
  { id: "pelvis", label: "Pelvis", position: [0, -0.44, 0.18], scale: [0.48, 0.32, 0.3] },
  { id: "left_arm", label: "Left arm", position: [-0.79, 0.2, 0.16], scale: [0.27, 0.68, 0.3] },
  { id: "right_arm", label: "Right arm", position: [0.79, 0.2, 0.16], scale: [0.27, 0.68, 0.3] },
  { id: "left_leg", label: "Left leg", position: [-0.26, -1.2, 0.16], scale: [0.28, 0.84, 0.32] },
  { id: "right_leg", label: "Right leg", position: [0.26, -1.2, 0.16], scale: [0.28, 0.84, 0.32] },
];

function LoaderLabel() {
  const { progress } = useProgress();
  return <Html center className="model-loader">Loading anatomy {Math.round(progress)}%</Html>;
}

function usePreparedModel() {
  const source = useLoader(OBJLoader, "/models/human.obj");
  return useMemo(() => {
    const model = source.clone(true);
    const box = new Box3().setFromObject(model);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const targetHeight = 2.82;
    const scale = targetHeight / size.y;
    model.position.set(-center.x * scale, -center.y * scale - 0.07, -center.z * scale);
    model.scale.setScalar(scale);
    model.traverse((child: Object3D) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material = new MeshStandardMaterial({
        color: "#c9907d",
        roughness: 0.78,
        metalness: 0,
        flatShading: false,
      });
    });
    return model;
  }, [source]);
}

function BodyModel({ selected, hovered }: { selected: BodyRegion | null; hovered: BodyRegion | null }) {
  const model = usePreparedModel();
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.045;
  });

  useEffect(() => {
    model.traverse((child: Object3D) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.color.set(selected || hovered ? "#d79f8b" : "#c9907d");
    });
  }, [hovered, model, selected]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

function Hotspots({ hovered, selected, onHover, onSelect }: {
  hovered: BodyRegion | null;
  selected: BodyRegion | null;
  onHover: (region: BodyRegion | null) => void;
  onSelect: (region: BodyRegion) => void;
}) {
  return (
    <group>
      {hotspotData.map(hotspot => {
        const active = selected === hotspot.id;
        const highlighted = hovered === hotspot.id || active;
        return (
          <mesh
            key={hotspot.id}
            position={hotspot.position}
            scale={hotspot.scale}
            onPointerOver={event => {
              event.stopPropagation();
              onHover(hotspot.id);
            }}
            onPointerOut={event => {
              event.stopPropagation();
              onHover(null);
            }}
            onClick={event => {
              event.stopPropagation();
              onSelect(hotspot.id);
            }}
          >
            <sphereGeometry args={[1, 24, 16]} />
            <meshBasicMaterial color={highlighted ? "#64a99d" : "#9bc9c1"} transparent opacity={highlighted ? 0.2 : 0.035} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function AnatomyScene({ selected, onSelect }: { selected: BodyRegion | null; onSelect: (region: BodyRegion) => void }) {
  const [hovered, setHovered] = useState<BodyRegion | null>(null);
  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} castShadow />
      <directionalLight position={[-3, 1, 2]} intensity={0.7} color="#8dc8c4" />
      <Suspense fallback={<LoaderLabel />}>
        <BodyModel selected={selected} hovered={hovered} />
        <Hotspots hovered={hovered} selected={selected} onHover={setHovered} onSelect={onSelect} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={7} maxDistance={16} enableDamping dampingFactor={0.08} rotateSpeed={0.55} zoomSpeed={0.65} />
    </>
  );
}

export function HumanBody({ selected = null, onSelect = () => undefined, className = "" }: { selected?: BodyRegion | null; onSelect?: (region: BodyRegion) => void; className?: string }) {
  return (
    <div className={`human-body-canvas ${className}`} aria-label="Interactive 3D human anatomy model">
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 31 }} dpr={[1, 1.5]}>
        <AnatomyScene selected={selected} onSelect={onSelect} />
      </Canvas>
    </div>
  );
}
