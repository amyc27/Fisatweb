'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { PALETTE, VEHICLE } from '@/lib/fisat/constants'
import { readControls, stepVehicle } from '@/lib/fisat/physics'
import { vehicle } from '@/lib/fisat/runtime'
import { getGameState } from '@/lib/fisat/store'

const WHEELS: [number, number, number, boolean][] = [
  [-0.82, VEHICLE.wheelRadius, 1.05, true],
  [0.82, VEHICLE.wheelRadius, 1.05, true],
  [-0.82, VEHICLE.wheelRadius, -1.05, false],
  [0.82, VEHICLE.wheelRadius, -1.05, false],
]

export function PlayerVehicle() {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const wheelRefs = useRef<(Group | null)[]>([])
  const spinRefs = useRef<(Mesh | null)[]>([])
  const visual = useRef({ steer: 0, lean: 0, pitch: 0, lastSpeed: 0 })

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const active = getGameState().phase === 'CAMPUS'
    const { throttle, turn } = active ? readControls() : { throttle: 0, turn: 0 }

    if (active) stepVehicle(dt, throttle, turn)

    const v = visual.current
    const k = 1 - Math.exp(-10 * dt)
    const accel = (vehicle.speed - v.lastSpeed) / Math.max(dt, 1e-4)
    v.lastSpeed = vehicle.speed
    v.steer += (turn * 0.45 - v.steer) * k
    v.lean += (-turn * Math.min(Math.abs(vehicle.speed) / VEHICLE.maxSpeed, 1) * 0.07 - v.lean) * k
    v.pitch += (Math.max(-0.05, Math.min(0.05, -accel * 0.004)) - v.pitch) * k

    if (root.current) {
      root.current.position.set(vehicle.x, 0, vehicle.z)
      root.current.rotation.y = vehicle.heading
    }
    if (body.current) {
      body.current.rotation.z = v.lean
      body.current.rotation.x = v.pitch
    }
    const spin = (vehicle.speed * dt) / VEHICLE.wheelRadius
    WHEELS.forEach(([, , , front], i) => {
      const w = wheelRefs.current[i]
      if (w && front) w.rotation.y = v.steer
      const s = spinRefs.current[i]
      if (s) s.rotation.x += spin
    })
  })

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
        <circleGeometry args={[1.5, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <group ref={body}>
        <RoundedBox args={[1.6, 0.7, 3]} radius={0.22} smoothness={3} position-y={0.75} castShadow>
          <meshStandardMaterial color={PALETTE.navy} roughness={0.4} metalness={0.2} />
        </RoundedBox>
        <RoundedBox args={[1.4, 0.55, 1.5]} radius={0.18} smoothness={3} position={[0, 1.35, -0.25]} castShadow>
          <meshStandardMaterial color={PALETTE.offWhite} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 1.38, 0.52]} rotation-x={-0.35}>
          <boxGeometry args={[1.3, 0.42, 0.05]} />
          <meshStandardMaterial color="#2c3a4d" roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.82, 1.48]}>
          <boxGeometry args={[1.2, 0.08, 0.06]} />
          <meshStandardMaterial color={PALETTE.accent} emissive={PALETTE.accent} emissiveIntensity={0.4} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.8, 1.5]}>
            <boxGeometry args={[0.28, 0.14, 0.04]} />
            <meshStandardMaterial color="#fff6dc" emissive="#fff1c4" emissiveIntensity={1.2} />
          </mesh>
        ))}
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.85, -1.5]}>
            <boxGeometry args={[0.3, 0.12, 0.04]} />
            <meshStandardMaterial color="#c0392b" emissive="#c0392b" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
      {WHEELS.map(([x, y, z], i) => (
        <group
          key={i}
          position={[x, y, z]}
          ref={(el) => {
            wheelRefs.current[i] = el
          }}
        >
          <mesh
            rotation-z={Math.PI / 2}
            ref={(el) => {
              spinRefs.current[i] = el
            }}
            castShadow
          >
            <cylinderGeometry args={[VEHICLE.wheelRadius, VEHICLE.wheelRadius, 0.3, 14]} />
            <meshStandardMaterial color="#1b1d21" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
