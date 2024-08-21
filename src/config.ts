import { Vector3 } from "three";

export const LOOP_SIZE = 100; // Adjust to your preferred loop size
export const STREET_WIDTH = 5; // Width of the street
export const CORNER_RADIUS = 15; // Outer corner radius
export const INNER_CORNER_RADIUS = 10; // Inner corner radius (smaller than outer)
export const STREET_DEPTH = 0.1; // Depth of the street
export const STREET_INNER_DEPTH = 0.1; // Depth of the inner street

export const CAR_SCALE = [0.75, 0.75, 0.75];

export const CAMERA_OFFSET = new Vector3(0, 5, 10);
export const INITIAL_CAR_POSITION: [number, number, number] = [2.5, 0, -15];
export const CAR_SPEED = 0.1;
export const TURN_DELAY = 500; // milliseconds
export const TURN_ANGLE = Math.PI / 2; // 90 degrees
export const TURN_STEP = Math.PI / 180; // 1 degree

// Texture URLs
export const TEXTURES = {
  grass: {
    aoMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/grass/Grass001_1K_AmbientOcclusion.jpg",
    map: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/grass/Grass001_1K_Color.jpg",
    displacementMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/grass/Grass001_1K_Displacement.jpg",
    normalMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/grass/Grass001_1K_Normal.jpg",
    roughnessMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/grass/Grass001_1K_Roughness.jpg",
  },
  tiles: {
    map: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/tiles/Tiles036_1K_Color.jpg",
    displacementMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/tiles/Tiles036_1K_Displacement.jpg",
    normalMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/tiles/Tiles036_1K_Normal.jpg",
    roughnessMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/tiles/Tiles036_1K_Roughness.jpg",
  },
  blackStone:
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/black-stone/matcap_black_stone.jpg",

  rock: {
    aoMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_AmbientOcclusion.jpg",
    map: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Color.jpg",
    displacementMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Displacement.jpg",
    normalMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Normal.jpg",
    roughnessMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Roughness.jpg",
  },

  wood: {
    aoMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_AmbientOcclusion.jpg",
    map: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Color.jpg",
    displacementMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Displacement.jpg",
    normalMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Normal.jpg",
    roughnessMap:
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/materials/rock/Rock020_1K_Roughness.jpg",
  },
};
