import { ClientOnly } from 'vike-react/ClientOnly'

import MapFallback from '@/components/map/MapFallback'
import MapLibreMap from '@/components/map/MapLibreMap'
import type { MapCameraIntent } from '@/components/map/map-types'
import type { MapCategory, MapMarker } from '@/data/constants'

interface MapShellProps {
  cameraIntent: MapCameraIntent
  categories: MapCategory[]
  className?: string
  markers: MapMarker[]
  selectedMarker: MapMarker | null
}

const MapShell = ({ cameraIntent, categories, className = '', markers, selectedMarker }: MapShellProps) => {
  return (
    <section
      className={`absolute isolate left-0 w-full top-0 h-full overflow-hidden bg-base-200 ${className}`}
      aria-label="Interactive map"
    >
      <ClientOnly fallback={<MapFallback />}>
        <MapLibreMap
          cameraIntent={cameraIntent}
          categories={categories}
          markers={markers}
          selectedMarker={selectedMarker}
        />
      </ClientOnly>
    </section>
  )
}

export default MapShell
