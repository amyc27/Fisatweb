'use client'

import { Canvas } from '@react-three/fiber'
import { CAMERA } from '@/lib/fisat/constants'
import { actions, useGame } from '@/lib/fisat/store'
import { CampusEnvironment } from './campus-environment'
import { CampusModel } from './campus-model'
import { FollowCamera } from './follow-camera'
import { InteractionZones } from './interaction-zones'
import { PlayerVehicle } from './player-vehicle'

export function CampusScene({ lowPower, reducedMotion }: { lowPower: boolean; reducedMotion: boolean }) {
  const phase = useGame((s) => s.phase)
  const running = phase === 'CAMPUS' || phase === 'LOADING'

  return (
    <Canvas
      className="!absolute inset-0 touch-none"
      shadows={!lowPower}
      dpr={[1, lowPower ? 1.5 : 2]}
      frameloop={running ? 'always' : 'demand'}
      camera={{
        fov: 50,
        near: 0.5,
        far: 320,
        position: [CAMERA.entryPosition.x, CAMERA.entryPosition.y, CAMERA.entryPosition.z],
      }}
      gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => actions.fallback(), { once: true })
        requestAnimationFrame(() => requestAnimationFrame(() => actions.setSceneReady()))
      }}
      aria-hidden="true"
    >
      <CampusEnvironment shadows={!lowPower} />
      <CampusModel />
      <InteractionZones />
      <PlayerVehicle />
      <FollowCamera reducedMotion={reducedMotion} />
    </Canvas>
  )
}
