import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D } from "three";
import { CAMERA_OFFSET } from "../config";
import { OrbitControls } from "@react-three/drei";

export interface CameraControllerProps {
  carRef: React.MutableRefObject<Object3D | undefined>;
  isCarMoving: boolean;
}

const CameraController = ({ carRef, isCarMoving }: CameraControllerProps) => {
  const { camera, gl } = useThree();
  const cameraOffset = useRef(CAMERA_OFFSET);

  const controlsRef = useRef(null);

  // optimize the camera movement
  useFrame(() => {
    if (carRef.current) {
      const carPosition = carRef.current.position.clone();
      const desiredPosition = carPosition.clone().add(cameraOffset.current);

      // Ensure the camera never goes below the street level (y >= 1 to stay above street level)
      if (desiredPosition.y < 1) {
        desiredPosition.y = 1;
      }

      // Allow rotation around the car when it is stationary
      if (isCarMoving) {
        camera.position.set(
          desiredPosition.x,
          desiredPosition.y,
          desiredPosition.z
        );
      } else {
        camera.position.lerp(desiredPosition, 0.1);
      }
      camera.lookAt(carPosition);

      if (controlsRef.current) {
        controlsRef.current.enabled = !isCarMoving;
      }
    }
  });

  return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

export default CameraController;
