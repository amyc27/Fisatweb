'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { locations } from '@/lib/fisat/locations'
import { actions, useGame } from '@/lib/fisat/store'

export function FallbackDestinations() {
  const phase = useGame((s) => s.phase)
  if (phase !== 'FALLBACK') return null

  return (
    <section aria-labelledby="fallback-title" className="absolute inset-0 z-20 overflow-y-auto bg-fisat-charcoal text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-12 md:py-20">
        <p className="font-display text-lg font-bold tracking-[0.25em]">FISAT</p>
        <h1 id="fallback-title" className="mt-10 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
          Explore the campus.
        </h1>
        <p className="mt-4 max-w-lg text-white/65">
          The interactive 3D campus isn&apos;t available on this device, so here are all the destinations to browse.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => actions.openLocation(l.id)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-gold"
              >
                <Image
                  src={l.heroImage}
                  alt={l.heroAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-fisat-charcoal via-fisat-charcoal/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.25em] text-fisat-gold">{l.eyebrow}</span>
                    <span className="mt-2 block font-display text-2xl font-bold">{l.name}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
