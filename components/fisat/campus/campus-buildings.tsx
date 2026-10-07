'use client'

import { buildings, type BuildingDef } from '@/lib/fisat/campus-layout'
import { PALETTE } from '@/lib/fisat/constants'

const GLASS = '#2c3a4d'
const FLOOR_HEIGHT = 3

function WindowBands({ w, d, height }: { w: number; d: number; height: number }) {
  const floors = Math.max(1, Math.floor((height - 1) / FLOOR_HEIGHT))
  return (
    <>
      {Array.from({ length: floors }, (_, i) => (
        <mesh key={i} position-y={1.9 + i * FLOOR_HEIGHT}>
          <boxGeometry args={[w + 0.06, 1.1, d + 0.06]} />
          <meshStandardMaterial color={GLASS} roughness={0.25} metalness={0.3} />
        </mesh>
      ))}
    </>
  )
}

function Fins({ w, d, height, spacing = 2.4 }: { w: number; d: number; height: number; spacing?: number }) {
  const count = Math.floor(w / spacing)
  return (
    <>
      {Array.from({ length: count + 1 }, (_, i) => {
        const x = -w / 2 + (i * w) / count
        return (
          <mesh key={i} position={[x, height / 2, d / 2 + 0.12]}>
            <boxGeometry args={[0.22, height - 0.6, 0.28]} />
            <meshStandardMaterial color={PALETTE.offWhite} />
          </mesh>
        )
      })}
    </>
  )
}

function PyramidRoof({ w, d, y, rise = 2.4 }: { w: number; d: number; y: number; rise?: number }) {
  const radius = Math.SQRT2 / 2
  return (
    <mesh position-y={y + rise / 2} rotation-y={Math.PI / 4} scale={[w + 1.6, 1, d + 1.6]} castShadow>
      <coneGeometry args={[radius, rise, 4, 1]} />
      <meshStandardMaterial color={PALETTE.roof} roughness={0.85} flatShading />
    </mesh>
  )
}

function Block({ b }: { b: BuildingDef }) {
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position-y={b.height / 2} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.height, b.d]} />
        <meshStandardMaterial color={b.color} roughness={0.9} />
      </mesh>
      <WindowBands w={b.w} d={b.d} height={b.height} />
      <Fins w={b.w} d={b.d} height={b.height} />
      <mesh position-y={b.height + 0.25} castShadow>
        <boxGeometry args={[b.w + 0.8, 0.5, b.d + 0.8]} />
        <meshStandardMaterial color={PALETTE.stone} />
      </mesh>
      <mesh position={[0, 1.4, b.d / 2 + 0.3]}>
        <boxGeometry args={[3, 2.8, 0.2]} />
        <meshStandardMaterial color={PALETTE.navy} />
      </mesh>
      <mesh position={[0, 3.1, b.d / 2 + 0.9]} castShadow>
        <boxGeometry args={[5, 0.25, 2]} />
        <meshStandardMaterial color={PALETTE.offWhite} />
      </mesh>
    </group>
  )
}

function Hostel({ b }: { b: BuildingDef }) {
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position-y={b.height / 2} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.height, b.d]} />
        <meshStandardMaterial color={b.color} roughness={0.9} />
      </mesh>
      <WindowBands w={b.w} d={b.d} height={b.height} />
      <PyramidRoof w={b.w} d={b.d} y={b.height} />
      <mesh position={[b.w / 2 + 0.3, 1.4, 0]}>
        <boxGeometry args={[0.2, 2.8, 2.6]} />
        <meshStandardMaterial color={PALETTE.navy} />
      </mesh>
    </group>
  )
}

function Pavilion({ b }: { b: BuildingDef }) {
  const posts = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [0, -1],
    [0, 1],
  ]
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position-y={0.15} receiveShadow>
        <boxGeometry args={[b.w + 1, 0.3, b.d + 1]} />
        <meshStandardMaterial color={PALETTE.path} />
      </mesh>
      <mesh position={[0, 1.5, -b.d / 2 + 1.2]} castShadow>
        <boxGeometry args={[b.w - 0.6, 3, 2]} />
        <meshStandardMaterial color={b.color} />
      </mesh>
      {posts.map(([px, pz], i) => (
        <mesh key={i} position={[(px * b.w) / 2 - px * 0.3, b.height / 2, (pz * b.d) / 2 - pz * 0.3]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, b.height, 8]} />
          <meshStandardMaterial color="#7a5638" />
        </mesh>
      ))}
      {[-2.2, 0, 2.2].map((tx) => (
        <mesh key={tx} position={[tx, 0.8, 1.5]} castShadow>
          <boxGeometry args={[1.6, 0.1, 1]} />
          <meshStandardMaterial color="#8a6a4d" />
        </mesh>
      ))}
      <PyramidRoof w={b.w} d={b.d} y={b.height} rise={3} />
    </group>
  )
}

