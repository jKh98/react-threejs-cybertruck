import { forwardRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GroupProps, useFrame } from "@react-three/fiber";
import { CAR_SCALE, INITIAL_CAR_POSITION } from "../config";
import { Color, Mesh, MeshStandardMaterial } from "three";

type GLTFResult = GLTF & {
  nodes: {
    steer: Mesh;
    interior003: Mesh;
    interior003_1: Mesh;
    interior003_2: Mesh;
    interior003_3: Mesh;
    interior003_4: Mesh;
    interior003_5: Mesh;
    tires: Mesh;
  };
  materials: {
    ["gray.002"]: MeshStandardMaterial;
    ["light_f.002"]: MeshStandardMaterial;
    ["body.002"]: MeshStandardMaterial;
    glass_crack: MeshStandardMaterial;
    ["glassgray.002"]: MeshStandardMaterial;
    Light: MeshStandardMaterial;
    ["rubber.002"]: MeshStandardMaterial;
  };
};

const Car = forwardRef(
  (props: GroupProps & { speed: number; isReversing: boolean }, ref) => {
    const { speed, isReversing } = props;
    const { nodes, materials } = useGLTF(
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cybertruck/model.gltf"
    ) as GLTFResult;

    // Wheel rotation animation
    useFrame(() => {
      const wheelRotation = speed * 0.05; // Adjust the multiplier for realistic rotation
      nodes.tires.rotation.x -= wheelRotation;
    });

    // Headlights logic
    useEffect(() => {
      if (isReversing || speed === 0) {
        materials.Light.emissive = new Color(0xffffff); // Turn on lights
      } else {
        materials.Light.emissive = new Color(0x000000); // Turn off lights
      }
    }, [speed, isReversing, materials.Light]);

    return (
      <group
        ref={ref}
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
