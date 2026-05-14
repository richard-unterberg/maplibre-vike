import { lazy, Suspense } from 'react'
import { ClientOnly } from 'vike-react/ClientOnly'

import MapFallback from '@/components/map/MapFallback'
import type { MapViewProps } from '@/components/map/map-types'

const MapLibreMap = lazy(() => import('@/components/map/MapLibreMap'))

interface MapShellProps extends MapViewProps {
  className?: string
}

const MapShell = ({ className = '', ...mapProps }: MapShellProps) => {
  return (
    <section
      className={`absolute isolate left-0 w-full top-0 h-full overflow-hidden bg-base-200 ${className}`}
      aria-label="Interactive map"
    >
      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <MapLibreMap {...mapProps} />
        </Suspense>
      </ClientOnly>
    </section>
  )
}

export default MapShell
