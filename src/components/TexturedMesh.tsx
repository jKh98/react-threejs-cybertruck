import { useTexture } from "@react-three/drei";
import { Box3, ExtrudeGeometry, Mesh, MeshPhysicalMaterial } from "three";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TexturedMeshProps {
  geometry: ExtrudeGeometry;
  textureUrls: {
    aoMap?: string;
    map: string;
    displacementMap: string;
    normalMap: string;
    roughnessMap: string;
  };
}

const TexturedMesh = forwardRef(
  ({ geometry, textureUrls }: TexturedMeshProps, ref) => {
    const { map, displacementMap, normalMap, roughnessMap, aoMap } = useTexture(
      { ...textureUrls }
    );

    const meshRef = useRef<Mesh>(null);

    // Expose bounding box to parent
    useImperativeHandle(ref, () => ({
      getBoundingBox: () => {
        const box = new Box3().setFromObject(meshRef.current!);
        return box;
      },
    }));

    // Configure the material
    const material = new MeshPhysicalMaterial({
      aoMap,
      map,
      displacementMap,
      normalMap,
      roughnessMap,
      displacementScale: 0.1,
      roughness: 0.5, // Adjust roughness
      metalness: 0.5, // Adjust metalness
    });

    return (
      <mesh geometry={geometry} material={material} rotation-x={-Math.PI / 2} />
    );
  }
);

export default TexturedMesh;
