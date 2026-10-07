'use client'

import { useEffect, useState } from 'react'
import { LOADING_MIN_MS } from '@/lib/fisat/constants'
import { actions, useGame } from '@/lib/fisat/store'
import { cn } from '@/lib/utils'

export function LoadingScreen() {
  const phase = useGame((s) => s.phase)
  const sceneReady = useGame((s) => s.sceneReady)
  const [minElapsed, setMinElapsed] = useState(false)
  const [mounted, setMounted] = useState(true)
  const loading = phase === 'LOADING'

  useEffect(() => {
    const t = window.setTimeout(() => setMinElapsed(true), LOADING_MIN_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (sceneReady && minElapsed) actions.finishLoading()
  }, [sceneReady, minElapsed])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      onTransitionEnd={() => !loading && setMounted(false)}
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#16181d] text-white transition-opacity duration-1000',
        loading ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <p className="font-display text-3xl font-bold tracking-[0.35em] md:text-5xl">ENTERING FISAT</p>
      <div className="mt-8 h-px w-56 overflow-hidden bg-white/15 md:w-72">
        <div
          className="h-full bg-[#d9a441] transition-[width] ease-out"
          style={{
            width: sceneReady && minElapsed ? '100%' : sceneReady ? '85%' : '55%',
            transitionDuration: `${LOADING_MIN_MS}ms`,
          }}
        />
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/50">
        {sceneReady ? 'Campus ready' : 'Building the campus'}
      </p>
    </div>
  )
}
