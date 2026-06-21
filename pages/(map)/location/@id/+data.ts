import type { PageContext } from 'vike/types'

import { normalizeLocale } from '@/data/i18n'
import { getCategories, getMarkerById, getOverviewMarkers } from '@/data/map-dataset'
import type { MapPageData } from '@/data/map-page-data'
import {
  getLocalizedCategories,
  getLocalizedGroupedMarkers,
  getLocalizedMarker,
  getLocalizedMarkerCategories,
  getLocalizedOverviewMarkers,
  getMarkerBounds,
} from '@/data/map-resolver'

export const data = async (pageContext: PageContext): Promise<MapPageData> => {
  const locale = normalizeLocale(pageContext.locale)
  const markerId = typeof pageContext.routeParams.id === 'string' ? pageContext.routeParams.id : null
  const [categories, overviewMarkers, rawSelectedMarker] = await Promise.all([
    getCategories(),
    getOverviewMarkers(),
    getMarkerById(markerId),
  ])

  if (!rawSelectedMarker) {
    throw new Error('Map marker not found')
  }

  if (!overviewMarkers.some((marker) => marker.id === rawSelectedMarker.id)) {
    throw new Error(`Map marker "${rawSelectedMarker.id}" is missing from the overview dataset`)
  }

  const selectedMarker = getLocalizedMarker(rawSelectedMarker, locale)
  const markers = getLocalizedOverviewMarkers(overviewMarkers, locale)

  return {
    categories: getLocalizedCategories(categories, locale),
    groupedMarkers: getLocalizedGroupedMarkers(categories, overviewMarkers, locale),
    mapView: {
      center: selectedMarker.coordinates,
      mode: 'detail',
      zoom: selectedMarker.detailZoom,
    },
    markerBounds: getMarkerBounds(overviewMarkers),
    markers,
    selectedMarker,
    selectedMarkerCategories: getLocalizedMarkerCategories(rawSelectedMarker, categories, locale),
  }
}
