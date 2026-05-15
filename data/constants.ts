import type { Coordinates } from '@/components/map/map-types'

export const MAP_CATEGORIES = [
  {
    description: 'Museums, theaters, public art, and cultural landmarks.',
    id: 'culture',
    title: 'Culture',
  },
  {
    description: 'Historic places, monuments, and industrial heritage.',
    id: 'history',
    title: 'History',
  },
  {
    description: 'Parks, lakes, forests, viewpoints, and outdoor places.',
    id: 'nature',
    title: 'Nature',
  },
  {
    description: 'Stations, transport hubs, bridges, and movement corridors.',
    id: 'mobility',
    title: 'Mobility',
  },
  {
    description: 'Cafes, markets, restaurants, and local food spots.',
    id: 'food',
    title: 'Food',
  },
  {
    description: 'Campuses, coworking spaces, libraries, and learning places.',
    id: 'workspace',
    title: 'Workspace',
  },
] as const

export type MapCategory = (typeof MAP_CATEGORIES)[number]
export type MapCategoryId = MapCategory['id']

export interface MapMarker {
  categoryIds: readonly [MapCategoryId, ...MapCategoryId[]]
  coordinates: Coordinates
  description: string
  detailZoom: number
  id: string
  title: string
}

export const MAP_MARKERS = [
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9252, 50.8342],
    description: 'Central Chemnitz landmark and public meeting point.',
    detailZoom: 15,
    id: 'karl-marx-monument',
    title: 'Karl Marx Monument',
  },
  {
    categoryIds: ['culture', 'history'],
    coordinates: [12.9259, 50.8377],
    description: 'Cultural square surrounded by museums, opera, and theater.',
    detailZoom: 15,
    id: 'theaterplatz',
    title: 'Theaterplatz Chemnitz',
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.9139, 50.8413],
    description: 'Urban lake and green recreation area near central Chemnitz.',
    detailZoom: 14,
    id: 'schlossteich',
    title: 'Schlossteich',
  },
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9036, 50.8238],
    description: 'Industrial heritage site documenting the manufacturing history of Chemnitz.',
    detailZoom: 15,
    id: 'industrial-museum',
    title: 'Saxon Museum of Industry',
  },
  {
    categoryIds: ['history'],
    coordinates: [12.8998, 50.8339],
    description: 'Large Grunderzeit district with dense urban architecture.',
    detailZoom: 14,
    id: 'kassberg',
    title: 'Kassberg',
  },
  {
    categoryIds: ['mobility'],
    coordinates: [12.9303, 50.8395],
    description: 'Main rail station and mobility hub.',
    detailZoom: 15,
    id: 'main-station',
    title: 'Chemnitz Hauptbahnhof',
  },
  {
    categoryIds: ['workspace'],
    coordinates: [12.9298, 50.8136],
    description: 'University campus and learning environment.',
    detailZoom: 15,
    id: 'tu-campus',
    title: 'TU Chemnitz Campus',
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.8992, 50.8028],
    description: 'Long green corridor along the Chemnitz river.',
    detailZoom: 14,
    id: 'stadtpark',
    title: 'Stadtpark Chemnitz',
  },
  {
    categoryIds: ['food', 'history'],
    coordinates: [12.9207, 50.8332],
    description: 'Historic market hall and food-oriented urban place.',
    detailZoom: 15,
    id: 'markthalle',
    title: 'Chemnitz Markthalle',
  },
  {
    categoryIds: ['workspace', 'history'],
    coordinates: [12.9018, 50.8207],
    description: 'Creative and workspace-oriented industrial complex.',
    detailZoom: 15,
    id: 'wirkbau',
    title: 'Wirkbau Chemnitz',
  },
  {
    categoryIds: ['culture'],
    coordinates: [12.9216, 50.8329],
    description: 'Central art collections and exhibition venue in the city center.',
    detailZoom: 15,
    id: 'kunstsammlungen',
    title: 'Kunstsammlungen Chemnitz',
  },
  {
    categoryIds: ['culture', 'workspace'],
    coordinates: [12.9241, 50.833],
    description: 'Public library and cultural learning space in central Chemnitz.',
    detailZoom: 15,
    id: 'stadtbibliothek',
    title: 'Stadtbibliothek Chemnitz',
  },
  {
    categoryIds: ['nature', 'culture'],
    coordinates: [12.9089, 50.852],
    description: 'Large park and recreation area north of central Chemnitz.',
    detailZoom: 14,
    id: 'kuechwald',
    title: 'Kuchwald Park',
  },
  {
    categoryIds: ['nature', 'history'],
    coordinates: [12.8154, 50.8331],
    description: 'Small castle and local nature destination near Chemnitz.',
    detailZoom: 14,
    id: 'rabenstein-castle',
    title: 'Burg Rabenstein',
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.7976, 50.8274],
    description: 'Reservoir and forested recreation area at the western edge of Chemnitz.',
    detailZoom: 13,
    id: 'rabenstein-reservoir',
    title: 'Stausee Rabenstein',
  },
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9511, 50.8276],
    description: 'Historic castle complex and museum above the Chemnitz river.',
    detailZoom: 15,
    id: 'schlossbergmuseum',
    title: 'Schlossbergmuseum',
  },
  {
    categoryIds: ['mobility', 'nature'],
    coordinates: [12.9125, 50.8299],
    description: 'River corridor and urban movement axis through central Chemnitz.',
    detailZoom: 14,
    id: 'chemnitz-river',
    title: 'Chemnitz River Corridor',
  },
  {
    categoryIds: ['culture', 'food'],
    coordinates: [12.9237, 50.8322],
    description: 'Central square for markets, civic events, and everyday city life.',
    detailZoom: 15,
    id: 'markt',
    title: 'Chemnitz Markt',
  },
  {
    categoryIds: ['workspace', 'culture'],
    coordinates: [12.905, 50.822],
    description: 'Former industrial area with creative reuse and event spaces.',
    detailZoom: 15,
    id: 'spinnerei',
    title: 'Spinnerei Chemnitz',
  },
  {
    categoryIds: ['mobility', 'history'],
    coordinates: [12.9168, 50.8295],
    description: 'Historic tram and bus interchange near the city center.',
    detailZoom: 15,
    id: 'zentralhaltestelle',
    title: 'Zentralhaltestelle',
  },
  {
    categoryIds: ['food', 'culture'],
    coordinates: [12.9197, 50.8318],
    description: 'Compact city center passage with cafes, shops, and everyday services.',
    detailZoom: 15,
    id: 'rosenhof',
    title: 'Rosenhof Chemnitz',
  },
  {
    categoryIds: ['nature', 'workspace'],
    coordinates: [12.9334, 50.8062],
    description: 'Green campus-adjacent district with student life and local routes.',
    detailZoom: 14,
    id: 'reichenhain-campus-edge',
    title: 'Reichenhain Campus Edge',
  },
] as const satisfies readonly MapMarker[]
