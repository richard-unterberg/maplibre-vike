import { getOverviewMarkers } from '@/data/map-dataset'
import { getMarkerRoute } from '@/data/map-resolver'

export const onBeforePrerenderStart = async () => {
  const markers = await getOverviewMarkers()

  return markers.map((marker) => getMarkerRoute(marker))
}
