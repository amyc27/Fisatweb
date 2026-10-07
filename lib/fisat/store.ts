'use client'

import { useSyncExternalStore } from 'react'
import { resetInput, restoreSnapshot, saveSnapshot } from './runtime'

export type Phase = 'INTRO' | 'LOADING' | 'CAMPUS' | 'MAP' | 'INFORMATION' | 'FALLBACK'

type GameState = {
  phase: Phase
  activeLocationId: string | null
  nearbyLocationId: string | null
  sceneReady: boolean
  hasDriven: boolean
}

const initialState: GameState = {
  phase: 'INTRO',
  activeLocationId: null,
  nearbyLocationId: null,
  sceneReady: false,
  hasDriven: false,
}

let state = initialState
const listeners = new Set<() => void>()

export function getGameState() {
  return state
}

function setState(partial: Partial<GameState>) {
  state = { ...state, ...partial }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  )
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export const actions = {
  enterCampus() {
    if (state.phase !== 'INTRO') return
    setState({ phase: isWebGLAvailable() ? 'LOADING' : 'FALLBACK' })
  },
  fallback() {
    setState({ phase: 'FALLBACK', activeLocationId: null })
  },
  setSceneReady() {
    if (!state.sceneReady) setState({ sceneReady: true })
  },
  finishLoading() {
    if (state.phase === 'LOADING') setState({ phase: 'CAMPUS' })
  },
  setNearby(id: string | null) {
    if (state.nearbyLocationId !== id) setState({ nearbyLocationId: id })
  },
  markDriven() {
    if (!state.hasDriven) setState({ hasDriven: true })
  },
  openLocation(id: string) {
    if (state.phase === 'FALLBACK') {
      setState({ activeLocationId: id })
      return
    }
    if (state.phase !== 'CAMPUS' && state.phase !== 'MAP') return
    resetInput()
    if (state.phase === 'CAMPUS') saveSnapshot()
    setState({ phase: 'INFORMATION', activeLocationId: id })
  },
  closeInformation() {
    if (state.phase === 'FALLBACK') {
      setState({ activeLocationId: null })
      return
    }
    if (state.phase !== 'INFORMATION') return
    restoreSnapshot()
    resetInput()
    setState({ phase: 'CAMPUS', activeLocationId: null })
  },
  openMap() {
    if (state.phase !== 'CAMPUS') return
    resetInput()
    saveSnapshot()
    setState({ phase: 'MAP' })
  },
  closeMap() {
    if (state.phase !== 'MAP') return
    restoreSnapshot()
    resetInput()
    setState({ phase: 'CAMPUS' })
  },
}
