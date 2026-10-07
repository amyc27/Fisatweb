'use client'

import { useEffect } from 'react'
import { actions, getGameState } from '@/lib/fisat/store'
import { input } from '@/lib/fisat/runtime'

const MOVEMENT: Record<string, keyof typeof input.keys> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function useGameKeyboard() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const { phase, nearbyLocationId } = getGameState()

      if (phase === 'CAMPUS') {
        const move = MOVEMENT[e.code]
        if (move) {
          e.preventDefault()
          input.keys[move] = true
          actions.markDriven()
          return
        }
        if (e.code === 'KeyE' && nearbyLocationId && !e.repeat) {
          e.preventDefault()
          actions.openLocation(nearbyLocationId)
        } else if (e.code === 'KeyM' && !e.repeat) {
          e.preventDefault()
          actions.openMap()
        }
        return
      }

      if (phase === 'MAP' && (e.code === 'KeyM' || e.code === 'Escape') && !e.repeat) {
        e.preventDefault()
        actions.closeMap()
      } else if (e.code === 'Escape' && getGameState().activeLocationId) {
        e.preventDefault()
        actions.closeInformation()
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const move = MOVEMENT[e.code]
      if (move) input.keys[move] = false
    }

    const onBlur = () => {
      input.keys.forward = input.keys.back = input.keys.left = input.keys.right = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])
}
