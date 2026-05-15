import type { PageContext } from 'vike/types'

import type { MapPageData } from '@/data/map-page-data'
import {
  findMarkerByRouteParams,
  getAllCategories,
  getAllMarkers,
  getGroupedMarkers,
  getMarkerBounds,
} from '@/data/map-resolver'

export const data = (pageContext: PageContext): MapPageData => {
  const selectedMarker = findMarkerByRouteParams(pageContext.routeParams)

  if (!selectedMarker) {
    throw new Error('Map marker not found')
  }

  const markers = getAllMarkers()

  return {
    categories: getAllCategories(),
    groupedMarkers: getGroupedMarkers(),
    mapView: {
      center: selectedMarker.coordinates,
      mode: 'detail',
      zoom: selectedMarker.detailZoom,
    },
    markerBounds: getMarkerBounds(markers),
    markers,
    selectedMarker,
  }
}
