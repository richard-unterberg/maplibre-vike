import { useData } from 'vike-react/useData'

import { getAppHref } from '@/data/app-url'
import type { MapPageData } from '@/data/map-page-data'
import { getMarkerCategories, getMarkerHref } from '@/data/map-resolver'

const LocationPage = () => {
  const { markers, selectedMarker } = useData<MapPageData>()

  if (!selectedMarker) {
    return null
  }

  const categories = getMarkerCategories(selectedMarker)
  const nextMarker = markers[(markers.findIndex((marker) => marker.id === selectedMarker.id) + 1) % markers.length]

  return (
    <article className="flex flex-col gap-4 py-6">
      <p className="text-base-muted text-sm">Chemnitz location</p>
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
          <dt className="font-semibold">Coordinates</dt>
          <dd className="text-base-muted">{selectedMarker.coordinates.join(', ')}</dd>
        </div>
        <div>
          <dt className="font-semibold">Map zoom</dt>
          <dd className="text-base-muted">{selectedMarker.detailZoom}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
        <a className="btn btn-primary w-fit" href={getMarkerHref(nextMarker)}>
          Open {nextMarker.title}
        </a>
        <a className="btn btn-outline w-fit" href={getAppHref('/map')}>
          Overview
        </a>
      </div>
    </article>
  )
}

export default LocationPage
