import maplibregl, { type Map as MapLibreInstance } from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'

import { getMapStyleUrl } from '@/components/map/map-styles'
import type { Coordinates, MapViewProps } from '@/components/map/map-types'
import { getCurrentThemePreference } from '@/components/themeAppearance'

const DEFAULT_CENTER: Coordinates = [13, 50.9]
const DEFAULT_ZOOM = 7

const toMapLibreCenter = (center: Coordinates): [number, number] => [center[0], center[1]]

const MapLibreMap = ({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreInstance | null>(null)
  const styleUrlRef = useRef(getMapStyleUrl(getCurrentThemePreference()))

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const map = new maplibregl.Map({
      attributionControl: {
        compact: true,
      },
      center: toMapLibreCenter(center),
      container: containerRef.current,
      style: styleUrlRef.current,
      zoom,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [center[0], center[1], zoom])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    map.easeTo({
      center: toMapLibreCenter(center),
      duration: 500,
      zoom,
    })
  }, [center[0], center[1], zoom])

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

    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" />
}

export default MapLibreMap
