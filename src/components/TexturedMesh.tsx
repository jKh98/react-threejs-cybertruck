import { useTexture } from "@react-three/drei";
import { ExtrudeGeometry, MeshPhysicalMaterial, RepeatWrapping } from "three";
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
}

const TexturedMesh = forwardRef(
  ({ geometry, textureUrls }: TexturedMeshProps) => {
    const { map, displacementMap, normalMap, roughnessMap, aoMap } = useTexture(
      { ...textureUrls }
    );

    // Adjusting UV wrapping and tiling
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(0.25, 0.25); // Adjust tiling
    displacementMap.wrapS = displacementMap.wrapT = RepeatWrapping;
    displacementMap.repeat.set(10, 10); // Adjust tiling

    // Configure the material
    const material = new MeshPhysicalMaterial({
      aoMap,
      map,
      displacementMap,
      normalMap,
      roughnessMap,
      displacementScale: 0, // Fine-tune displacement scale
      roughness: 0.5, // Lower roughness for a shinier appearance
      metalness: 0.5, // Lower metalness for less metallic look
      clearcoat: 1.0, // Add clearcoat for a glossy effect
      clearcoatRoughness: 0.4, // Adjust clearcoat roughness,
    });

    return <mesh geometry={geometry} material={material} />;
  }
);

export default TexturedMesh;
