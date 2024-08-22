import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import { CAMERA_OFFSET } from "../config";
import { OrbitControls } from "@react-three/drei";

export interface CameraControllerProps {
  carRef: React.RefObject<Object3D>;
  isCarMoving: boolean;
}

const CameraController = ({ carRef, isCarMoving }: CameraControllerProps) => {
  const { camera, gl } = useThree();
  const cameraOffset = useRef(new Vector3(...CAMERA_OFFSET));
  const controlsRef = useRef(null);

  useFrame(() => {
    if (carRef.current) {
      const carPosition = carRef.current.position.clone();
      const carDirection = new Vector3(0, -0.2, 1)
        .applyQuaternion(carRef.current.quaternion)
        .normalize();

      // Calculate the desired camera position relative to the car's direction
      const desiredPosition = carPosition
        .clone()
        .add(carDirection.clone().multiplyScalar(-cameraOffset.current.z))
        .add(new Vector3(0, cameraOffset.current.y, 0));

      // Ensure the camera never goes below the street level (y >= 1 to stay above street level)
      if (desiredPosition.y < 1) {
        desiredPosition.y = 1;
      }

      // Smooth camera movement when the car is not moving
      if (isCarMoving) {
        camera.position.set(
          desiredPosition.x,
          desiredPosition.y,
          desiredPosition.z
        );
      } else {
        camera.position.lerp(desiredPosition, 0.1);
      }

      // Make the camera look at the car's current position
      camera.lookAt(carPosition);

      // Enable orbit controls only when the car is stationary
      if (controlsRef.current) {
        controlsRef.current.enabled = !isCarMoving;
      }
    }
  });

  return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

export default CameraController;
