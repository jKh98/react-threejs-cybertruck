import { Shape, ExtrudeGeometry, Box3, Mesh } from "three";
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
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface StreetProps {
  innerRef: React.MutableRefObject<Box3 | undefined>;
  outerRef: React.MutableRefObject<Box3 | undefined>;
}

const Street = forwardRef((_, ref) => {
  const outerRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  useImperativeHandle(ref, () => ({
    getOuterBoundingBox: () =>
      outerRef.current?.geometry?.boundingBox || new Box3(),
    getInnerBoundingBox: () =>
      innerRef.current?.geometry?.boundingBox || new Box3(),
  }));

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

    bevelEnabled: true,
  });

  const innerGeometry = new ExtrudeGeometry(innerShape, {
    depth: STREET_INNER_DEPTH,
    bevelEnabled: true,
  });

  return (
    <>
      <TexturedMesh
        ref={outerRef}
        geometry={outerGeometry}
        textureUrls={TEXTURES.tiles}
      />
      <TexturedMesh
        ref={innerRef}
        geometry={innerGeometry}
        textureUrls={TEXTURES.grass}
      />
    </>
  );
});

export default Street;
