'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { benches, gatePillars, lamps, people, plaza, roads, sportsField, trees } from '@/lib/fisat/campus-layout'
import { PALETTE, WORLD } from '@/lib/fisat/constants'

type Transform = {
  x: number
  y: number
  z: number
  ry?: number
  sx?: number
  sy?: number
  sz?: number
  color?: string
}

function Instances({
  items,
  castShadow = false,
  children,
}: {
  items: Transform[]
  castShadow?: boolean
  children: React.ReactNode
}) {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    items.forEach((t, i) => {
      dummy.position.set(t.x, t.y, t.z)
      dummy.rotation.set(0, t.ry ?? 0, 0)
      dummy.scale.set(t.sx ?? 1, t.sy ?? 1, t.sz ?? 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      if (t.color) mesh.setColorAt(i, color.set(t.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [items])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow={castShadow} receiveShadow>
      {children}
    </instancedMesh>
  )
}

function Ground() {
  const size = WORLD.halfSize * 2
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[size * 2.4, size * 2.4]} />
        <meshStandardMaterial color={PALETTE.grass} roughness={1} />
      </mesh>
      {roads.map((r, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[r.x, 0.02, r.z]} receiveShadow>
          <planeGeometry args={[r.w, r.d]} />
          <meshStandardMaterial color={PALETTE.road} roughness={0.95} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[plaza.x, 0.03, plaza.z]} receiveShadow>
        <circleGeometry args={[plaza.radius, 48]} />
        <meshStandardMaterial color={PALETTE.path} roughness={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[plaza.x, 0.04, plaza.z]}>
        <ringGeometry args={[2.2, 2.6, 48]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.6} />
      </mesh>
      <mesh position={[plaza.x, 0.4, plaza.z]} castShadow>
        <cylinderGeometry args={[2, 2.2, 0.8, 32]} />
        <meshStandardMaterial color={PALETTE.stone} />
      </mesh>
      <mesh position={[plaza.x, 0.85, plaza.z]}>
        <cylinderGeometry args={[1.7, 1.7, 0.1, 32]} />
        <meshStandardMaterial color="#5c8ea8" roughness={0.2} metalness={0.1} />
      </mesh>
      <SportsField />
    </group>
  )
}

function SportsField() {
  const { x, z, w, d } = sportsField
  return (
    <group position={[x, 0, z]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.025} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#5f9a4c" roughness={1} />
      </mesh>
      {[
        [0, -d / 2 + 0.15, w, 0.3],
        [0, d / 2 - 0.15, w, 0.3],
        [-w / 2 + 0.15, 0, 0.3, d],
        [w / 2 - 0.15, 0, 0.3, d],
        [0, 0, w, 0.3],
      ].map(([lx, lz, lw, ld], i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[lx, 0.035, lz]}>
          <planeGeometry args={[lw, ld]} />
          <meshBasicMaterial color="#f4f2ee" />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position-y={0.035}>
        <ringGeometry args={[3, 3.3, 48]} />
        <meshBasicMaterial color="#f4f2ee" />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, s * (d / 2 - 0.4)]}>
          <mesh position={[-2.5, 1, 0]} castShadow>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color="#f4f2ee" />
          </mesh>
          <mesh position={[2.5, 1, 0]} castShadow>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color="#f4f2ee" />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[5.15, 0.15, 0.15]} />
            <meshStandardMaterial color="#f4f2ee" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LaneMarkings() {
  const items = useMemo<Transform[]>(() => {
    const list: Transform[] = []
    for (let z = -24; z <= 50; z += 4) list.push({ x: 0, y: 0.04, z, sx: 0.18, sz: 1.6 })
    for (let x = -46; x <= 46; x += 4) {
      if (Math.abs(x) < 5) continue
      list.push({ x, y: 0.04, z: -8, sx: 1.6, sz: 0.18 })
      list.push({ x, y: 0.04, z: 34, sx: 1.6, sz: 0.18 })
    }
    return list
  }, [])
  return (
    <Instances items={items}>
      <boxGeometry args={[1, 0.01, 1]} />
      <meshBasicMaterial color="#e9e3d6" />
    </Instances>
  )
}

function Trees() {
  const { trunks, crowns, palmTrunks, palmCrowns } = useMemo(() => {
    const trunks: Transform[] = []
    const crowns: Transform[] = []
    const palmTrunks: Transform[] = []
    const palmCrowns: Transform[] = []
    trees.forEach((t) => {
      if (t.palm) {
        palmTrunks.push({ x: t.x, y: 3 * t.scale, z: t.z, sx: t.scale, sy: t.scale, sz: t.scale })
        palmCrowns.push({ x: t.x, y: 6.2 * t.scale, z: t.z, ry: t.rotation, sx: t.scale, sy: t.scale * 0.55, sz: t.scale })
      } else {
        trunks.push({ x: t.x, y: 1 * t.scale, z: t.z, sx: t.scale, sy: t.scale, sz: t.scale })
        crowns.push({ x: t.x, y: 3.2 * t.scale, z: t.z, ry: t.rotation, sx: t.scale, sy: t.scale, sz: t.scale })
      }
    })
    return { trunks, crowns, palmTrunks, palmCrowns }
  }, [])

  return (
    <group>
      <Instances items={trunks} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 2, 6]} />
        <meshStandardMaterial color="#6e5440" roughness={1} />
      </Instances>
      <Instances items={crowns} castShadow>
        <icosahedronGeometry args={[1.9, 0]} />
        <meshStandardMaterial color={PALETTE.grassDark} roughness={1} flatShading />
      </Instances>
      <Instances items={palmTrunks} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 6, 6]} />
        <meshStandardMaterial color="#8a7259" roughness={1} />
      </Instances>
      <Instances items={palmCrowns} castShadow>
        <coneGeometry args={[2.4, 1.6, 7, 1, true]} />
        <meshStandardMaterial color="#4f7d3b" roughness={1} flatShading side={2} />
      </Instances>
    </group>
  )
}

