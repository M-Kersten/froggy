import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../../types';
import { FONT_REGULAR, FONT_SEMIBOLD } from '../../utils/fonts';

const TITLE_COLOR = '#1f3b2e';
const BODY_COLOR = '#2f5a44';
const PREVIEW_W = 2.35;
const PREVIEW_H = PREVIEW_W * 0.625; // 16:10

function ScreenshotPreview({ url }: { url: string }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  return (
    <group>
      <RoundedBox args={[PREVIEW_W + 0.2, 0.07, PREVIEW_H + 0.2]} radius={0.06} smoothness={3} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.205, 0]}>
        <planeGeometry args={[PREVIEW_W, PREVIEW_H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ReadMorePill({ accent }: { accent: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.6) * 0.03;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[1.5, 0.13, 0.46]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.18} roughness={0.45} />
      </RoundedBox>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.17}
        position={[0, 0.08, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Read More ›
      </Text>
    </group>
  );
}

/** Title, screenshot preview, one-liner and a Read More pill, laid flat on the pad. */
export function ProjectPadContent({ project }: { project: Project }) {
  return (
    <group>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.32}
        position={[0, 0.22, -1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={TITLE_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={3.4}
        textAlign="center"
      >
        {project.title}
      </Text>

      <group position={[0, 0, -0.15]}>
        <ScreenshotPreview url={project.screenshot} />
      </group>

      <Text
        font={FONT_REGULAR}
        fontSize={0.16}
        position={[0, 0.22, 0.95]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={BODY_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.9}
        textAlign="center"
        lineHeight={1.3}
      >
        {project.description}
      </Text>

      <group position={[0, 0.22, 1.65]}>
        <ReadMorePill accent={project.accent} />
      </group>
    </group>
  );
}
