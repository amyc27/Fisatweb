/**
 * World layout for the stylised prototype campus. Units are metres, -z is
 * "north" (top of the map). Rendering, collisions, interaction zones and the
 * map are all derived from this file, so replacing the prototype with an
 * accurate GLB only requires updating these coordinates to match the model.
 */

export type Rect = { x: number; z: number; w: number; d: number }

export type BuildingKind = 'main' | 'block' | 'hostel' | 'pavilion' | 'busbay' | 'decor'

export type BuildingDef = Rect & {
  id: string
  label: string
  kind: BuildingKind
  height: number
  color: string
  locationId?: string
}

export type ZoneDef = { locationId: string; x: number; z: number; radius: number }

export const roads: Rect[] = [
  { x: 0, z: 12, w: 8, d: 78 },
  { x: 0, z: -8, w: 99, d: 7 },
  { x: 0, z: 34, w: 99, d: 7 },
  { x: -46, z: 13, w: 7, d: 49 },
  { x: 46, z: 13, w: 7, d: 49 },
]

export const plaza = { x: 0, z: -18, radius: 8 }

export const sportsField: Rect = { x: 24, z: 16, w: 20, d: 28 }

export const buildings: BuildingDef[] = [
  { id: 'main', label: 'Main College Building', kind: 'main', x: 0, z: -36, w: 34, d: 14, height: 12, color: '#efe8da', locationId: 'main-college' },
  { id: 'academic', label: 'Academic Block', kind: 'block', x: -26, z: -24, w: 18, d: 12, height: 9, color: '#e6ddcc', locationId: 'academic-block' },
  { id: 'library', label: 'Library', kind: 'block', x: 26, z: -24, w: 16, d: 12, height: 10, color: '#dcd3c1', locationId: 'library' },
  { id: 'hostel-a', label: 'Hostel', kind: 'hostel', x: -34, z: 6, w: 12, d: 10, height: 10, color: '#e9dfcf', locationId: 'hostel' },
  { id: 'hostel-b', label: 'Hostel', kind: 'hostel', x: -34, z: 22, w: 12, d: 10, height: 10, color: '#e9dfcf' },
  { id: 'canteen', label: 'Canteen', kind: 'pavilion', x: -12, z: 18, w: 9, d: 9, height: 4, color: '#f1ebe0', locationId: 'canteen' },
  { id: 'sports', label: 'Sports Centre', kind: 'block', x: 39, z: 16, w: 6, d: 14, height: 6, color: '#d8d0c0', locationId: 'sports-centre' },
  { id: 'busbay', label: 'Bus Bay', kind: 'busbay', x: -22, z: 44, w: 22, d: 8, height: 4, color: '#c9c2b4', locationId: 'transport' },
  { id: 'workshop', label: 'Workshops', kind: 'decor', x: -40, z: -32, w: 10, d: 12, height: 7, color: '#ddd5c6' },
  { id: 'auditorium', label: 'Auditorium', kind: 'decor', x: 40, z: -32, w: 12, d: 12, height: 8, color: '#e3dac9' },
  { id: 'admin-annex', label: 'Annex', kind: 'decor', x: 22, z: 46, w: 12, d: 7, height: 6, color: '#e2d9c8' },
]

export const zones: ZoneDef[] = [
  { locationId: 'main-college', x: 0, z: -24, radius: 6.5 },
  { locationId: 'academic-block', x: -26, z: -14.5, radius: 5.5 },
  { locationId: 'library', x: 26, z: -14.5, radius: 5.5 },
  { locationId: 'hostel', x: -24, z: 14, radius: 5.5 },
  { locationId: 'canteen', x: -12, z: 9, radius: 5 },
  { locationId: 'sports-centre', x: 9, z: 16, radius: 5.5 },
  { locationId: 'transport', x: -22, z: 38.5, radius: 5.5 },
]

export const gatePillars = [
  { x: -6, z: 50, r: 0.9 },
  { x: 6, z: 50, r: 0.9 },
]

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function insideRect(x: number, z: number, r: Rect, pad: number) {
  return Math.abs(x - r.x) < r.w / 2 + pad && Math.abs(z - r.z) < r.d / 2 + pad
}

