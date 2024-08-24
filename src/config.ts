import { Vector3 } from "three";

export const LAYOUT_SIZE = 1000; // Adjust to your preferred loop size
export const LAYOUT_DEPTH = -0.1;
export const BOUNDARY_DEPTH = -0.2;
export const OUTERSIDE_DEPTH = -0.5;

export const CAR_SCALE: [number, number, number] = [1, 1, 1];
export const CAMERA_OFFSET = new Vector3(0, 5, 10);
export const INITIAL_CAR_POSITION: [number, number, number] = [0, 0, 0];

export const ACCELERATION = 0.02; // Increased for a more responsive acceleration
export const MAX_SPEED = 2; // Increased to allow for faster movement
export const BRAKE_DECELERATION = 0.03; // Increased to provide more effective braking
export const MIN_SPEED_TO_TURN = 0.02; // Slightly increased to ensure turns only happen when the car is moving
export const FRICTION = 0.005; // Increased to add more natural deceleration when keys are not pressed
export const TURN_STEP = Math.PI / 90; // Increased for sharper turns, especially at lower speeds

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
};
