import maplibregl, { type Map as MapLibreInstance } from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/components/map/map-controls.css'

import { getMapStyleUrl } from '@/components/map/map-styles'
import type { Coordinates, MapPadding, MapViewProps } from '@/components/map/map-types'
import { getCurrentThemePreference } from '@/components/themeAppearance'

const DEFAULT_CENTER: Coordinates = [13, 50.9]
const DEFAULT_PADDING = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
} as const satisfies Required<MapPadding>
const DEFAULT_ZOOM = 7

const toMapLibreCenter = (center: Coordinates): [number, number] => [center[0], center[1]]

const MapLibreMap = ({ center = DEFAULT_CENTER, padding = DEFAULT_PADDING, zoom = DEFAULT_ZOOM }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialCameraRef = useRef({
    center,
    padding: {
      bottom: padding.bottom ?? 0,
      left: padding.left ?? 0,
      right: padding.right ?? 0,
      top: padding.top ?? 0,
    },
    zoom,
  })
  const mapRef = useRef<MapLibreInstance | null>(null)
  const styleUrlRef = useRef(getMapStyleUrl(getCurrentThemePreference()))
  const paddingBottom = padding.bottom ?? 0
  const paddingLeft = padding.left ?? 0
  const paddingRight = padding.right ?? 0
  const paddingTop = padding.top ?? 0

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const map = new maplibregl.Map({
      attributionControl: {
        compact: true,
      },
      center: toMapLibreCenter(initialCameraRef.current.center),
      container: containerRef.current,
      style: styleUrlRef.current,
      zoom: initialCameraRef.current.zoom,
    })

    map.setPadding(initialCameraRef.current.padding)
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    container.style.setProperty('--map-frame-offset-bottom', `${paddingBottom}px`)
    container.style.setProperty('--map-frame-offset-left', `${paddingLeft}px`)
    container.style.setProperty('--map-frame-offset-right', `${paddingRight}px`)
    container.style.setProperty('--map-frame-offset-top', `${paddingTop}px`)
  }, [paddingBottom, paddingLeft, paddingRight, paddingTop])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    map.easeTo({
      center: toMapLibreCenter(center),
      duration: 600,
      padding: {
        bottom: paddingBottom,
        left: paddingLeft,
        right: paddingRight,
        top: paddingTop,
      },
      zoom,
    })
  }, [center[0], center[1], paddingBottom, paddingLeft, paddingRight, paddingTop, zoom])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const applyThemeStyle = () => {
      const nextStyleUrl = getMapStyleUrl(getCurrentThemePreference())

      if (styleUrlRef.current === nextStyleUrl) {
        return
      }

      styleUrlRef.current = nextStyleUrl
      map.setStyle(nextStyleUrl)
    }

    const observer = new MutationObserver(applyThemeStyle)

    observer.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    })

    applyThemeStyle()

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const container = containerRef.current

    if (!map || !container) {
      return
    }

    const resizeObserver = new ResizeObserver(() => map.resize())

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return <div ref={containerRef} className="maplibre-vike-map h-full w-full" />
}

export default MapLibreMap
