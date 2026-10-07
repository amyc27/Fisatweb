import { boxColliders, circleColliders } from './campus-layout'
import { VEHICLE, WORLD } from './constants'
import { input, vehicle } from './runtime'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function readControls() {
  const { keys, touch } = input
  const throttle = clamp((keys.forward ? 1 : 0) - (keys.back ? 1 : 0) + touch.throttle, -1, 1)
  const turn = clamp((keys.left ? 1 : 0) - (keys.right ? 1 : 0) + touch.steer, -1, 1)
  return { throttle, turn }
}

/** Arcade-style vehicle integration. Returns true when a collision occurred. */
export function stepVehicle(dt: number, throttle: number, turn: number) {
  let { speed } = vehicle

  if (throttle > 0) {
    speed += (speed < 0 ? VEHICLE.brake : VEHICLE.acceleration) * throttle * dt
  } else if (throttle < 0) {
    speed += (speed > 0.5 ? -VEHICLE.brake : -VEHICLE.reverseAcceleration) * -throttle * dt
  } else {
    const drop = Math.min(Math.abs(speed), VEHICLE.coast * dt)
    speed -= Math.sign(speed) * drop
  }
  speed = clamp(speed, -VEHICLE.maxReverse, VEHICLE.maxSpeed)

  const grip = clamp(Math.abs(speed) / 5, 0, 1) * Math.sign(speed)
  const highSpeedDamp = 1 - (Math.abs(speed) / VEHICLE.maxSpeed) * 0.35
  vehicle.heading += turn * VEHICLE.steerRate * grip * highSpeedDamp * dt

  let x = vehicle.x + Math.sin(vehicle.heading) * speed * dt
  let z = vehicle.z + Math.cos(vehicle.heading) * speed * dt

  const r = WORLD.vehicleRadius
  let hit = false

  for (const b of boxColliders) {
    const dx = x - b.x
    const dz = z - b.z
    if (Math.abs(dx) > b.hw + r || Math.abs(dz) > b.hd + r) continue
    const cx = clamp(dx, -b.hw, b.hw)
    const cz = clamp(dz, -b.hd, b.hd)
    const ox = dx - cx
    const oz = dz - cz
    const d2 = ox * ox + oz * oz
    if (d2 >= r * r) continue
    hit = true
    if (d2 > 1e-6) {
      const d = Math.sqrt(d2)
      x += (ox / d) * (r - d)
      z += (oz / d) * (r - d)
    } else {
      const px = b.hw + r - Math.abs(dx)
      const pz = b.hd + r - Math.abs(dz)
      if (px < pz) x += Math.sign(dx || 1) * px
      else z += Math.sign(dz || 1) * pz
    }
  }

  for (const c of circleColliders) {
    const dx = x - c.x
    const dz = z - c.z
    const min = r + c.r
    const d2 = dx * dx + dz * dz
    if (d2 >= min * min || d2 < 1e-6) continue
    hit = true
    const d = Math.sqrt(d2)
    x += (dx / d) * (min - d)
    z += (dz / d) * (min - d)
  }

  const bound = WORLD.boundary
  if (Math.abs(x) > bound || Math.abs(z) > bound) hit = true
  x = clamp(x, -bound, bound)
  z = clamp(z, -bound, bound)

  if (hit) speed *= 0.55

  vehicle.x = x
  vehicle.z = z
  vehicle.speed = speed
  return hit
}
