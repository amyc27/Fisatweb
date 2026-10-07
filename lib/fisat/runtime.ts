import { Vector3 } from 'three'
import { CAMERA, WORLD } from './constants'

/**
 * High-frequency, per-frame state lives outside React so the vehicle and
 * camera can update at 60fps without re-rendering the component tree.
 */
export const vehicle = {
  x: WORLD.start.x as number,
  z: WORLD.start.z as number,
  heading: WORLD.start.heading as number,
  speed: 0,
}

export const cameraRig = {
  position: new Vector3(CAMERA.entryPosition.x, CAMERA.entryPosition.y, CAMERA.entryPosition.z),
  target: new Vector3(0, 1, 0),
}

export const input = {
  keys: { forward: false, back: false, left: false, right: false },
  touch: { throttle: 0, steer: 0 },
}

export function resetInput() {
  input.keys.forward = false
  input.keys.back = false
  input.keys.left = false
  input.keys.right = false
  input.touch.throttle = 0
  input.touch.steer = 0
}

type Snapshot = {
  x: number
  z: number
  heading: number
  camPosition: Vector3
  camTarget: Vector3
}

let snapshot: Snapshot | null = null

export function saveSnapshot() {
  vehicle.speed = 0
  snapshot = {
    x: vehicle.x,
    z: vehicle.z,
    heading: vehicle.heading,
    camPosition: cameraRig.position.clone(),
    camTarget: cameraRig.target.clone(),
  }
}

export function restoreSnapshot() {
  if (!snapshot) return
  vehicle.x = snapshot.x
  vehicle.z = snapshot.z
  vehicle.heading = snapshot.heading
  vehicle.speed = 0
  cameraRig.position.copy(snapshot.camPosition)
  cameraRig.target.copy(snapshot.camTarget)
  snapshot = null
}
