import type { Coordinates } from '@/components/map/map-types'

export interface DemoLocation {
  coordinates: Coordinates
  description: string
  id: string
  route: string
  title: string
  zoom: number
}

export const demoLocations = [
  {
    coordinates: [12.9252, 50.8342],
    description: 'Central Chemnitz landmark and public meeting point.',
    id: 'dummy',
    route: '/location/dummy',
    title: 'Karl Marx Monument',
    zoom: 15,
  },
  {
    coordinates: [12.9139, 50.8413],
    description: 'Urban lake and green recreation area near central Chemnitz.',
    id: 'schlossteich',
    route: '/location/schlossteich',
    title: 'Schlossteich',
    zoom: 15,
  },
] as const satisfies readonly DemoLocation[]

export const findDemoLocationByRoute = (route: string) => {
  return demoLocations.find((location) => location.route === route) ?? null
}
