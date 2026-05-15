import type { MapPageData } from '@/data/map-page-data'
import { getAllCategories, getAllMarkers, getGroupedMarkers, getMarkerBounds } from '@/data/map-resolver'

export const data = (): MapPageData => {
  const markers = getAllMarkers()

  return {
    categories: getAllCategories(),
    groupedMarkers: getGroupedMarkers(),
    mapView: {
      bounds: getMarkerBounds(markers),
      mode: 'overview',
    },
    markerBounds: getMarkerBounds(markers),
    markers,
    selectedMarker: null,
  }
}
