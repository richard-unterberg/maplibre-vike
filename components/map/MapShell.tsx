import { lazy, Suspense } from 'react'
import { ClientOnly } from 'vike-react/ClientOnly'

import MapFallback from '@/components/map/MapFallback'
import type { MapCameraIntent } from '@/components/map/map-types'
import type { Locale } from '@/data/i18n'
import type { LocalizedMapMarker, LocalizedOverviewMapMarker } from '@/data/map-resolver'

const MapLibreMap = lazy(() => import('@/components/map/MapLibreMap'))

interface MapShellProps {
  cameraIntent: MapCameraIntent
  className?: string
  locale: Locale
  markers: LocalizedOverviewMapMarker[]
  selectedMarker: LocalizedMapMarker | null
}

const MapShell = ({ cameraIntent, className = '', locale, markers, selectedMarker }: MapShellProps) => {
  return (
    <section
      className={`absolute isolate left-0 w-full top-0 h-full overflow-hidden bg-base-200 ${className}`}
      aria-label="Interactive map"
    >
      <ClientOnly fallback={<MapFallback />}>
        <Suspense fallback={<MapFallback />}>
          <MapLibreMap cameraIntent={cameraIntent} locale={locale} markers={markers} selectedMarker={selectedMarker} />
        </Suspense>
      </ClientOnly>
    </section>
  )
}

export default MapShell
