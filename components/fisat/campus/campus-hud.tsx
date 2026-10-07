'use client'

import { useEffect, useState } from 'react'
import { Map as MapIcon } from 'lucide-react'
import { locationsById } from '@/lib/fisat/locations'
import { actions, useGame } from '@/lib/fisat/store'
import { cn } from '@/lib/utils'

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/25 bg-white/10 px-1.5 font-mono text-[11px] font-medium text-white">
      {children}
    </kbd>
  )
}

export function CampusHud({ touch }: { touch: boolean }) {
  const phase = useGame((s) => s.phase)
  const nearbyId = useGame((s) => s.nearbyLocationId)
  const hasDriven = useGame((s) => s.hasDriven)
  const [hintExpired, setHintExpired] = useState(false)
  const visible = phase === 'CAMPUS'
  const nearby = nearbyId ? locationsById[nearbyId] : null

  useEffect(() => {
    if (phase !== 'CAMPUS') return
    const t = window.setTimeout(() => setHintExpired(true), 6000)
    return () => window.clearTimeout(t)
  }, [phase])

  const showHint = visible && !hasDriven && !hintExpired

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10 text-white transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <header className="flex items-start justify-between p-4 md:p-6">
        <div className="rounded-xl bg-[#16181d]/70 px-4 py-2.5 backdrop-blur-md">
          <p className="font-display text-lg font-bold leading-none tracking-[0.18em]">FISAT</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/60">Campus · Live</p>
        </div>
        <button
          type="button"
          onClick={() => actions.openMap()}
          className="pointer-events-auto flex items-center gap-2 rounded-xl bg-[#16181d]/70 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-md transition-colors hover:bg-[#16181d]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a441]"
          tabIndex={visible ? 0 : -1}
        >
          <MapIcon className="size-4" aria-hidden="true" />
          Map
          {!touch && <Key>M</Key>}
        </button>
      </header>

      {showHint && (
        <div className="absolute inset-x-0 top-1/4 flex justify-center px-6 animate-in fade-in duration-700">
          <div className="rounded-2xl bg-[#16181d]/75 px-7 py-5 text-center backdrop-blur-md">
            <p className="font-display text-2xl font-bold tracking-[0.2em] md:text-3xl">EXPLORE FISAT</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/70">
              {touch ? 'Use the controls to drive · Find glowing rings' : 'WASD / Arrows to drive · E to interact'}
            </p>
          </div>
        </div>
      )}

      <div aria-live="polite" className="absolute inset-x-0 bottom-28 flex justify-center px-4 md:bottom-10">
        {nearby && visible && (
          <button
            type="button"
            onClick={() => actions.openLocation(nearby.id)}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-[#f4f2ee] py-2.5 pl-2.5 pr-6 text-[#16181d] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a441]"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#14213d] font-mono text-sm font-semibold text-white">
              {touch ? '→' : 'E'}
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">{nearby.prompt}</span>
          </button>
        )}
      </div>

      {!touch && (
        <div className="absolute bottom-6 left-6 hidden rounded-xl bg-[#16181d]/70 p-4 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md md:block">
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <Key>W</Key>
              <Key>S</Key>
              <span>Drive / Reverse</span>
            </li>
            <li className="flex items-center gap-2">
              <Key>A</Key>
              <Key>D</Key>
              <span>Steer</span>
            </li>
            <li className="flex items-center gap-2">
              <Key>E</Key>
              <span>Interact</span>
            </li>
            <li className="flex items-center gap-2">
              <Key>M</Key>
              <span>Map</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
