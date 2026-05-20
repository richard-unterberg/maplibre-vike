import maplibregl, { type GeoJSONSource, type Map as MapLibreInstance, type MapMouseEvent } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'
import { navigate } from 'vike/client/router'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/components/map/map-controls.css'

import { useMapStore } from '@/components/map/map-store'
import { getMapStyleUrl } from '@/components/map/map-styles'
import {
  type Coordinates,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_PADDING,
  DEFAULT_MAP_ZOOM,
  type MapBounds,
  type MapCameraIntent,
  type RequiredMapPadding,
} from '@/components/map/map-types'
import { getCurrentThemePreference } from '@/components/themeAppearance'
import type { MapCategory, MapMarker } from '@/data/constants'
import { getMarkerHref, getPrimaryMarkerCategory } from '@/data/map-resolver'

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

const MARKER_SOURCE_ID = 'maplibre-vike-markers'
const MARKER_SELECTED_LAYER_ID = 'maplibre-vike-marker-selected'
const MARKER_LAYER_ID = 'maplibre-vike-marker'
const MARKER_CORE_LAYER_ID = 'maplibre-vike-marker-core'

const markerColors = {
  culture: '#7c3aed',
  food: '#be123c',
  history: '#b45309',
  mobility: '#0369a1',
  nature: '#15803d',
  workspace: '#0f766e',
} as const satisfies Record<MapCategory['id'], string>

interface MarkerFeatureProperties {
  categoryId: MapCategory['id']
  color: string
  id: string
  selected: boolean
}

const getMarkerFeatureCollection = (
  markers: MapMarker[],
  selectedMarker: MapMarker | null,
): GeoJSON.FeatureCollection<GeoJSON.Point, MarkerFeatureProperties> => ({
  features: markers.map((marker) => {
    const categoryId = getPrimaryMarkerCategory(marker).id

    return {
      geometry: {
        coordinates: toMapLibreCenter(marker.coordinates),
        type: 'Point',
      },
      properties: {
        categoryId,
        color: markerColors[categoryId],
        id: marker.id,
        selected: marker.id === selectedMarker?.id,
      },
      type: 'Feature',
    }
  }),
  type: 'FeatureCollection',
})

const ensureMarkerLayers = (map: MapLibreInstance) => {
  if (!map.getSource(MARKER_SOURCE_ID)) {
    map.addSource(MARKER_SOURCE_ID, {
      data: {
        features: [],
        type: 'FeatureCollection',
      },
      type: 'geojson',
    })
  }

  if (!map.getLayer(MARKER_SELECTED_LAYER_ID)) {
    map.addLayer({
      filter: ['==', ['get', 'selected'], true],
      id: MARKER_SELECTED_LAYER_ID,
      paint: {
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.22,
        'circle-radius': 18,
        'circle-stroke-color': ['get', 'color'],
        'circle-stroke-opacity': 0.45,
        'circle-stroke-width': 2,
      },
      source: MARKER_SOURCE_ID,
      type: 'circle',
    })
  }

  if (!map.getLayer(MARKER_LAYER_ID)) {
    map.addLayer({
      id: MARKER_LAYER_ID,
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': ['case', ['get', 'selected'], 9, 7],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
      source: MARKER_SOURCE_ID,
      type: 'circle',
    })
  }

  if (!map.getLayer(MARKER_CORE_LAYER_ID)) {
    map.addLayer({
      id: MARKER_CORE_LAYER_ID,
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': ['case', ['get', 'selected'], 3.5, 2.5],
      },
      source: MARKER_SOURCE_ID,
      type: 'circle',
    })
  }
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

const MapLibreMap = ({ cameraIntent: initialCameraIntentProp, markers, selectedMarker }: MapLibreMapProps) => {
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
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map || !cameraIntent || lastAppliedIntentIdRef.current === cameraIntent.id) {
      return
    }

    lastAppliedIntentIdRef.current = cameraIntent.id
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

    const syncMarkerSource = () => {
      if (!map.isStyleLoaded()) {
        return
      }

      ensureMarkerLayers(map)

      const source = map.getSource(MARKER_SOURCE_ID) as GeoJSONSource | undefined

      source?.setData(getMarkerFeatureCollection(markers, selectedMarker))
    }

    map.on('load', syncMarkerSource)
    map.on('style.load', syncMarkerSource)
    syncMarkerSource()

    return () => {
      map.off('load', syncMarkerSource)
      map.off('style.load', syncMarkerSource)
    }
  }, [mapReady, markers, selectedMarker])

  useEffect(() => {
    const map = mapRef.current

    if (!map || !mapReady) {
      return
    }

    const getMarkerIdAtPoint = (event: MapMouseEvent) => {
      if (!map.getLayer(MARKER_LAYER_ID)) {
        return undefined
      }

      return map.queryRenderedFeatures(event.point, { layers: [MARKER_LAYER_ID] })[0]?.properties?.id as
        | string
        | undefined
    }

    const handleMarkerClick = (event: MapMouseEvent) => {
      const markerId = getMarkerIdAtPoint(event)
      const marker = markers.find((candidate) => candidate.id === markerId)

      if (!marker) {
        return
      }

      event.preventDefault()
      void navigate(getMarkerHref(marker))
    }

    const handleMarkerHover = (event: MapMouseEvent) => {
      map.getCanvas().style.cursor = getMarkerIdAtPoint(event) ? 'pointer' : ''
    }

    map.on('click', handleMarkerClick)
    map.on('mousemove', handleMarkerHover)

    return () => {
      map.off('click', handleMarkerClick)
      map.off('mousemove', handleMarkerHover)
      map.getCanvas().style.cursor = ''
    }
  }, [mapReady, markers])

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
