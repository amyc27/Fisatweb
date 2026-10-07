export const ASSETS = {
  introVideo: '/assets/intro/fisat-drone.mp4',
  introPoster: '/assets/intro/fisat-drone-poster.png',
  logo: '/assets/branding/fisat-logo.svg',
  logoWhite: '/assets/branding/fisat-logo-white.svg',
  campusModel: '/assets/campus/campus-model.glb',
} as const

export const WORLD = {
  halfSize: 62,
  boundary: 58,
  vehicleRadius: 1.35,
  start: { x: 0, z: 30, heading: Math.PI },
} as const

export const VEHICLE = {
  maxSpeed: 17,
  maxReverse: 6,
  acceleration: 13,
  brake: 30,
  reverseAcceleration: 9,
  coast: 6,
  steerRate: 2.3,
  wheelRadius: 0.38,
} as const

export const CAMERA = {
  distance: 9.5,
  height: 5.2,
  lookAhead: 4,
  positionDamping: 3.4,
  targetDamping: 6,
  reducedMotionDamping: 10,
  entryPosition: { x: 0, y: 42, z: 72 },
} as const

export const PALETTE = {
  charcoal: '#16181d',
  navy: '#14213d',
  offWhite: '#f4f2ee',
  stone: '#d9d4ca',
  accent: '#d9a441',
  grass: '#7fa461',
  grassDark: '#5f8a4a',
  road: '#3b3f47',
  path: '#cfc6b4',
  roof: '#b5523b',
} as const

export const LOADING_MIN_MS = 1400
