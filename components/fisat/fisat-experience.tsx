'use client'

import dynamic from 'next/dynamic'
import { useGameKeyboard } from '@/hooks/use-game-keyboard'
import { useIsCoarsePointer, usePrefersReducedMotion } from '@/hooks/use-media-query'
import { useGame } from '@/lib/fisat/store'
import { CampusHud } from './campus/campus-hud'
import { CampusMap } from './campus/campus-map'
import { LoadingScreen } from './campus/loading-screen'
import { TouchControls } from './campus/touch-controls'
import { FallbackDestinations } from './fallback-destinations'
import { InformationSection } from './info/information-section'
import { IntroScreen } from './intro/intro-screen'

const CampusScene = dynamic(() => import('./campus/campus-scene').then((m) => m.CampusScene), { ssr: false })

export function FisatExperience() {
  const phase = useGame((s) => s.phase)
  const coarse = useIsCoarsePointer()
  const reducedMotion = usePrefersReducedMotion()
  useGameKeyboard()

  const campusMounted = phase !== 'INTRO' && phase !== 'FALLBACK'
  const campusHidden = phase === 'INFORMATION' || phase === 'MAP'

  return (
    <main className="relative h-svh w-full overflow-hidden bg-fisat-charcoal">
      {campusMounted && (
        <div className="absolute inset-0" aria-hidden={campusHidden} inert={campusHidden}>
          <CampusScene lowPower={coarse} reducedMotion={reducedMotion} />
          <CampusHud touch={coarse} />
          {coarse && <TouchControls />}
          <LoadingScreen />
        </div>
      )}
      <CampusMap />
      <InformationSection />
      <FallbackDestinations />
      <IntroScreen />
    </main>
  )
}
