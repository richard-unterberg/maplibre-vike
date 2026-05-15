import type { Coordinates, MapBounds } from '@/components/map/map-types'
import type { GroupedMapMarkers } from '@/data/map-resolver'
import type { MapCategory, MapMarker } from '@/data/constants'

type MapPageView =
  | {
      bounds: MapBounds
      mode: 'overview'
    }
  | {
      center: Coordinates
      mode: 'detail'
      zoom: number
    }

export interface MapPageData {
  categories: MapCategory[]
  groupedMarkers: GroupedMapMarkers[]
  mapView: MapPageView
  markerBounds: MapBounds
  markers: MapMarker[]
  selectedMarker: MapMarker | null
}
