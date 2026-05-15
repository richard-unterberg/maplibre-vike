export type Coordinates = readonly [lng: number, lat: number]
export type MapBounds = readonly [southWest: Coordinates, northEast: Coordinates]

export interface MapPadding {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

export type RequiredMapPadding = Required<MapPadding>
export type MapView = 'overview' | 'detail' | 'mapFocus'

type MapCameraMode = 'overview' | 'detail' | 'bounds'
type MapCameraTransition = 'jump' | 'ease'

export interface MapCameraIntent {
  bounds?: MapBounds
  center?: Coordinates
  id: string
  mode: MapCameraMode
  padding: RequiredMapPadding
  selectedMarkerId?: string | null
  transition?: MapCameraTransition
  zoom?: number
}

export const DEFAULT_MAP_CENTER: Coordinates = [13, 50.9]
export const DEFAULT_MAP_PADDING = {
  bottom: 32,
  left: 32,
  right: 32,
  top: 32,
} as const satisfies RequiredMapPadding
export const DEFAULT_MAP_ZOOM = 10

export const normalizeMapPadding = (padding?: MapPadding): RequiredMapPadding => ({
  bottom: padding?.bottom ?? DEFAULT_MAP_PADDING.bottom,
  left: padding?.left ?? DEFAULT_MAP_PADDING.left,
  right: padding?.right ?? DEFAULT_MAP_PADDING.right,
  top: padding?.top ?? DEFAULT_MAP_PADDING.top,
})
