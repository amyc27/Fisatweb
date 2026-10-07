'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Mesh, type MeshBasicMaterial } from 'three'
import { zones } from '@/lib/fisat/campus-layout'
import { PALETTE } from '@/lib/fisat/constants'
import { vehicle } from '@/lib/fisat/runtime'
import { actions, getGameState } from '@/lib/fisat/store'

function ZoneMarker({ index }: { index: number }) {
  const zone = zones[index]
  const ring = useRef<Mesh>(null)
  const beam = useRef<Mesh>(null)
  const glow = useRef(0)

  useFrame(({ clock }, delta) => {
    const active = getGameState().nearbyLocationId === zone.locationId
    glow.current += ((active ? 1 : 0) - glow.current) * (1 - Math.exp(-8 * delta))
    const t = clock.elapsedTime
    if (ring.current) {
      const s = 1 + Math.sin(t * 2 + index) * 0.04 + glow.current * 0.15
      ring.current.scale.setScalar(s)
      ;(ring.current.material as MeshBasicMaterial).opacity = 0.35 + glow.current * 0.55
    }
    if (beam.current) {
      ;(beam.current.material as MeshBasicMaterial).opacity = 0.05 + glow.current * 0.18
    }
  })

  return (
    <group position={[zone.x, 0, zone.z]}>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.06}>
        <ringGeometry args={[2.1, 2.5, 48]} />
        <meshBasicMaterial color={PALETTE.accent} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh ref={beam} position-y={3}>
        <cylinderGeometry args={[2.3, 2.3, 6, 32, 1, true]} />
        <meshBasicMaterial
          color={PALETTE.accent}
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={AdditiveBlending}
          side={2}
        />
      </mesh>
    </group>
  )
}

export function InteractionZones() {
  useFrame(() => {
    if (getGameState().phase !== 'CAMPUS') return
    let nearest: string | null = null
    let best = Infinity
    for (const z of zones) {
      const d = Math.hypot(vehicle.x - z.x, vehicle.z - z.z)
      if (d < z.radius && d < best) {
        best = d
        nearest = z.locationId
      }
    }
    actions.setNearby(nearest)
  })

  return (
    <group>
      {zones.map((z, i) => (
        <ZoneMarker key={z.locationId} index={i} />
      ))}
    </group>
  )
}
