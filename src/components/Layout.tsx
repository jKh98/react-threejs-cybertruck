import { Shape, ExtrudeGeometry, Vector3, Vector2 } from "three";
import {
  TEXTURES,
  LAYOUT_SIZE,
  LAYOUT_DEPTH,
  BOUNDARY_DEPTH,
  OUTERSIDE_DEPTH,
} from "../config";
import { forwardRef, useImperativeHandle } from "react";
import useMaterial from "../hooks/useMaterial";

export type LayoutRefObject = {
  checkBounds: (position: Vector3) => { isOnTrack: boolean };
};

const Layout = forwardRef((_, ref) => {
  const innerGeometry = new ExtrudeGeometry(
    new Shape([
      new Vector2(0, 0),
      new Vector2(LAYOUT_SIZE, 0),
      new Vector2(LAYOUT_SIZE, LAYOUT_SIZE),
      new Vector2(0, LAYOUT_SIZE),
    ]),
    {
      depth: LAYOUT_DEPTH,
      bevelEnabled: true,
    }
  );

  const boundaryGeometry = new ExtrudeGeometry(
    new Shape([
      new Vector2(0, 0),
      new Vector2(2 * LAYOUT_SIZE, 0),
      new Vector2(2 * LAYOUT_SIZE, 2 * LAYOUT_SIZE),
      new Vector2(0, 2 * LAYOUT_SIZE),
    ]),
    { depth: BOUNDARY_DEPTH, bevelEnabled: true }
  );

  const outerGeometry = new ExtrudeGeometry(
    new Shape([
      new Vector2(0, 0),
      new Vector2(3 * LAYOUT_SIZE, 0),
      new Vector2(3 * LAYOUT_SIZE, 3 * LAYOUT_SIZE),
      new Vector2(0, 3 * LAYOUT_SIZE),
    ]),
    {
      depth: OUTERSIDE_DEPTH,
      bevelEnabled: false,
    }
  );

  innerGeometry.translate(-0.5 * LAYOUT_SIZE, -0.5 * LAYOUT_SIZE, 0);
  boundaryGeometry.translate(-LAYOUT_SIZE, -LAYOUT_SIZE, 0);
  outerGeometry.translate(-1.5 * LAYOUT_SIZE, -1.5 * LAYOUT_SIZE, 0);

  // Rotate the geometry to align with the car
  innerGeometry.rotateX(-Math.PI / 2);
  boundaryGeometry.rotateX(-Math.PI / 2);
  outerGeometry.rotateX(-Math.PI / 2);

  // Check that the car is within outer bounds and outside inner bounds
  const checkBounds = (position: Vector3): { isOnTrack: boolean } => {
    boundaryGeometry.computeBoundingBox();
    innerGeometry.computeBoundingBox();
    boundaryGeometry.computeBoundingSphere();
    innerGeometry.computeBoundingSphere();

    const middleBoxBounds = boundaryGeometry.boundingBox;
    const innerBoxBounds = innerGeometry.boundingBox;
    const middleSphereBounds = boundaryGeometry.boundingSphere;
    const innerSphereBounds = innerGeometry.boundingSphere;

    const middleBoxContains = middleBoxBounds?.containsPoint(position);
    const innerBoxContains = innerBoxBounds?.containsPoint(position);

    const middleSphereContains = middleSphereBounds?.containsPoint(position);
    const innerSphereContains = innerSphereBounds?.containsPoint(position);

    const inMidGeometry = middleBoxContains && middleSphereContains;
    const inInnerGeometry = innerBoxContains && innerSphereContains;

    const isOnTrack = !!(inMidGeometry || inInnerGeometry);

    return { isOnTrack };
  };

  useImperativeHandle(ref, () => ({
    checkBounds,
  }));

  const innerMaterial = useMaterial({
    textureUrls: TEXTURES.grass,
    materialParams: {
      displacementScale: 0,
    },
  });

  const middleMaterial = useMaterial({
    textureUrls: TEXTURES.tiles,
    materialParams: {
      displacementScale: 0,
    },
  });

  const outerMaterial = useMaterial({
    textureUrls: TEXTURES.rock,
    materialParams: {
      displacementScale: 0,
      fog: true,
    },
    mapTiling: [0.075, 0.075],
    displacementMapTiling: [0.075, 0.075],
  });

  return (
    <group>
      <mesh geometry={innerGeometry} material={innerMaterial} />
      <mesh geometry={boundaryGeometry} material={middleMaterial} />
      <mesh geometry={outerGeometry} material={outerMaterial} />
    </group>
  );
});

export default Layout;
