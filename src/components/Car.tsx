// src/components/Car.tsx

import * as THREE from "three";
import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GroupProps, useFrame } from "@react-three/fiber";
import { CAR_SCALE, INITIAL_CAR_POSITION } from "../config";

type GLTFResult = GLTF & {
  nodes: {
    steer: THREE.Mesh;
    interior003: THREE.Mesh;
    interior003_1: THREE.Mesh;
    interior003_2: THREE.Mesh;
    interior003_3: THREE.Mesh;
    interior003_4: THREE.Mesh;
    interior003_5: THREE.Mesh;
    tires: THREE.Mesh;
  };
  materials: {
    ["gray.002"]: THREE.MeshStandardMaterial;
    ["light_f.002"]: THREE.MeshStandardMaterial;
    ["body.002"]: THREE.MeshStandardMaterial;
    glass_crack: THREE.MeshStandardMaterial;
    ["glassgray.002"]: THREE.MeshStandardMaterial;
    Light: THREE.MeshStandardMaterial;
    ["rubber.002"]: THREE.MeshStandardMaterial;
  };
};

const Car = forwardRef<THREE.Group<THREE.Object3DEventMap>>(
  (props: GroupProps, ref) => {
    const { nodes, materials } = useGLTF(
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cybertruck/model.gltf"
    ) as GLTFResult;

    return (
      <group
        ref={ref}
        {...props}
        position={INITIAL_CAR_POSITION}
        scale={CAR_SCALE}
        rotation={[0, Math.PI, 0]}
        dispose={null}
      >
        <mesh geometry={nodes.steer.geometry} material={nodes.steer.material} />
        <mesh
          geometry={nodes.interior003.geometry}
          material={nodes.interior003.material}
        />
        <mesh
          geometry={nodes.interior003_1.geometry}
          material={materials["light_f.002"]}
        />
        <mesh
          geometry={nodes.interior003_2.geometry}
          material={materials["body.002"]}
        />
        <mesh
          geometry={nodes.interior003_3.geometry}
          material={materials.glass_crack}
        />
        <mesh
          geometry={nodes.interior003_4.geometry}
          material={materials["glassgray.002"]}
        />
        <mesh
          geometry={nodes.interior003_5.geometry}
          material={materials.Light}
        />
        <mesh
          geometry={nodes.tires.geometry}
          material={materials["rubber.002"]}
        />
      </group>
    );
  }
);

useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cybertruck/model.gltf"
);

export default Car;
