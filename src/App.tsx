import { KeyboardEvent, useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Car from "./components/Car";
import Street from "./components/Street";
import CameraController from "./components/CameraController";
import { Box3, Object3D, Vector3 } from "three";
import { CAR_SPEED, INITIAL_CAR_POSITION, TURN_STEP } from "./config";

function App() {
  const carRef = useRef<Object3D>();
  const streetRef = useRef<{
    getOuterBoundingBox: () => Box3;
    getInnerBoundingBox: () => Box3;
  } | null>(null);

  const direction = useRef(new Vector3(0, 0, -1));
  const speed = useRef(CAR_SPEED);
  const keysPressed = useRef(new Set<string>());
  const [isCarMoving, setIsCarMoving] = useState(false);

  const handleMovement = useCallback(() => {
    if (!carRef.current || !streetRef.current) return;

    const carPosition = carRef.current.position.clone();
    const outerBoundingBox = streetRef.current.getOuterBoundingBox();
    const innerBoundingBox = streetRef.current.getInnerBoundingBox();

    // Move car forward or backward
    if (keysPressed.current.has("ArrowUp")) {
      carRef.current.position.addScaledVector(direction.current, speed.current);
      setIsCarMoving(true);
    } else if (keysPressed.current.has("ArrowDown")) {
      carRef.current.position.addScaledVector(
        direction.current,
        -speed.current
      );
      setIsCarMoving(true);
    }

    // Check if car is within x and z bounds of the street
    if (
      !outerBoundingBox.containsPoint(carRef.current.position) ||
      innerBoundingBox.containsPoint(carRef.current.position)
    ) {
      console.log("Out of bounds");
      // carRef.current.position.copy(carPosition); // Reset position
    }

    // Rotate car only if it is moving
    if (isCarMoving) {
      if (keysPressed.current.has("ArrowLeft")) {
        carRef.current.rotation.y += TURN_STEP;
        direction.current.applyAxisAngle(new Vector3(0, 1, 0), TURN_STEP);
      } else if (keysPressed.current.has("ArrowRight")) {
        carRef.current.rotation.y -= TURN_STEP;
        direction.current.applyAxisAngle(new Vector3(0, 1, 0), -TURN_STEP);
      }
    }
  }, [isCarMoving]);

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.add(event.key);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.delete(event.key);

    if (keysPressed.current.size === 0) {
      setIsCarMoving(false); // Stop movement tracking when no keys are pressed
    }
  };

  useEffect(() => {
    const interval = setInterval(handleMovement, 16); // Move car every 16ms (60fps)
    return () => clearInterval(interval);
  }, [handleMovement]);

  return (
    <Canvas
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Street ref={streetRef} />
      <Car ref={carRef} position={INITIAL_CAR_POSITION} />
      <CameraController carRef={carRef} isCarMoving={isCarMoving} />
    </Canvas>
  );
}

export default App;
