import type { MapBounds } from '@/components/map/map-types'
import { getLocalizedAppHref } from '@/data/app-url'
import type { MapCategory, MapCategoryId, MapMarker, OverviewMapMarker } from '@/data/map-data-types'
import { type Locale, pickLocaleString } from '@/data/i18n'

export interface LocalizedMapCategory {
  description: string
  id: MapCategoryId
  title: string
}

export interface LocalizedOverviewMapMarker {
  categoryIds: readonly [MapCategoryId, ...MapCategoryId[]]
  coordinates: OverviewMapMarker['coordinates']
  detailZoom: number
  id: string
  primaryCategoryId: MapCategoryId
  title: string
}

export interface LocalizedMapMarker extends LocalizedOverviewMapMarker {
  description: string
}

export interface LocalizedGroupedOverviewMapMarkers {
  category: LocalizedMapCategory
  markers: LocalizedOverviewMapMarker[]
}

export const getMarkerRoute = (marker: Pick<OverviewMapMarker, 'id'>): `/location/${string}` => `/location/${marker.id}`

export const getMarkerHref = (marker: Pick<OverviewMapMarker, 'id'>, locale?: Locale) =>
  getLocalizedAppHref(getMarkerRoute(marker), locale)

const getLocalizedCategory = (category: MapCategory, locale: Locale): LocalizedMapCategory => ({
  description: pickLocaleString(category.description, locale),
  id: category.id,
  title: pickLocaleString(category.title, locale),
})

const getPrimaryMarkerCategoryId = (marker: Pick<OverviewMapMarker, 'categoryIds' | 'id'>): MapCategoryId => {
  const primaryCategoryId = marker.categoryIds[0]

  if (!primaryCategoryId) {
    throw new Error(`Unknown primary category for marker "${marker.id}"`)
  }

  return primaryCategoryId
}

const getLocalizedOverviewMarker = (marker: OverviewMapMarker, locale: Locale): LocalizedOverviewMapMarker => ({
  categoryIds: marker.categoryIds,
  coordinates: marker.coordinates,
  detailZoom: marker.detailZoom,
  id: marker.id,
  primaryCategoryId: getPrimaryMarkerCategoryId(marker),
  title: pickLocaleString(marker.title, locale),
})

export const getLocalizedMarker = (marker: MapMarker, locale: Locale): LocalizedMapMarker => ({
  ...getLocalizedOverviewMarker(marker, locale),
  description: pickLocaleString(marker.description, locale),
})

export const getLocalizedCategories = (categories: readonly MapCategory[], locale: Locale): LocalizedMapCategory[] => {
  return categories.map((category) => getLocalizedCategory(category, locale))
}

export const getLocalizedOverviewMarkers = (
  markers: readonly OverviewMapMarker[],
  locale: Locale,
): LocalizedOverviewMapMarker[] => {
  return markers.map((marker) => getLocalizedOverviewMarker(marker, locale))
}

export const getLocalizedMarkerCategories = (
  marker: Pick<OverviewMapMarker, 'categoryIds'>,
  categories: readonly MapCategory[],
  locale: Locale,
): LocalizedMapCategory[] => {
  return marker.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId))
    .filter((category): category is MapCategory => Boolean(category))
    .map((category) => getLocalizedCategory(category, locale))
}

export const getLocalizedGroupedMarkers = (
  categories: readonly MapCategory[],
  markers: readonly OverviewMapMarker[],
  locale: Locale,
): LocalizedGroupedOverviewMapMarkers[] => {
  return categories.map((category) => ({
    category: getLocalizedCategory(category, locale),
    markers: markers
      .filter((marker) => (marker.categoryIds as readonly MapCategoryId[]).includes(category.id))
      .map((marker) => getLocalizedOverviewMarker(marker, locale)),
  }))
}

export const getMarkerBounds = (markers: readonly Pick<OverviewMapMarker, 'coordinates'>[]): MapBounds => {
  if (markers.length === 0) {
    throw new Error('Cannot calculate marker bounds without markers')
  }

  let minLng = markers[0].coordinates[0]
  let maxLng = markers[0].coordinates[0]
  let minLat = markers[0].coordinates[1]
  let maxLat = markers[0].coordinates[1]

  for (const marker of markers) {
    const [lng, lat] = marker.coordinates

    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }

  if (minLng === maxLng) {
    minLng -= 0.01
    maxLng += 0.01
  }

  if (minLat === maxLat) {
    minLat -= 0.01
    maxLat += 0.01
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}
