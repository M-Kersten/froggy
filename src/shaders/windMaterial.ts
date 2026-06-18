import * as THREE from 'three';

export interface WindMaterial extends THREE.MeshStandardMaterial {
  userData: { shader?: { uniforms: { uTime: { value: number } } } };
}

/**
 * A flat-shaded standard material that bends its geometry in the vertex stage
 * to fake a breeze. Expects a per-instance `aPhase` attribute (so each reed
 * sways out of sync) and geometry whose base sits at local y = 0.
 */
export function makeWindMaterial(color: string, strength: number): WindMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.85,
    metalness: 0,
  }) as WindMaterial;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    mat.userData.shader = shader as unknown as WindMaterial['userData']['shader'];

    shader.vertexShader =
      'uniform float uTime;\nattribute float aPhase;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `#include <begin_vertex>
        float h = max(position.y, 0.0);
        float bend = h * h * ${strength.toFixed(3)};
        transformed.x += sin(uTime * 1.5 + aPhase) * bend;
        transformed.z += cos(uTime * 1.2 + aPhase * 1.3) * bend * 0.6;
      `,
    );
  };

  return mat;
}

/** Push the shared clock into every wind material each frame. */
export function updateWind(mat: WindMaterial, time: number): void {
  const shader = mat.userData.shader;
  if (shader) shader.uniforms.uTime.value = time;
}
