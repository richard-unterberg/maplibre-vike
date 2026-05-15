import { lazy, Suspense } from 'react'
import { ClientOnly } from 'vike-react/ClientOnly'

import MapFallback from '@/components/map/MapFallback'

const MapLibreMap = lazy(() => import('@/components/map/MapLibreMap'))

interface MapShellProps {
  className?: string
}

const MapShell = ({ className = '' }: MapShellProps) => {
  return (
    <section
      className={`absolute isolate left-0 w-full top-0 h-full overflow-hidden bg-base-200 ${className}`}
      aria-label="Interactive map"
    >
      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <MapLibreMap />
        </Suspense>
      </ClientOnly>
    </section>
  )
}

export default MapShell
