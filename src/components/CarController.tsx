import { useEffect, useRef, useCallback, RefObject } from "react";
import { Object3D, Vector3 } from "three";
import {
  CAR_SPEED,
  TURN_STEP,
  ACCELERATION,
  MAX_SPEED,
  BUMP_DECELERATION,
  BRAKE_DECELERATION,
} from "../config";
import { StreetRefObject } from "./Street";
import { Keys } from "../constants/Keys";

export interface CarControllerProps {
  carRef: React.RefObject<Object3D>;
  streetRef: RefObject<StreetRefObject>;
  setIsCarMoving: React.Dispatch<React.SetStateAction<boolean>>;
}

// Helper function to handle speed adjustments
const adjustSpeed = (
  keysPressed: Set<string>,
  currentSpeed: number,
  previousSpeed: number
): number => {
  const isReversing =
    (keysPressed.has(Keys.ArrowUp) && previousSpeed < 0) ||
    (keysPressed.has(Keys.ArrowDown) && previousSpeed > 0);

  if (keysPressed.has(Keys.Space)) {
    // Space bar for braking
    return (
      Math.max(Math.abs(currentSpeed) - BRAKE_DECELERATION, 0) *
      Math.sign(currentSpeed)
    );
  }

  if (isReversing) {
    // Sudden change in direction: decelerate first before reversing
    return (
      Math.max(Math.abs(currentSpeed) - 2 * ACCELERATION, 0) *
      Math.sign(previousSpeed)
    );
  }

  if (keysPressed.has(Keys.ArrowUp)) {
    return Math.min(Math.abs(currentSpeed) + ACCELERATION, MAX_SPEED);
  }

  if (keysPressed.has(Keys.ArrowDown)) {
    return -Math.min(Math.abs(currentSpeed) + ACCELERATION, MAX_SPEED);
  }

  return Math.abs(currentSpeed) < ACCELERATION
    ? 0
    : currentSpeed - Math.sign(currentSpeed) * ACCELERATION;
};

// Helper function to handle car rotation
const rotateCar = (
  car: Object3D,
  direction: Vector3,
  keysPressed: Set<string>,
  speed: number
) => {
  const rotationDirection = speed < 0 ? -1 : 1;

  if (keysPressed.has(Keys.ArrowLeft)) {
    car.rotation.y += rotationDirection * TURN_STEP;
    direction.applyAxisAngle(
      new Vector3(0, 1, 0),
      rotationDirection * TURN_STEP
    );
  } else if (keysPressed.has(Keys.ArrowRight)) {
    car.rotation.y -= rotationDirection * TURN_STEP;
    direction.applyAxisAngle(
      new Vector3(0, 1, 0),
      -rotationDirection * TURN_STEP
    );
  }
};

export default function CarController({
  carRef,
  streetRef,
  setIsCarMoving,
}: CarControllerProps) {
  const direction = useRef(new Vector3(0, 0, -1));
  const speed = useRef(CAR_SPEED);
  const previousSpeed = useRef(0); // Track previous speed to detect direction changes
  const keysPressed = useRef(new Set<string>());

  const handleMovement = useCallback(() => {
    if (!carRef.current || !streetRef.current) return;

    // Adjust speed based on key presses
    speed.current = adjustSpeed(
      keysPressed.current,
      speed.current,
      previousSpeed.current
    );

    const carPosition = carRef.current.position.clone();

    // Move car forward or backward
    carRef.current.position.addScaledVector(direction.current, speed.current);

    const { withinOuterBox, withinInnerBox } = streetRef.current.checkBounds(
      carRef.current.position
    );

    if (withinInnerBox) {
      console.log("In inner box");

      // Decelerate when entering inner box to make turning easier
      speed.current = Math.max(speed.current - BUMP_DECELERATION, CAR_SPEED);
    }

    // Check if car is within bounds of the street
    if (!withinOuterBox) {
      console.log("Out of bounds");
      carRef.current.position.copy(carPosition); // Reset position

      // Adjust speed and decelerate when bumping
      speed.current = Math.max(speed.current - BUMP_DECELERATION, 0);
    }

    const currentlyMoving = Math.abs(speed.current) > 0;

    // Rotate car only if it is moving
    if (currentlyMoving) {
      rotateCar(
        carRef.current,
        direction.current,
        keysPressed.current,
        speed.current
      );
    }

    // Update movement state
    setIsCarMoving(currentlyMoving);

    // Update previous speed for the next frame
    previousSpeed.current = speed.current;
  }, [carRef, streetRef, setIsCarMoving]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.add(event.key);
  }, []);

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      keysPressed.current.delete(event.key);

      if (keysPressed.current.size === 0) {
        setIsCarMoving(false); // Stop movement tracking when no keys are pressed
      }
    },
    [setIsCarMoving]
  );

  useEffect(() => {
    const interval = setInterval(handleMovement, 16); // Move car every 16ms (60fps)
    return () => clearInterval(interval);
  }, [handleMovement]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return null; // No need to render anything
}
