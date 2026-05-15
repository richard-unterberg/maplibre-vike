import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import Limit from '@/components/Limit'
import MapShell from '@/components/map/MapShell'
import { useMapStore } from '@/components/map/map-store'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_PADDING,
  DEFAULT_MAP_ZOOM,
  type MapCameraIntent,
  type MapView,
  normalizeMapPadding,
} from '@/components/map/map-types'
import { useSyncMapCameraIntent } from '@/components/map/useSyncMapCameraIntent'
import { findDemoLocationByRoute } from '@/root/data/demo-locations'

const sidebarTransition = {
  duration: 0.2,
  ease: 'easeOut',
} as const

const sidebarMotion = {
  animate: { y: 0 },
  exit: { y: '100%' },
  initial: { y: '100%' },
} as const
const sidebarHeightByView = {
  detail: '50%',
  mapFocus: '25%',
} as const satisfies Record<Exclude<MapView, 'overview'>, string>

const MapLayout = ({ children }: { children: React.ReactNode }) => {
  const pageContext = usePageContext()
  const routeView: MapView = pageContext.urlPathname === '/map' ? 'overview' : 'detail'
  const storedView = useMapStore((state) => state.view)
  const setView = useMapStore((state) => state.setView)
  const view: MapView = routeView === 'overview' ? 'overview' : storedView === 'mapFocus' ? 'mapFocus' : 'detail'
  const selectedLocation = findDemoLocationByRoute(pageContext.urlPathname)
  const [sidebarElement, setSidebarElement] = useState<HTMLElement | null>(null)
  const [sidebarHeight, setSidebarHeight] = useState(0)

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
    if (view === 'overview' || !sidebarElement) {
      setSidebarHeight(0)
      return
    }

    const updateSidebarSize = () => {
      const { height } = sidebarElement.getBoundingClientRect()

      setSidebarHeight(Math.round(height))
    }
    const resizeObserver = new ResizeObserver(updateSidebarSize)

    updateSidebarSize()
    resizeObserver.observe(sidebarElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [sidebarElement, view])

  const cameraIntent = useMemo<MapCameraIntent>(() => {
    const padding = normalizeMapPadding(view === 'overview' ? DEFAULT_MAP_PADDING : { bottom: sidebarHeight })
    const mode = view === 'overview' ? 'overview' : 'detail'
    const selectedMarkerId = selectedLocation?.id ?? null

    return {
      center: selectedLocation?.coordinates ?? DEFAULT_MAP_CENTER,
      id: `${view}:${selectedMarkerId ?? 'none'}:${padding.top}:${padding.right}:${padding.bottom}:${padding.left}`,
      mode,
      padding,
      selectedMarkerId,
      transition: 'ease',
      zoom: selectedLocation?.zoom ?? DEFAULT_MAP_ZOOM,
    }
  }, [selectedLocation, sidebarHeight, view])

  useSyncMapCameraIntent(cameraIntent)

  return (
    <div className="relative h-[calc(100dvh-16*var(--spacing))] min-w-0 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MapShell />
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
            animate={{ ...sidebarMotion.animate, height: sidebarHeightByView[view] }}
            className="absolute inset-x-0 bottom-0 z-20 min-w-0 border-base-300 border-t bg-base-100"
            exit={sidebarMotion.exit}
            initial={{ ...sidebarMotion.initial, height: sidebarHeightByView[view] }}
            key="detail-content"
            ref={setSidebarElement}
            transition={sidebarTransition}
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
