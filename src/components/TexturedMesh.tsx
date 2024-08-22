import { useTexture } from "@react-three/drei";
import {
  ExtrudeGeometry,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  RepeatWrapping,
} from "three";
import { forwardRef } from "react";

export interface TexturedMeshProps {
  geometry: ExtrudeGeometry;
  textureUrls: {
    aoMap?: string;
    map: string;
    displacementMap: string;
    normalMap: string;
    roughnessMap: string;
  };
  materialParams?: MeshStandardMaterialParameters;
}

const TexturedMesh = forwardRef(
  ({ geometry, textureUrls, materialParams }: TexturedMeshProps) => {
    const { map, displacementMap, normalMap, roughnessMap, aoMap } = useTexture(
      { ...textureUrls }
    );

    // Adjusting UV wrapping and tiling
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(0.25, 0.25); // Adjust tiling
    displacementMap.wrapS = displacementMap.wrapT = RepeatWrapping;
    displacementMap.repeat.set(0.25, 0.25); // Adjust tiling

    // Configure the material
    const material = new MeshStandardMaterial({
      ...materialParams,
      aoMap,
      map,
      displacementMap,
      normalMap,
      roughnessMap,
    });

    return <mesh geometry={geometry} material={material} />;
  }
);

export default TexturedMesh;
