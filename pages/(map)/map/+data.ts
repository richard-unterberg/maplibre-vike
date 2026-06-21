import type { PageContext } from 'vike/types'

import { normalizeLocale } from '@/data/i18n'
import { getCategories, getOverviewMarkers } from '@/data/map-dataset'
import type { MapPageData } from '@/data/map-page-data'
import {
  getLocalizedCategories,
  getLocalizedGroupedMarkers,
  getLocalizedOverviewMarkers,
  getMarkerBounds,
} from '@/data/map-resolver'

export const data = async (pageContext: PageContext): Promise<MapPageData> => {
  const locale = normalizeLocale(pageContext.locale)
  const [categories, overviewMarkers] = await Promise.all([getCategories(), getOverviewMarkers()])
  const markers = getLocalizedOverviewMarkers(overviewMarkers, locale)

  return {
    categories: getLocalizedCategories(categories, locale),
    groupedMarkers: getLocalizedGroupedMarkers(categories, overviewMarkers, locale),
    mapView: {
      bounds: getMarkerBounds(overviewMarkers),
      mode: 'overview',
    },
    markerBounds: getMarkerBounds(overviewMarkers),
    markers,
    selectedMarker: null,
    selectedMarkerCategories: [],
  }
}
