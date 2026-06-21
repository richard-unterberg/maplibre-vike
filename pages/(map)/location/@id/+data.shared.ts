import type { PageContext } from 'vike/types'

import { normalizeLocale } from '@/data/i18n'
import type { MapPageData } from '@/data/map-page-data'
import {
  findLocalizedMarkerByRouteParams,
  getAllMarkers,
  getLocalizedCategories,
  getLocalizedGroupedMarkers,
  getLocalizedMarkers,
  getMarkerBounds,
} from '@/data/map-resolver'

export const data = (pageContext: PageContext): MapPageData => {
  const locale = normalizeLocale(pageContext.locale)
  const selectedMarker = findLocalizedMarkerByRouteParams(pageContext.routeParams, locale)

  if (!selectedMarker) {
    throw new Error('Map marker not found')
  }

  const rawMarkers = getAllMarkers()
  const markers = getLocalizedMarkers(locale)

  return {
    categories: getLocalizedCategories(locale),
    groupedMarkers: getLocalizedGroupedMarkers(locale),
    mapView: {
      center: selectedMarker.coordinates,
      mode: 'detail',
      zoom: selectedMarker.detailZoom,
    },
    markerBounds: getMarkerBounds(rawMarkers),
    markers,
    selectedMarker,
  }
}
