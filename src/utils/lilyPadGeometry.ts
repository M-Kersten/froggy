import * as THREE from 'three';

const cache = new Map<number, THREE.ExtrudeGeometry>();

/**
 * Builds the classic lily-pad silhouette: a near-full disc with a single
 * wedge notch cut toward the centre, given a little thickness + soft bevel for
 * a clean low-poly edge. Geometry is cached per radius (pads share sizes).
 */
export function getLilyPadGeometry(radius: number): THREE.ExtrudeGeometry {
  const key = Math.round(radius * 100);
  const cached = cache.get(key);
  if (cached) return cached;

  const notch = 0.42; // half-angle of the wedge cut (radians)
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, notch, Math.PI * 2 - notch, false);
  shape.lineTo(0, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.08,
    bevelSegments: 2,
    curveSegments: 22,
  });
  // Extrude builds along +Z; center the slab and lay it flat (top = +Y).
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  cache.set(key, geo);
  return geo;
}
