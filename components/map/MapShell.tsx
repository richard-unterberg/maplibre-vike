import { lazy, Suspense } from 'react'
import { ClientOnly } from 'vike-react/ClientOnly'

import MapFallback from '@/components/map/MapFallback'
import type { MapViewProps } from '@/components/map/map-types'

const MapLibreMap = lazy(() => import('@/components/map/MapLibreMap'))

const mapSizeClass = {
  overview: 'h-[calc(100dvh-4rem)] w-full',
  detail: 'h-[40dvh] min-h-[280px] w-full',
  embedded: 'h-[360px] w-full rounded-box',
} as const

interface MapShellProps extends MapViewProps {
  className?: string
}

const MapShell = ({ className = '', variant = 'overview', ...mapProps }: MapShellProps) => {
  return (
    <section
      className={`absolute isolate left-0 w-full top-16 h-[calc(100svh-16*var(--spacing))] overflow-hidden bg-base-200 ${mapSizeClass[variant]} ${className}`}
      aria-label="Interactive map"
    >
      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <MapLibreMap variant={variant} {...mapProps} />
        </Suspense>
      </ClientOnly>
    </section>
  )
}

export default MapShell