function StreetFurniture() {
  const { poles, bulbs, seats, bodies, heads } = useMemo(() => {
    const poles: Transform[] = lamps.map((l) => ({ x: l.x, y: 1.8, z: l.z }))
    const bulbs: Transform[] = lamps.map((l) => ({ x: l.x, y: 3.65, z: l.z }))
    const seats: Transform[] = benches.map((b) => ({ x: b.x, y: 0.45, z: b.z, ry: b.rotation }))
    const bodies: Transform[] = people.map((p) => ({ x: p.x, y: 0.75, z: p.z, color: p.color }))
    const heads: Transform[] = people.map((p) => ({ x: p.x, y: 1.65, z: p.z }))
    return { poles, bulbs, seats, bodies, heads }
  }, [])
  return (
    <group>
      <Instances items={poles} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3.6, 6]} />
        <meshStandardMaterial color="#2b2f36" />
      </Instances>
      <Instances items={bulbs}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#fff2cf" emissive="#ffd98a" emissiveIntensity={0.9} />
      </Instances>
      <Instances items={seats} castShadow>
        <boxGeometry args={[1.8, 0.12, 0.5]} />
        <meshStandardMaterial color="#8a6a4d" />
      </Instances>
      <Instances items={bodies} castShadow>
        <capsuleGeometry args={[0.26, 0.9, 3, 8]} />
        <meshStandardMaterial roughness={0.9} />
      </Instances>
      <Instances items={heads}>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color="#8d6346" roughness={0.9} />
      </Instances>
    </group>
  )
}

function EntranceGate() {
  return (
    <group>
      {gatePillars.map((p, i) => (
        <mesh key={i} position={[p.x, 3, p.z]} castShadow>
          <boxGeometry args={[1.4, 6, 1.4]} />
          <meshStandardMaterial color={PALETTE.offWhite} />
        </mesh>
      ))}
      <mesh position={[0, 6.4, 50]} castShadow>
        <boxGeometry args={[14.6, 1.2, 1.6]} />
        <meshStandardMaterial color={PALETTE.navy} />
      </mesh>
      <mesh position={[0, 6.4, 49.15]}>
        <boxGeometry args={[6, 0.35, 0.05]} />
        <meshStandardMaterial color={PALETTE.accent} emissive={PALETTE.accent} emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

export function CampusEnvironment({ shadows }: { shadows: boolean }) {
  return (
    <>
      <color attach="background" args={['#cfdbe2']} />
      <fog attach="fog" args={['#cfdbe2', 70, 170]} />
      <hemisphereLight args={['#f6f1e6', '#5d7d4a', 0.9]} />
      <directionalLight
        position={[40, 60, 25]}
        intensity={2.1}
        color="#fff4e2"
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-far={200}
        shadow-bias={-0.0004}
      />
      <Ground />
      <LaneMarkings />
      <Trees />
      <StreetFurniture />
      <EntranceGate />
    </>
  )
}
