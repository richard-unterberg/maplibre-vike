import { clientOnly } from 'vike-react/clientOnly'

import MapFallback from '@/components/map/MapFallback'
import type { MapCameraIntent } from '@/components/map/map-types'
import type { MapCategory, MapMarker } from '@/data/constants'

const MapLibreMap = clientOnly(() => import('@/components/map/MapLibreMap'))

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
      <MapLibreMap
        cameraIntent={cameraIntent}
        categories={categories}
        fallback={<MapFallback />}
        markers={markers}
        selectedMarker={selectedMarker}
      />
    </section>
  )
}

export default MapShell
