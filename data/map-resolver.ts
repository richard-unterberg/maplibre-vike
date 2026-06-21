import type { MapBounds } from '@/components/map/map-types'
import { getLocalizedAppHref } from '@/data/app-url'
import { MAP_CATEGORIES, MAP_MARKERS, type MapCategory, type MapCategoryId, type MapMarker } from '@/data/constants'
import { type Locale, pickLocaleString } from '@/data/i18n'

export interface LocalizedMapCategory {
  description: string
  id: MapCategoryId
  title: string
}

export interface LocalizedMapMarker {
  categoryIds: readonly [MapCategoryId, ...MapCategoryId[]]
  coordinates: MapMarker['coordinates']
  description: string
  detailZoom: number
  id: string
  title: string
}

export interface LocalizedGroupedMapMarkers {
  category: LocalizedMapCategory
  markers: LocalizedMapMarker[]
}

export interface LocationRouteParams {
  id?: string
}

export const getAllMarkers = (): MapMarker[] => [...MAP_MARKERS]

export const getMarkerRoute = (marker: Pick<MapMarker, 'id'>): `/location/${string}` => `/location/${marker.id}`

export const getMarkerHref = (marker: Pick<MapMarker, 'id'>, locale?: Locale) =>
  getLocalizedAppHref(getMarkerRoute(marker), locale)

const findMarkerById = (id?: string | null): MapMarker | null => {
  if (!id) {
    return null
  }

  return MAP_MARKERS.find((marker) => marker.id === id) ?? null
}

const findMarkerByRouteParams = (routeParams: LocationRouteParams): MapMarker | null => {
  return findMarkerById(routeParams.id)
}

const getLocalizedCategory = (category: MapCategory, locale: Locale): LocalizedMapCategory => ({
  description: pickLocaleString(category.description, locale),
  id: category.id,
  title: pickLocaleString(category.title, locale),
})

const getLocalizedMarker = (marker: MapMarker, locale: Locale): LocalizedMapMarker => ({
  categoryIds: marker.categoryIds,
  coordinates: marker.coordinates,
  description: pickLocaleString(marker.description, locale),
  detailZoom: marker.detailZoom,
  id: marker.id,
  title: pickLocaleString(marker.title, locale),
})

export const getLocalizedCategories = (locale: Locale): LocalizedMapCategory[] => {
  return MAP_CATEGORIES.map((category) => getLocalizedCategory(category, locale))
}

export const getLocalizedMarkers = (locale: Locale): LocalizedMapMarker[] => {
  return MAP_MARKERS.map((marker) => getLocalizedMarker(marker, locale))
}

export const findLocalizedMarkerByRouteParams = (
  routeParams: LocationRouteParams,
  locale: Locale,
): LocalizedMapMarker | null => {
  const marker = findMarkerByRouteParams(routeParams)

  return marker ? getLocalizedMarker(marker, locale) : null
}

const getMarkersByCategory = (categoryId: MapCategoryId): MapMarker[] => {
  return MAP_MARKERS.filter((marker) => (marker.categoryIds as readonly MapCategoryId[]).includes(categoryId))
}

export const getLocalizedMarkerCategories = (
  marker: Pick<MapMarker, 'categoryIds'>,
  locale: Locale,
): LocalizedMapCategory[] => {
  return marker.categoryIds
    .map((categoryId) => MAP_CATEGORIES.find((category) => category.id === categoryId))
    .filter((category): category is MapCategory => Boolean(category))
    .map((category) => getLocalizedCategory(category, locale))
}

export const getPrimaryMarkerCategory = (marker: Pick<MapMarker, 'categoryIds' | 'id'>): MapCategory => {
  const primaryCategory = MAP_CATEGORIES.find((category) => category.id === marker.categoryIds[0])

  if (!primaryCategory) {
    throw new Error(`Unknown primary category for marker "${marker.id}"`)
  }

  return primaryCategory
}

export const getLocalizedGroupedMarkers = (locale: Locale): LocalizedGroupedMapMarkers[] => {
  return MAP_CATEGORIES.map((category) => ({
    category: getLocalizedCategory(category, locale),
    markers: getMarkersByCategory(category.id).map((marker) => getLocalizedMarker(marker, locale)),
  }))
}

export const getMarkerBounds = (markers: readonly Pick<MapMarker, 'coordinates'>[]): MapBounds => {
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
