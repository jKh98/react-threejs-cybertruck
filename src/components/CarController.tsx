import { useEffect, useRef, useCallback, RefObject } from "react";
import { Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import {
  ACCELERATION,
  MAX_SPEED,
  FRICTION,
  TURN_STEP,
  BRAKE_DECELERATION,
  MIN_SPEED_TO_TURN,
} from "../config";
import { LayoutRefObject } from "./Layout";
import { Keys } from "../constants/Keys";

export interface CarControllerProps {
  carRef: React.RefObject<Object3D>;
  layoutRef: RefObject<LayoutRefObject>;
  setIsCarMoving: React.Dispatch<React.SetStateAction<boolean>>;
}

// Helper function to adjust speed based on input and physics
const calculateSpeed = (
  keysPressed: Set<string>,
  currentSpeed: number,
  previousSpeed: number
): number => {
  const isReversing =
    (keysPressed.has(Keys.ArrowUp) && previousSpeed < 0) ||
    (keysPressed.has(Keys.ArrowDown) && previousSpeed > 0);

  let targetSpeed = currentSpeed;

  if (keysPressed.has(Keys.Space)) {
    // Apply braking
    targetSpeed =
      Math.max(Math.abs(currentSpeed) - BRAKE_DECELERATION, 0) *
      Math.sign(currentSpeed);
  } else if (isReversing) {
    // Decelerate before reversing
    targetSpeed =
      Math.max(Math.abs(currentSpeed) - 2 * ACCELERATION, 0) *
      Math.sign(previousSpeed);
  } else if (keysPressed.has(Keys.ArrowUp)) {
    // Accelerate forward
    targetSpeed = Math.min(currentSpeed + ACCELERATION, MAX_SPEED);
  } else if (keysPressed.has(Keys.ArrowDown)) {
    // Accelerate backward
    targetSpeed = Math.max(currentSpeed - ACCELERATION, -MAX_SPEED);
  } else {
    // Apply friction when no acceleration key is pressed
    if (Math.abs(currentSpeed) > FRICTION) {
      targetSpeed = currentSpeed - Math.sign(currentSpeed) * FRICTION;
    } else {
      targetSpeed = 0;
    }
  }

  return targetSpeed;
};

// Helper function to handle car rotation based on speed
const handleRotation = (
  car: Object3D,
  direction: Vector3,
  keysPressed: Set<string>,
  speed: number
) => {
  // Determine the steering angle based on speed
  const maxTurnStep = TURN_STEP; // Max steering angle at low speed
  const minTurnStep = TURN_STEP / 4; // Min steering angle at high speed

  // Adjust turning angle based on speed
  const adjustedTurnStep =
    maxTurnStep - (Math.abs(speed) / MAX_SPEED) * (maxTurnStep - minTurnStep);

  const rotationDirection = speed < 0 ? -1 : 1;

  if (keysPressed.has(Keys.ArrowLeft)) {
    car.rotation.y += rotationDirection * adjustedTurnStep;
    direction.applyAxisAngle(
      new Vector3(0, 1, 0),
      rotationDirection * adjustedTurnStep
    );
  } else if (keysPressed.has(Keys.ArrowRight)) {
    car.rotation.y -= rotationDirection * adjustedTurnStep;
    direction.applyAxisAngle(
      new Vector3(0, 1, 0),
      -rotationDirection * adjustedTurnStep
    );
  }
};

export default function CarController({
  carRef,
  layoutRef: streetRef,
  setIsCarMoving,
}: CarControllerProps) {
  const direction = useRef(new Vector3(0, 0, -1));
  const speed = useRef(0);
  const previousSpeed = useRef(0);
  const keysPressed = useRef(new Set<string>());

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.add(event.key);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.delete(event.key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Main animation loop, using useFrame for smoother updates
  useFrame(() => {
    if (!carRef.current || !streetRef.current) return;

    // Adjust speed based on input and physics
    speed.current = calculateSpeed(
      keysPressed.current,
      speed.current,
      previousSpeed.current
    );

    // Apply movement and rotation
    if (Math.abs(speed.current) > MIN_SPEED_TO_TURN) {
      carRef.current.position.addScaledVector(direction.current, speed.current);
      handleRotation(
        carRef.current,
        direction.current,
        keysPressed.current,
        speed.current
      );
    }

    // Check for collisions or out-of-bounds
    const carPosition = carRef.current.position.clone();
    const { isOnTrack } = streetRef.current.checkBounds(carPosition);

    if (!isOnTrack) {
      // mock a bump and reverse direction, then apply deceleration
      speed.current = -speed.current;
      carRef.current.position.addScaledVector(direction.current, speed.current);
    }

    // Update movement state
    const currentlyMoving = Math.abs(speed.current) > 0;
    setIsCarMoving(currentlyMoving);

    // Store the current speed for the next frame
    previousSpeed.current = speed.current;
  });

  return null;
}
