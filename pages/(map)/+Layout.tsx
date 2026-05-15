import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useData } from 'vike-react/useData'
import Limit from '@/components/Limit'
import MapShell from '@/components/map/MapShell'
import { useMapStore } from '@/components/map/map-store'
import {
  DEFAULT_MAP_PADDING,
  type MapCameraIntent,
  type MapView,
  normalizeMapPadding,
} from '@/components/map/map-types'
import { useSyncMapCameraIntent } from '@/components/map/useSyncMapCameraIntent'
import type { MapPageData } from '@/data/map-page-data'

const drawerTransition = {
  duration: 0.2,
  ease: 'easeOut',
} as const

const drawerMotion = {
  animate: { y: 0 },
  exit: { y: '100%' },
  initial: { y: '100%' },
} as const
const drawerHeightByView = {
  detail: '50%',
  mapFocus: '25%',
} as const satisfies Record<Exclude<MapView, 'overview'>, string>

const getBoundsIntentId = (cameraIntent: Pick<MapCameraIntent, 'bounds' | 'mode' | 'padding' | 'selectedMarkerId'>) => {
  const bounds = cameraIntent.bounds
  const padding = cameraIntent.padding

  return [
    cameraIntent.mode,
    cameraIntent.selectedMarkerId ?? 'none',
    bounds?.[0][0] ?? 'none',
    bounds?.[0][1] ?? 'none',
    bounds?.[1][0] ?? 'none',
    bounds?.[1][1] ?? 'none',
    padding.top,
    padding.right,
    padding.bottom,
    padding.left,
  ].join(':')
}

const getCenterIntentId = (
  cameraIntent: Pick<MapCameraIntent, 'center' | 'mode' | 'padding' | 'selectedMarkerId' | 'zoom'>,
) => {
  const center = cameraIntent.center
  const padding = cameraIntent.padding

  return [
    cameraIntent.mode,
    cameraIntent.selectedMarkerId ?? 'none',
    center?.[0] ?? 'none',
    center?.[1] ?? 'none',
    cameraIntent.zoom ?? 'none',
    padding.top,
    padding.right,
    padding.bottom,
    padding.left,
  ].join(':')
}

const MapLayout = ({ children }: { children: React.ReactNode }) => {
  const { categories, mapView, markerBounds, markers, selectedMarker } = useData<MapPageData>()
  const routeView: MapView = mapView.mode === 'overview' ? 'overview' : 'detail'
  const storedView = useMapStore((state) => state.view)
  const setView = useMapStore((state) => state.setView)
  const view: MapView = routeView === 'overview' ? 'overview' : storedView === 'mapFocus' ? 'mapFocus' : 'detail'
  const [detailDrawerElement, setDetailDrawerElement] = useState<HTMLElement | null>(null)
  const [detailDrawerHeight, setDetailDrawerHeight] = useState(0)

  useEffect(() => {
    const { documentElement } = document
    documentElement.style.overflow = 'hidden'
    return () => {
      documentElement.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (routeView === 'overview') {
      setView('overview')
      return
    }

    if (storedView === 'overview') {
      setView('detail')
    }
  }, [routeView, setView, storedView])

  useEffect(() => {
    if (view === 'overview' || !detailDrawerElement) {
      setDetailDrawerHeight(0)
      return
    }

    const updateDrawerSize = () => {
      const { height } = detailDrawerElement.getBoundingClientRect()

      setDetailDrawerHeight(Math.round(height))
    }
    const resizeObserver = new ResizeObserver(updateDrawerSize)

    updateDrawerSize()
    resizeObserver.observe(detailDrawerElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [detailDrawerElement, view])

  const cameraIntent = useMemo<MapCameraIntent>(() => {
    const padding = normalizeMapPadding(
      view === 'overview' ? DEFAULT_MAP_PADDING : { bottom: detailDrawerHeight + DEFAULT_MAP_PADDING.bottom },
    )
    const selectedMarkerId = selectedMarker?.id ?? null

    if (view === 'overview') {
      const bounds = mapView.mode === 'overview' ? mapView.bounds : markerBounds
      const overviewIntent = {
        bounds,
        mode: 'bounds',
        padding,
        selectedMarkerId: null,
        transition: 'ease',
      } as const satisfies Omit<MapCameraIntent, 'id'>

      return {
        ...overviewIntent,
        id: getBoundsIntentId(overviewIntent),
      }
    }

    const detailIntent = {
      center: selectedMarker?.coordinates ?? (mapView.mode === 'detail' ? mapView.center : undefined),
      mode: 'detail',
      padding,
      selectedMarkerId,
      transition: 'ease',
      zoom: selectedMarker?.detailZoom ?? (mapView.mode === 'detail' ? mapView.zoom : undefined),
    } as const satisfies Omit<MapCameraIntent, 'id'>

    return {
      ...detailIntent,
      id: getCenterIntentId(detailIntent),
    }
  }, [detailDrawerHeight, mapView, markerBounds, selectedMarker, view])

  useSyncMapCameraIntent(cameraIntent)

  return (
    <div className="relative h-[calc(100dvh-16*var(--spacing))] min-w-0 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MapShell
          cameraIntent={cameraIntent}
          categories={categories}
          markers={markers}
          selectedMarker={selectedMarker}
        />
      </div>

      {view !== 'overview' && (
        <button
          aria-pressed={view === 'mapFocus'}
          className="btn btn-sm absolute top-4 right-4 z-10 border-base-300 bg-base-100/90 backdrop-blur"
          onClick={() => setView(view === 'mapFocus' ? 'detail' : 'mapFocus')}
          type="button"
        >
          {view === 'mapFocus' ? 'Dock' : 'Map'}
        </button>
      )}

      <AnimatePresence initial={false}>
        {view === 'overview' && (
          <motion.div
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 z-10"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="overview-content"
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            <Limit>{children}</Limit>
          </motion.div>
        )}

        {view !== 'overview' && (
          <motion.aside
            animate={{ ...drawerMotion.animate, height: drawerHeightByView[view] }}
            className="absolute inset-x-0 bottom-0 z-20 min-w-0 border-base-300 border-t bg-base-100"
            exit={drawerMotion.exit}
            initial={{ ...drawerMotion.initial, height: drawerHeightByView[view] }}
            key="detail-content"
            ref={setDetailDrawerElement}
            transition={drawerTransition}
          >
            <Limit $size="md" className="overflow-y-auto absolute inset-0">
              {children}
            </Limit>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MapLayout
