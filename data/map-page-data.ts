import type { Coordinates, MapBounds } from '@/components/map/map-types'
import type {
  LocalizedGroupedOverviewMapMarkers,
  LocalizedMapCategory,
  LocalizedMapMarker,
  LocalizedOverviewMapMarker,
} from '@/data/map-resolver'

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
  groupedMarkers: LocalizedGroupedOverviewMapMarkers[]
  mapView: MapPageView
  markerBounds: MapBounds
  markers: LocalizedOverviewMapMarker[]
  selectedMarker: LocalizedMapMarker | null
  selectedMarkerCategories: LocalizedMapCategory[]
}
