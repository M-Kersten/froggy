import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { StandProp } from './StandProp';
import type { Island } from '../../types';
import { FONT_SEMIBOLD } from '../../utils/fonts';

const HEADING_COLOR = '#274b38';
const PREVIEW_W = 2.6;
const PREVIEW_H = PREVIEW_W * 0.625;

function ScreenshotPreview({ url }: { url: string }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return (
    <group>
      <RoundedBox args={[PREVIEW_W + 0.2, 0.08, PREVIEW_H + 0.2]} radius={0.06} smoothness={3} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.21, 0]}>
        <planeGeometry args={[PREVIEW_W, PREVIEW_H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function NumberBadge({ n, accent }: { n: number; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.1, 24]} />
        <meshStandardMaterial color={accent} roughness={0.5} emissive={accent} emissiveIntensity={0.12} />
      </mesh>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.34}
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {String(n)}
      </Text>
    </group>
  );
}

function Pill({ label, accent }: { label: string; accent: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2.6) * 0.03);
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[1.5, 0.14, 0.46]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.18} roughness={0.45} />
      </RoundedBox>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.17}
        position={[0, 0.09, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/** Content laid flat on a project / info / contact island. */
export function IslandContent({ island }: { island: Island }) {
  const content = island.content;
  if (!content) return null;

  const isProject = island.type === 'project' && !!content.screenshot;
  const heading = isProject ? content.title : island.label;
  const pillLabel = island.type === 'contact' ? 'Say hello' : 'Read More';

  return (
    <group>
      {island.number !== undefined && (
        <group position={[0, 0, isProject ? -2.0 : -1.5]}>
          <NumberBadge n={island.number} accent={island.accent} />
        </group>
      )}

      {isProject ? (
        <group position={[0, 0, -0.5]}>
          <ScreenshotPreview url={content.screenshot!} />
        </group>
      ) : (
        island.prop &&
        island.prop !== 'torii' &&
        island.prop !== 'board' && (
          <group position={[0, 0, -0.55]}>
            <StandProp prop={island.prop} accent={island.accent} />
          </group>
        )
      )}

      <Text
        font={FONT_SEMIBOLD}
        fontSize={isProject ? 0.26 : 0.34}
        position={[0, 0.06, isProject ? 1.0 : 0.75]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={HEADING_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={isProject ? 3.4 : 3.0}
        textAlign="center"
      >
        {heading}
      </Text>

      <group position={[0, 0.06, isProject ? 1.95 : 1.7]}>
        <Pill label={pillLabel} accent={island.accent} />
      </group>
    </group>
  );
}
