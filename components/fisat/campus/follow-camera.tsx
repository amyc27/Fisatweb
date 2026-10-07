'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { boxColliders } from '@/lib/fisat/campus-layout'
import { CAMERA } from '@/lib/fisat/constants'
import { cameraRig, vehicle } from '@/lib/fisat/runtime'
import { getGameState } from '@/lib/fisat/store'

export function FollowCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera)
  const desired = useRef(new Vector3())
  const lookTarget = useRef(new Vector3())

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const { phase } = getGameState()

    if (phase === 'CAMPUS' || phase === 'LOADING') {
      const fx = Math.sin(vehicle.heading)
      const fz = Math.cos(vehicle.heading)
      const speedPull = Math.min(Math.abs(vehicle.speed) / 17, 1) * 1.5

      const d = desired.current
      d.set(
        vehicle.x - fx * (CAMERA.distance + speedPull),
        CAMERA.height + speedPull * 0.3,
        vehicle.z - fz * (CAMERA.distance + speedPull),
      )

      for (const b of boxColliders) {
        if (Math.abs(d.x - b.x) < b.hw + 1 && Math.abs(d.z - b.z) < b.hd + 1) {
          d.y = Math.max(d.y, b.height + 2)
        }
      }

      lookTarget.current.set(vehicle.x + fx * CAMERA.lookAhead, 1.2, vehicle.z + fz * CAMERA.lookAhead)

      const posK = reducedMotion
        ? 1 - Math.exp(-CAMERA.reducedMotionDamping * dt)
        : 1 - Math.exp(-(phase === 'LOADING' ? 1.6 : CAMERA.positionDamping) * dt)
      const tgtK = 1 - Math.exp(-(reducedMotion ? CAMERA.reducedMotionDamping : CAMERA.targetDamping) * dt)
      cameraRig.position.lerp(d, posK)
      cameraRig.target.lerp(lookTarget.current, tgtK)
    }

    camera.position.copy(cameraRig.position)
    camera.lookAt(cameraRig.target)
  })

  return null
}
