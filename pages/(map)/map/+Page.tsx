import { Tags, X } from 'lucide-react'
import { useData } from 'vike-react/useData'

import { useMapStore } from '@/components/map/map-store'
import type { MapPageData } from '@/data/map-page-data'
import { getMarkerRoute, getMarkersByCategory } from '@/data/map-resolver'

const MapPage = () => {
  const { categories, markers } = useData<MapPageData>()
  const activeCategoryId = useMapStore((state) => state.activeCategoryId)
  const categoryMenuOpen = useMapStore((state) => state.categoryMenuOpen)
  const setActiveCategoryId = useMapStore((state) => state.setActiveCategoryId)
  const setCategoryMenuOpen = useMapStore((state) => state.setCategoryMenuOpen)
  const toggleCategoryMenu = useMapStore((state) => state.toggleCategoryMenu)
  const filteredMarkers = activeCategoryId ? getMarkersByCategory(activeCategoryId) : markers

  return (
    <section className="pointer-events-auto fixed top-24 left-8 z-10 max-w-[calc(100vw-4rem)]">
      {!categoryMenuOpen && (
        <button
          type="button"
          className="btn border-base-300 bg-base-100/90 shadow-lg backdrop-blur"
          aria-expanded={false}
          aria-label="Open category menu"
          onClick={toggleCategoryMenu}
        >
          <Tags className="size-4" aria-hidden="true" />
          Categories
        </button>
      )}

      {categoryMenuOpen && (
        <div className="w-[min(42rem,calc(100vw-4rem))] rounded-box border border-base-300 bg-base-100/90 p-5 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base-muted text-sm">Chemnitz map</p>
              <h1 className="mt-1 text-xl font-bold">Explore {filteredMarkers.length} places</h1>
            </div>
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost"
              aria-label="Close category menu"
              onClick={() => setCategoryMenuOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${activeCategoryId === null ? 'btn-primary' : 'btn-outline'}`}
              aria-pressed={activeCategoryId === null}
              onClick={() => setActiveCategoryId(null)}
            >
              All {markers.length}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                className={`btn btn-sm ${activeCategoryId === category.id ? 'btn-primary' : 'btn-outline'}`}
                aria-pressed={activeCategoryId === category.id}
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.title} {getMarkersByCategory(category.id).length}
              </button>
            ))}
          </div>

          <div className="mt-4 flex max-h-[42dvh] flex-wrap gap-2 overflow-y-auto pr-1">
            {filteredMarkers.map((marker) => (
              <a className="btn btn-sm btn-outline" href={getMarkerRoute(marker)} key={marker.id}>
                {marker.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default MapPage
