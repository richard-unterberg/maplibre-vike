import type { Coordinates } from '@/components/map/map-types'
import type { LocaleString } from '@/data/i18n'

export type MapCategoryId = 'culture' | 'history' | 'nature' | 'mobility' | 'food' | 'workspace'

export interface MapCategory {
  description: LocaleString
  id: MapCategoryId
  title: LocaleString
}

export interface OverviewMapMarker {
  categoryIds: readonly [MapCategoryId, ...MapCategoryId[]]
  coordinates: Coordinates
  detailZoom: number
  id: string
  title: LocaleString
}

export interface MapMarker extends OverviewMapMarker {
  description: LocaleString
}
