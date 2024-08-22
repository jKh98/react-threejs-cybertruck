import { Shape, ExtrudeGeometry, Vector3 } from "three";
import {
  TEXTURES,
  LOOP_SIZE,
  STREET_WIDTH,
  CORNER_RADIUS,
  STREET_DEPTH,
  INNER_CORNER_RADIUS,
  STREET_INNER_DEPTH,
} from "../config";
import TexturedMesh from "./TexturedMesh";
import { forwardRef, useImperativeHandle } from "react";

export type StreetRefObject = {
  checkBounds: (position: Vector3) => {
    withinOuterBox: boolean;
    withinInnerBox: boolean;
  };
};

const Street = forwardRef((_, ref) => {
  const createTrackShape = (
    width: number,
    height: number,
    outerRadius: number
  ) => {
    const shape = new Shape();
    shape.moveTo(outerRadius, 0);
    shape.lineTo(width - outerRadius, 0);
    shape.absarc(
      width - outerRadius,
      outerRadius,
      outerRadius,
      -Math.PI / 2,
      0,
      false
    );
    shape.lineTo(width, height - outerRadius);
    shape.absarc(
      width - outerRadius,
      height - outerRadius,
      outerRadius,
      0,
      Math.PI / 2,
      false
    );
    shape.lineTo(outerRadius, height);
    shape.absarc(
      outerRadius,
      height - outerRadius,
      outerRadius,
      Math.PI / 2,
      Math.PI,
      false
    );
    shape.lineTo(0, outerRadius);
    shape.absarc(
      outerRadius,
      outerRadius,
      outerRadius,
      Math.PI,
      Math.PI * 1.5,
      false
    );
    return shape;
  };

  const outerShape = createTrackShape(LOOP_SIZE, LOOP_SIZE, CORNER_RADIUS);

  const innerWidth = LOOP_SIZE - 2 * STREET_WIDTH;
  const innerHeight = LOOP_SIZE - 2 * STREET_WIDTH;

  const innerShape = new Shape();
  innerShape.moveTo(INNER_CORNER_RADIUS + STREET_WIDTH, STREET_WIDTH);
  innerShape.lineTo(
    innerWidth - INNER_CORNER_RADIUS + STREET_WIDTH,
    STREET_WIDTH
  );
  innerShape.absarc(
    innerWidth - INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS,
    -Math.PI / 2,
    0,
    false
  );
  innerShape.lineTo(
    innerWidth + STREET_WIDTH,
    innerHeight - INNER_CORNER_RADIUS + STREET_WIDTH
  );
  innerShape.absarc(
    innerWidth - INNER_CORNER_RADIUS + STREET_WIDTH,
    innerHeight - INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS,
    0,
    Math.PI / 2,
    false
  );
  innerShape.lineTo(
    INNER_CORNER_RADIUS + STREET_WIDTH,
    innerHeight + STREET_WIDTH
  );
  innerShape.absarc(
    INNER_CORNER_RADIUS + STREET_WIDTH,
    innerHeight - INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS,
    Math.PI / 2,
    Math.PI,
    false
  );
  innerShape.lineTo(STREET_WIDTH, INNER_CORNER_RADIUS + STREET_WIDTH);
  innerShape.absarc(
    INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS + STREET_WIDTH,
    INNER_CORNER_RADIUS,
    Math.PI,
    Math.PI * 1.5,
    false
  );

  const outerGeometry = new ExtrudeGeometry(outerShape, {
    depth: STREET_DEPTH,
    bevelEnabled: false,
  });

  const innerGeometry = new ExtrudeGeometry(innerShape, {
    depth: STREET_INNER_DEPTH,
    bevelEnabled: true,
  });

  // Rotate the geometry to align with the car
  outerGeometry.rotateX(-Math.PI / 2);
  innerGeometry.rotateX(-Math.PI / 2);

  // Check that the car is within outer bounds and outside inner bounds
  const checkBounds = (
    position: Vector3
  ): {
    withinOuterBox: boolean;
    withinInnerBox: boolean;
  } => {
    outerGeometry.computeBoundingBox();
    innerGeometry.computeBoundingBox();
    outerGeometry.computeBoundingSphere();
    innerGeometry.computeBoundingSphere();

    const outerBoxBounds = outerGeometry.boundingBox;
    const innerBoxBounds = innerGeometry.boundingBox;
    const outerSphereBounds = outerGeometry.boundingSphere;
    const innerSphereBounds = innerGeometry.boundingSphere;

    if (
      !outerBoxBounds ||
      !innerBoxBounds ||
      !outerSphereBounds ||
      !innerSphereBounds
    ) {
      return { withinOuterBox: false, withinInnerBox: false };
    }

    const outerBoxContains = outerBoxBounds.containsPoint(position);
    const innerBoxContains = innerBoxBounds.containsPoint(position);

    const outerSphereContains = outerSphereBounds.containsPoint(position);
    const innerSphereContains = innerSphereBounds.containsPoint(position);

    const withinOuterBox = outerBoxContains && outerSphereContains;
    const withinInnerBox = innerBoxContains && innerSphereContains;

    return { withinOuterBox, withinInnerBox };
  };

  useImperativeHandle(ref, () => ({
    checkBounds,
  }));

  return (
    <>
      <TexturedMesh
        geometry={outerGeometry}
        textureUrls={TEXTURES.tiles}
        materialParams={{
          displacementScale: 0, // Fine-tune displacement scale
          roughness: 0.1, // Lower roughness for a shinier appearance
          metalness: 0.1, // Lower metalness for less metallic look
        }}
      />
      <TexturedMesh
        geometry={innerGeometry}
        textureUrls={TEXTURES.grass}
        materialParams={{
          displacementScale: 0.1, // Fine-tune displacement scale
          roughness: 0.5, // Lower roughness for a shinier appearance
          metalness: 0, // Lower metalness for less metallic look
        }}
      />
    </>
  );
});

export default Street;
