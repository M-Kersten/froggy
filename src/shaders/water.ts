import * as THREE from 'three';
import { MAX_RIPPLES, rippleData } from '../state/ripples';
import { COLORS } from '../config';

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vHeight;

  // Sum of small, higher-frequency ripples → fine, subtle wavelets.
  float waveHeight(vec2 p, float t) {
    float h = 0.0;
    h += sin(p.x * 1.35 + t * 0.85) * 0.05;
    h += sin(p.y * 1.55 - t * 0.75) * 0.045;
    h += sin((p.x + p.y) * 1.15 + t * 1.15) * 0.03;
    h += sin((p.x - p.y) * 1.9 - t * 1.5) * 0.022;
    return h;
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xy; // local plane coords (before the flattening rotation)
    float t = uTime;

    float h = waveHeight(p, t);
    pos.z += h;
    vHeight = h;

    // Normal from finite differences of the height field.
    float e = 0.18;
    float hx = waveHeight(p + vec2(e, 0.0), t) - waveHeight(p - vec2(e, 0.0), t);
    float hy = waveHeight(p + vec2(0.0, e), t) - waveHeight(p - vec2(0.0, e), t);
    vec3 n = normalize(vec3(-hx, -hy, 2.0 * e));
    vNormal = normalize(mat3(modelMatrix) * n);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  #define MAX_RIPPLES ${MAX_RIPPLES}
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uColorHighlight;
  uniform vec3 uLightDir;
  uniform vec2 uCenter;
  uniform vec4 uRipples[MAX_RIPPLES];

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vHeight;

  void main() {
    vec3 normal = normalize(vNormal);

    // Strong depth gradient from the garden centre → dark edges make land pop.
    float distC = length(vWorldPos.xz - uCenter);
    float depth = smoothstep(3.0, 30.0, distC);
    vec3 base = mix(uColorShallow, uColorDeep, depth);
    // extra darkening far out for contrast / focus
    base *= 1.0 - smoothstep(20.0, 40.0, distC) * 0.35;

    // Wave crests catch the light (subtle, calm water).
    base = mix(base, uColorHighlight, smoothstep(0.03, 0.08, vHeight) * 0.3);

    // Soft diffuse + a restrained top-down specular sparkle on the crests.
    vec3 L = normalize(uLightDir);
    float diff = clamp(dot(normal, L) * 0.5 + 0.5, 0.0, 1.0);
    vec3 color = base * (0.82 + 0.18 * diff);

    vec3 V = vec3(0.0, 1.0, 0.0);
    vec3 H = normalize(L + V);
    float spec = pow(clamp(dot(normal, H), 0.0, 1.0), 70.0);
    color += vec3(spec) * 0.22;

    // Expanding concentric ripples from the shared buffer.
    float ripple = 0.0;
    for (int i = 0; i < MAX_RIPPLES; i++) {
      vec4 r = uRipples[i];
      float strength = r.w;
      if (strength <= 0.0) continue;
      float age = uTime - r.z;
      if (age < 0.0 || age > 2.2) continue;
      float d = distance(vWorldPos.xz, r.xy);
      float radius = age * 2.6;
      float ring = smoothstep(0.55, 0.0, abs(d - radius));
      float ring2 = smoothstep(0.50, 0.0, abs(d - radius * 0.55)) * 0.5;
      float fade = 1.0 - age / 2.2;
      ripple += (ring + ring2) * fade * strength;
    }
    ripple = clamp(ripple, 0.0, 1.5);
    color += uColorHighlight * ripple * 0.5;

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
      uLightDir: { value: new THREE.Vector3(0.4, 1.0, 0.3).normalize() },
      uCenter: { value: new THREE.Vector2(0, 0) },
      uRipples: { value: rippleData },
    },
  });
}
