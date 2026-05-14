import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import Limit from '@/components/Limit'
import MapShell from '@/components/map/MapShell'
import { findDemoLocationByRoute } from '@/root/data/demo-locations'

const sidebarTransition = {
  duration: 0.2,
  ease: 'easeOut',
} as const

const LG_MEDIA_QUERY = '(min-width: 64rem)'

const MapLayout = ({ children }: { children: React.ReactNode }) => {
  const pageContext = usePageContext()
  const isOverview = pageContext.urlPathname === '/map'
  const selectedLocation = findDemoLocationByRoute(pageContext.urlPathname)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [sidebarElement, setSidebarElement] = useState<HTMLElement | null>(null)
  const [sidebarSize, setSidebarSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    const { body, documentElement } = document
    const scrollY = window.scrollY
    const previousStyles = {
      bodyLeft: body.style.left,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyRight: body.style.right,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      documentElementOverflow: documentElement.style.overflow,
      documentElementOverscrollBehavior: documentElement.style.overscrollBehavior,
    }

    documentElement.style.overflow = 'hidden'
    documentElement.style.overscrollBehavior = 'none'
    body.style.left = '0'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    body.style.position = 'fixed'
    body.style.right = '0'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      documentElement.style.overflow = previousStyles.documentElementOverflow
      documentElement.style.overscrollBehavior = previousStyles.documentElementOverscrollBehavior
      body.style.left = previousStyles.bodyLeft
      body.style.overflow = previousStyles.bodyOverflow
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior
      body.style.position = previousStyles.bodyPosition
      body.style.right = previousStyles.bodyRight
      body.style.top = previousStyles.bodyTop
      body.style.width = previousStyles.bodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(LG_MEDIA_QUERY)
    const updateIsLargeScreen = () => setIsLargeScreen(mediaQuery.matches)

    updateIsLargeScreen()
    mediaQuery.addEventListener('change', updateIsLargeScreen)

    return () => {
      mediaQuery.removeEventListener('change', updateIsLargeScreen)
    }
  }, [])

  useEffect(() => {
    if (isOverview || !sidebarElement) {
      setSidebarSize({ height: 0, width: 0 })
      return
    }

    const updateSidebarSize = () => {
      const { height, width } = sidebarElement.getBoundingClientRect()

      setSidebarSize({
        height: Math.round(height),
        width: Math.round(width),
      })
    }
    const resizeObserver = new ResizeObserver(updateSidebarSize)

    updateSidebarSize()
    resizeObserver.observe(sidebarElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [isOverview, sidebarElement])

  const sidebarMotion = isLargeScreen
    ? {
        animate: { x: 0, y: 0 },
        exit: { x: '100%', y: 0 },
        initial: { x: '100%', y: 0 },
      }
    : {
        animate: { x: 0, y: 0 },
        exit: { x: 0, y: '100%' },
        initial: { x: 0, y: '100%' },
      }
  const mapPadding = isOverview
    ? undefined
    : isLargeScreen
      ? { right: sidebarSize.width }
      : { bottom: sidebarSize.height }

  return (
    <div className="relative h-[calc(100dvh-16*var(--spacing))] min-w-0 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MapShell center={selectedLocation?.coordinates} padding={mapPadding} zoom={selectedLocation?.zoom} />
      </div>

      <AnimatePresence initial={false}>
        {isOverview ? (
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
        ) : (
          <motion.aside
            animate={sidebarMotion.animate}
            className="absolute inset-x-0 bottom-0 z-20 h-1/2 min-w-0 border-base-300 border-t bg-base-100 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[min(37.5%,32rem)] lg:border-t-0 lg:border-l"
            exit={sidebarMotion.exit}
            initial={sidebarMotion.initial}
            key="detail-content"
            ref={setSidebarElement}
            transition={sidebarTransition}
          >
            <Limit className="overflow-y-auto absolute inset-0">{children}</Limit>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MapLayout
