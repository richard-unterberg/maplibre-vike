import { useData } from 'vike-react/useData'
import { usePageContext } from 'vike-react/usePageContext'

import { getLocalizedAppHref } from '@/data/app-url'
import { normalizeLocale, t } from '@/data/i18n'
import type { MapPageData } from '@/data/map-page-data'
import { getLocalizedMarkerCategories, getMarkerHref } from '@/data/map-resolver'

const LocationPage = () => {
  const { markers, selectedMarker } = useData<MapPageData>()
  const pageContext = usePageContext()
  const locale = normalizeLocale(pageContext.locale)

  if (!selectedMarker) {
    return null
  }

  const categories = getLocalizedMarkerCategories(selectedMarker, locale)
  const nextMarker = markers[(markers.findIndex((marker) => marker.id === selectedMarker.id) + 1) % markers.length]

  return (
    <article className="flex flex-col gap-4 py-6">
      <p className="text-base-muted text-sm">{t('chemnitzLocation', locale)}</p>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <span className="badge badge-outline" key={category.id}>
            {category.title}
          </span>
        ))}
      </div>
      <h1 className="text-2xl font-bold">{selectedMarker.title}</h1>
      <p>{selectedMarker.description}</p>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="font-semibold">{t('coordinates', locale)}</dt>
          <dd className="text-base-muted">{selectedMarker.coordinates.join(', ')}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t('mapZoom', locale)}</dt>
          <dd className="text-base-muted">{selectedMarker.detailZoom}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
        <a className="btn btn-primary w-fit" href={getMarkerHref(nextMarker, locale)}>
          {t('open', locale)} {nextMarker.title}
        </a>
        <a className="btn btn-outline w-fit" href={getLocalizedAppHref('/map', locale)}>
          {t('overview', locale)}
        </a>
      </div>
    </article>
  )
}

export default LocationPage
