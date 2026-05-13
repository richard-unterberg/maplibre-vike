export type Coordinates = readonly [lng: number, lat: number]

type MapShellVariant = 'overview' | 'detail' | 'embedded'

export interface MapViewProps {
  center?: Coordinates
  zoom?: number
  variant?: MapShellVariant
}
