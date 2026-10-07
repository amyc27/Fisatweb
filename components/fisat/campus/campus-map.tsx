'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { buildings, plaza, roads, sportsField, zones } from '@/lib/fisat/campus-layout'
import { WORLD } from '@/lib/fisat/constants'
import { locationsById } from '@/lib/fisat/locations'
import { vehicle } from '@/lib/fisat/runtime'
import { actions, useGame } from '@/lib/fisat/store'

const S = WORLD.halfSize

export function CampusMap() {
  const phase = useGame((s) => s.phase)
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = phase === 'MAP'

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  if (!open) return null

  const heading = (vehicle.heading * 180) / Math.PI

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-title"
      className="absolute inset-0 z-30 flex flex-col bg-fisat-charcoal/85 text-white backdrop-blur-md animate-in fade-in duration-300 md:flex-row"
    >
      <div className="flex items-center justify-between p-5 md:absolute md:inset-x-0 md:top-0 md:p-6">
        <h2 id="map-title" className="font-display text-xl font-bold tracking-[0.2em]">
          CAMPUS MAP
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={() => actions.closeMap()}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-gold"
        >
          <X className="size-4" aria-hidden="true" />
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-4 md:p-20">
        <svg viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`} className="h-full max-h-[78svh] w-full" role="img" aria-label="Top-down map of the campus">
          <rect x={-S} y={-S} width={S * 2} height={S * 2} rx={4} fill="#5f8a4a" opacity={0.55} />
          {roads.map((r, i) => (
            <rect key={i} x={r.x - r.w / 2} y={r.z - r.d / 2} width={r.w} height={r.d} fill="#3b3f47" />
          ))}
          <circle cx={plaza.x} cy={plaza.z} r={plaza.radius} fill="#cfc6b4" />
          <rect
            x={sportsField.x - sportsField.w / 2}
            y={sportsField.z - sportsField.d / 2}
            width={sportsField.w}
            height={sportsField.d}
            fill="#6fa55a"
            stroke="#f4f2ee"
            strokeWidth={0.3}
          />
          {buildings.map((b) => (
            <rect
              key={b.id}
              x={b.x - b.w / 2}
              y={b.z - b.d / 2}
              width={b.w}
              height={b.d}
              rx={0.6}
              fill={b.locationId ? '#f4f2ee' : '#a9a397'}
            />
          ))}
          {zones.map((z) => (
            <g
              key={z.locationId}
              role="button"
              tabIndex={0}
              aria-label={`Open ${locationsById[z.locationId].name}`}
              className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-white"
              onClick={() => actions.openLocation(z.locationId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  actions.openLocation(z.locationId)
                }
              }}
            >
              <circle cx={z.x} cy={z.z} r={2.8} fill="#d9a441" stroke="#16181d" strokeWidth={0.6} />
              <text
                x={z.x}
                y={z.z - 4.2}
                textAnchor="middle"
                fontSize={3}
                fontWeight={700}
                fill="#ffffff"
                stroke="#16181d"
                strokeWidth={0.8}
                paintOrder="stroke"
                className="font-display"
              >
                {locationsById[z.locationId].shortName}
              </text>
            </g>
          ))}
          <g transform={`translate(${vehicle.x} ${vehicle.z}) rotate(${-heading + 180})`} aria-label="Your position">
            <circle r={3.4} fill="#14213d" stroke="#ffffff" strokeWidth={0.6} />
            <path d="M0 -2.2 L1.6 1.6 L0 0.7 L-1.6 1.6 Z" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <nav aria-label="Destinations" className="border-t border-white/10 p-5 md:w-72 md:self-center md:border-l md:border-t-0 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">Destinations</p>
        <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-1">
          {zones.map((z) => (
            <li key={z.locationId}>
              <button
                type="button"
                onClick={() => actions.openLocation(z.locationId)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-gold"
              >
                {locationsById[z.locationId].name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
