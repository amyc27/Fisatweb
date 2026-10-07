'use client'

import { useRef } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { ASSETS } from '@/lib/fisat/constants'
import { actions, useGame } from '@/lib/fisat/store'
import { usePrefersReducedMotion } from '@/hooks/use-media-query'

gsap.registerPlugin(useGSAP)

async function videoExists(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok && (res.headers.get('content-type') ?? '').startsWith('video')
  } catch {
    return false
  }
}

export function IntroScreen() {
  const phase = useGame((s) => s.phase)
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const { data: hasVideo } = useSWR(ASSETS.introVideo, videoExists, { revalidateOnFocus: false })

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-intro-media]', { scale: 1.12, duration: 2.4 }, 0)
        .from('[data-intro-line]', { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.3)
        .from('[data-intro-fade]', { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.9)
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  if (phase !== 'INTRO') return null

  return (
    <section ref={root} aria-labelledby="intro-title" className="absolute inset-0 z-40 overflow-hidden bg-fisat-charcoal text-white">
      <div data-intro-media className="absolute inset-0">
        {hasVideo && !reducedMotion ? (
          <video
            className="size-full object-cover"
            src={ASSETS.introVideo}
            poster={ASSETS.introPoster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <Image src={ASSETS.introPoster} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-fisat-charcoal via-fisat-charcoal/40 to-fisat-charcoal/20" />

      <div className="relative flex h-full flex-col justify-between p-5 pb-[max(2rem,env(safe-area-inset-bottom))] md:p-12">
        <header data-intro-fade className="flex items-center justify-between">
          <p className="font-display text-lg font-bold tracking-[0.25em]">FISAT</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">Angamaly · Kerala</p>
        </header>

        <div>
          <p data-intro-fade className="text-[11px] uppercase tracking-[0.3em] text-fisat-gold">
            Federal Institute of Science And Technology
          </p>
          <h1 id="intro-title" className="mt-5 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-[9rem]">
            <span className="block overflow-hidden">
              <span data-intro-line className="block">
                Explore
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-intro-line className="block">
                FISAT.
              </span>
            </span>
          </h1>
          <p data-intro-fade className="mt-6 max-w-md text-pretty leading-relaxed text-white/75 md:text-lg">
            More than a campus. Take the wheel and drive through a stylised 3D campus to discover where you&apos;ll learn,
            live and play.
          </p>
          <div data-intro-fade className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => actions.enterCampus()}
              className="group flex items-center gap-3 rounded-full bg-fisat-paper py-4 pl-7 pr-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-fisat-charcoal transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-gold focus-visible:ring-offset-2 focus-visible:ring-offset-fisat-charcoal"
            >
              Enter Campus
              <span className="flex size-8 items-center justify-center rounded-full bg-fisat-navy text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => actions.fallback()}
              className="text-xs uppercase tracking-[0.2em] text-white/60 underline-offset-4 hover:text-white hover:underline"
            >
              Browse without 3D
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
