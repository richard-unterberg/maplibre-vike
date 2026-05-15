import maplibregl, { type Map as MapLibreInstance } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'
import { navigate } from 'vike/client/router'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/components/map/map-controls.css'

import { getMapStyleUrl } from '@/components/map/map-styles'
import { useMapStore } from '@/components/map/map-store'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_PADDING,
  DEFAULT_MAP_ZOOM,
  type Coordinates,
  type MapBounds,
  type MapCameraIntent,
  type RequiredMapPadding,
} from '@/components/map/map-types'
import { getCurrentThemePreference } from '@/components/themeAppearance'
import type { MapCategory, MapMarker } from '@/data/constants'
import { getMarkerRoute, getPrimaryMarkerCategory } from '@/data/map-resolver'

interface MapLibreMapProps {
  cameraIntent: MapCameraIntent
  categories: MapCategory[]
  markers: MapMarker[]
  selectedMarker: MapMarker | null
}

const toMapLibreCenter = (center: Coordinates): [number, number] => [center[0], center[1]]
const toMapLibreBounds = (bounds: MapBounds): [[number, number], [number, number]] => [
  [bounds[0][0], bounds[0][1]],
  [bounds[1][0], bounds[1][1]],
]
const toMapLibrePadding = (padding: RequiredMapPadding) => ({
  bottom: padding.bottom,
  left: padding.left,
  right: padding.right,
  top: padding.top,
})

const setControlOffsets = (container: HTMLElement, padding: RequiredMapPadding) => {
  container.style.setProperty('--map-frame-offset-bottom', `${padding.bottom}px`)
  container.style.setProperty('--map-frame-offset-left', `${padding.left}px`)
  container.style.setProperty('--map-frame-offset-right', `${padding.right}px`)
  container.style.setProperty('--map-frame-offset-top', `${padding.top}px`)
}

const applyBoundsIntent = (map: MapLibreInstance, cameraIntent: MapCameraIntent) => {
  if (!cameraIntent.bounds) {
    return
  }

  map.stop()
  map.setPadding(toMapLibrePadding(cameraIntent.padding))
  map.fitBounds(toMapLibreBounds(cameraIntent.bounds), {
    duration: cameraIntent.transition === 'jump' ? 0 : 600,
    padding: toMapLibrePadding(cameraIntent.padding),
  })
}

const MapLibreMap = ({
  cameraIntent: initialCameraIntentProp,
  categories,
  markers,
  selectedMarker,
}: MapLibreMapProps) => {
  const cameraIntent = useMapStore((state) => state.cameraIntent)
  const containerRef = useRef<HTMLDivElement>(null)
  const initialCameraIntent = initialCameraIntentProp ?? useMapStore.getState().cameraIntent
  const initialCameraIntentRef = useRef(initialCameraIntent)
  const initialCameraRef = useRef({
    center: initialCameraIntent?.center ?? DEFAULT_MAP_CENTER,
    padding: initialCameraIntent?.padding ?? DEFAULT_MAP_PADDING,
    zoom: initialCameraIntent?.zoom ?? DEFAULT_MAP_ZOOM,
  })
  const lastAppliedIntentIdRef = useRef<string | null>(initialCameraIntent?.id ?? null)
  const mapRef = useRef<MapLibreInstance | null>(null)
  const markerInstancesRef = useRef<maplibregl.Marker[]>([])
  const [mapReady, setMapReady] = useState(false)
  const styleUrlRef = useRef(getMapStyleUrl(getCurrentThemePreference()))

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

    setControlOffsets(containerRef.current, initialCameraRef.current.padding)
    map.setPadding(toMapLibrePadding(initialCameraRef.current.padding))
    if (initialCameraIntentRef.current?.mode === 'bounds') {
      applyBoundsIntent(map, {
        ...initialCameraIntentRef.current,
        transition: 'jump',
      })
    }
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')
    mapRef.current = map
    setMapReady(true)

    return () => {
      setMapReady(false)
      for (const markerInstance of markerInstancesRef.current) {
        markerInstance.remove()
      }
      markerInstancesRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const container = containerRef.current

    if (!map || !container || !cameraIntent || lastAppliedIntentIdRef.current === cameraIntent.id) {
      return
    }

    lastAppliedIntentIdRef.current = cameraIntent.id
    setControlOffsets(container, cameraIntent.padding)
    map.stop()

    if (cameraIntent.mode === 'bounds' && cameraIntent.bounds) {
      applyBoundsIntent(map, cameraIntent)
      return
    }

    if (!cameraIntent.center || typeof cameraIntent.zoom !== 'number') {
      return
    }

    const cameraOptions = {
      center: toMapLibreCenter(cameraIntent.center),
      padding: toMapLibrePadding(cameraIntent.padding),
      zoom: cameraIntent.zoom,
    }

    if (cameraIntent.transition === 'jump') {
      map.jumpTo(cameraOptions)
      return
    }

    map.easeTo({
      ...cameraOptions,
      duration: 600,
    })
  }, [cameraIntent])

  useEffect(() => {
    const map = mapRef.current

    if (!map || !mapReady) {
      return
    }

    const categoriesById = new Map(categories.map((category) => [category.id, category]))

    for (const markerInstance of markerInstancesRef.current) {
      markerInstance.remove()
    }

    markerInstancesRef.current = markers.map((marker) => {
      const primaryCategory = categoriesById.get(marker.categoryIds[0]) ?? getPrimaryMarkerCategory(marker)
      const element = document.createElement('button')

      element.type = 'button'
      element.className = 'map-marker'
      element.dataset.category = primaryCategory.id
      element.dataset.selected = marker.id === selectedMarker?.id ? 'true' : 'false'
      element.ariaLabel = `Open ${marker.title}`
      element.addEventListener('click', () => {
        void navigate(getMarkerRoute(marker))
      })

      return new maplibregl.Marker({
        anchor: 'bottom',
        element,
      })
        .setLngLat(toMapLibreCenter(marker.coordinates))
        .addTo(map)
    })

    return () => {
      for (const markerInstance of markerInstancesRef.current) {
        markerInstance.remove()
      }

      markerInstancesRef.current = []
    }
  }, [categories, mapReady, markers, selectedMarker?.id])

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
