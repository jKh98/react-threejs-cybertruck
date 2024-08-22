import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Car from "./components/Car";
import Street, { StreetRefObject } from "./components/Street";
import CameraController from "./components/CameraController";
import { Group, Object3DEventMap } from "three";
import CarController from "./components/CarController";
import { Environment } from "@react-three/drei";

function App() {
  const carRef = useRef<Group<Object3DEventMap>>(null);
  const streetRef = useRef<StreetRefObject>(null);

  const [isCarMoving, setIsCarMoving] = useState(false);

  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="night" />

      <Street ref={streetRef} />
      <Car ref={carRef} />
      <CameraController carRef={carRef} isCarMoving={isCarMoving} />
      <CarController
        carRef={carRef}
        streetRef={streetRef}
        setIsCarMoving={setIsCarMoving}
      />
    </Canvas>
  );
}

export default App;
