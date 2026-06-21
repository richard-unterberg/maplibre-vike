import { Tags, X } from 'lucide-react'
import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'

import { useMapStore } from '@/components/map/map-store'
import { normalizeLocale, t } from '@/data/i18n'
import type { MapPageData } from '@/data/map-page-data'
import { getMarkerHref } from '@/data/map-resolver'

const MapPage = () => {
  const { categories, markers } = useData<MapPageData>()
  const pageContext = usePageContext()
  const locale = normalizeLocale(pageContext.locale)
  const activeCategoryId = useMapStore((state) => state.activeCategoryId)
  const categoryMenuOpen = useMapStore((state) => state.categoryMenuOpen)
  const setActiveCategoryId = useMapStore((state) => state.setActiveCategoryId)
  const setCategoryMenuOpen = useMapStore((state) => state.setCategoryMenuOpen)
  const toggleCategoryMenu = useMapStore((state) => state.toggleCategoryMenu)
  const filteredMarkers = activeCategoryId
    ? markers.filter((marker) => marker.categoryIds.includes(activeCategoryId))
    : markers

  return (
    <section className="pointer-events-auto fixed top-18 left-3 z-10 max-w-[calc(100vw-4rem)]">
      {!categoryMenuOpen && (
        <button
          type="button"
          className="btn border-base-300 bg-base-100/90"
          aria-expanded={false}
          aria-label={t('openCategoryMenu', locale)}
          onClick={toggleCategoryMenu}
        >
          <Tags className="size-4" aria-hidden="true" />
          {t('categories', locale)}
        </button>
      )}

      {categoryMenuOpen && (
        <div className="w-[min(42rem,calc(100vw-4rem))] rounded-box border border-base-300 bg-base-100/90 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base-muted text-sm">{t('chemnitzMap', locale)}</p>
              <h1 className="mt-1 text-xl font-bold">
                {t('explorePlaces', locale)} {filteredMarkers.length}
              </h1>
            </div>
            <button
              type="button"
              className="btn btn-square btn-sm btn-ghost"
              aria-label={t('closeCategoryMenu', locale)}
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
              {t('all', locale)} {markers.length}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                className={`btn btn-sm ${activeCategoryId === category.id ? 'btn-primary' : 'btn-outline'}`}
                aria-pressed={activeCategoryId === category.id}
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.title} {markers.filter((marker) => marker.categoryIds.includes(category.id)).length}
              </button>
            ))}
          </div>

          <div className="mt-4 flex max-h-[42dvh] flex-wrap gap-2 overflow-y-auto pr-1">
            {filteredMarkers.map((marker) => (
              <a className="btn btn-sm btn-outline" href={getMarkerHref(marker, locale)} key={marker.id}>
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
