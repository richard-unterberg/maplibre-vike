import { getAllMarkers, getMarkerRoute } from '@/data/map-resolver'

export const onBeforePrerenderStart = () => {
  return getAllMarkers().map((marker) => getMarkerRoute(marker))
}
