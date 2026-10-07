'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { locationsById, PENDING, type CampusLocation } from '@/lib/fisat/locations'
import { actions, useGame } from '@/lib/fisat/store'
import { usePrefersReducedMotion } from '@/hooks/use-media-query'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Pending({ label }: { label?: string }) {
  return (
    <span className="inline-block rounded-md border border-dashed border-fisat-charcoal/25 px-2 py-1 text-sm text-fisat-charcoal/55">
      {label ? `${label}: ` : ''}To be added from official FISAT sources
    </span>
  )
}

function Text({ value }: { value: string }) {
  return value === PENDING ? <Pending /> : <>{value}</>
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-fisat-charcoal/15 py-4">
      <dt className="text-[11px] uppercase tracking-[0.22em] text-fisat-charcoal/55">{label}</dt>
      <dd className="mt-2 text-base leading-relaxed text-fisat-charcoal">
        <Text value={value} />
      </dd>
    </div>
  )
}

function LocationContent({ location, onBack, backLabel }: { location: CampusLocation; onBack: () => void; backLabel: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    scroller.current?.focus({ preventScroll: true })
  }, [])

  useGSAP(
    () => {
      if (reducedMotion) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-hero-image]', { scale: 1.15, duration: 1.6 }, 0)
        .from('[data-hero-line]', { yPercent: 110, duration: 1, stagger: 0.08 }, 0.15)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.06 }, 0.5)

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, scroller: scroller.current, start: 'top 88%' },
        })
      })

      gsap.to('[data-hero-image]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', scroller: scroller.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: scroller, dependencies: [location.id, reducedMotion] },
  )

  return (
    <div
      ref={scroller}
      tabIndex={-1}
      className="absolute inset-0 overflow-y-auto overscroll-contain bg-fisat-paper text-fisat-charcoal outline-none"
    >
      <button
        type="button"
        onClick={onBack}
        className="fixed left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-fisat-charcoal/80 py-2.5 pl-3 pr-5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md transition-colors hover:bg-fisat-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-gold md:left-6 md:top-6"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </button>

      <section data-hero className="relative flex h-[88svh] min-h-[520px] items-end overflow-hidden bg-fisat-charcoal">
        <Image
          data-hero-image
          src={location.heroImage}
          alt={location.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fisat-charcoal via-fisat-charcoal/30 to-transparent" />
        <div className="relative w-full px-5 pb-12 md:px-12 md:pb-16">
          <p data-hero-fade className="text-[11px] uppercase tracking-[0.3em] text-fisat-gold">
            {location.eyebrow}
          </p>
          <h2 id="info-title" className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-8xl">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                {location.name}
              </span>
            </span>
          </h2>
          <p className="mt-5 overflow-hidden font-display text-xl text-white/85 md:text-3xl">
            <span data-hero-line className="block">
              {location.tagline}
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-24">
        <div data-reveal className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <p className="text-pretty font-display text-2xl leading-snug md:text-3xl">
            <Text value={location.description} />
          </p>
          {location.stats.length > 0 && (
            <dl className="grid grid-cols-2 gap-6 self-start">
              {location.stats.map((s) => (
                <div key={s.label} className="border-l-2 border-fisat-gold pl-4">
                  <dt className="order-2 text-xs uppercase tracking-[0.18em] text-fisat-charcoal/60">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold text-fisat-navy md:text-4xl">
                    {s.value === PENDING ? '—' : s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {location.gallery.length > 0 && (
          <div data-reveal className="mt-16 grid grid-cols-2 gap-3 md:mt-24 md:grid-cols-4 md:gap-4">
            {location.gallery.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden rounded-xl bg-fisat-stone ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-x-16">
          {location.sections.map((s) => (
            <section key={s.heading} data-reveal>
              <h3 className="font-display text-2xl font-bold text-fisat-navy">{s.heading}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-fisat-charcoal/80">
                <Text value={s.body} />
              </p>
            </section>
          ))}
        </div>

        {location.facilities.length > 0 && (
          <section data-reveal className="mt-16 md:mt-24">
            <h3 className="font-display text-2xl font-bold text-fisat-navy">Facilities</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {location.facilities.map((f) => (
                <li key={f} className="rounded-full bg-fisat-navy px-4 py-2 text-sm text-white">
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        <dl data-reveal className="mt-16 grid md:mt-24 md:grid-cols-3 md:gap-x-10">
          <Detail label="Timings" value={location.timings} />
          <Detail label="Location" value={location.location} />
          <Detail label="Contact" value={location.contact} />
        </dl>

        <div data-reveal className="mt-16 flex flex-col gap-4 border-t border-fisat-charcoal/15 pt-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            {location.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-fisat-charcoal/20 px-4 py-2 text-sm transition-colors hover:border-fisat-navy hover:bg-fisat-navy hover:text-white"
              >
                {l.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-fisat-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-fisat-charcoal transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fisat-navy"
          >
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function InformationSection() {
  const activeId = useGame((s) => s.activeLocationId)
  const phase = useGame((s) => s.phase)
  const location = activeId ? locationsById[activeId] : null
  if (!location) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-title"
      className="absolute inset-0 z-30 animate-in fade-in duration-500"
    >
      <LocationContent
        key={location.id}
        location={location}
        onBack={() => actions.closeInformation()}
        backLabel={phase === 'FALLBACK' ? 'All destinations' : 'Back to campus'}
      />
    </div>
  )
}