function Bus({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position-y={1.55} castShadow>
        <boxGeometry args={[2.4, 2.4, 6.4]} />
        <meshStandardMaterial color="#e2b23a" roughness={0.6} />
      </mesh>
      <mesh position-y={2}>
        <boxGeometry args={[2.46, 0.8, 5.6]} />
        <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.3} />
      </mesh>
      {[-2.2, 2.2].flatMap((wz) =>
        [-1.2, 1.2].map((wx) => (
          <mesh key={`${wx}${wz}`} position={[wx, 0.45, wz]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.45, 0.45, 0.3, 12]} />
            <meshStandardMaterial color="#1b1d21" />
          </mesh>
        )),
      )}
    </group>
  )
}

function BusBay({ b }: { b: BuildingDef }) {
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position-y={b.height + 0.15} castShadow>
        <boxGeometry args={[b.w, 0.3, b.d]} />
        <meshStandardMaterial color={PALETTE.navy} />
      </mesh>
      {[-1, -0.33, 0.33, 1].flatMap((px) =>
        [-1, 1].map((pz) => (
          <mesh key={`${px}${pz}`} position={[(px * (b.w - 0.6)) / 2, b.height / 2, (pz * (b.d - 0.6)) / 2]} castShadow>
            <boxGeometry args={[0.3, b.height, 0.3]} />
            <meshStandardMaterial color={PALETTE.stone} />
          </mesh>
        )),
      )}
      {[-7, -2.4, 2.4, 7].map((x) => (
        <Bus key={x} x={x} />
      ))}
    </group>
  )
}

function MainBuilding({ b }: { b: BuildingDef }) {
  const front = b.d / 2
  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position-y={0.3} receiveShadow>
        <boxGeometry args={[b.w + 2, 0.6, b.d + 4]} />
        <meshStandardMaterial color={PALETTE.stone} />
      </mesh>
      <mesh position-y={b.height / 2} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.height, b.d]} />
        <meshStandardMaterial color={b.color} roughness={0.85} />
      </mesh>
      <WindowBands w={b.w} d={b.d} height={b.height} />
      <mesh position-y={b.height + 0.3} castShadow>
        <boxGeometry args={[b.w + 1, 0.6, b.d + 1]} />
        <meshStandardMaterial color={PALETTE.offWhite} />
      </mesh>
      <mesh position={[0, b.height - 1.2, front + 0.06]}>
        <boxGeometry args={[b.w, 0.5, 0.1]} />
        <meshStandardMaterial color={PALETTE.accent} emissive={PALETTE.accent} emissiveIntensity={0.15} />
      </mesh>
      {/* Central tower */}
      <group position={[0, 0, 1]}>
        <mesh position-y={9} castShadow>
          <boxGeometry args={[9, 18, b.d - 1]} />
          <meshStandardMaterial color={PALETTE.offWhite} roughness={0.8} />
        </mesh>
        <mesh position={[0, 10, (b.d - 1) / 2 + 0.05]}>
          <boxGeometry args={[5, 12, 0.1]} />
          <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.4} />
        </mesh>
        <PyramidRoof w={9} d={b.d - 1} y={18} rise={3.2} />
      </group>
      {/* Colonnade portico */}
      <mesh position={[0, 5.2, front + 1.9]} castShadow>
        <boxGeometry args={[16, 0.6, 4]} />
        <meshStandardMaterial color={PALETTE.offWhite} />
      </mesh>
      {[-7, -4.2, -1.4, 1.4, 4.2, 7].map((x) => (
        <mesh key={x} position={[x, 2.6, front + 3.4]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 5, 12]} />
          <meshStandardMaterial color={PALETTE.offWhite} />
        </mesh>
      ))}
      <mesh position={[0, 2, front + 0.1]}>
        <boxGeometry args={[5, 3.6, 0.2]} />
        <meshStandardMaterial color={PALETTE.navy} />
      </mesh>
    </group>
  )
}

export function CampusBuildings() {
  return (
    <group>
      {buildings.map((b) => {
        switch (b.kind) {
          case 'main':
            return <MainBuilding key={b.id} b={b} />
          case 'hostel':
            return <Hostel key={b.id} b={b} />
          case 'pavilion':
            return <Pavilion key={b.id} b={b} />
          case 'busbay':
            return <BusBay key={b.id} b={b} />
          default:
            return <Block key={b.id} b={b} />
        }
      })}
    </group>
  )
}
