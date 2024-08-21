// src/components/Car.tsx
import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { CAR_SCALE } from "../config";

export interface CarProps {
  position: [number, number, number];
}

const Car = forwardRef(({ position }: CarProps, ref) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cybertruck/model.gltf"
  );

  return (
    <primitive
      object={scene}
      ref={ref}
      position={position}
      scale={CAR_SCALE}
      rotation={[0, Math.PI, 0]}
    />
  );
});

export default Car;
