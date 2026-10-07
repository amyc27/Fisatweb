'use client'

import { Component, Suspense, type ReactNode } from 'react'
import useSWR from 'swr'
import { useGLTF } from '@react-three/drei'
import { ASSETS } from '@/lib/fisat/constants'
import { CampusBuildings } from './campus-buildings'

async function assetExists(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    const type = res.headers.get('content-type') ?? ''
    return res.ok && !type.includes('text/html')
  } catch {
    return false
  }
}

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function GLBCampus({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

/**
 * Uses an accurate campus GLB when one is placed at ASSETS.campusModel,
 * otherwise renders the procedural prototype campus.
 */
export function CampusModel() {
  const { data: hasModel } = useSWR(ASSETS.campusModel, assetExists, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  const procedural = <CampusBuildings />
  if (!hasModel) return procedural
  return (
    <ModelBoundary fallback={procedural}>
      <Suspense fallback={procedural}>
        <GLBCampus url={ASSETS.campusModel} />
      </Suspense>
    </ModelBoundary>
  )
}
