import Limit from '@/components/Limit'
import ThemeToggle from '@/components/ThemeToggle'
import { findMarkerById, getMarkerRoute } from '@/data/map-resolver'

const featuredMarkers = ['karl-marx-monument', 'schlossteich']
  .map((markerId) => findMarkerById(markerId))
  .filter((marker) => marker !== null)

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed top-0 left-0 z-50 h-16 w-full border-base-muted-light border-b bg-base-100/95 backdrop-blur">
        <Limit className="mx-auto flex h-full w-full items-center justify-between">
          <a className="font-semibold text-base-content" href="/map">
            maplibre-vike
          </a>
          <div className="flex-1 flex justify-center gap-4">
            {featuredMarkers.map((marker) => (
              <a className="text-sm text-base-muted" href={getMarkerRoute(marker)} key={marker.id}>
                {marker.title}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </Limit>
      </header>
      <main className="pt-16">
        <div className="relative h-[calc(100dvh-16*var(--spacing))]">{children}</div>
      </main>
    </div>
  )
}
export default Layout
