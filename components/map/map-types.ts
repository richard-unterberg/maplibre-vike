export type Coordinates = readonly [lng: number, lat: number]

export interface MapPadding {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

export interface MapViewProps {
  center?: Coordinates
  padding?: MapPadding
  zoom?: number
}
