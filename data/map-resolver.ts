import type { MapBounds } from '@/components/map/map-types'
import { MAP_CATEGORIES, MAP_MARKERS, type MapCategory, type MapCategoryId, type MapMarker } from '@/data/constants'

export interface GroupedMapMarkers {
  category: MapCategory
  markers: MapMarker[]
}

export interface LocationRouteParams {
  id?: string
}

export const getAllCategories = (): MapCategory[] => [...MAP_CATEGORIES]

export const getAllMarkers = (): MapMarker[] => [...MAP_MARKERS]

export const getMarkerRoute = (marker: Pick<MapMarker, 'id'>) => `/location/${marker.id}`

const findMarkerById = (id?: string | null): MapMarker | null => {
  if (!id) {
    return null
  }

  return MAP_MARKERS.find((marker) => marker.id === id) ?? null
}

export const findMarkerByRouteParams = (routeParams: LocationRouteParams): MapMarker | null => {
  return findMarkerById(routeParams.id)
}

export const getMarkersByCategory = (categoryId: MapCategoryId): MapMarker[] => {
  return MAP_MARKERS.filter((marker) => (marker.categoryIds as readonly MapCategoryId[]).includes(categoryId))
}

export const getMarkerCategories = (marker: MapMarker): MapCategory[] => {
  return marker.categoryIds
    .map((categoryId) => MAP_CATEGORIES.find((category) => category.id === categoryId))
    .filter((category): category is MapCategory => Boolean(category))
}

export const getPrimaryMarkerCategory = (marker: MapMarker): MapCategory => {
  const primaryCategory = MAP_CATEGORIES.find((category) => category.id === marker.categoryIds[0])

  if (!primaryCategory) {
    throw new Error(`Unknown primary category for marker "${marker.id}"`)
  }

  return primaryCategory
}

export const getGroupedMarkers = (): GroupedMapMarkers[] => {
  return MAP_CATEGORIES.map((category) => ({
    category,
    markers: getMarkersByCategory(category.id),
  }))
}

export const getMarkerBounds = (markers: readonly MapMarker[]): MapBounds => {
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
