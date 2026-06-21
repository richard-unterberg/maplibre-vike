import type { Coordinates, MapBounds } from '@/components/map/map-types'
import type { LocalizedGroupedMapMarkers, LocalizedMapCategory, LocalizedMapMarker } from '@/data/map-resolver'

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
  categories: LocalizedMapCategory[]
  groupedMarkers: LocalizedGroupedMapMarkers[]
  mapView: MapPageView
  markerBounds: MapBounds
  markers: LocalizedMapMarker[]
  selectedMarker: LocalizedMapMarker | null
}
