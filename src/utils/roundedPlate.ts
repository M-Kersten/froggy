import * as THREE from 'three';

const cache = new Map<string, THREE.ExtrudeGeometry>();

/**
 * A thin extruded rounded-rectangle "plate" lying flat (top face = +Y), used
 * for soft, rounded signboards and frames. Cached by its parameters.
 */
export function roundedPlate(w: number, h: number, r: number, depth = 0.07): THREE.ExtrudeGeometry {
  const key = `${w}|${h}|${r}|${depth}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const x = -w / 2;
  const y = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.025,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 6,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  geo.computeVertexNormals();
  cache.set(key, geo);
  return geo;
}
