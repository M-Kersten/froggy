import * as THREE from 'three';
import { MAX_RIPPLES, rippleData } from '../state/ripples';
import { COLORS } from '../config';

export const MAX_ISLANDS = 12;

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  #define MAX_RIPPLES ${MAX_RIPPLES}
  #define MAX_ISLANDS ${MAX_ISLANDS}
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uColorHighlight;
  uniform vec2 uCenter;
  uniform vec4 uRipples[MAX_RIPPLES];
  uniform vec3 uIslands[MAX_ISLANDS]; // xz = centre, z-component = radius
  uniform int uIslandCount;

  varying vec3 vWorldPos;

  void main() {
    vec2 P = vWorldPos.xz;

    // Clean depth gradient from the garden centre → dark, calm edges.
    float distC = length(P - uCenter);
    float depth = smoothstep(3.0, 30.0, distC);
    vec3 color = mix(uColorShallow, uColorDeep, depth);
    color *= 1.0 - smoothstep(20.0, 42.0, distC) * 0.35;

    // Very soft, broad tone drift (no directional ripple texture).
    float u = sin(P.x * 0.16 + uTime * 0.18) * sin(P.y * 0.16 - uTime * 0.16);
    color = mix(color, uColorHighlight, (u * 0.5 + 0.5) * 0.04);

    // Stylised shoreline foam: a soft lapping band just outside each island.
    float edge = 1e9;
    for (int i = 0; i < MAX_ISLANDS; i++) {
      if (i >= uIslandCount) continue;
      vec3 isl = uIslands[i];
      edge = min(edge, length(P - isl.xy) - isl.z);
    }
    float foam = smoothstep(1.05, 0.0, edge) * step(0.04, edge);
    foam *= 0.5 + 0.5 * sin(edge * 6.5 - uTime * 1.6);
    color = mix(color, uColorHighlight, clamp(foam, 0.0, 1.0) * 0.5);

    // Sparse, soft sun sparkle.
    vec2 sp = P * 0.3;
    float n = sin(sp.x + uTime * 0.35) * sin(sp.y * 1.3 - uTime * 0.28)
            + sin((sp.x + sp.y) * 0.6 + uTime * 0.4);
    color += uColorHighlight * smoothstep(1.5, 1.95, n) * 0.10;

    // Soft expanding ripples (event-driven).
    float ripple = 0.0;
    for (int i = 0; i < MAX_RIPPLES; i++) {
      vec4 r = uRipples[i];
      if (r.w <= 0.0) continue;
      float age = uTime - r.z;
      if (age < 0.0 || age > 2.2) continue;
      float d = distance(P, r.xy);
      float radius = age * 2.6;
      ripple += smoothstep(0.5, 0.0, abs(d - radius)) * (1.0 - age / 2.2) * r.w;
    }
    color += uColorHighlight * clamp(ripple, 0.0, 1.0) * 0.28;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function createWaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color(COLORS.waterDeep) },
      uColorShallow: { value: new THREE.Color(COLORS.waterShallow) },
      uColorHighlight: { value: new THREE.Color(COLORS.waterHighlight) },
      uCenter: { value: new THREE.Vector2(0, 0) },
      uRipples: { value: rippleData },
      uIslands: { value: new Float32Array(MAX_ISLANDS * 3) },
      uIslandCount: { value: 0 },
    },
  });
}