export type TreeDef = { x: number; z: number; scale: number; palm: boolean; rotation: number }

function generateTrees(): TreeDef[] {
  const rand = mulberry32(2002)
  const trees: TreeDef[] = []
  const step = 6.5
  for (let gx = -58; gx <= 58; gx += step) {
    for (let gz = -58; gz <= 58; gz += step) {
      const x = gx + (rand() - 0.5) * 4
      const z = gz + (rand() - 0.5) * 4
      if (rand() > 0.62) continue
      if (roads.some((r) => insideRect(x, z, r, 2.2))) continue
      if (buildings.some((b) => insideRect(x, z, b, 3))) continue
      if (insideRect(x, z, sportsField, 2.5)) continue
      if (zones.some((zn) => Math.hypot(x - zn.x, z - zn.z) < zn.radius + 2.5)) continue
      if (Math.hypot(x - plaza.x, z - plaza.z) < plaza.radius + 2) continue
      if (Math.abs(x) < 9 && z > 44) continue
      trees.push({ x, z, scale: 0.8 + rand() * 0.6, palm: rand() > 0.45, rotation: rand() * Math.PI * 2 })
    }
  }
  return trees
}

export const trees = generateTrees()

export const lamps: { x: number; z: number }[] = [
  ...[-2, 6, 14, 22, 42].flatMap((z) => [
    { x: -5.2, z },
    { x: 5.2, z },
  ]),
  ...[-40, -30, -18, 18, 30, 40].map((x) => ({ x, z: -12.2 })),
  ...[-40, -30, -14, 14, 30, 40].map((x) => ({ x, z: 38.2 })),
]

export const benches: { x: number; z: number; rotation: number }[] = [
  { x: -9.5, z: -18, rotation: Math.PI / 2 },
  { x: 9.5, z: -18, rotation: -Math.PI / 2 },
  { x: -6, z: -10.5, rotation: 0 },
  { x: 6, z: -10.5, rotation: 0 },
  { x: -18, z: 22, rotation: Math.PI / 2 },
  { x: -18, z: 15, rotation: Math.PI / 2 },
  { x: 13, z: 4, rotation: 0 },
  { x: 13, z: 28, rotation: Math.PI },
]

export const people: { x: number; z: number; color: string }[] = (() => {
  const rand = mulberry32(683577)
  const clusters = [
    { x: 0, z: -18, n: 6, spread: 6 },
    { x: -12, z: 11, n: 5, spread: 3 },
    { x: 24, z: 16, n: 8, spread: 8 },
    { x: 26, z: -16.5, n: 3, spread: 3 },
    { x: -26, z: -16.5, n: 3, spread: 3 },
    { x: -22, z: 39, n: 4, spread: 4 },
  ]
  const colors = ['#14213d', '#f4f2ee', '#d9a441', '#6b7a8f', '#9c4f3a', '#2f4858']
  return clusters.flatMap((c) =>
    Array.from({ length: c.n }, () => ({
      x: c.x + (rand() - 0.5) * c.spread * 2,
      z: c.z + (rand() - 0.5) * c.spread,
      color: colors[Math.floor(rand() * colors.length)],
    })),
  )
})()

export type BoxCollider = { x: number; z: number; hw: number; hd: number; height: number }
export type CircleCollider = { x: number; z: number; r: number }

const mainBuilding = buildings[0]

export const boxColliders: BoxCollider[] = [
  ...buildings.map((b) => ({
    x: b.x,
    z: b.z,
    hw: b.w / 2,
    hd: b.d / 2,
    height: b.height,
  })),
  { x: mainBuilding.x, z: mainBuilding.z + mainBuilding.d / 2 + 1.9, hw: 8, hd: 1.9, height: 5.5 },
]

export const circleColliders: CircleCollider[] = [
  ...trees.map((t) => ({ x: t.x, z: t.z, r: 0.45 * t.scale })),
  ...gatePillars,
  ...lamps.map((l) => ({ x: l.x, z: l.z, r: 0.15 })),
  { x: plaza.x, z: plaza.z, r: 2.2 },
]
