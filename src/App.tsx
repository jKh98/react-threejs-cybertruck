import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Car from "./components/Car";
import Layout, { LayoutRefObject } from "./components/Layout";
import CameraController from "./components/CameraController";
import { Group, Object3DEventMap } from "three";
import CarController from "./components/CarController";
import { Environment } from "@react-three/drei";

function App() {
  const carRef = useRef<Group<Object3DEventMap>>(null);
  const layoutRef = useRef<LayoutRefObject>(null);

  const [isCarMoving, setIsCarMoving] = useState(false);

  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="night" />

      <Layout ref={layoutRef} />
      <Car ref={carRef} />
      <CameraController carRef={carRef} isCarMoving={isCarMoving} />
      <CarController
        carRef={carRef}
        layoutRef={layoutRef}
        setIsCarMoving={setIsCarMoving}
      />
    </Canvas>
  );
}

export default App;
