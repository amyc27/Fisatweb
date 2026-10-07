'use client'

import { useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { input } from '@/lib/fisat/runtime'
import { actions, useGame } from '@/lib/fisat/store'
import { cn } from '@/lib/utils'

function SteeringPad() {
  const pad = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)

  const update = (clientX: number) => {
    const el = pad.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const half = rect.width / 2
    const dx = Math.max(-1, Math.min(1, (clientX - (rect.left + half)) / (half * 0.8)))
    input.touch.steer = -dx
    if (knob.current) knob.current.style.transform = `translateX(${dx * half * 0.55}px)`
    actions.markDriven()
  }

  const release = () => {
    input.touch.steer = 0
    if (knob.current) knob.current.style.transform = 'translateX(0px)'
  }

  return (
    <div
      ref={pad}
      role="slider"
      aria-label="Steering"
      aria-valuemin={-1}
      aria-valuemax={1}
      aria-valuenow={0}
      className="pointer-events-auto relative flex h-24 w-44 touch-none select-none items-center justify-center rounded-full border border-white/20 bg-[#16181d]/60 backdrop-blur-md"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) update(e.clientX)
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span className="absolute left-4 text-xs text-white/50" aria-hidden="true">
        L
      </span>
      <span className="absolute right-4 text-xs text-white/50" aria-hidden="true">
        R
      </span>
      <div ref={knob} className="size-14 rounded-full bg-[#f4f2ee] shadow-lg transition-transform duration-75" />
    </div>
  )
}

function PedalButton({ value, label, children }: { value: number; label: string; children: React.ReactNode }) {
  const release = () => {
    input.touch.throttle = 0
  }
  return (
    <button
      type="button"
      aria-label={label}
      className="pointer-events-auto flex size-16 touch-none select-none items-center justify-center rounded-full border border-white/20 bg-[#16181d]/60 text-white backdrop-blur-md active:bg-[#d9a441] active:text-[#16181d]"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        input.touch.throttle = value
        actions.markDriven()
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  )
}

export function TouchControls() {
  const phase = useGame((s) => s.phase)
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-opacity',
        phase === 'CAMPUS' ? 'opacity-100' : 'invisible opacity-0',
      )}
    >
      <SteeringPad />
      <div className="flex flex-col gap-3">
        <PedalButton value={1} label="Accelerate">
          <ChevronUp className="size-7" aria-hidden="true" />
        </PedalButton>
        <PedalButton value={-1} label="Brake and reverse">
          <ChevronDown className="size-7" aria-hidden="true" />
        </PedalButton>
      </div>
    </div>
  )
}
