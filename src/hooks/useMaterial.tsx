import { useTexture } from "@react-three/drei";
import {
  MeshPhysicalMaterial,
  MeshStandardMaterialParameters,
  RepeatWrapping,
} from "three";

export type Textures = {
  aoMap?: string;
  map: string;
  displacementMap: string;
  normalMap: string;
  roughnessMap: string;
};

export interface UseMaterialProps {
  textureUrls: Textures;
  materialParams?: MeshStandardMaterialParameters;
  mapTiling?: [number, number];
  displacementMapTiling?: [number, number];
}

const useMaterial = ({
  textureUrls,
  materialParams,
  mapTiling = [0.25, 0.25],
  displacementMapTiling = [0.25, 0.25],
}: UseMaterialProps) => {
  const { map, displacementMap, normalMap, roughnessMap, aoMap } = useTexture({
    ...textureUrls,
  });

  // Adjusting UV wrapping and tiling
  map.wrapS = map.wrapT = RepeatWrapping;
  map.repeat.set(...mapTiling); // Adjust tiling

  displacementMap.wrapS = displacementMap.wrapT = RepeatWrapping;
  displacementMap.repeat.set(...displacementMapTiling); // Adjust tiling

  // Configure the material
  return new MeshPhysicalMaterial({
    ...materialParams,
    aoMap,
    map,
    displacementMap,
    normalMap,
    roughnessMap,
  });
};

export default useMaterial;
